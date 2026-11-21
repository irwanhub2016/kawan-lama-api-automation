import { test, expect } from "../../src/fixtures/apiFixtures.js";
import { createUser } from "../../src/utils/testDataFactory.js";
import { expectSuccessfulOperation, expectUserResponse } from "../../src/utils/apiHelpers.js";

test.describe("GET /user/{username}", () => {
  test("retrieves a previously created user and all provided properties", async ({ userApi }) => {
    const user = createUser();
    const createResponse = await userApi.createUser(user);
    await expectSuccessfulOperation(createResponse, "POST /user");

    const response = await userApi.getUser(user.username);
    const retrieved = await expectUserResponse(response, user);

    expect(retrieved.username).toBe(user.username);
    expect(retrieved).toMatchObject(user);
  });

  test("returns the documented not-found response for an unknown username", async ({ userApi }) => {
    const response = await userApi.getUser(`missing_${crypto.randomUUID()}`);

    expect(response.status()).toBe(404);
  });

  test("retrieves a user whose username contains a URL-encoded character", async ({ userApi }) => {
    const user = createUser({ username: `sdet+${crypto.randomUUID()}` });
    const createResponse = await userApi.createUser(user);
    await expectSuccessfulOperation(createResponse, "POST /user");

    const response = await userApi.getUser(user.username);
    await expectUserResponse(response, user);
  });
});
