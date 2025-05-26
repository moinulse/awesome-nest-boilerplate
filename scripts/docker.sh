#!/bin/bash

# Awesome NestJS Boilerplate - Docker Helper Script
# Usage: ./scripts/docker.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_help() {
    echo -e "${BLUE}Awesome NestJS Boilerplate - Docker Helper${NC}"
    echo ""
    echo "Usage: ./scripts/docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build-prod        Build production Docker image"
    echo "  build-dev         Build development Docker image"
    echo "  dev               Start development environment"
    echo "  prod              Start production environment"
    echo "  stop              Stop all services"
    echo "  restart           Restart all services"
    echo "  logs              Show logs for all services"
    echo "  logs-app          Show logs for app service only"
    echo "  logs-db           Show logs for database service only"
    echo "  clean             Remove all containers and images"
    echo "  reset             Clean and rebuild everything"
    echo "  shell             Open shell in running app container"
    echo "  shell-db          Open PostgreSQL shell"
    echo "  migrate           Run database migrations"
    echo "  seed              Run database seeds"
    echo "  test              Run tests in container"
    echo "  lint              Run linting in container"
    echo "  help              Show this help message"
}

build_prod() {
    echo -e "${BLUE}Building production Docker image...${NC}"
    docker build -t awesome-nest-app:latest .
    echo -e "${GREEN}Production image built successfully!${NC}"
}

build_dev() {
    echo -e "${BLUE}Building development Docker image...${NC}"
    docker build -f Dockerfile.dev -t awesome-nest-app:dev .
    echo -e "${GREEN}Development image built successfully!${NC}"
}

start_dev() {
    echo -e "${BLUE}Starting development environment...${NC}"
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
    echo -e "${GREEN}Development environment started!${NC}"
    echo -e "${YELLOW}App available at: http://localhost:3000${NC}"
    echo -e "${YELLOW}Database available at: localhost:5432${NC}"
}

start_dev_full() {
    echo -e "${BLUE}Starting full development environment with tools...${NC}"
    docker-compose -f docker-compose.dev.yml --profile tools up -d
    echo -e "${GREEN}Development environment started!${NC}"
    echo -e "${YELLOW}App available at: http://localhost:3000${NC}"
    echo -e "${YELLOW}Database available at: localhost:5432${NC}"
    echo -e "${YELLOW}PgAdmin available at: http://localhost:8080${NC}"
}

start_prod() {
    echo -e "${BLUE}Starting production environment...${NC}"
    docker-compose -f docker-compose.yml up -d
    echo -e "${GREEN}Production environment started!${NC}"
    echo -e "${YELLOW}App available at: http://localhost:3000${NC}"
}

stop_services() {
    echo -e "${BLUE}Stopping all services...${NC}"
    docker-compose -f docker-compose.yml down
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}All services stopped!${NC}"
}

restart_services() {
    echo -e "${BLUE}Restarting services...${NC}"
    stop_services
    start_dev
}

show_logs() {
    docker-compose -f docker-compose.yml logs -f
}

show_logs_app() {
    docker-compose -f docker-compose.yml logs -f app
}

show_logs_db() {
    docker-compose -f docker-compose.yml logs -f awesome-nest-db
}

clean_docker() {
    echo -e "${YELLOW}Warning: This will remove all containers and images!${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Cleaning Docker resources...${NC}"
        docker-compose -f docker-compose.yml down -v --remove-orphans
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        echo -e "${GREEN}Docker resources cleaned!${NC}"
    fi
}

reset_environment() {
    echo -e "${BLUE}Resetting entire environment...${NC}"
    clean_docker
    build_dev
    build_prod
    start_dev
    echo -e "${GREEN}Environment reset complete!${NC}"
}

open_shell() {
    echo -e "${BLUE}Opening shell in app container...${NC}"
    docker-compose -f docker-compose.yml exec app sh
}

open_db_shell() {
    echo -e "${BLUE}Opening PostgreSQL shell...${NC}"
    docker-compose -f docker-compose.yml exec awesome-nest-db psql -U postgres -d awesome_nest
}

run_migrations() {
    echo -e "${BLUE}Running database migrations...${NC}"
    docker-compose -f docker-compose.yml exec app yarn migration:run
    echo -e "${GREEN}Migrations completed!${NC}"
}

run_seeds() {
    echo -e "${BLUE}Running database seeds...${NC}"
    # Add your seed command here
    echo -e "${YELLOW}Seed command not configured yet${NC}"
}

run_tests() {
    echo -e "${BLUE}Running tests in container...${NC}"
    docker-compose -f docker-compose.yml exec app yarn test
}

run_lint() {
    echo -e "${BLUE}Running linting in container...${NC}"
    docker-compose -f docker-compose.yml exec app yarn lint
}

# Main script logic
case "$1" in
    "build-prod")
        build_prod
        ;;
    "build-dev")
        build_dev
        ;;
    "dev")
        start_dev
        ;;
    "dev-full")
        start_dev_full
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs
        ;;
    "logs-app")
        show_logs_app
        ;;
    "logs-db")
        show_logs_db
        ;;
    "clean")
        clean_docker
        ;;
    "reset")
        reset_environment
        ;;
    "shell")
        open_shell
        ;;
    "shell-db")
        open_db_shell
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        run_seeds
        ;;
    "test")
        run_tests
        ;;
    "lint")
        run_lint
        ;;
    "help"|""|*)
        print_help
        ;;
esac
