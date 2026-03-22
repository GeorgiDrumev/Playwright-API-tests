import { test as enrollmentTest, expect } from '@fixtures/enrollment.fixtures';
import { HttpClient } from '@utils/http-client';
import { SubmissionService } from '@services/submission.service';
import { SubmissionFactory } from '@factories/submission.factory';
import { SubmissionSchema, type Submission } from '@dtos/submission.dto';
import { SANDBOX_ASSIGNMENT_ID } from '@data/test-data/sandbox.data';

type SubmissionFixtures = {
  submissionService: SubmissionService;
  createdSubmission: Submission;
};

/**
 * Playwright fixture for the Submission resource.
 * Extends `enrollmentTest` so that `createdStudent` and `createdEnrollment` are available.
 * Provides `submissionService` and `createdSubmission` (created before each test, deleted after).
 */
export const test = enrollmentTest.extend<SubmissionFixtures>({
  submissionService: async ({ request }, use) => {
    await use(new SubmissionService(new HttpClient(request)));
  },

  createdSubmission: async ({ request, createdStudent, createdEnrollment }, use) => {
    const service = new SubmissionService(new HttpClient(request));
    const payload = SubmissionFactory.build({
      studentId: createdStudent.id,
      assignmentId: SANDBOX_ASSIGNMENT_ID,
    });

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const submission = SubmissionSchema.parse(await response.json());

    await use(submission);

    await service.delete(submission.id);
  },
});

export { expect };
