# API Test Plan

## Objective

Validate the Library Management REST API at service level and verify that API behavior matches its documented contract.

## Scope

- Health endpoint
- Login/authentication
- Book retrieval
- Book search
- Borrow operation
- Return operation
- Validation
- Error handling
- Data consistency

## Test Strategy

### Functional API Testing
Validate successful API responses using valid requests.

### Negative API Testing
Validate invalid credentials, missing authorization, missing parameters, invalid IDs, and invalid business states.

### Contract Testing
Validate expected status codes, required response properties, and basic JSON types.

### Integration Testing
Verify that API actions correctly change persisted book state.

### Database Validation
Use SQL queries to inspect state after API operations.

## Entry Criteria

- Node.js installed
- Dependencies installed
- API starts successfully
- Postman collection available

## Exit Criteria

- All critical API scenarios executed
- No unresolved Critical defects
- Authentication behavior verified
- Borrow/return state transitions verified
- Test results documented

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Authentication bypass | High | Test missing and invalid tokens |
| Incorrect status code | Medium | Assert status for every request |
| Incorrect book state | High | API + SQL validation |
| Missing validation | Medium | Negative test suite |
| Regression | Medium | Repeat Newman collection in CI |
