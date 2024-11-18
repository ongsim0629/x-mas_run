export default class HttpClient {
  private baseURL: string;
  constructor() {
    this.baseURL = import.meta.env.VITE_DEV_SERVER_URL;
  }

  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // credentials: 'include',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || '알 수 없는 에러가 발생했습니다.');
    }
    return data;
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetchWithErrorHandling<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
  ): Promise<T> {
    return this.fetchWithErrorHandling(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
  ): Promise<T> {
    return this.fetchWithErrorHandling(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(
    endpoint: string,
    body: object,
    options: RequestInit = {},
  ): Promise<T> {
    return this.fetchWithErrorHandling(endpoint, {
      ...options,
      method: 'DELETE',
      body: JSON.stringify(body),
    });
  }
}
