const amplifyBranchUrl =
  process.env.AWS_APP_ID && process.env.AWS_BRANCH
    ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
    : undefined;

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || amplifyBranchUrl || "http://localhost:3000";

export const siteUrl = new URL(configuredSiteUrl).origin;

const siteHostname = new URL(siteUrl).hostname;
export const isProductionSite =
  siteHostname === "levon.blog" || siteHostname === "www.levon.blog";
