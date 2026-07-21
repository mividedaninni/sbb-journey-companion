import type { NextFunction, Request, Response } from 'express';

import { ApiErrorCode } from '@sbb-journey-companion/common';

import { sendApiError } from '../common/api-error.js';
import { verifyAccessToken } from './jwt.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendApiError(res, ApiErrorCode.UNAUTHORIZED, 'Missing Authorization header');
  }

  if (!authHeader.startsWith('Bearer ')) {
    return sendApiError(res, ApiErrorCode.UNAUTHORIZED, 'Invalid Authorization header format');
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    console.error(err);
    return sendApiError(res, ApiErrorCode.UNAUTHORIZED, 'Invalid or expired access token');
  }
}
