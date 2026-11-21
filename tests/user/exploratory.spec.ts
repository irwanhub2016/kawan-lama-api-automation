import { test, expect } from "../../src/fixtures/apiFixtures.js";
import { environment } from "../../src/config/environment.js";
import { createUser } from "../../src/utils/testDataFactory.js";

test.describe("Exploratory User API inputs @exploratory", () => {
  test.skip(
    !environment.exploratoryTestsEnabled,
    "Set API_EXPLORATORY_TESTS=true to send undocumented or potentially mutating inputs to the shared demo API.",
  );

  test("characterizes an empty create body", async ({ userApi }) => {
    const response = await userApi.sendExploratoryPayload("POST", undefined, {});
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Empty POST /user returned ${response.status()}`);
  });

  test("characterizes omitted fields and invalid email format", async ({ userApi }) => {
    const username = `explore_${crypto.randomUUID().replaceAll("-", "")}`;
    const response = await userApi.sendExploratoryPayload("POST", undefined, {
      username,
      email: "not-an-email",
    });
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Invalid email POST /user returned ${response.status()}`);
  });

  test("characterizes null values and incorrect property types", async ({ userApi }) => {
    const user = createUser();
    const response = await userApi.sendExploratoryPayload("POST", undefined, {
      ...user,
      firstName: null,
      userStatus: "active",
    });
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Invalid property POST /user returned ${response.status()}`);
  });

  test("characterizes long string fields", async ({ userApi }) => {
    const user = createUser({ username: `long_${"x".repeat(240)}` });
    const response = await userApi.createUser(user);
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Long username POST /user returned ${response.status()}`);
  });

  test("characterizes duplicate username behavior", async ({ userApi }) => {
    const user = createUser();
    const first = await userApi.createUser(user);
    const second = await userApi.createUser(user);
    expect(first.status()).toBeGreaterThanOrEqual(100);
    expect(second.status()).toBeGreaterThanOrEqual(100);
    console.info(
      `[exploratory] Duplicate POST /user returned ${first.status()} then ${second.status()}`,
    );
  });

  test("characterizes special and empty usernames", async ({ userApi }) => {
    for (const username of ["", "not a username", `missing_${"x".repeat(256)}`]) {
      const response = await userApi.getUser(username);
      expect(response.status()).toBeGreaterThanOrEqual(100);
      expect(response.status()).toBeLessThan(600);
      console.info(`[exploratory] GET username length=${username.length} returned ${response.status()}`);
    }
  });

  test("characterizes update with an empty body", async ({ userApi }) => {
    const user = createUser();
    const response = await userApi.sendExploratoryPayload("PUT", user.username, {});
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Empty PUT /user/{username} returned ${response.status()}`);
  });

  test("characterizes a path/body username mismatch", async ({ userApi }) => {
    const user = createUser();
    const response = await userApi.updateUser(`path_${user.username}`, user);
    expect(response.status()).toBeGreaterThanOrEqual(100);
    expect(response.status()).toBeLessThan(600);
    console.info(`[exploratory] Path/body mismatch PUT returned ${response.status()}`);
  });
});
