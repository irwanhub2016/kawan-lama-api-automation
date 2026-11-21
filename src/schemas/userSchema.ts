import type { User } from "../types/userTypes.js";

export const userSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    phone: { type: "string" },
    userStatus: { type: "integer" },
  },
} as const;

export function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return Object.entries(userSchema.properties).every(([field, definition]) => {
    if (!(field in record)) {
      return true;
    }

    const fieldValue = record[field];
    if (definition.type === "integer") {
      return typeof fieldValue === "number" && Number.isInteger(fieldValue);
    }

    return typeof fieldValue === definition.type;
  });
}
