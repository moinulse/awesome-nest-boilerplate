# 🚀 Awesome NestJS Boilerplate

[![NestJS](https://img.shields.io/badge/NestJS-v11.1.2-red?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🎯 An opinionated, production-ready NestJS boilerplate with TypeScript, PostgreSQL, and modern development tools

## 🙏 Credits

This project is based on the amazing work by **Narek Hakobyan** 🇦🇲  
**Original Repository**: [awesome-nest-boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate/) ⭐

Special thanks to Narek for creating such a comprehensive and well-structured NestJS boilerplate that serves as the foundation for this project.

---

## 📋 Prerequisite

- 🟢 [Node.js 20+](https://github.com/nvm-sh/nvm)
- 🐳 [Docker + Docker Compose](https://github.com/docker/docker-install)
- 📦 [Yarn](https://yarnpkg.com/) - `npm i -g yarn`

## 🛠️ Tech Stack

| Technology        | Version | Purpose                       |
| ----------------- | ------- | ----------------------------- |
| 🏗️ **NestJS**     | v11.1.2 | Progressive Node.js framework |
| 💪 **TypeScript** | v5.8.3  | Strongly typed JavaScript     |
| 🗄️ **TypeORM**    | v0.3.24 | Database ORM                  |
| 🐘 **PostgreSQL** | Latest  | Primary database              |
| 🔍 **ESLint**     | v9.27.0 | Code linting with flat config |
| 🎨 **Prettier**   | v3.5.3  | Code formatting               |
| 🐺 **Husky**      | v9.1.7  | Git hooks for code quality    |
| 🧪 **Jest**       | v29.7.0 | Testing framework             |
| 📚 **Swagger**    | v11.2.0 | API documentation             |
| 🔐 **JWT**        | v11.0.0 | Authentication                |

## 🚀 Getting Started

```bash
# 1. Clone this project
git clone https://github.com/moinulse/awesome-nest-boilerplate {your project name}

# 2. Enter your newly-cloned folder
cd your-project-name

# 3. Create Environment variables file
cp .env.example .env

# 4. Install dependencies
yarn

# 5. Run DB
docker compose up
```

## 🔥 Development

```bash
# 4. Run development server and open http://localhost:3000
yarn watch:dev

# Alternative development start
yarn start:dev

# View API documentation (Swagger)
# Navigate to: http://localhost:3000/documentation
```

## 🧪 Testing & Code Quality

```bash
# Run linting
yarn lint

# Fix linting issues automatically
yarn lint:fix

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

## 🔄 Database Operations

```bash
# Generate a new migration
yarn migration:generate ./src/database/migrations/{migration-name}

# Example: Add post table
yarn migration:generate ./src/database/migrations/add-post-table

# Run pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Create empty migration file
yarn migration:create ./src/database/migrations/{migration-name}
```

## 🏗️ Build & Deploy

```bash
# Build for production
yarn build:prod

# Start production server
yarn start:prod
```

## ⚡ Features

- ✅ **JWT Authentication** - Secure authentication system
- ✅ **Role-based Access Control** - User permissions and roles
- ✅ **API Documentation** - Auto-generated Swagger docs
- ✅ **Database Migrations** - TypeORM migration system
- ✅ **Environment Configuration** - Development, staging, production configs
- ✅ **Input Validation** - Request validation with class-validator
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Logging** - Structured logging system
- ✅ **Health Checks** - Application health monitoring
- ✅ **Rate Limiting** - API rate limiting protection
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Security Headers** - Helmet.js security headers
- ✅ **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- ✅ **Testing Setup** - Unit and E2E testing with Jest

## 🔧 Code Quality & Git Hooks

This project uses modern tooling for maintaining code quality:

- 🔍 **ESLint v9** with flat config format (`eslint.config.mjs`)
- 🐺 **Husky v9** for Git hooks
- 📝 **lint-staged** for pre-commit linting
- 💬 **commitlint** for conventional commit messages

Git hooks are automatically set up when you run `yarn`. The hooks will:

- 🔍 Run ESLint and Prettier on staged files before commit
- ✅ Validate commit messages follow conventional commit format

## 📚 Documentation

This project includes comprehensive documentation:

1. 🛠️ [Setup and Development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
2. 🏗️ [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
3. 📝 [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- 🙏 **Narek Hakobyan** for the original [awesome-nest-boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate/)
- 🎯 The NestJS team for the amazing framework
- 💪 The TypeScript team for making JavaScript better
- 🔥 All the open-source contributors who made this possible

---

<div align="center">
  
**⭐ Star this repo if you found it helpful!**

Made with ❤️ by developers, for developers

</div>
