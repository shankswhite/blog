import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(projectRoot, ".env.production");

const RUNTIME_ENV_KEYS = [
  "NOTION_WEBHOOK_SETUP_MODE",
  "NOTION_AUTO_PUBLISH_ENABLED",
  "NOTION_ALLOW_BEST_EFFORT_DEDUPLICATION",
  "NOTION_WEBHOOK_WORKSPACE_ID",
  "NOTION_WEBHOOK_SUBSCRIPTION_ID",
  "NOTION_WEBHOOK_VERIFICATION_TOKEN_SSM_PATH",
  "AMPLIFY_BUILD_WEBHOOK_URL_SSM_PATH",
] as const;

async function main() {
  const packageJson = JSON.parse(
    await readFile(path.join(projectRoot, "package.json"), "utf8"),
  ) as { name?: string };
  if (packageJson.name !== "aws-amplify-gen2") {
    throw new Error(
      "Refusing to write runtime configuration outside the expected project root.",
    );
  }

  if (!process.env.AWS_APP_ID?.trim()) {
    console.log(
      "Runtime environment export skipped: this is not an Amplify build.",
    );
    return;
  }

  const lines = RUNTIME_ENV_KEYS.flatMap((key) => {
    const rawValue = process.env[key]?.trim();
    if (!rawValue) return [];

    const value =
      key === "NOTION_WEBHOOK_SETUP_MODE" ||
      key === "NOTION_AUTO_PUBLISH_ENABLED" ||
      key === "NOTION_ALLOW_BEST_EFFORT_DEDUPLICATION"
        ? rawValue === "true"
          ? "true"
          : "false"
        : rawValue;

    return `${key}=${JSON.stringify(value)}`;
  });

  await writeFile(outputPath, `${lines.join("\n")}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  console.log(`Exported ${lines.length} allowlisted runtime setting(s).`);
}

main().catch((error: unknown) => {
  console.error("Runtime environment export failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
