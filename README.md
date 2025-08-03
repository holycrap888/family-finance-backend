# Family Finance Backend

A RESTful API for managing family finances, built with NestJS and MongoDB.

## Features

- User registration and authentication (JWT)
- Expense tracking (add, list, categorize)
- Monthly summary reports
- User settings (budget ratios)
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

### Installation

```sh
npm install
```

### Environment Variables


Create a `.env` file in the root directory with the following variables:

| Variable      | Description                      | Example Value                |
|-------------- |----------------------------------|-----------------------------|
| MONGO_URI     | MongoDB connection string        | mongodb://localhost:27017   |
| DB_NAME       | Database name                    | family_finance              |
| JWT_SECRET    | JWT signing secret               | secretkey                   |
| PORT          | Server port                      | 3001                        |

### Running the App

```sh
npm run start:dev
```

### API Documentation

Swagger UI available at: `http://localhost:3001/api`

## Project Structure

- `src/modules/auth` – Authentication endpoints
- `src/modules/users` – User management
- `src/modules/expenses` – Expense CRUD
- `src/modules/summary` – Monthly summary
- `src/core/database` – MongoDB integration
- `src/common` – DTOs, guards, interceptors, utilities

## Testing

```sh
npm test
```

## License

UNLICENSED
