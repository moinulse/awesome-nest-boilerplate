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

## Docker Support

This project includes comprehensive Docker support with optimized multi-stage builds for both development and production environments.

### Quick Start with Docker

```bash
# Start development environment (with hot reloading)
./scripts/docker.sh dev

# Start production environment
./scripts/docker.sh prod

# View all available Docker commands
./scripts/docker.sh help
```

### Docker Commands

```bash
# Build images
./scripts/docker.sh build-dev     # Build development image
./scripts/docker.sh build-prod    # Build production image

# Environment management
./scripts/docker.sh dev           # Start development environment
./scripts/docker.sh dev-full      # Start with additional tools (PgAdmin)
./scripts/docker.sh prod          # Start production environment
./scripts/docker.sh stop          # Stop all services
./scripts/docker.sh restart       # Restart services

# Monitoring and debugging
./scripts/docker.sh logs          # View logs from all services
./scripts/docker.sh logs-app      # View app logs only
./scripts/docker.sh shell         # Open shell in app container
./scripts/docker.sh shell-db      # Open PostgreSQL shell

# Database operations
./scripts/docker.sh migrate       # Run database migrations
./scripts/docker.sh seed          # Run database seeds

# Maintenance
./scripts/docker.sh clean         # Remove containers and images
./scripts/docker.sh reset         # Reset entire environment
```

### Docker Architecture

- **Multi-stage builds** for optimized production images
- **Alpine Linux** base images for smaller size and better security
- **Non-root user** execution for enhanced security
- **Health checks** for container monitoring
- **Layer caching** optimization for faster builds
- **Development hot reloading** with volume mounts

## GitHub Actions CI/CD

This project includes comprehensive GitHub Actions workflows for automated testing, security scanning, and deployment:

### 🔄 **Continuous Integration**

- **Lint & Format** (`lint.yml`) - ESLint, Prettier, TypeScript checking
- **CI Pipeline** (`ci.yml`) - Unit tests, e2e tests, build validation, database migrations
- **Docker CI/CD** (`docker.yml`) - Multi-platform Docker builds, security scanning, registry publishing

### 🔒 **Security & Quality**

- **Security Scan** (`security.yml`) - Dependency scanning, SAST, secret detection, license compliance
- **Performance Testing** (`performance.yml`) - Load testing, bundle analysis, Docker performance
- **Dependabot** - Automated dependency updates for npm, Docker, and GitHub Actions

### 🚀 **Deployment**

- **Deploy** (`deploy.yml`) - Staging and production deployments with rollback capability
- **Environment protection rules** - Manual approval for production deployments
- **Health checks and smoke tests** - Automated verification of deployments

### 📊 **Monitoring & Reporting**

- **Code coverage reports** - Codecov integration
- **Security vulnerability scanning** - Trivy, Grype, Snyk integration
- **Performance metrics** - Bundle size tracking, load test results
- **Automated PR comments** - Security and performance summaries

### 🔧 **Setup Requirements**

To use these workflows, configure the following secrets in your GitHub repository:

```bash
# Docker Registry
DOCKER_USERNAME         # Docker Hub username
DOCKER_PASSWORD         # Docker Hub password/token

# Deployment
STAGING_HOST            # Staging server hostname
STAGING_USER            # SSH username for staging
STAGING_SSH_KEY         # SSH private key for staging
PRODUCTION_HOST         # Production server hostname
PRODUCTION_USER         # SSH username for production
PRODUCTION_SSH_KEY      # SSH private key for production

# Database
DB_USERNAME             # Database username
DB_PASSWORD             # Database password
DB_DATABASE             # Database name

# Security Tools (Optional)
SNYK_TOKEN              # Snyk API token
SEMGREP_APP_TOKEN       # Semgrep API token
FOSSA_API_KEY           # FOSSA API key
GITLEAKS_LICENSE        # GitLeaks license key

# Notifications
SLACK_WEBHOOK_URL       # Slack webhook for deployment notifications
```

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/development.html#first-time-setup)
2.  [Architecture](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/architecture.html)
3.  [Naming Cheatsheet](https://narhakobyan.github.io/awesome-nest-boilerplate/docs/naming-cheatsheet.html)
