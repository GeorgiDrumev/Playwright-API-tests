import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateCourseRequest, UpdateCourseRequest } from '@dtos/course.dto';

/**
 * Service for the `/education/api/courses` endpoint group.
 * Wraps all CRUD operations plus search and reference-data lookups for the Course resource.
 */
export class CourseService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Promise<APIResponse> {
    return this.http.get('/education/api/courses/categories');
  }

  getLevels(): Promise<APIResponse> {
    return this.http.get('/education/api/courses/levels');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.http.get('/education/api/courses', { params });
  }

  create(payload: CreateCourseRequest): Promise<APIResponse> {
    return this.http.post('/education/api/courses', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/courses/${id}`);
  }

  update(id: number, payload: UpdateCourseRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/courses/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/courses/${id}`);
  }

  search(query: string): Promise<APIResponse> {
    return this.http.get('/education/api/courses/search', { params: { query } });
  }
}
