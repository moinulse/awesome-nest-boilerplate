module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
  ],
  '*.{js,jsx,ts,tsx,json,md}': [
    'prettier --write',
  ],
  // '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
  //   'yarn lint:prettier --parser json',
  // ],
  // 'package.json': ['yarn lint:prettier'],
  // '*.md': ['yarn lint:markdownlint', 'yarn lint:prettier'],
};
