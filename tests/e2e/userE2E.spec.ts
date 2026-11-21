import { test, expect } from "../../src/fixtures/apiFixtures.js";
import { createUser } from "../../src/utils/testDataFactory.js";
import {
  expectSuccessfulOperation,
  expectUserResponse,
} from "../../src/utils/apiHelpers.js";

test("completes the create, retrieve, update, retrieve user end-to-end flow", async ({
  userService,
}) => {
  const original = createUser();
  const { createResponse, getResponse } = await userService.createThenRetrieve(original);
  await expectSuccessfulOperation(createResponse, "POST /user");
  await expectUserResponse(getResponse, original);

  const updated = {
    ...original,
    firstName: "Workflow",
    lastName: "Updated",
    email: `workflow.${crypto.randomUUID()}@example.test`,
    phone: "555-0118",
  };
  const { updateResponse, getResponse: updatedGetResponse } =
    await userService.updateThenRetrieve(original.username, updated);

  await expectSuccessfulOperation(updateResponse, "PUT /user/{username}");
  const retrievedUpdated = await expectUserResponse(updatedGetResponse, updated);
  expect(retrievedUpdated).toMatchObject(updated);
});
