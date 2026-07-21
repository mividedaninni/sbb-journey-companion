import tseslint from 'typescript-eslint';
import { baseConfig, finalPrettier } from '../../eslint.base.mjs';

export default tseslint.config(
  ...baseConfig,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'generated/', 'prisma/'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  finalPrettier,
);
