import type { APIResponse } from '@playwright/test';
import { HttpClient } from '@utils/http-client';
import type { CreateStudentRequest, UpdateStudentRequest } from '@dtos/student.dto';

export class StudentService {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<APIResponse> {
    return this.http.get('/education/api/students');
  }

  create(payload: CreateStudentRequest): Promise<APIResponse> {
    return this.http.post('/education/api/students', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/students/${id}`);
  }

  update(id: number, payload: UpdateStudentRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/students/${id}`, { data: payload });
  }

  partialUpdate(id: number, payload: Partial<UpdateStudentRequest>): Promise<APIResponse> {
    return this.http.patch(`/education/api/students/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/students/${id}`);
  }
}
