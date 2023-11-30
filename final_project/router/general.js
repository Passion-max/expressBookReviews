const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    username = req.body.username;
    password = req.body.password;
    if (username && password) {

        if (!isValid(username)) {
            users.push({ "username": username, "password": password })
            return res.status(200).json(users)
        } else {
            return res.status(404).json({ "message": "Username already exist" })
        }
    }
    else {
        return res.status(404).json({ "message": "Please provide username and password" })
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({ books }, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const get_book_by_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(JSON.stringify(books[isbn], null, 4)));
    });
    get_book_by_isbn.then(() => console.log("resolve getting book details by isbn"))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const get_books_by_author = new Promise((resolve, reject) => {
        const books_keys = Object.keys(books)
        const author = req.params.author
        const author_books = books_keys.filter((book_key) => books[book_key].author == author)
        resolve(res.status(200).json(books[author_books[0]]))
    });

    get_books_by_author.then(() => console.log("resolve getting book details by author"))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const get_book_by_title = new Promise((resolve, reject) => {
        books_keys = Object.keys(books)
        title = req.params.title
        book_title = books_keys.filter((book_key) => books[book_key].title == title)
        resolve ( res.status(200).json(books[book_title[0]]))
    })

    get_book_by_title.then(() => console.log("resolve getting book details by title"))

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    isbn = req.params.isbn
    return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
