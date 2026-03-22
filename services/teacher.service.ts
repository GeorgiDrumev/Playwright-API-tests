import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateTeacherRequest, UpdateTeacherRequest } from '@dtos/teacher.dto';

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
