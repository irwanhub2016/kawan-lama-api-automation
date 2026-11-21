import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { User } from "../types/userTypes.js";

export class UserApiClient {
  constructor(private readonly request: APIRequestContext) {}

  createUser(user: User): Promise<APIResponse> {
    return this.send("POST", "user", user);
  }

  getUser(username: string): Promise<APIResponse> {
    return this.send("GET", `user/${encodeURIComponent(username)}`);
  }

  updateUser(username: string, user: User): Promise<APIResponse> {
    return this.send("PUT", `user/${encodeURIComponent(username)}`, user);
  }

  async sendExploratoryPayload(
    method: "POST" | "PUT",
    username: string | undefined,
    payload: unknown,
  ): Promise<APIResponse> {
    const path = username === undefined ? "user" : `user/${encodeURIComponent(username)}`;
    return this.send(method, path, payload);
  }

  private send(method: "GET" | "POST" | "PUT", path: string, data?: unknown) {
    return this.request.fetch(path, {
      method,
      ...(data === undefined ? {} : { data }),
    });
  }
}
