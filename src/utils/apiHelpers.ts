import { expect, type APIResponse } from "@playwright/test";
import { isUser } from "../schemas/userSchema.js";
import type { User } from "../types/userTypes.js";

export async function expectSuccessfulOperation(
  response: APIResponse,
  operation: string,
): Promise<void> {
  expect(
    response.ok(),
    `${operation} should return a successful HTTP status; received ${response.status()}`,
  ).toBe(true);

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType, `${operation} should return JSON`).toContain("application/json");
}

export async function expectUserResponse(
  response: APIResponse,
  expected: User,
): Promise<User> {
  expect(response.status(), "GET user should return the documented success status").toBe(200);
  expect(response.headers()["content-type"] ?? "").toContain("application/json");

  const body: unknown = await response.json();
  if (!isUser(body)) {
    throw new Error("GET user response does not match the Swagger User schema");
  }

  expect(body).toMatchObject({ ...expected });
  return body;
}
