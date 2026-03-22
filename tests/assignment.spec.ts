import { test, expect } from '@fixtures/assignment.fixtures';
import { AssignmentFactory } from '@factories/assignment.factory';
import { AssignmentSchema, AssignmentTypesResponseSchema } from '@dtos/assignment.dto';
import { SANDBOX_COURSE_ID } from '@data/test-data/sandbox.data';

test.describe('Assignments API', () => {
  test('GET /education/api/assignments/types — returns a list of assignment types', async ({
    assignmentService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => assignmentService.getTypes());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const types = AssignmentTypesResponseSchema.parse(body);
      expect(types.length).toBeGreaterThan(0);
    });
  });

  test('GET /education/api/assignments — returns a paginated list', async ({
    assignmentService,
  }) => {
    await test.step('Given', async () => {});

    const response = await test.step('When', async () => assignmentService.list());

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });

  test('POST /education/api/assignments — creates an assignment with valid payload', async ({
    assignmentService,
  }) => {
    const payload = await test.step('Given', async () =>
      AssignmentFactory.published({ courseId: SANDBOX_COURSE_ID }));

    const response = await test.step('When', async () => assignmentService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const assignment = AssignmentSchema.parse(body);
      createdId = assignment.id;

      expect.soft(assignment.courseId).toBe(payload.courseId);
      expect.soft(assignment.isPublished).toBe(true);
      expect.soft(assignment.id).toBeTruthy();
    });

    await assignmentService.delete(createdId!);
  });

  test('POST /education/api/assignments — creates an unpublished assignment', async ({
    assignmentService,
  }) => {
    const payload = await test.step('Given', async () =>
      AssignmentFactory.unpublished({ courseId: SANDBOX_COURSE_ID }));

    const response = await test.step('When', async () => assignmentService.create(payload));

    let createdId: number;
    await test.step('Then', async () => {
      expect(response.status()).toBe(201);
      const body = await response.json();
      const assignment = AssignmentSchema.parse(body);
      createdId = assignment.id;
      expect.soft(assignment.isPublished).toBe(false);
    });

    await assignmentService.delete(createdId!);
  });

  test('GET /education/api/assignments/:id — returns the created assignment', async ({
    assignmentService,
    createdAssignment,
  }) => {
    const assignmentId = await test.step('Given', async () => createdAssignment.id);

    const response = await test.step('When', async () => assignmentService.getById(assignmentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const assignment = AssignmentSchema.parse(body);
      expect.soft(assignment.id).toBe(createdAssignment.id);
      expect.soft(assignment.courseId).toBe(createdAssignment.courseId);
      expect.soft(assignment.title).toBe(createdAssignment.title);
    });
  });

  test('GET /education/api/assignments/:id — returns 404 for non-existent ID', async ({
    assignmentService,
  }) => {
    const nonExistentId = await test.step('Given', async () => 999999999);

    const response = await test.step('When', async () => assignmentService.getById(nonExistentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('PUT /education/api/assignments/:id — updates the assignment', async ({
    assignmentService,
    createdAssignment,
  }) => {
    const updates = await test.step('Given', async () =>
      AssignmentFactory.buildUpdate({ title: 'Updated Assignment Title' }));

    const response = await test.step('When', async () =>
      assignmentService.update(createdAssignment.id, updates));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      const assignment = AssignmentSchema.parse(body);
      expect.soft(assignment.title).toBe('Updated Assignment Title');
      expect.soft(assignment.id).toBe(createdAssignment.id);
    });
  });

  test('DELETE /education/api/assignments/:id — deletes the assignment and returns 204', async ({
    assignmentService,
  }) => {
    const assignmentId = await test.step('Given', async () => {
      const createResponse = await assignmentService.create(
        AssignmentFactory.published({ courseId: SANDBOX_COURSE_ID }),
      );
      expect(createResponse.ok()).toBeTruthy();
      const body = await createResponse.json();
      return AssignmentSchema.parse(body).id;
    });

    const response = await test.step('When', async () => assignmentService.delete(assignmentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(204);

      const getResponse = await assignmentService.getById(assignmentId);
      expect(getResponse.status()).toBe(404);
    });
  });

  test('GET /education/api/assignments/:id/submissions — returns submissions for assignment', async ({
    assignmentService,
    createdAssignment,
  }) => {
    const assignmentId = await test.step('Given', async () => createdAssignment.id);

    const response = await test.step('When', async () =>
      assignmentService.getSubmissions(assignmentId));

    await test.step('Then', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toBeDefined();
    });
  });
});
