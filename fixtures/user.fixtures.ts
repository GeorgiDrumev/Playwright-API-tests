import { test as base, expect } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import { UserService } from '@services/user.service';
import { UserFactory } from '@factories/user.factory';
import { UserSchema, type User } from '@dtos/user.dto';

type UserFixtures = {
  userService: UserService;
  createdUser: User;
};

/**
 * Playwright fixture for the User resource.
 * Provides `userService` and `createdUser` (created before each test, deleted after).
 */
export const test = base.extend<UserFixtures>({
  userService: async ({ request }, use) => {
    await use(new UserService(new HttpClient(request)));
  },

  createdUser: async ({ request }, use) => {
    const service = new UserService(new HttpClient(request));
    const payload = UserFactory.build();

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const user = UserSchema.parse(await response.json());

    await use(user);

    await service.delete(user.id);
  },
});

export { expect };
