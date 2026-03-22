import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.number().int(),
  assignmentId: z.number().int(),
  studentId: z.number().int(),
  content: z.string().nullable(),
  attachmentUrls: z.string().nullable(),
  submittedAt: z.string(),
  status: z.string().nullable(),
  pointsEarned: z.number().int().nullable(),
  feedback: z.string().nullable(),
  gradedAt: z.string().nullable(),
  isLate: z.boolean(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

export const CreateSubmissionRequestSchema = SubmissionSchema.omit({ id: true });
export type CreateSubmissionRequest = z.infer<typeof CreateSubmissionRequestSchema>;

export const UpdateSubmissionRequestSchema = CreateSubmissionRequestSchema.partial();
export type UpdateSubmissionRequest = z.infer<typeof UpdateSubmissionRequestSchema>;

export const GradeSubmissionRequestSchema = z.object({
  pointsEarned: z.number().int().nullable(),
  feedback: z.string().nullable(),
});
export type GradeSubmissionRequest = z.infer<typeof GradeSubmissionRequestSchema>;

export const SubmissionStatusesResponseSchema = z.array(z.string());
export type SubmissionStatusesResponse = z.infer<typeof SubmissionStatusesResponseSchema>;
