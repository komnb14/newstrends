type ErrorName =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnknownError'
  | 'UnAuthorizedError';
type ErrorInfo = {
  message: string;
  statusCode: number;
};
const statusCodeMap: Record<ErrorName, ErrorInfo> = {
  UserExistsError: {
    message: 'User Already Exists',
    statusCode: 409,
  },
  AuthenticationError: {
    message: 'Invalid Username or Password',
    statusCode: 401,
  },
  UnAuthorizedError: {
    message: 'Unauthorized',
    statusCode: 401,
  },
  UnknownError: {
    message: 'Unknown Error',
    statusCode: 500,
  },
};

export default class AppError extends Error {
  public statusCode: number;

  constructor(public name: ErrorName) {
    const info = statusCodeMap[name];
    super(info.message);
    this.statusCode = info.statusCode;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export const appErrorSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
  },
};

export function createAppErrorSchema<T>(example: T) {
  return {
    ...appErrorSchema,
    example,
  };
}
