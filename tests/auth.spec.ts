import { test, expect } from '@fixtures/auth.fixtures';
import { UserFactory } from '@factories/user.factory';
import { VALID_CREDENTIALS, INVALID_CREDENTIALS } from '@data/test-data/auth.data';

test.describe('Auth API', () => {
  test('POST /api/auth/login — returns 200 with valid credentials', async ({ authService }) => {
    const payload = await test.step('Given', async () =>
      UserFactory.buildLoginRequest(VALID_CREDENTIALS));

    const response = await test.step('When', async () => authService.login(payload));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /api/auth/login — returns error for invalid credentials', async ({ authService }) => {
    const payload = await test.step('Given', async () =>
      UserFactory.buildLoginRequest(INVALID_CREDENTIALS));

    const response = await test.step('When', async () => authService.login(payload));

    await test.step('Then', async () => {
      expect([400, 401, 403]).toContain(response.status());
    });
  });
});
