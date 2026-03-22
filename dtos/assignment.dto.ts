import { z } from 'zod';

/** Zod schema and TypeScript type for an Assignment resource. */
export const AssignmentSchema = z.object({
  id: z.number().int(),
  courseId: z.number().int(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  type: z.string().nullable(),
  maxPoints: z.number().int(),
  dueDate: z.string(),
  createdAt: z.string(),
  isPublished: z.boolean(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const CreateAssignmentRequestSchema = AssignmentSchema.omit({ id: true });
export type CreateAssignmentRequest = z.infer<typeof CreateAssignmentRequestSchema>;

export const UpdateAssignmentRequestSchema = CreateAssignmentRequestSchema.partial();
export type UpdateAssignmentRequest = z.infer<typeof UpdateAssignmentRequestSchema>;

export const AssignmentTypesResponseSchema = z.array(z.string());
export type AssignmentTypesResponse = z.infer<typeof AssignmentTypesResponseSchema>;
