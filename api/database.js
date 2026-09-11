const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:");

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE books (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('AVAILABLE', 'BORROWED')),
          borrowed_by INTEGER NULL
        )
      `);

      const userStmt = db.prepare(
        "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
      );

      userStmt.run(1, "student", "library123");
      userStmt.run(2, "tester", "test123");
      userStmt.finalize();

      const bookStmt = db.prepare(
        "INSERT INTO books (id, title, author, status, borrowed_by) VALUES (?, ?, ?, ?, ?)"
      );

      bookStmt.run(1, "The Hobbit", "J.R.R. Tolkien", "AVAILABLE", null);
      bookStmt.run(2, "1984", "George Orwell", "BORROWED", 2);
      bookStmt.run(3, "To Kill a Mockingbird", "Harper Lee", "AVAILABLE", null);
      bookStmt.run(4, "The Great Gatsby", "F. Scott Fitzgerald", "AVAILABLE", null);
      bookStmt.run(5, "Clean Code", "Robert C. Martin", "AVAILABLE", null);
      bookStmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

function findUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, row) => err ? reject(err) : resolve(row)
    );
  });
}

function allBooks() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, title, author, status FROM books ORDER BY id",
      [],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

function searchBooks(query) {
  return new Promise((resolve, reject) => {
    const value = `%${query}%`;
    db.all(
      "SELECT id, title, author, status FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY id",
      [value, value],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

function getBook(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, title, author, status, borrowed_by FROM books WHERE id = ?",
      [id],
      (err, row) => err ? reject(err) : resolve(row)
    );
  });
}

function borrowBook(id, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE books SET status = 'BORROWED', borrowed_by = ? WHERE id = ? AND status = 'AVAILABLE'",
      [userId, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function returnBook(id, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE books SET status = 'AVAILABLE', borrowed_by = NULL WHERE id = ? AND status = 'BORROWED' AND borrowed_by = ?",
      [id, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

module.exports = {
  db,
  initializeDatabase,
  findUser,
  allBooks,
  searchBooks,
  getBook,
  borrowBook,
  returnBook
};
