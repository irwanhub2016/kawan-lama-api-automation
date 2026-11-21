import { test, expect } from "../../src/fixtures/apiFixtures.js";
import { createUser } from "../../src/utils/testDataFactory.js";
import { expectSuccessfulOperation, expectUserResponse } from "../../src/utils/apiHelpers.js";

test.describe("PUT /user/{username}", () => {
  test("updates an existing user using a complete User object", async ({ userApi }) => {
    const original = createUser();
    const createResponse = await userApi.createUser(original);
    await expectSuccessfulOperation(createResponse, "POST /user");

    const updated = createUser({
      ...original,
      firstName: "Updated",
      lastName: "User",
      email: `updated.${crypto.randomUUID()}@example.test`,
      phone: "555-0199",
    });
    const updateResponse = await userApi.updateUser(original.username, updated);
    await expectSuccessfulOperation(updateResponse, "PUT /user/{username}");

    const getResponse = await userApi.getUser(original.username);
    const retrieved = await expectUserResponse(getResponse, updated);
    expect(retrieved.username).toBe(original.username);
    expect(retrieved).toMatchObject(updated);
    expect(retrieved).toMatchObject(updated);
  });

  test("returns the documented not-found response when updating an unknown user", async ({
    userApi,
  }) => {
    test.fail(
      true,
      "OpenAPI documents 404, but the live Swagger Petstore returned 200 for this request.",
    );
    const unknownUser = createUser();
    const response = await userApi.updateUser(unknownUser.username, unknownUser);

    expect(response.status()).toBe(404);
  });
});
