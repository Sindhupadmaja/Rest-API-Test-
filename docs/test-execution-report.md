# API Test Execution Report

## Test Cycle

**Cycle:** API-2024-01  
**Execution:** Newman/Postman  
**Environment:** Local Node.js API

## Expected Execution

The automated suite is designed to validate the complete API workflow.

| Area | Scenarios |
|---|---:|
| Health | 1 |
| Authentication | 3 |
| Books | 4 |
| Borrow/Return | 6 |
| **Total** | **14+** |

## Quality Gates

A run should be considered successful when:

- Authentication tests pass.
- Protected endpoints reject missing/invalid authentication.
- Response status codes match the contract.
- Required JSON fields exist.
- Borrowing an available book changes it to BORROWED.
- Returning a borrowed book changes it to AVAILABLE.
- Invalid business operations return controlled errors.

## Execution Command

```bash
npm start
```

In a second terminal:

```bash
npm test
```

## Reporting

Newman prints request and assertion results to the terminal. A CI failure indicates that at least one automated API assertion failed.

This report intentionally describes the expected execution process rather than inventing a CI result from a machine that has not executed the project.
