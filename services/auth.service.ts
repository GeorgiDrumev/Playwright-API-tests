import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { LoginRequest } from '@dtos/user.dto';

export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Promise<APIResponse> {
    return this.http.post('/api/auth/login', { data: payload });
  }
}
