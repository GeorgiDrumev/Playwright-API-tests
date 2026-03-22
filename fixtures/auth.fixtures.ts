import { test as base, expect } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import { AuthService } from '@services/auth.service';

type AuthFixtures = {
  authService: AuthService;
};

/**
 * Playwright fixture for the Auth resource.
 * Provides `authService` wired up with a fresh `HttpClient` for each test.
 */
export const test = base.extend<AuthFixtures>({
  authService: async ({ request }, use) => {
    await use(new AuthService(new HttpClient(request)));
  },
});

export { expect };
