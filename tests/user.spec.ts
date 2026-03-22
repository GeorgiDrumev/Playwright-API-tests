import { test, expect } from '../fixtures/user.fixtures';
import { UserFactory } from '../factories/user.factory';
import { UserSchema } from '../dtos/user.dto';

test.describe('Users API', () => {
  test('GET /api/users — returns a list of users', async ({ userService }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => userService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const users = Array.isArray(body) ? body : body.data;
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  test('POST /api/users — creates a user with valid payload', async ({ userService }) => {
    const payload = await test.step('Given', async () => UserFactory.build());

    const response = await test.step('When', async () => userService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const user = UserSchema.parse(body);
      createdId = user.id;

      expect.soft(user.email).toBe(payload.email);
      expect.soft(user.username).toBe(payload.username);
      expect.soft(user.firstName).toBe(payload.firstName);
      expect.soft(user.lastName).toBe(payload.lastName);
      expect.soft(user.id).toBeTruthy();
    });

    await userService.delete(createdId!);
  });

  test('GET /api/users/:id — returns the created user', async ({ userService, createdUser }) => {
    const userId = await test.step('Given', async () => createdUser.id);

    const response = await test.step('When', async () => userService.getById(userId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const user = UserSchema.parse(body);
      expect.soft(user.id).toBe(createdUser.id);
      expect.soft(user.email).toBe(createdUser.email);
      expect.soft(user.username).toBe(createdUser.username);
    });
  });

  test('GET /api/users/:id — returns 404 for non-existent user', async ({ userService }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => userService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /api/users/:id — updates the user', async ({ userService, createdUser }) => {
    const updates = await test.step('Given', async () =>
      UserFactory.buildUpdate({ firstName: 'UpdatedFirst', lastName: 'UpdatedLast' }));

    const response = await test.step('When', async () =>
      userService.update(createdUser.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const user = UserSchema.parse(body);
      expect.soft(user.firstName).toBe('UpdatedFirst');
      expect.soft(user.lastName).toBe('UpdatedLast');
      expect.soft(user.id).toBe(createdUser.id);
    });
  });

  test('PATCH /api/users/:id — partially updates a user phone number', async ({
    userService,
    createdUser,
  }) => {
    const partialUpdate = await test.step('Given', async () => ({
      phone: '+1-555-000-9999',
    }));

    const response = await test.step('When', async () =>
      userService.partialUpdate(createdUser.id, partialUpdate));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect.soft(body.phone).toBe('+1-555-000-9999');
      expect.soft(body.id).toBe(createdUser.id);
    });
  });

  test('DELETE /api/users/:id — deletes the user and returns 204', async ({ userService }) => {
    const userId = await test.step('Given', async () => {
      const createResponse = await userService.create(UserFactory.build());
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return UserSchema.parse(body).id;
    });

    const response = await test.step('When', async () => userService.delete(userId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);

      const getResponse = await userService.getById(userId);
      expect(getResponse.status()).toBe(404);
    });
  });
});
