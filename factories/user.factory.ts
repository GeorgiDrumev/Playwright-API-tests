import { faker } from '@faker-js/faker';
import type { CreateUserRequest, UpdateUserRequest, LoginRequest } from '@dtos/user.dto';

/**
 * Factory for generating User test payloads using Faker.
 * Also provides `buildLoginRequest()` for auth-related test scenarios.
 */
export class UserFactory {
  static build(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
    return {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password({ length: 12 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      address: {
        city: faker.location.city(),
        street: faker.location.street(),
        number: faker.number.int({ min: 1, max: 999 }),
        zipcode: faker.location.zipCode(),
        geolocation: null,
      },
      ...overrides,
    };
  }

  static buildMany(count: number, overrides: Partial<CreateUserRequest> = {}): CreateUserRequest[] {
    return Array.from({ length: count }, () => UserFactory.build(overrides));
  }

  static buildUpdate(overrides: Partial<UpdateUserRequest> = {}): UpdateUserRequest {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      ...overrides,
    };
  }

  static buildLoginRequest(overrides: Partial<LoginRequest> = {}): LoginRequest {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password({ length: 12 }),
      ...overrides,
    };
  }
}
