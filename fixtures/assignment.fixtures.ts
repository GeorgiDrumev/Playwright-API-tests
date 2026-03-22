import { test as base, expect } from '@playwright/test';
import { HttpClient } from '../utils/http-client';
import { AssignmentService } from '../services/assignment.service';
import { AssignmentFactory } from '../factories/assignment.factory';
import { AssignmentSchema, type Assignment } from '../dtos/assignment.dto';
import { SANDBOX_COURSE_ID } from '../data/test-data/sandbox.data';

type AssignmentFixtures = {
  assignmentService: AssignmentService;
  createdAssignment: Assignment;
};

export const test = base.extend<AssignmentFixtures>({
  assignmentService: async ({ request }, use) => {
    await use(new AssignmentService(new HttpClient(request)));
  },

  createdAssignment: async ({ request }, use) => {
    const service = new AssignmentService(new HttpClient(request));
    const payload = AssignmentFactory.published({ courseId: SANDBOX_COURSE_ID });

    const response = await service.create(payload);
    expect(response.ok()).toBeTruthy();
    const assignment = AssignmentSchema.parse(await response.json());

    await use(assignment);

    await service.delete(assignment.id);
  },
});

export { expect };
