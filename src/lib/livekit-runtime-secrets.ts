import "server-only";

import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

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
      }),
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

export async function getLiveKitRuntimeSecrets() {
  const [url, apiKey, apiSecret] = await Promise.all([
    resolveSecret({
      inlineValue: process.env.LIVEKIT_URL,
      parameterPath: process.env.LIVEKIT_URL_SSM_PATH,
    }),
    resolveSecret({
      inlineValue: process.env.LIVEKIT_API_KEY,
      parameterPath: process.env.LIVEKIT_API_KEY_SSM_PATH,
    }),
    resolveSecret({
      inlineValue: process.env.LIVEKIT_API_SECRET,
      parameterPath: process.env.LIVEKIT_API_SECRET_SSM_PATH,
    }),
  ]);

  return { url, apiKey, apiSecret };
}
