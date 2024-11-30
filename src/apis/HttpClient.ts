import ApiError from './ApiError';

export default class HttpClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_DEV_SERVER_URL;
  }

  private buildURLWithParams(
    endpoint: string,
    params?: Record<string, string>,
  ): string {
    const url = `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      return `${url}?${queryString}`;
    }
    return url;
  }

  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = this.buildURLWithParams(endpoint, params);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.msg || '알 수 없는 에러가 발생했습니다.',
      );
    }
    return data;
  }

  async get<T>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string>,
  ): Promise<T> {
    return this.fetchWithErrorHandling<T>(
      endpoint,
      { ...options, method: 'GET' },
      params,
    );
  }

  async post<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
    params?: Record<string, string>,
  ): Promise<T> {
    return this.fetchWithErrorHandling<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      },
      params,
    );
  }

  async put<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
    params?: Record<string, string>,
  ): Promise<T> {
    return this.fetchWithErrorHandling<T>(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      params,
    );
  }

  async delete<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
    params?: Record<string, string>,
  ): Promise<T> {
    return this.fetchWithErrorHandling<T>(
      endpoint,
      {
        ...options,
        method: 'DELETE',
        body: JSON.stringify(body),
      },
      params,
    );
  }
}
