import dotenv from 'dotenv';

const isProdScript = process.env.npm_lifecycle_event === 'start:prod';

dotenv.config({ path: '.env' });
if (isProdScript) {
  dotenv.config({ path: '.env.production', override: true });
}
