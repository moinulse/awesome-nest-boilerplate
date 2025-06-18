module.exports = {
  // TypeScript/JavaScript files - run ESLint with auto-fix
  '*.{ts,tsx,js,jsx}': ['eslint --fix'],

  // All supported files - run Prettier with auto-format
  '*.{ts,tsx,js,jsx,json,md,yml,yaml}': ['prettier --write'],

  // TypeScript files - run type checking
  // '*.{ts,tsx}': () => 'yarn type-check',

  // Package.json - validate structure and ensure lockfile is up to date
  'package.json': ['prettier --write', () => 'yarn install --check-files'],
};
