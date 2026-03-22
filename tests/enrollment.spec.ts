import { test, expect } from '@fixtures/enrollment.fixtures';
import { EnrollmentFactory } from '@factories/enrollment.factory';
import { EnrollmentSchema, EnrollmentStatusesResponseSchema } from '@dtos/enrollment.dto';
import { SANDBOX_COURSE_ID } from '@data/test-data/sandbox.data';

test.describe('Enrollments API', () => {
  test('GET /education/api/enrollments/statuses — returns available statuses', async ({
    enrollmentService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => enrollmentService.getStatuses());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const statuses = EnrollmentStatusesResponseSchema.parse(body);
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/enrollments — returns a list of enrollments', async ({
    enrollmentService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => enrollmentService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /education/api/enrollments — enrolls a student in a course', async ({
    enrollmentService,
    createdStudent,
  }) => {
    const payload = await test.step('Given', async () =>
      EnrollmentFactory.build({ studentId: createdStudent.id, courseId: SANDBOX_COURSE_ID }));

    const response = await test.step('When', async () => enrollmentService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const enrollment = EnrollmentSchema.parse(body);
      createdId = enrollment.id;

      expect.soft(enrollment.studentId).toBe(payload.studentId);
      expect.soft(enrollment.courseId).toBe(payload.courseId);
      expect.soft(enrollment.id).toBeTruthy();
    });

    await enrollmentService.delete(createdId!);
  });

  test('POST /education/api/enrollments — creates a completed enrollment', async ({
    enrollmentService,
    createdStudent,
  }) => {
    const payload = await test.step('Given', async () =>
      EnrollmentFactory.completed({ studentId: createdStudent.id, courseId: SANDBOX_COURSE_ID }));

    const response = await test.step('When', async () => enrollmentService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const enrollment = EnrollmentSchema.parse(body);
      createdId = enrollment.id;
      expect.soft(enrollment.status).toBe('Completed');
      expect.soft(enrollment.progressPercentage).toBe(100);
    });

    await enrollmentService.delete(createdId!);
  });

  test('GET /education/api/enrollments/:id — returns the created enrollment', async ({
    enrollmentService,
    createdEnrollment,
  }) => {
    const enrollmentId = await test.step('Given', async () => createdEnrollment.id);

    const response = await test.step('When', async () => enrollmentService.getById(enrollmentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const enrollment = EnrollmentSchema.parse(body);
      expect.soft(enrollment.id).toBe(createdEnrollment.id);
      expect.soft(enrollment.studentId).toBe(createdEnrollment.studentId);
      expect.soft(enrollment.courseId).toBe(createdEnrollment.courseId);
    });
  });

  test('GET /education/api/enrollments/:id — returns 404 for non-existent enrollment', async ({
    enrollmentService,
  }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => enrollmentService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /education/api/enrollments/:id — updates the enrollment', async ({
    enrollmentService,
    createdEnrollment,
  }) => {
    const updates = await test.step('Given', async () =>
      EnrollmentFactory.buildUpdate({ progressPercentage: 75, status: 'Active' }));

    const response = await test.step('When', async () =>
      enrollmentService.update(createdEnrollment.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const enrollment = EnrollmentSchema.parse(body);
      expect.soft(enrollment.progressPercentage).toBe(75);
      expect.soft(enrollment.id).toBe(createdEnrollment.id);
    });
  });

  test('PATCH /education/api/enrollments/:id — partially updates enrollment progress', async ({
    enrollmentService,
    createdEnrollment,
  }) => {
    const partialUpdate = await test.step('Given', async () => ({ progressPercentage: 50 }));

    const response = await test.step('When', async () =>
      enrollmentService.partialUpdate(createdEnrollment.id, partialUpdate));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect.soft(body.progressPercentage).toBe(50);
    });
  });

  test('DELETE /education/api/enrollments/:id — unenrolls student and returns 204', async ({
    enrollmentService,
    createdStudent,
  }) => {
    const enrollmentId = await test.step('Given', async () => {
      const createResponse = await enrollmentService.create(
        EnrollmentFactory.build({ studentId: createdStudent.id, courseId: SANDBOX_COURSE_ID }),
      );
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return EnrollmentSchema.parse(body).id;
    });

    const response = await test.step('When', async () => enrollmentService.delete(enrollmentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(204);

      const getResponse = await enrollmentService.getById(enrollmentId);
      expect(getResponse.status()).toBe(404);
    });
  });
});
