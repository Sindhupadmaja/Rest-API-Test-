# API Contract

## GET /health

### Success
**200**

```json
{
  "status": "UP",
  "service": "library-api",
  "version": "1.0.0"
}
```

## POST /api/login

### Request

```json
{
  "username": "student",
  "password": "library123"
}
```

### Success
**200**

Response includes `token` and `user`.

### Invalid credentials
**401**

Response includes `error` and `message`.

### Missing fields
**400**

## GET /api/books

Requires Bearer authentication.

### Success
**200**

Response contains:

- `count`
- `books[]`
- each book has `id`, `title`, `author`, `status`

## GET /api/books/search?q=Hobbit

Requires authentication.

### Success
**200**

Response contains:

- `query`
- `count`
- `books[]`

### Missing q
**400**

## POST /api/books/:id/borrow

Requires authentication.

Possible responses:

- `200` — successful borrow
- `404` — book does not exist
- `409` — book is unavailable
- `400` — invalid ID

## POST /api/books/:id/return

Requires authentication.

Possible responses:

- `200` — successful return
- `404` — book does not exist
- `403` — user is not the borrower
- `409` — book is already available
- `400` — invalid ID
