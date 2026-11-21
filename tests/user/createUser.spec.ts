import { test, expect } from "../../src/fixtures/apiFixtures.js";
import { createUser } from "../../src/utils/testDataFactory.js";
import { expectSuccessfulOperation, expectUserResponse } from "../../src/utils/apiHelpers.js";

test.describe("POST /user", () => {
  test("creates a user with every documented field and makes it retrievable", async ({
    userService,
  }) => {
    const user = createUser();
    const { createResponse, getResponse } = await userService.createThenRetrieve(user);

    await expectSuccessfulOperation(createResponse, "POST /user");
    const retrieved = await expectUserResponse(getResponse, user);
    expect(retrieved).toMatchObject(user);
  });

  test("creates multiple users with isolated generated data", async ({ userApi }) => {
    const users = [createUser(), createUser()];

    for (const user of users) {
      const createResponse = await userApi.createUser(user);
      await expectSuccessfulOperation(createResponse, "POST /user");

      const getResponse = await userApi.getUser(user.username);
      await expectUserResponse(getResponse, user);
    }
  });
});
