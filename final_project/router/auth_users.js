const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userWithUsername = users.filter((user) => {
    return user.username === username
});
if(userWithUsername.length > 0) {
    return  true
} else {
    return false
}
}

const authenticatedUser = (username,password)=>{
    let validUser = users.filter((user) => {
        return (user.username == username && user.password == password)
    })
    
    if (validUser.length > 0) {
        return true 
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const  username = req.body.username
 const  password = req.body.password

  if (!username || !password) { 
      return res.status(404).json({"message":"Please provide credentials"})
    }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data:password},"access", {expiresIn: 60 * 60});
    req.session.authourisation = { accessToken, username }
    return res.status(200).send(`User logged in successfully`)
  } else {
     return res.status(404).json({"message":"Invalid login credentials"})
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; 
  const review = req.query.review; 
  const username = req.session.authourisation.username; 

  if (!username) {
    return res.status(401).json({ message: "Unauthorized access. Please log in." });
  }
  if (books[isbn]) {
    
    if (books[isbn].reviews[username]) {
      
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully." });
    } else {
      
      books[isbn].reviews[username] = review;
      return res.status(201).json({ message: "Review added successfully." });
    }
  } else {
    return res.status(208).json({ message: "ISBN not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authourisation.username; 

    if (books[isbn]) {
        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully." });
        } else {
            return res.status(404).json({ message: "No Review found for this user" });

        }
    } else {
        res.status(404).json({"message":"Book not found"})
    }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
