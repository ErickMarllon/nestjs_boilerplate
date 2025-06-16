import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        sourceType: 'module',
      },
      globals: {
        __VUE_HMR_RUNTIME__: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.mjs',
      'docs/.vuepress/**/*',
      'src/generated/i18n.generated.ts',
    ],
  },
];
