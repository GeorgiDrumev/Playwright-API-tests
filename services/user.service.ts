import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateUserRequest, UpdateUserRequest } from '@dtos/user.dto';

export class UserService {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<APIResponse> {
    return this.http.get('/api/users');
  }

  create(payload: CreateUserRequest): Promise<APIResponse> {
    return this.http.post('/api/users', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/api/users/${id}`);
  }

  update(id: number, payload: UpdateUserRequest): Promise<APIResponse> {
    return this.http.put(`/api/users/${id}`, { data: payload });
  }

  partialUpdate(id: number, payload: Partial<UpdateUserRequest>): Promise<APIResponse> {
    return this.http.patch(`/api/users/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/api/users/${id}`);
  }
}
