export default class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
    // Error 클래스를 상속받을 때 프로토타입 체인 복구
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
