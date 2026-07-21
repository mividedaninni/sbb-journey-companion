import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export const baseConfig = tseslint.config(
    eslint.configs.recommended,
    {
        files: ['**/*.ts'],
        extends: [...tseslint.configs.recommended],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier: prettierPlugin,
            perfectionist,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'perfectionist/sort-imports': [
                'error',
                {
                    type: 'natural',
                    order: 'asc',
                    groups: [
                        'type',
                        ['builtin', 'external'],
                        'internal-type',
                        'internal',
                        ['parent-type', 'sibling-type', 'index-type'],
                        ['parent', 'sibling', 'index'],
                        'side-effect',
                        'style',
                        'object',
                        'unknown',
                    ],
                },
            ],
        },
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: { 'prettier/prettier': 'error' },
    }
);

export const finalPrettier = prettierConfig;
