import { faker } from '@faker-js/faker';
import type {
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
  GradeSubmissionRequest,
} from '@dtos/submission.dto';

const SUBMISSION_STATUSES = ['Pending', 'Graded', 'Late', 'Resubmit'] as const;

export class SubmissionFactory {
  static build(overrides: Partial<CreateSubmissionRequest> = {}): CreateSubmissionRequest {
    return {
      assignmentId: faker.number.int({ min: 100000, max: 9999999 }),
      studentId: faker.number.int({ min: 100000, max: 9999999 }),
      content: faker.lorem.paragraph(),
      attachmentUrls: faker.internet.url(),
      submittedAt: new Date().toISOString(),
      status: 'Pending',
      pointsEarned: null,
      feedback: faker.lorem.sentence(),
      gradedAt: null,
      isLate: false,
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateSubmissionRequest> = {},
  ): CreateSubmissionRequest[] {
    return Array.from({ length: count }, () => SubmissionFactory.build(overrides));
  }

  static late(overrides: Partial<CreateSubmissionRequest> = {}): CreateSubmissionRequest {
    return SubmissionFactory.build({ isLate: true, status: 'Pending', ...overrides });
  }

  static graded(overrides: Partial<CreateSubmissionRequest> = {}): CreateSubmissionRequest {
    return SubmissionFactory.build({
      status: 'Graded',
      pointsEarned: faker.number.int({ min: 0, max: 100 }),
      feedback: faker.lorem.sentence(),
      gradedAt: new Date().toISOString(),
      ...overrides,
    });
  }

  static buildUpdate(overrides: Partial<UpdateSubmissionRequest> = {}): UpdateSubmissionRequest {
    return {
      content: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(SUBMISSION_STATUSES),
      ...overrides,
    };
  }

  static buildGrade(overrides: Partial<GradeSubmissionRequest> = {}): GradeSubmissionRequest {
    return {
      pointsEarned: faker.number.int({ min: 0, max: 100 }),
      feedback: faker.lorem.sentence(),
      ...overrides,
    };
  }
}
