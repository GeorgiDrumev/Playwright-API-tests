import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { LoginRequest } from '@dtos/user.dto';

/**
 * Service for the `/api/auth` endpoint group.
 * Provides authentication operations against the Mockerito API.
 */
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  /** POST `/api/auth/login` — exchange credentials for a JWT token. */
  login(payload: LoginRequest): Promise<APIResponse> {
    return this.http.post('/api/auth/login', { data: payload });
  }
}
