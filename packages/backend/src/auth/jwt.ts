import { JwtPayloadDto } from '@sbb-journey-companion/common';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '1d';

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('Missing required JWT secrets in environment');
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signAccessToken(payload: JwtPayloadDto) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: JwtPayloadDto) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyAccessToken(token: string): JwtPayloadDto {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayloadDto;
}

export function verifyRefreshToken(token: string): JwtPayloadDto {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayloadDto;
}
