import { faker } from '@faker-js/faker';
import type { CreateAssignmentRequest, UpdateAssignmentRequest } from '@dtos/assignment.dto';

const ASSIGNMENT_TYPES = ['Quiz', 'Project', 'Essay', 'Code', 'Homework'] as const;

/**
 * Factory for generating Assignment test payloads using Faker.
 * Provides `published()` and `unpublished()` convenience builders.
 */
export class AssignmentFactory {
  static build(overrides: Partial<CreateAssignmentRequest> = {}): CreateAssignmentRequest {
    const dueDate = faker.date.future();
    return {
      courseId: faker.number.int({ min: 1, max: 100 }),
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(ASSIGNMENT_TYPES),
      maxPoints: faker.number.int({ min: 10, max: 100 }),
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
      isPublished: faker.datatype.boolean(),
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateAssignmentRequest> = {},
  ): CreateAssignmentRequest[] {
    return Array.from({ length: count }, () => AssignmentFactory.build(overrides));
  }

  static published(overrides: Partial<CreateAssignmentRequest> = {}): CreateAssignmentRequest {
    return AssignmentFactory.build({ isPublished: true, ...overrides });
  }

  static unpublished(overrides: Partial<CreateAssignmentRequest> = {}): CreateAssignmentRequest {
    return AssignmentFactory.build({ isPublished: false, ...overrides });
  }

  static buildUpdate(overrides: Partial<UpdateAssignmentRequest> = {}): UpdateAssignmentRequest {
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      ...overrides,
    };
  }
}
