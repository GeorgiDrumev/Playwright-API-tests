import { test as base, expect } from '@playwright/test';
import { HttpClient } from '../utils/http-client';
import { TeacherService } from '../services/teacher.service';
import { TeacherFactory } from '../factories/teacher.factory';
import { TeacherSchema, type Teacher } from '../dtos/teacher.dto';

type TeacherFixtures = {
  teacherService: TeacherService;
  createdTeacher: Teacher;
};

export const test = base.extend<TeacherFixtures>({
  teacherService: async ({ request }, use) => {
    await use(new TeacherService(new HttpClient(request)));
  },

  createdTeacher: async ({ request }, use) => {
    const service = new TeacherService(new HttpClient(request));
    const payload = TeacherFactory.build();

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const teacher = TeacherSchema.parse(await response.json());

    await use(teacher);

    await service.delete(teacher.id);
  },
});

export { expect };
