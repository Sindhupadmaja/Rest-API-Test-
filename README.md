# REST API Test Project — 2024

**Project:** Library Management REST API QA  
**Timeline:** January 2024  
**Level:** Intermediate QA / API Testing  
**Purpose:** Demonstrate API test design, authentication testing, schema/status validation, SQL data verification, negative testing, debugging, and reusable Newman execution.

---

## 1. Project Overview

This project extends the manual Library Management QA work from the 2023 project into service/API testing.

The application exposes REST endpoints for:

- User login/authentication
- Listing books
- Searching books
- Borrowing books
- Returning books

The QA layer validates:

- HTTP status codes
- JSON response structure
- Authentication behavior
- Required fields
- Positive and negative scenarios
- Business-rule validation
- Data consistency
- SQL-backed records
- Repeatable automated API execution with Newman

## 2. Technology Stack

- Node.js
- Express
- SQLite
- REST API
- Postman
- Newman
- JavaScript assertions
- SQL
- GitHub Actions

## 3. Repository Structure

```text
REST-API-Test-Project-2024/
├── README.md
├── package.json
├── .gitignore
│
├── api/
│   ├── server.js
│   └── database.js
│
├── postman/
│   ├── library-api.postman_collection.json
│   └── local.postman_environment.json
│
├── newman/
│   └── run-tests.js
│
├── sql/
│   └── validation-queries.sql
│
├── test-data/
│   └── api-test-data.json
│
├── docs/
│   ├── api-test-plan.md
│   ├── api-contract.md
│   ├── test-scenarios.md
│   ├── traceability-matrix.md
│   └── test-execution-report.md
│
├── defects/
│   └── defect-log.csv
│
├── evidence/
│   └── README.md
│
└── .github/
    └── workflows/
        └── api-tests.yml
```

## 4. Run the API

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## 5. Run API Tests

With the API running in another terminal:

```bash
npm test
```

The Newman runner executes the Postman collection.

You can also run Newman directly:

```bash
npx newman run postman/library-api.postman_collection.json   -e postman/local.postman_environment.json
```

## 6. Important Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service health |
| POST | `/api/login` | Authenticate user |
| GET | `/api/books` | List books |
| GET | `/api/books/search?q=` | Search books |
| POST | `/api/books/:id/borrow` | Borrow a book |
| POST | `/api/books/:id/return` | Return a book |

Protected endpoints require:

```text
Authorization: Bearer <token>
```

## 7. Test Coverage

The Postman suite covers:

- Valid authentication
- Invalid authentication
- Missing authentication
- Valid book retrieval
- Search with results
- Search with no results
- Invalid book ID
- Borrow available book
- Borrow unavailable book
- Return borrowed book
- Return already available book
- Response schema checks
- Response status checks
- Authentication propagation
- Data consistency

## 8. SQL Validation

The SQLite database is used as a simple persistence layer.

SQL queries in `sql/validation-queries.sql` demonstrate verification of:

- Book status
- User records
- Borrow state
- Data consistency

## 9. CI

GitHub Actions runs the API and Newman test suite automatically.

The CI pipeline:

1. Checks out the repository.
2. Installs Node dependencies.
3. Starts the API.
4. Waits for the health endpoint.
5. Executes Newman.
6. Fails the workflow if API tests fail.

## 10. QA Progression

This is intentionally more advanced than the 2023 project:

**2023:** Manual requirements-based testing  
→ **2024:** API + authentication + schema + SQL + repeatable test execution  
→ **2025:** Banking transaction QA + concurrency + audit/data integrity  
→ **2026:** End-to-end release quality + risk management + release sign-off

## 11. Portfolio Note

This is a self-contained portfolio project created to demonstrate the QA capabilities represented by the 2024 resume project entry. It is not a claim that the API belongs to an external organization.
