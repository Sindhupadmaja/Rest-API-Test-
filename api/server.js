const express = require("express");
const {
  initializeDatabase,
  findUser,
  allBooks,
  searchBooks,
  getBook,
  borrowBook,
  returnBook
} = require("./database");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKENS = new Map();

function auth(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Bearer token is required"
    });
  }

  const token = header.substring(7);
  const user = TOKENS.get(token);

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token"
    });
  }

  req.user = user;
  next();
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "library-api",
    version: "1.0.0"
  });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Username and password are required"
    });
  }

  try {
    const user = await findUser(username, password);

    if (!user) {
      return res.status(401).json({
        error: "AuthenticationError",
        message: "Invalid username or password"
      });
    }

    const token = `demo-token-${user.id}`;
    TOKENS.set(token, user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "InternalServerError",
      message: "Unexpected server error"
    });
  }
});

app.get("/api/books", auth, async (req, res) => {
  try {
    const books = await allBooks();
    res.status(200).json({
      count: books.length,
      books
    });
  } catch (err) {
    res.status(500).json({
      error: "InternalServerError",
      message: "Unable to retrieve books"
    });
  }
});

app.get("/api/books/search", auth, async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Search query q is required"
    });
  }

  try {
    const books = await searchBooks(query);

    res.status(200).json({
      query,
      count: books.length,
      books
    });
  } catch (err) {
    res.status(500).json({
      error: "InternalServerError",
      message: "Search failed"
    });
  }
});

app.post("/api/books/:id/borrow", auth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Book id must be an integer"
    });
  }

  try {
    const book = await getBook(id);

    if (!book) {
      return res.status(404).json({
        error: "NotFound",
        message: "Book not found"
      });
    }

    if (book.status !== "AVAILABLE") {
      return res.status(409).json({
        error: "Conflict",
        message: "Book is not available"
      });
    }

    const updated = await borrowBook(id, req.user.id);

    if (updated !== 1) {
      return res.status(409).json({
        error: "Conflict",
        message: "Book could not be borrowed"
      });
    }

    const updatedBook = await getBook(id);

    res.status(200).json({
      message: "Book borrowed successfully",
      book: {
        id: updatedBook.id,
        title: updatedBook.title,
        status: updatedBook.status
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "InternalServerError",
      message: "Borrow operation failed"
    });
  }
});

app.post("/api/books/:id/return", auth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Book id must be an integer"
    });
  }

  try {
    const book = await getBook(id);

    if (!book) {
      return res.status(404).json({
        error: "NotFound",
        message: "Book not found"
      });
    }

    if (book.status !== "BORROWED") {
      return res.status(409).json({
        error: "Conflict",
        message: "Book is already available"
      });
    }

    if (book.borrowed_by !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only the borrower can return this book"
      });
    }

    const updated = await returnBook(id, req.user.id);

    if (updated !== 1) {
      return res.status(409).json({
        error: "Conflict",
        message: "Book could not be returned"
      });
    }

    const updatedBook = await getBook(id);

    res.status(200).json({
      message: "Book returned successfully",
      book: {
        id: updatedBook.id,
        title: updatedBook.title,
        status: updatedBook.status
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "InternalServerError",
      message: "Return operation failed"
    });
  }
});

async function start() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Library API running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;
