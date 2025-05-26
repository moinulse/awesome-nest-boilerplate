# Nestjs Awesome Boilerplate 

## Prerequisite
- [Node.js 20 above](https://github.com/nvm-sh/nvm)
- [Docker + Docker Compose](https://github.com/docker/docker-install)
- [Yarn] `npm i -g yarn`

## Tech Stack
- **NestJS**: v11.1.1 - A progressive Node.js framework
- **TypeScript**: v5.8.3 - Strongly typed JavaScript
- **ESLint**: v9.27.0 - Code linting with flat config
- **Husky**: v9.1.7 - Git hooks for code quality
- **Prettier**: Code formatting
- **TypeORM**: Database ORM
- **Jest**: Testing framework

## Getting started

```bash
# 1. Clone this project
git clone https://github.com/jackgoh/awesome-nest-boilerplate {your project name}

# 2. Enter your newly-cloned folder.
cd your-project-name

# 3. Create Environment variables file.
cp .env.example .env

# 4. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn

# 5. Run DB
docker compose up
```

### Development
```bash
# 4. Run development server and open http://localhost:3000
yarn watch:dev

# 5. Read the documentation linked below for "Setup and development".
# Run linting
yarn lint

# Run linting with auto-fix
yarn lint:fix

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

### Code Quality & Git Hooks

This project uses modern tooling for code quality:

- **ESLint v9** with flat config format (`eslint.config.mjs`)
- **Husky v9** for Git hooks
- **lint-staged** for pre-commit linting
- **commitlint** for conventional commit messages

Git hooks are automatically set up when you run `yarn` (via the `prepare` script). The hooks will:
- Run ESLint and Prettier on staged files before commit
- Validate commit messages follow conventional commit format

### Generate migration
```bash
yarn migration:generate ./src/database/migrations/{your migration name}

#Example
yarn migration:generate ./src/database/migrations/add-post-table
```

### Build

To build the App, run

```bash
yarn build:prod
```
And you will see the generated file in `dist` that ready to be served.

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
2.  [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
3.  [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)
