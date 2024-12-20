const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let sameUser = users.filter((user) => {
    return user.username === username;
  })

  if (sameUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let authUser = users.filter((user) => {
    return (user.username === username && user.password === password)
  })

  if (authUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"})
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", {expiresIn: 60 * 60} )

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User logged in successfully")
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.session.authorization;

  if (!username) {
    return res.status(401).json({message: "Unauthorized: Please login first"})
  }

  if(!books[isbn]) {
    return res.status(404).json({message: "Book not found for given ISBN"})
  }

  books[isbn].reviews[username] = review;
  
  return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const session = req.session.authorization;

  // Check if user is logged in 
  if (!session) {
    return res.status(401).json({message: "Unauthorized. Can't delete review"})
  }

  // Check if book exist
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found for given ISBN"})
  }

  // Check if user has review for the book
  if (!books[isbn].reviews[session]) {
    return res.status(404).json({message: "No review found for this user"})
  }

  // Now delete book
  delete books[isbn].reviews[session];

  return res.status(200).send(`Review for the ISBN ${isbn} posted by the user ${session.username} has been deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
