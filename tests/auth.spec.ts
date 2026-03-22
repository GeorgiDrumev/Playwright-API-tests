import { test, expect } from '../fixtures/auth.fixtures';
import { UserFactory } from '../factories/user.factory';

test.describe('Auth API', () => {
  test('POST /api/auth/login — returns 200 with valid credentials', async ({ authService }) => {
    const payload = await test.step('Given', async () =>
      UserFactory.buildLoginRequest({ username: 'johnd', password: 'm38rmF$' }));

    const response = await test.step('When', async () => authService.login(payload));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /api/auth/login — returns error for invalid credentials', async ({ authService }) => {
    const payload = await test.step('Given', async () =>
      UserFactory.buildLoginRequest({ username: 'invalid_user', password: 'wrong_password' }));

    const response = await test.step('When', async () => authService.login(payload));

    await test.step('Then', async () => {
      expect([400, 401, 403]).toContain(response.status());
    });
  });
});
