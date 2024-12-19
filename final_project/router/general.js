const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password})
      return res.status(200).json({message: "User successfully registered. Now you can login"})
    } else {
      return res.status(404).json({message: "User Already Registered"})
    }
  } else {
    return res.status(404).json({message: "Unable to register user"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let retrieved = books[isbn];
  
  if (retrieved) {
    return res.send(retrieved);
  } else {
    return res.status(404).send({message: "Unable to retrieve book"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  let retrieved = Object.values(books).filter(book => book.author === author);

  if (retrieved.length > 0) {
    return res.status(200).json(retrieved);
  } else {
    return res.status(404).json({message: "No books found for this author"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  let result = Object.values(books).filter(book => book.title === title);

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({message: "No books found for this title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  if (books[isbn]) {
    let review = books[isbn].reviews;
    return res.status(200).json(review)
  } else {
    return res.status(404).json({message: "Book review not found for given isbn"})
  }
});

module.exports.general = public_users;
