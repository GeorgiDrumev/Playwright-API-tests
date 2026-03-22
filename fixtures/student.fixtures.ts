import { test as base, expect } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import { StudentService } from '@services/student.service';
import { StudentFactory } from '@factories/student.factory';
import { StudentSchema, type Student } from '@dtos/student.dto';

type StudentFixtures = {
  studentService: StudentService;
  createdStudent: Student;
};

export const test = base.extend<StudentFixtures>({
  studentService: async ({ request }, use) => {
    await use(new StudentService(new HttpClient(request)));
  },

  createdStudent: async ({ request }, use) => {
    const service = new StudentService(new HttpClient(request));
    const payload = StudentFactory.build();

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const student = StudentSchema.parse(await response.json());

    await use(student);

    await service.delete(student.id);
  },
});

export { expect };
