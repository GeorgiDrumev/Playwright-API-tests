import { z } from 'zod';
import { AddressSchema } from '@dtos/common.dto';

/** Zod schema and TypeScript type for a User resource. */
export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().nullable(),
  username: z.string().nullable(),
  password: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  address: AddressSchema.nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserRequestSchema = UserSchema.omit({ id: true });
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z
  .object({
    token: z.string().optional(),
    user: UserSchema.optional(),
  })
  .passthrough();
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
