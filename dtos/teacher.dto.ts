import { z } from 'zod';

export const TeacherSchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  bio: z.string().nullable(),
  specialization: z.string().nullable(),
  profilePictureUrl: z.string().nullable(),
  yearsOfExperience: z.number().int(),
  rating: z.number(),
  totalStudents: z.number().int(),
  courseCount: z.number().int(),
  joinedAt: z.string(),
});

export type Teacher = z.infer<typeof TeacherSchema>;

export const CreateTeacherRequestSchema = TeacherSchema.omit({ id: true });
export type CreateTeacherRequest = z.infer<typeof CreateTeacherRequestSchema>;

export const UpdateTeacherRequestSchema = CreateTeacherRequestSchema.partial();
export type UpdateTeacherRequest = z.infer<typeof UpdateTeacherRequestSchema>;

export const TeacherSpecializationsResponseSchema = z.array(z.string());
export type TeacherSpecializationsResponse = z.infer<typeof TeacherSpecializationsResponseSchema>;
