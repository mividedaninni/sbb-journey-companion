import { JwtPayloadDto } from '@sbb-journey-companion/common';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDto;
    }
  }
}
