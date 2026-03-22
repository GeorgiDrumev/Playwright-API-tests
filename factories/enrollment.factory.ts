import { faker } from '@faker-js/faker';
import type { CreateEnrollmentRequest, UpdateEnrollmentRequest } from '../dtos/enrollment.dto';

const ENROLLMENT_STATUSES = ['Active', 'Completed', 'Dropped'] as const;

export class EnrollmentFactory {
  static build(overrides: Partial<CreateEnrollmentRequest> = {}): CreateEnrollmentRequest {
    const now = new Date().toISOString();
    return {
      studentId: faker.number.int({ min: 100000, max: 9999999 }),
      courseId: faker.number.int({ min: 100000, max: 9999999 }),
      enrolledAt: now,
      progressPercentage: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(ENROLLMENT_STATUSES),
      completedAt: null,
      finalGrade: null,
      certificateIssued: false,
      lastAccessedAt: now,
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateEnrollmentRequest> = {},
  ): CreateEnrollmentRequest[] {
    return Array.from({ length: count }, () => EnrollmentFactory.build(overrides));
  }

  static completed(overrides: Partial<CreateEnrollmentRequest> = {}): CreateEnrollmentRequest {
    return EnrollmentFactory.build({
      status: 'Completed',
      progressPercentage: 100,
      completedAt: new Date().toISOString(),
      finalGrade: faker.number.float({ min: 60, max: 100, fractionDigits: 1 }),
      certificateIssued: true,
      ...overrides,
    });
  }

  static buildUpdate(overrides: Partial<UpdateEnrollmentRequest> = {}): UpdateEnrollmentRequest {
    return {
      progressPercentage: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(ENROLLMENT_STATUSES),
      ...overrides,
    };
  }
}
