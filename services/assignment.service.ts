import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateAssignmentRequest, UpdateAssignmentRequest } from '@dtos/assignment.dto';

export class AssignmentService {
  constructor(private readonly http: HttpClient) {}

  getTypes(): Promise<APIResponse> {
    return this.http.get('/education/api/assignments/types');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.http.get('/education/api/assignments', { params });
  }

  create(payload: CreateAssignmentRequest): Promise<APIResponse> {
    return this.http.post('/education/api/assignments', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/assignments/${id}`);
  }

  update(id: number, payload: UpdateAssignmentRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/assignments/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/assignments/${id}`);
  }

  getSubmissions(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/assignments/${id}/submissions`);
  }
}
