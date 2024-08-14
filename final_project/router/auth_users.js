const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  const filteredUsers = users.filter(item => item.username === username);
  if (filteredUsers.length < 1) {
    return false;
  }

  return true;
}

const authenticatedUser = async (username, password) => { //returns boolean
  try {
    const user = users.find(item => item.username === username && item.password === password);
    if (!user) {
      throw new Error('Invalid username or password.');
    }
    const token = await jwt.sign({ username: username }, 'thisismysecretkey');
    return token;

  } catch (error) {
    return error;
  }
}

//only registered users can login
regd_users.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      throw new Error('Username or password not provided.');
    }

    if (!isValid(username)) {
      throw new Error('User does not exists.');
    }

    const result = await authenticatedUser(username, password);
    if (typeof result !== 'string') {
      throw new Error(result)
    }

    return res.status(200).send({ message: 'Login successfull', token: result })

  } catch (error) {
    return res.status(300).send({ message: error.message });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.username;

    Object.values(books).forEach((item) => {
      if (item.isbn === isbn) {
        item.reviews[username] = review
      }
    });

    const book = Object.values(books).find(item => item.isbn === isbn);

    return res.send(book);

  } catch (error) {
    return res.status(300).send({ message: error });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.username;

    Object.values(books).forEach((item) => {
      if (item.isbn === isbn) {
        delete item.reviews[username]
      }
    });

    const book = Object.values(books).find(item => item.isbn === isbn);

    return res.send(book);

  } catch (error) {
    return res.status(300).send({ message: error });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
