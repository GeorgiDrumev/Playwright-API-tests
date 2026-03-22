import { z } from 'zod';

/** Zod schema and TypeScript type for a Course resource. */
export const CourseSchema = z.object({
  id: z.number().int(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  level: z.string().nullable(),
  teacherId: z.number().int(),
  price: z.number(),
  durationHours: z.number().int(),
  rating: z.number(),
  enrollmentCount: z.number().int(),
  thumbnailUrl: z.string().nullable(),
  isPublished: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

export const CreateCourseRequestSchema = CourseSchema.omit({ id: true });
export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;

export const UpdateCourseRequestSchema = CreateCourseRequestSchema.partial();
export type UpdateCourseRequest = z.infer<typeof UpdateCourseRequestSchema>;

export const CourseCategoriesResponseSchema = z.array(z.string());
export type CourseCategoriesResponse = z.infer<typeof CourseCategoriesResponseSchema>;

export const CourseLevelsResponseSchema = z.array(z.string());
export type CourseLevelsResponse = z.infer<typeof CourseLevelsResponseSchema>;
