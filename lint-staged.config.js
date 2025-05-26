module.exports = {
  // TypeScript/JavaScript files - run ESLint with auto-fix
  '*.{ts,tsx,js,jsx}': ['eslint --fix'],

  // All supported files - run Prettier with auto-format
  '*.{ts,tsx,js,jsx,json,md,yml,yaml}': ['prettier --write'],
  // '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
  //   'yarn lint:prettier --parser json',
  // ],
  // 'package.json': ['yarn lint:prettier'],
  // '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier'],
};
