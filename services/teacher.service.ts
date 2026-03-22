import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateTeacherRequest, UpdateTeacherRequest } from '@dtos/teacher.dto';

/**
 * Service for the `/education/api/teachers` endpoint group.
 * Wraps all CRUD operations plus specializations and courses sub-resource for the Teacher resource.
 */
export class TeacherService {
  constructor(private readonly http: HttpClient) {}

  getSpecializations(): Promise<APIResponse> {
    return this.http.get('/education/api/teachers/specializations');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.http.get('/education/api/teachers', { params });
  }

  create(payload: CreateTeacherRequest): Promise<APIResponse> {
    return this.http.post('/education/api/teachers', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/teachers/${id}`);
  }

  update(id: number, payload: UpdateTeacherRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/teachers/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/teachers/${id}`);
  }

  getCourses(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/teachers/${id}/courses`);
  }
}
