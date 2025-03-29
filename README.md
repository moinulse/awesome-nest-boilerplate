# Nestjs Awesome Boilerplate 

## Prerequisite
- [Nodejs 20 above](https://github.com/nvm-sh/nvm)
- [Docker + Docker Compose](https://github.com/docker/docker-install)
- [Yarn] `npm i -g yarn`

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
```

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

## Mailer Module Configuration

To configure the mailer module, follow these steps:

1. Install the `@nestjs-modules/mailer` package and its dependencies.
2. Create a new module, `mailer`, in the `src/modules` directory.
3. Configure the mailer module in `mailer.module.ts` using the `MailerModule` from `@nestjs-modules/mailer`.
4. Add a service, `mailer.service.ts`, in the `mailer` module to handle email sending logic.
5. Inject the `MailerService` into other modules where email sending is required, such as the `auth` module for sending verification emails.

## Enhanced Logging and Telemetry

The application now includes enhanced logging and telemetry setup. The logging setup has been improved to include more detailed log messages and structured logging. Additional telemetry data collection points have been integrated into critical parts of the application, such as the `auth` module and the `user` module. The logging and telemetry data are exported to a centralized monitoring system for better analysis and visualization.
