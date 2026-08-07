const amplifyBranchUrl =
  process.env.AWS_APP_ID && process.env.AWS_BRANCH
    ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
    : undefined;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || amplifyBranchUrl || "http://localhost:3000";
