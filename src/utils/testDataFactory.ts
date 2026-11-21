import { randomUUID } from "node:crypto";
import { userDefaults } from "../data/userTestData.js";
import type { CompleteUser, User } from "../types/userTypes.js";

export function createUser(overrides: Partial<User> = {}): CompleteUser {
  const uniqueId = randomUUID().replaceAll("-", "");
  const username = `sdet_${uniqueId}`;

  return {
    id: Number.parseInt(uniqueId.slice(0, 8), 16),
    username,
    firstName: userDefaults.firstName,
    lastName: userDefaults.lastName,
    email: `api.${uniqueId}@${userDefaults.emailDomain}`,
    password: userDefaults.password,
    phone: userDefaults.phone,
    userStatus: userDefaults.userStatus,
    ...overrides,
  };
}
