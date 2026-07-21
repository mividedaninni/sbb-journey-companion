import {
  ApiErrorCode,
  AuthRequestDto,
  AuthResponseDto,
  JwtPayloadDto,
  UserDto,
} from '@sbb-journey-companion/common';
import { Request, Response, Router } from 'express';

import { sendApiError } from '../common/api-error.js';
import { findUser, login, register } from './auth.service.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt.js';

const isProduction = process.env.NODE_ENV === 'production';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const authRouter: Router = Router();

authRouter.post('/register', async (req: Request, res: Response): Promise<Response> => {
  const { username, password }: AuthRequestDto = req.body;

  if (!username || !password) {
    return sendApiError(res, ApiErrorCode.VALIDATION_ERROR, 'Username and password are required');
  }

  try {
    const user: UserDto | null = await register(username, password);
    if (!user) {
      return sendApiError(res, ApiErrorCode.USERNAME_TAKEN, 'Username is already taken.');
    }

    const accessToken = signAccessToken({ id: user.id, username: user.username });
    const refreshToken = signRefreshToken({ id: user.id, username: user.username });
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    const response: AuthResponseDto = { accessToken, user };
    return res.status(201).json({ ...response });
  } catch (error) {
    console.error(error);
    return sendApiError(
      res,
      ApiErrorCode.INTERNAL_ERROR,
      'Internal server error during registration.',
    );
  }
});

authRouter.post('/login', async (req: Request, res: Response): Promise<Response> => {
  const { username, password }: AuthRequestDto = req.body;

  if (!username || !password) {
    return sendApiError(res, ApiErrorCode.VALIDATION_ERROR, 'Username and password are required.');
  }

  try {
    const user: UserDto | null = await login(username, password);
    if (!user) {
      return sendApiError(res, ApiErrorCode.INVALID_CREDENTIALS, 'Invalid username or password.');
    }

    const accessToken = signAccessToken({ id: user.id, username: user.username });
    const refreshToken = signRefreshToken({ id: user.id, username: user.username });
    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

    const response: AuthResponseDto = { accessToken, user };
    return res.json({ ...response });
  } catch (error) {
    console.error(error);
    return sendApiError(res, ApiErrorCode.INTERNAL_ERROR, 'Internal server error during login.');
  }
});

authRouter.post('/refresh', async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.refresh_token;

  if (!token) {
    return sendApiError(res, ApiErrorCode.UNAUTHORIZED, 'Missing refresh token');
  }

  try {
    const payload: JwtPayloadDto = verifyRefreshToken(token);
    const username = payload.username;
    const accessToken: string = signAccessToken({ id: payload.id, username });

    const user: UserDto | null = await findUser(username);
    if (!user) {
      return sendApiError(res, ApiErrorCode.INVALID_CREDENTIALS, 'Invalid username or password.');
    }
    const response: AuthResponseDto = { accessToken, user };
    return res.json({ ...response });
  } catch {
    return sendApiError(res, ApiErrorCode.UNAUTHORIZED, 'Invalid refresh token');
  }
});

authRouter.post('/logout', (_: Request, res: Response) => {
  res.clearCookie('refresh_token', REFRESH_COOKIE_OPTIONS);

  return res.status(204).send();
});

export default authRouter;
