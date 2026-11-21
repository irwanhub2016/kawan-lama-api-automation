import "dotenv/config";

const defaultBaseUrl = "https://petstore.swagger.io/v2";
const configuredBaseUrl = process.env.API_BASE_URL ?? defaultBaseUrl;

let parsedBaseUrl: URL;
try {
  parsedBaseUrl = new URL(configuredBaseUrl);
} catch (error) {
  throw new Error(`API_BASE_URL must be an absolute URL: ${configuredBaseUrl}`, {
    cause: error,
  });
}

if (parsedBaseUrl.protocol !== "http:" && parsedBaseUrl.protocol !== "https:") {
  throw new Error(`API_BASE_URL must use HTTP or HTTPS: ${configuredBaseUrl}`);
}

export const environment = {
  baseUrl: `${configuredBaseUrl.replace(/\/+$/, "")}/`,
  exploratoryTestsEnabled: process.env.API_EXPLORATORY_TESTS === "true",
};
