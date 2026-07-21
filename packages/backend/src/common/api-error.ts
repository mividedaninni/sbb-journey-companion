import { ApiError, ApiErrorCode } from '@sbb-journey-companion/common';
import { Response } from 'express';

export const ERROR_STATUS_MAP: Record<ApiErrorCode, number> = {
  [ApiErrorCode.VALIDATION_ERROR]: 400,
  [ApiErrorCode.INVALID_CREDENTIALS]: 401,
  [ApiErrorCode.UNAUTHORIZED]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.USERNAME_TAKEN]: 409,
  [ApiErrorCode.INTERNAL_ERROR]: 500,
};

export function sendApiError(
  res: Response,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): Response<ApiError> {
  const error: ApiError = { code, message, details };
  return res.status(ERROR_STATUS_MAP[code]).json(error);
}
