import type { APIRequestContext, APIResponse } from '@playwright/test';
import { sleep } from './sleep';

type RequestOptions = Parameters<APIRequestContext['get']>[1];

export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  private async withRetry(
    method: string,
    url: string,
    fn: () => Promise<APIResponse>,
  ): Promise<APIResponse> {
    let response = await fn();
    for (let attempt = 0; response.status() === 429 && attempt < 3; attempt++) {
      await sleep(2000 * (attempt + 1));
      response = await fn();
    }
    return response;
  }

  get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('GET', url, () => this.request.get(url, options));
  }

  post(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('POST', url, () => this.request.post(url, options));
  }

  put(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('PUT', url, () => this.request.put(url, options));
  }

  patch(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('PATCH', url, () => this.request.patch(url, options));
  }

  delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('DELETE', url, () => this.request.delete(url, options));
  }
}
