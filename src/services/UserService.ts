import type { APIResponse } from "@playwright/test";
import { UserApiClient } from "../clients/UserApiClient.js";
import type { User } from "../types/userTypes.js";

export class UserService {
  constructor(private readonly client: UserApiClient) {}

  async createThenRetrieve(user: User): Promise<{
    createResponse: APIResponse;
    getResponse: APIResponse;
  }> {
    if (typeof user.username !== "string") {
      throw new Error("Cannot retrieve a created user without a username");
    }

    const createResponse = await this.client.createUser(user);
    const getResponse = await this.client.getUser(user.username);

    return { createResponse, getResponse };
  }

  async updateThenRetrieve(
    username: string,
    user: User,
  ): Promise<{
    updateResponse: APIResponse;
    getResponse: APIResponse;
  }> {
    const updateResponse = await this.client.updateUser(username, user);
    const getResponse = await this.client.getUser(username);
    return { updateResponse, getResponse };
  }
}
