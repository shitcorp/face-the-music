module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'airbnb-typescript/base',
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: [
    'build',
    '.*.js',
    '*.config.js',
    'node_modules',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types':
      'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'no-console': 'error',
  },
};
