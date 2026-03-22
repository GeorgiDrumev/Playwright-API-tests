import { z } from 'zod';

export const EnrollmentSchema = z.object({
  id: z.number().int(),
  studentId: z.number().int(),
  courseId: z.number().int(),
  enrolledAt: z.string(),
  progressPercentage: z.number().int(),
  status: z.string().nullable(),
  completedAt: z.string().nullable(),
  finalGrade: z.number().nullable(),
  certificateIssued: z.boolean(),
  lastAccessedAt: z.string(),
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;

export const CreateEnrollmentRequestSchema = EnrollmentSchema.omit({ id: true });
export type CreateEnrollmentRequest = z.infer<typeof CreateEnrollmentRequestSchema>;

export const UpdateEnrollmentRequestSchema = CreateEnrollmentRequestSchema.partial();
export type UpdateEnrollmentRequest = z.infer<typeof UpdateEnrollmentRequestSchema>;

export const EnrollmentStatusesResponseSchema = z.array(z.string());
export type EnrollmentStatusesResponse = z.infer<typeof EnrollmentStatusesResponseSchema>;
