import type { APIResponse } from '@playwright/test';
import { HttpClient } from '../utils/http-client';
import type {
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
  GradeSubmissionRequest,
} from '../dtos/submission.dto';

export class SubmissionService {
  constructor(private readonly http: HttpClient) {}

  getStatuses(): Promise<APIResponse> {
    return this.http.get('/education/api/submissions/statuses');
  }

  list(params?: Record<string, string>): Promise<APIResponse> {
    return this.http.get('/education/api/submissions', { params });
  }

  create(payload: CreateSubmissionRequest): Promise<APIResponse> {
    return this.http.post('/education/api/submissions', { data: payload });
  }

  getById(id: number): Promise<APIResponse> {
    return this.http.get(`/education/api/submissions/${id}`);
  }

  update(id: number, payload: UpdateSubmissionRequest): Promise<APIResponse> {
    return this.http.put(`/education/api/submissions/${id}`, { data: payload });
  }

  delete(id: number): Promise<APIResponse> {
    return this.http.delete(`/education/api/submissions/${id}`);
  }

  grade(id: number, payload: GradeSubmissionRequest): Promise<APIResponse> {
    return this.http.patch(`/education/api/submissions/${id}/grade`, { data: payload });
  }
}
