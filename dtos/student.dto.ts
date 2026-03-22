import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  profilePictureUrl: z.string().nullable().optional(),
  joinedAt: z.string().nullable().optional(),
  enrolledCoursesCount: z.number().int().nullable().optional(),
  completedCoursesCount: z.number().int().nullable().optional(),
  totalPoints: z.number().nullable().optional(),
});

export type Student = z.infer<typeof StudentSchema>;

export const CreateStudentRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});
export type CreateStudentRequest = z.infer<typeof CreateStudentRequestSchema>;

export const UpdateStudentRequestSchema = CreateStudentRequestSchema.partial();
export type UpdateStudentRequest = z.infer<typeof UpdateStudentRequestSchema>;
