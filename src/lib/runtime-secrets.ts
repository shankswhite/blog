import "server-only";

import {
  GetParameterCommand,
  PutParameterCommand,
  SSMClient,
} from "@aws-sdk/client-ssm";

type SecretInput = {
  inlineValue?: string;
  parameterPath?: string;
};

const secretPromises = new Map<string, Promise<string>>();
const ssmClient = new SSMClient({});

async function readSsmSecret(parameterPath: string): Promise<string> {
  const cached = secretPromises.get(parameterPath);
  if (cached) return cached;

  const request = ssmClient
    .send(
      new GetParameterCommand({
        Name: parameterPath,
        WithDecryption: true,
      })
    )
    .then((response) => {
      const value = response.Parameter?.Value?.trim();
      if (!value) throw new Error("Secure parameter is empty.");
      return value;
    })
    .catch((error) => {
      secretPromises.delete(parameterPath);
      throw error;
    });

  secretPromises.set(parameterPath, request);
  return request;
}

async function resolveSecret({
  inlineValue,
  parameterPath,
}: SecretInput): Promise<string | undefined> {
  const path = parameterPath?.trim();
  if (path) return readSsmSecret(path);
  return inlineValue?.trim() || undefined;
}

export async function getNotionWebhookRuntimeSecrets() {
  const [verificationToken, amplifyBuildWebhookUrl] = await Promise.all([
    resolveSecret({
      inlineValue: process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN,
      parameterPath: process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN_SSM_PATH,
    }),
    resolveSecret({
      inlineValue: process.env.AMPLIFY_BUILD_WEBHOOK_URL,
      parameterPath: process.env.AMPLIFY_BUILD_WEBHOOK_URL_SSM_PATH,
    }),
  ]);

  return { verificationToken, amplifyBuildWebhookUrl };
}

export async function storeNotionWebhookVerificationToken(token: string) {
  const parameterPath =
    process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN_SSM_PATH?.trim();
  if (!parameterPath) {
    throw new Error("Verification-token SSM path is not configured.");
  }

  await ssmClient.send(
    new PutParameterCommand({
      Name: parameterPath,
      Value: token,
      Type: "SecureString",
      Tier: "Standard",
      Overwrite: false,
      Description: "Notion webhook verification token for the portfolio",
    }),
  );
  secretPromises.delete(parameterPath);
}
