import "server-only";

import {
  DynamoDBClient,
  PutItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const EVENT_RETENTION_SECONDS = 90 * 24 * 60 * 60;
const LEAD_RETENTION_SECONDS = 365 * 24 * 60 * 60;
const LOCAL_DATA_PATH = path.join(
  process.cwd(),
  ".local-data",
  "companion-events.ndjson",
);
const TABLE_NAME_PATTERN = /^[A-Za-z0-9_.-]{3,255}$/;

export type CompanionEngagementEvent = {
  id: string;
  type: "page_view" | "message";
  path: string;
  role?: "user" | "assistant" | "system";
  channel?: "text" | "voice" | "page";
  content?: string;
  clientCreatedAt?: string;
};

export type CompanionLead = {
  sessionId: string;
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  consent: true;
  path: string;
};

type StoredRecord = Record<string, unknown> & {
  PK: string;
  SK: string;
};

type DynamoClientState = {
  client: DynamoDBClient;
  region: string | undefined;
};

export class CompanionEngagementConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompanionEngagementConfigurationError";
  }
}

let dynamoClientState: DynamoClientState | null = null;
let localWriteQueue: Promise<void> = Promise.resolve();
const localSeenKeys = new Set<string>();

export async function storeCompanionEvents(
  sessionId: string,
  events: CompanionEngagementEvent[],
) {
  const now = new Date();
  const serverCreatedAt = now.toISOString();
  const expiresAt =
    Math.floor(now.getTime() / 1000) + EVENT_RETENTION_SECONDS;
  const records = events.map<StoredRecord>((event) => ({
    PK: `SESSION#${sessionId}`,
    SK: `EVENT#${event.id}`,
    schemaVersion: 1,
    recordType: "event",
    sessionId,
    eventId: event.id,
    eventType: event.type,
    path: event.path,
    ...(event.role ? { role: event.role } : {}),
    ...(event.channel ? { channel: event.channel } : {}),
    ...(event.content !== undefined ? { content: event.content } : {}),
    ...(event.clientCreatedAt
      ? { clientCreatedAt: event.clientCreatedAt }
      : {}),
    serverCreatedAt,
    expiresAt,
  }));

  const inserted = await putRecords(records);
  return { inserted: inserted.filter(Boolean).length };
}

export async function storeCompanionLead(lead: CompanionLead) {
  const now = new Date();
  const serverCreatedAt = now.toISOString();
  const record: StoredRecord = {
    PK: `SESSION#${lead.sessionId}`,
    SK: `LEAD#${lead.id}`,
    schemaVersion: 1,
    recordType: "lead",
    sessionId: lead.sessionId,
    leadId: lead.id,
    path: lead.path,
    consent: true,
    ...(lead.name ? { name: lead.name } : {}),
    ...(lead.email ? { email: lead.email } : {}),
    ...(lead.interest ? { interest: lead.interest } : {}),
    ...(lead.message ? { message: lead.message } : {}),
    serverCreatedAt,
    expiresAt: Math.floor(now.getTime() / 1000) + LEAD_RETENTION_SECONDS,
  };

  const [inserted] = await putRecords([record]);
  return { inserted };
}

async function putRecords(records: StoredRecord[]): Promise<boolean[]> {
  const tableName = configuredTableName();
  if (!tableName) {
    if (process.env.NODE_ENV === "production") {
      throw new CompanionEngagementConfigurationError(
        "COMPANION_ENGAGEMENT_TABLE is required in production.",
      );
    }
    return appendLocalRecords(records);
  }

  const client = dynamoClient();
  return Promise.all(
    records.map(async (record) => {
      try {
        await client.send(
          new PutItemCommand({
            TableName: tableName,
            Item: toDynamoItem(record),
            ConditionExpression:
              "attribute_not_exists(#partitionKey) AND attribute_not_exists(#sortKey)",
            ExpressionAttributeNames: {
              "#partitionKey": "PK",
              "#sortKey": "SK",
            },
          }),
        );
        return true;
      } catch (error) {
        if (isConditionalCheckFailure(error)) return false;
        throw error;
      }
    }),
  );
}

function configuredTableName() {
  const tableName = process.env.COMPANION_ENGAGEMENT_TABLE?.trim();
  if (!tableName) return undefined;
  if (!TABLE_NAME_PATTERN.test(tableName)) {
    throw new CompanionEngagementConfigurationError(
      "COMPANION_ENGAGEMENT_TABLE is not a valid DynamoDB table name.",
    );
  }
  return tableName;
}

function dynamoClient() {
  const region = process.env.AWS_REGION?.trim() || undefined;
  const currentState = dynamoClientState;
  if (currentState && currentState.region === region) return currentState.client;

  const client = new DynamoDBClient(region ? { region } : {});
  dynamoClientState = { client, region };
  return client;
}

function toDynamoItem(record: StoredRecord) {
  const item: Record<string, AttributeValue> = {};

  Object.entries(record).forEach(([key, value]) => {
    if (typeof value === "string") {
      item[key] = { S: value };
    } else if (typeof value === "number") {
      item[key] = { N: String(value) };
    } else if (typeof value === "boolean") {
      item[key] = { BOOL: value };
    }
  });

  return item;
}

function isConditionalCheckFailure(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ConditionalCheckFailedException"
  );
}

async function appendLocalRecords(records: StoredRecord[]) {
  const inserted = records.map(() => false);
  const operation = localWriteQueue.then(async () => {
    const pending: Array<{ index: number; key: string; record: StoredRecord }> = [];

    records.forEach((record, index) => {
      const key = `${record.PK}\u0000${record.SK}`;
      if (!localSeenKeys.has(key)) pending.push({ index, key, record });
    });

    if (pending.length === 0) return;

    await mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
    await appendFile(
      LOCAL_DATA_PATH,
      `${pending.map(({ record }) => JSON.stringify(record)).join("\n")}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    pending.forEach(({ index, key }) => {
      localSeenKeys.add(key);
      inserted[index] = true;
    });
  });

  localWriteQueue = operation.catch(() => undefined);
  await operation;
  return inserted;
}
