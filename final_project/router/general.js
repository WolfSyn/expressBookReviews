// const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      throw new Error('Username or password not provided.');
    }

    const isUserExists = users.find(item => item.username === username);
    if (isUserExists) {
      throw new Error('User already exists.');
    }

    users.push({
      username: username,
      password: password
    });

    return res.status(201).send('User created successfully');

  } catch (error) {
    return res.status(300).send({ message: error.message })
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getBooks = new Promise((resolve, rej) => {
    setTimeout(() => {
      resolve(books)
    }, 2000)
  })
  getBooks.then(books => {
    return res.status(200).send(books)
  })
    .catch(error => {
      return res.status(300).json({ message: error });
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const filteredBook = new Promise((resolve, rej) => {
    setTimeout(() => {
      const book = Object.values(books).find(item => item.isbn === isbn);
      if (book) {
        resolve(book)
      } else {
        rej('No book found with this ISBN')
      }
    }, 2000);
  });
  filteredBook.then(book => {
    return res.status(200).send(book)
  }).catch(error => {
    return res.status(300).json({ message: error });
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBook = new Promise((resolve, rej) => {
    setTimeout(() => {
      const book = Object.values(books).find(item => item.author === author);
      if (book) {
        resolve(book)
      } else {
        rej('No book found with this Author')
      }
    }, 2000);
  });
  filteredBook.then(book => {
    return res.status(200).send(book)
  }).catch(error => {
    return res.status(300).json({ message: error });
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBook = new Promise((resolve, rej) => {
    setTimeout(() => {
      const book = Object.values(books).find(item => item.title === title);
      if (book) {
        resolve(book)
      } else {
        rej('No book found with this Title')
      }
    }, 2000);
  });
  filteredBook.then(book => {
    return res.status(200).send(book)
  }).catch(error => {
    return res.status(300).json({ message: error });
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const booksList = Object.values(books);
    const book = booksList.filter(item => item.isbn === isbn);
    if (book.length < 1) {
      throw new Error('No book found with this title')
    }
    return res.send(book[0].reviews)
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
});

module.exports.general = public_users;
