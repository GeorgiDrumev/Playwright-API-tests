import { z } from 'zod';

/** Zod schema for a physical address shared across multiple resources. */
export const AddressSchema = z.object({
  city: z.string().nullable(),
  street: z.string().nullable(),
  number: z.number().int(),
  zipcode: z.string().nullable(),
  geolocation: z.string().nullable(),
});

export type Address = z.infer<typeof AddressSchema>;

/** Zod schema for RFC 7807 Problem Details error responses. */
export const ProblemDetailsSchema = z.object({
  detail: z.string().nullable().optional(),
  instance: z.string().nullable().optional(),
  status: z.number().int().nullable().optional(),
  title: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  propertyName: z.unknown().optional(),
});

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
