import { z } from 'zod';

export const AddressSchema = z.object({
  city: z.string().nullable(),
  street: z.string().nullable(),
  number: z.number().int(),
  zipcode: z.string().nullable(),
  geolocation: z.string().nullable(),
});

export type Address = z.infer<typeof AddressSchema>;

export const ProblemDetailsSchema = z.object({
  detail: z.string().nullable().optional(),
  instance: z.string().nullable().optional(),
  status: z.number().int().nullable().optional(),
  title: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  propertyName: z.unknown().optional(),
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
