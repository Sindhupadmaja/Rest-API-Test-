-- SQLite validation queries
-- These queries are intended for manual database verification.

-- 1. Verify users
SELECT id, username
FROM users
ORDER BY id;

-- 2. Verify book inventory and current state
SELECT id, title, author, status, borrowed_by
FROM books
ORDER BY id;

-- 3. Find borrowed books
SELECT id, title, borrowed_by
FROM books
WHERE status = 'BORROWED';

-- 4. Find available books
SELECT id, title
FROM books
WHERE status = 'AVAILABLE';

-- 5. Detect invalid state combinations
SELECT id, title, status, borrowed_by
FROM books
WHERE (status = 'AVAILABLE' AND borrowed_by IS NOT NULL)
   OR (status = 'BORROWED' AND borrowed_by IS NULL);
