import { test, expect } from '../fixtures/course.fixtures';
import { CourseFactory } from '../factories/course.factory';
import {
  CourseSchema,
  CourseCategoriesResponseSchema,
  CourseLevelsResponseSchema,
} from '../dtos/course.dto';
import { SANDBOX_TEACHER_ID } from '../data/test-data/sandbox.data';

test.describe('Courses API', () => {
  test('GET /education/api/courses/categories — returns a list of categories', async ({
    courseService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => courseService.getCategories());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const categories = CourseCategoriesResponseSchema.parse(body);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/courses/levels — returns a list of course levels', async ({
    courseService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => courseService.getLevels());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const levels = CourseLevelsResponseSchema.parse(body);
      expect(levels.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/courses — returns a list of courses', async ({ courseService }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => courseService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /education/api/courses — creates a course with valid payload', async ({
    courseService,
  }) => {
    const payload = await test.step('Given', async () =>
      CourseFactory.published({ teacherId: SANDBOX_TEACHER_ID }));

    const response = await test.step('When', async () => courseService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const course = CourseSchema.parse(body);
      createdId = course.id;

      expect.soft(course.isPublished).toBe(true);
      expect.soft(course.teacherId).toBe(payload.teacherId);
      expect.soft(course.id).toBeTruthy();
    });

    await courseService.delete(createdId!);
  });

  test('POST /education/api/courses — creates a free course', async ({ courseService }) => {
    const payload = await test.step('Given', async () =>
      CourseFactory.free({ teacherId: SANDBOX_TEACHER_ID }));

    const response = await test.step('When', async () => courseService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const course = CourseSchema.parse(body);
      createdId = course.id;
      expect.soft(course.price).toBe(0);
    });

    await courseService.delete(createdId!);
  });

  test('GET /education/api/courses/:id — returns the created course', async ({
    courseService,
    createdCourse,
  }) => {
    const courseId = await test.step('Given', async () => createdCourse.id);

    const response = await test.step('When', async () => courseService.getById(courseId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const course = CourseSchema.parse(body);
      expect.soft(course.id).toBe(createdCourse.id);
      expect.soft(course.title).toBe(createdCourse.title);
      expect.soft(course.teacherId).toBe(createdCourse.teacherId);
    });
  });

  test('GET /education/api/courses/:id — returns 404 for non-existent course', async ({
    courseService,
  }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => courseService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /education/api/courses/:id — updates the course title', async ({
    courseService,
    createdCourse,
  }) => {
    const updates = await test.step('Given', async () =>
      CourseFactory.buildUpdate({ title: 'Updated Course Title' }));

    const response = await test.step('When', async () =>
      courseService.update(createdCourse.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const course = CourseSchema.parse(body);
      expect.soft(course.title).toBe('Updated Course Title');
      expect.soft(course.id).toBe(createdCourse.id);
    });
  });

  test('DELETE /education/api/courses/:id — deletes the course and returns 204', async ({
    courseService,
  }) => {
    const courseId = await test.step('Given', async () => {
      const createResponse = await courseService.create(
        CourseFactory.published({ teacherId: SANDBOX_TEACHER_ID }),
      );
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return CourseSchema.parse(body).id;
    });

    const response = await test.step('When', async () => courseService.delete(courseId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(204);

      const getResponse = await courseService.getById(courseId);
      expect(getResponse.status()).toBe(404);
    });
  });

  test('GET /education/api/courses/search — returns courses matching the query', async ({
    courseService,
  }) => {
    const query = await test.step('Given', async () => 'programming');

    const response = await test.step('When', async () => courseService.search(query));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });
});
