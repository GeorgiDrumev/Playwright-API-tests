import { test as studentTest, expect } from '@fixtures/student.fixtures';
import { HttpClient } from '@utils/http-client';
import { EnrollmentService } from '@services/enrollment.service';
import { EnrollmentFactory } from '@factories/enrollment.factory';
import { EnrollmentSchema, type Enrollment } from '@dtos/enrollment.dto';
import { SANDBOX_COURSE_ID } from '@data/test-data/sandbox.data';

type EnrollmentFixtures = {
  enrollmentService: EnrollmentService;
  createdEnrollment: Enrollment;
};

export const test = studentTest.extend<EnrollmentFixtures>({
  enrollmentService: async ({ request }, use) => {
    await use(new EnrollmentService(new HttpClient(request)));
  },

  createdEnrollment: async ({ request, createdStudent }, use) => {
    const service = new EnrollmentService(new HttpClient(request));
    const payload = EnrollmentFactory.build({
      studentId: createdStudent.id,
      courseId: SANDBOX_COURSE_ID,
    });

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const enrollment = EnrollmentSchema.parse(await response.json());

    await use(enrollment);

    await service.delete(enrollment.id);
  },
});

export { expect };
