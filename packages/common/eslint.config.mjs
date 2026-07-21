import tseslint from 'typescript-eslint';

import { baseConfig, finalPrettier } from '../../eslint.base.mjs';

export default tseslint.config(
  ...baseConfig,
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-empty-interface': 'warn',
    },
  },
  finalPrettier,
);
