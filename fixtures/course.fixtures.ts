import { test as base, expect } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import { CourseService } from '@services/course.service';
import { CourseFactory } from '@factories/course.factory';
import { CourseSchema, type Course } from '@dtos/course.dto';
import { SANDBOX_TEACHER_ID } from '@data/test-data/sandbox.data';

type CourseFixtures = {
  courseService: CourseService;
  createdCourse: Course;
};

/**
 * Playwright fixture for the Course resource.
 * Provides `courseService` and `createdCourse` (created before each test, deleted after).
 */
export const test = base.extend<CourseFixtures>({
  courseService: async ({ request }, use) => {
    await use(new CourseService(new HttpClient(request)));
  },

  createdCourse: async ({ request }, use) => {
    const service = new CourseService(new HttpClient(request));
    const payload = CourseFactory.published({ teacherId: SANDBOX_TEACHER_ID });

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const course = CourseSchema.parse(await response.json());

    await use(course);

    await service.delete(course.id);
  },
});

export { expect };
