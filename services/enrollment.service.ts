import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateEnrollmentRequest, UpdateEnrollmentRequest } from '@dtos/enrollment.dto';

/**
 * Service for the `/education/api/enrollments` endpoint group.
 * Wraps all CRUD operations plus enrollment statuses reference data.
 */
export class EnrollmentService {
  constructor(private readonly http: HttpClient) {}

  getStatuses(): Promise<APIResponse> {
    return this.http.get('/education/api/enrollments/statuses');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.http.get('/education/api/enrollments', { params });
  }

  create(payload: CreateEnrollmentRequest): Promise<APIResponse> {
    return this.http.post('/education/api/enrollments', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/enrollments/${id}`);
  }

  update(id: number, payload: UpdateEnrollmentRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/enrollments/${id}`, { data: payload });
  }

  partialUpdate(id: number, payload: Partial<UpdateEnrollmentRequest>): Promise<APIResponse> {
    return this.http.patch(`/education/api/enrollments/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/enrollments/${id}`);
  }
}
