import { test as enrollmentTest, expect } from './enrollment.fixtures';
import { HttpClient } from '../utils/http-client';
import { SubmissionService } from '../services/submission.service';
import { SubmissionFactory } from '../factories/submission.factory';
import { SubmissionSchema, type Submission } from '../dtos/submission.dto';

type SubmissionFixtures = {
  submissionService: SubmissionService;
  createdSubmission: Submission;
};

export const test = enrollmentTest.extend<SubmissionFixtures>({
  submissionService: async ({ request }, use) => {
    await use(new SubmissionService(new HttpClient(request)));
  },

  createdSubmission: async ({ request, createdStudent, createdEnrollment }, use) => {
    const service = new SubmissionService(new HttpClient(request));
    const payload = SubmissionFactory.build({ studentId: createdStudent.id, assignmentId: 1 });

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const submission = SubmissionSchema.parse(await response.json());

    await use(submission);

    await service.delete(submission.id);
  },
});

export { expect };
