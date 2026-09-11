# API Test Scenarios

| ID | Scenario | Type | Expected |
|---|---|---|---|
| API-001 | Health endpoint | Positive | 200 |
| API-002 | Valid login | Positive | 200 + token |
| API-003 | Invalid login | Negative | 401 |
| API-004 | Missing login field | Negative | 400 |
| API-005 | Books without token | Security/Negative | 401 |
| API-006 | List books | Positive | 200 + schema |
| API-007 | Search existing title | Positive | 200 + result |
| API-008 | Search unknown title | Negative | 200 + count 0 |
| API-009 | Search without query | Negative | 400 |
| API-010 | Borrow available book | Positive | 200 + BORROWED |
| API-011 | Borrow unavailable book | Negative | 409 |
| API-012 | Borrow missing book | Negative | 404 |
| API-013 | Return borrowed book | Positive | 200 + AVAILABLE |
| API-014 | Return already available book | Negative | 409 |
| API-015 | Return by non-borrower | Authorization | 403 |
| API-016 | Invalid book ID | Negative | 400 |
