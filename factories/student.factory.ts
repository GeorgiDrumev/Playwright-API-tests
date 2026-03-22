import { faker } from '@faker-js/faker';
import type { CreateStudentRequest, UpdateStudentRequest } from '@dtos/student.dto';

/**
 * Factory for generating Student test payloads using Faker.
 * Use `build()` for a single payload, `buildMany()` for an array, and `buildUpdate()` for a partial update.
 */
export class StudentFactory {
  static build(overrides: Partial<CreateStudentRequest> = {}): CreateStudentRequest {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateStudentRequest> = {},
  ): CreateStudentRequest[] {
    return Array.from({ length: count }, () => StudentFactory.build(overrides));
  }

  static buildUpdate(overrides: Partial<UpdateStudentRequest> = {}): UpdateStudentRequest {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides,
    };
  }
}
