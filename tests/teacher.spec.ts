import { test, expect } from '@fixtures/teacher.fixtures';
import { TeacherFactory } from '@factories/teacher.factory';
import { TeacherSchema, TeacherSpecializationsResponseSchema } from '@dtos/teacher.dto';

test.describe('Teachers API', () => {
  test('GET /education/api/teachers/specializations — returns a list of specializations', async ({
    teacherService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => teacherService.getSpecializations());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const specializations = TeacherSpecializationsResponseSchema.parse(body);
      expect(specializations.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/teachers — returns a list of teachers', async ({ teacherService }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => teacherService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /education/api/teachers — creates a teacher with valid payload', async ({
    teacherService,
  }) => {
    const payload = await test.step('Given', async () => TeacherFactory.build());

    const response = await test.step('When', async () => teacherService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const teacher = TeacherSchema.parse(body);
      createdId = teacher.id;

      expect.soft(teacher.firstName).toBe(payload.firstName);
      expect.soft(teacher.email).toBe(payload.email);
      expect.soft(teacher.specialization).toBe(payload.specialization);
      expect.soft(teacher.id).toBeTruthy();
    });

    await teacherService.delete(createdId!);
  });

  test('POST /education/api/teachers — creates an expert teacher', async ({ teacherService }) => {
    const payload = await test.step('Given', async () => TeacherFactory.expert());

    const response = await test.step('When', async () => teacherService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const teacher = TeacherSchema.parse(body);
      createdId = teacher.id;
      expect.soft(teacher.yearsOfExperience).toBe(10);
      expect.soft(teacher.rating).toBe(4.9);
    });

    await teacherService.delete(createdId!);
  });

  test('GET /education/api/teachers/:id — returns the created teacher', async ({
    teacherService,
    createdTeacher,
  }) => {
    const teacherId = await test.step('Given', async () => createdTeacher.id);

    const response = await test.step('When', async () => teacherService.getById(teacherId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const teacher = TeacherSchema.parse(body);
      expect.soft(teacher.id).toBe(createdTeacher.id);
      expect.soft(teacher.email).toBe(createdTeacher.email);
      expect.soft(teacher.specialization).toBe(createdTeacher.specialization);
    });
  });

  test('GET /education/api/teachers/:id — returns 404 for non-existent teacher', async ({
    teacherService,
  }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => teacherService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /education/api/teachers/:id — updates the teacher bio', async ({
    teacherService,
    createdTeacher,
  }) => {
    const updates = await test.step('Given', async () =>
      TeacherFactory.buildUpdate({ bio: 'Updated professional biography.' }));

    const response = await test.step('When', async () =>
      teacherService.update(createdTeacher.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const teacher = TeacherSchema.parse(body);
      expect.soft(teacher.bio).toBe('Updated professional biography.');
      expect.soft(teacher.id).toBe(createdTeacher.id);
    });
  });

  test('DELETE /education/api/teachers/:id — deletes the teacher and returns 204', async ({
    teacherService,
  }) => {
    const teacherId = await test.step('Given', async () => {
      const createResponse = await teacherService.create(TeacherFactory.build());
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return TeacherSchema.parse(body).id;
    });

    const response = await test.step('When', async () => teacherService.delete(teacherId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(204);

      const getResponse = await teacherService.getById(teacherId);
      expect(getResponse.status()).toBe(404);
    });
  });

  test('GET /education/api/teachers/:id/courses — returns courses for a teacher', async ({
    teacherService,
    createdTeacher,
  }) => {
    const teacherId = await test.step('Given', async () => createdTeacher.id);

    const response = await test.step('When', async () => teacherService.getCourses(teacherId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });
});
