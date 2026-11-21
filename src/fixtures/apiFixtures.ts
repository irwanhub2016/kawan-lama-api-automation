import { test as base } from "@playwright/test";
import { UserApiClient } from "../clients/UserApiClient.js";
import { UserService } from "../services/UserService.js";

interface ApiFixtures {
  userApi: UserApiClient;
  userService: UserService;
}

export const test = base.extend<ApiFixtures>({
  userApi: async ({ request }, use) => {
    await use(new UserApiClient(request));
  },
  userService: async ({ userApi }, use) => {
    await use(new UserService(userApi));
  },
});

export { expect } from "@playwright/test";
