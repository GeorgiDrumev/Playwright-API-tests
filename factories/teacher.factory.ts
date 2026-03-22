import { faker } from '@faker-js/faker';
import type { CreateTeacherRequest, UpdateTeacherRequest } from '@dtos/teacher.dto';

const SPECIALIZATIONS = [
  'JavaScript',
  'Python',
  'Data Science',
  'UX Design',
  'Machine Learning',
  'Web Development',
  'DevOps',
] as const;

/**
 * Factory for generating Teacher test payloads using Faker.
 * Provides an `expert()` convenience builder for high-experience teacher scenarios.
 */
export class TeacherFactory {
  static build(overrides: Partial<CreateTeacherRequest> = {}): CreateTeacherRequest {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      bio: faker.lorem.paragraph(),
      specialization: faker.helpers.arrayElement(SPECIALIZATIONS),
      profilePictureUrl: faker.image.avatar(),
      yearsOfExperience: faker.number.int({ min: 1, max: 20 }),
      rating: parseFloat(faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)),
      totalStudents: faker.number.int({ min: 0, max: 10000 }),
      courseCount: faker.number.int({ min: 1, max: 50 }),
      joinedAt: faker.date.past({ years: 5 }).toISOString(),
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateTeacherRequest> = {},
  ): CreateTeacherRequest[] {
    return Array.from({ length: count }, () => TeacherFactory.build(overrides));
  }

  static expert(overrides: Partial<CreateTeacherRequest> = {}): CreateTeacherRequest {
    return TeacherFactory.build({ yearsOfExperience: 10, rating: 4.9, ...overrides });
  }

  static buildUpdate(overrides: Partial<UpdateTeacherRequest> = {}): UpdateTeacherRequest {
    return {
      bio: faker.lorem.paragraph(),
      specialization: faker.helpers.arrayElement(SPECIALIZATIONS),
      ...overrides,
    };
  }
}
