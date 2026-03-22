import type { APIRequestContext, APIResponse } from '@playwright/test';
import { sleep } from '@utils/sleep';

type RequestOptions = Parameters<APIRequestContext['get']>[1];

/**
 * Thin wrapper around Playwright's `APIRequestContext` that adds automatic
 * retry behaviour for `429 Too Many Requests` responses.
 *
 * Each HTTP method retries up to **3 times** with exponential back-off
 * (2 s, 4 s, 6 s) before returning the last response to the caller.
 */
export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Executes `fn` and retries up to 3 times when the API responds with 429.
   * Waits `2000 * (attempt + 1)` ms between each retry.
   */
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

  /** Sends a GET request to `url`. */
  get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('GET', url, () => this.request.get(url, options));
  }

  /** Sends a POST request to `url` with the provided `options`. */
  post(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('POST', url, () => this.request.post(url, options));
  }

  /** Sends a PUT request to `url` with the provided `options`. */
  put(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('PUT', url, () => this.request.put(url, options));
  }

  /** Sends a PATCH request to `url` with the provided `options`. */
  patch(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('PATCH', url, () => this.request.patch(url, options));
  }

  /** Sends a DELETE request to `url`. */
  delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.withRetry('DELETE', url, () => this.request.delete(url, options));
  }
}
