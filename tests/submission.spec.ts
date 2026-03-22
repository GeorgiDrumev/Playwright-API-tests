import { test, expect } from '../fixtures/submission.fixtures';
import { SubmissionFactory } from '../factories/submission.factory';
import { SubmissionSchema, SubmissionStatusesResponseSchema } from '../dtos/submission.dto';

test.describe('Submissions API', () => {
  test('GET /education/api/submissions/statuses — returns available statuses', async ({
    submissionService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => submissionService.getStatuses());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const statuses = SubmissionStatusesResponseSchema.parse(body);
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/submissions — returns a list of submissions', async ({
    submissionService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => submissionService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /education/api/submissions — creates a submission with valid payload', async ({
    submissionService,
    createdStudent,
    createdEnrollment,
  }) => {
    const payload = await test.step('Given', async () =>
      SubmissionFactory.build({ assignmentId: 1, studentId: createdStudent.id }));

    const response = await test.step('When', async () => submissionService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const submission = SubmissionSchema.parse(body);
      createdId = submission.id;

      expect.soft(submission.assignmentId).toBe(payload.assignmentId);
      expect.soft(submission.studentId).toBe(payload.studentId);
      expect.soft(submission.status).toBe('Pending');
      expect.soft(submission.pointsEarned).toBeNull();
      expect.soft(submission.id).toBeTruthy();
    });

    await submissionService.delete(createdId!);
  });

  test('POST /education/api/submissions — creates a late submission', async ({
    submissionService,
    createdStudent,
    createdEnrollment,
  }) => {
    const payload = await test.step('Given', async () =>
      SubmissionFactory.late({ assignmentId: 1, studentId: createdStudent.id }));

    const response = await test.step('When', async () => submissionService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const submission = SubmissionSchema.parse(body);
      createdId = submission.id;
      expect.soft(submission.isLate).toBe(true);
      expect.soft(submission.status).toBe('Pending');
    });

    await submissionService.delete(createdId!);
  });

  test('GET /education/api/submissions/:id — returns the created submission', async ({
    submissionService,
    createdSubmission,
  }) => {
    const submissionId = await test.step('Given', async () => createdSubmission.id);

    const response = await test.step('When', async () => submissionService.getById(submissionId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const submission = SubmissionSchema.parse(body);
      expect.soft(submission.id).toBe(createdSubmission.id);
      expect.soft(submission.assignmentId).toBe(createdSubmission.assignmentId);
      expect.soft(submission.studentId).toBe(createdSubmission.studentId);
    });
  });

  test('GET /education/api/submissions/:id — returns 404 for non-existent submission', async ({
    submissionService,
  }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => submissionService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /education/api/submissions/:id — updates the submission content', async ({
    submissionService,
    createdSubmission,
  }) => {
    const updates = await test.step('Given', async () =>
      SubmissionFactory.buildUpdate({ content: 'Updated answer content' }));

    const response = await test.step('When', async () =>
      submissionService.update(createdSubmission.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const submission = SubmissionSchema.parse(body);
      expect.soft(submission.content).toBe('Updated answer content');
      expect.soft(submission.id).toBe(createdSubmission.id);
    });
  });

  test('PATCH /education/api/submissions/:id/grade — grades a submission', async ({
    submissionService,
    createdSubmission,
  }) => {
    const gradePayload = await test.step('Given', async () =>
      SubmissionFactory.buildGrade({ pointsEarned: 85, feedback: 'Great work!' }));

    const response = await test.step('When', async () =>
      submissionService.grade(createdSubmission.id, gradePayload));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect.soft(body.pointsEarned).toBe(85);
      expect.soft(body.feedback).toBe('Great work!');
    });
  });

  test('DELETE /education/api/submissions/:id — deletes the submission and returns 204', async ({
    submissionService,
    createdStudent,
    createdEnrollment,
  }) => {
    const submissionId = await test.step('Given', async () => {
      const createResponse = await submissionService.create(
        SubmissionFactory.build({ assignmentId: 1, studentId: createdStudent.id }),
      );
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return SubmissionSchema.parse(body).id;
    });

    const response = await test.step('When', async () => submissionService.delete(submissionId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(204);

      const getResponse = await submissionService.getById(submissionId);
      expect(getResponse.status()).toBe(404);
    });
  });
});
