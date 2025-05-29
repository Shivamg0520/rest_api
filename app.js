// Import the express library
const express = require('express');
const app = express(); // Create an Express application
const PORT = 3000; // Define the port for the server

// Middleware to parse JSON bodies in requests
// This is crucial for POST and PUT requests to read data from the request body
app.use(express.json());

// In-memory data store for books
// In a real application, this would be a database
let books = [
    { id: '1', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams' },
    { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: '3', title: '1984', author: 'George Orwell' }
];

// Helper function to generate a unique ID for new books
// In a real database, IDs would be managed by the DB
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
}

// --- API Endpoints ---

// 1. GET all books
// Endpoint: GET /books
app.get('/books', (req, res) => {
    console.log('GET /books request received.');
    res.json(books); // Send the entire books array as JSON response
});

// 2. GET a single book by ID
// Endpoint: GET /books/:id
app.get('/books/:id', (req, res) => {
    const { id } = req.params; // Get the ID from URL parameters
    console.log(`GET /books/${id} request received.`);
    const book = books.find(b => b.id === id); // Find book by ID

    if (book) {
        res.json(book); // If found, send the book
    } else {
        res.status(404).json({ message: 'Book not found' }); // If not found, send 404 error
    }
});

// 3. POST a new book
// Endpoint: POST /books
// Request Body Example (JSON): { "title": "New Book Title", "author": "New Author Name" }
app.post('/books', (req, res) => {
    const { title, author } = req.body; // Get title and author from request body
    console.log('POST /books request received with body:', req.body);

    if (!title || !author) {
        // Basic validation
        return res.status(400).json({ message: 'Title and Author are required' });
    }

    const newBook = {
        id: generateUniqueId(), // Assign a unique ID
        title,
        author
    };
    books.push(newBook); // Add the new book to our in-memory array

    // Send the newly created book object with 201 Created status
    res.status(201).json(newBook);
});

// 4. PUT (Update) an existing book by ID
// Endpoint: PUT /books/:id
// Request Body Example (JSON): { "title": "Updated Title", "author": "Updated Author" }
app.put('/books/:id', (req, res) => {
    const { id } = req.params; // Get ID from URL parameters
    const { title, author } = req.body; // Get updated data from request body
    console.log(`PUT /books/${id} request received with body:`, req.body);

    const bookIndex = books.findIndex(b => b.id === id); // Find index of the book

    if (bookIndex !== -1) {
        // Update the book's properties
        books[bookIndex].title = title || books[bookIndex].title; // Update if title provided, else keep old
        books[bookIndex].author = author || books[bookIndex].author; // Update if author provided, else keep old

        res.json(books[bookIndex]); // Send the updated book
    } else {
        res.status(404).json({ message: 'Book not found' }); // If not found, send 404
    }
});

// 5. DELETE a book by ID
// Endpoint: DELETE /books/:id
app.delete('/books/:id', (req, res) => {
    const { id } = req.params; // Get ID from URL parameters
    console.log(`DELETE /books/${id} request received.`);

    const initialLength = books.length; // Store initial length to check if a book was removed
    books = books.filter(book => book.id !== id); // Remove the book by filtering the array

    if (books.length < initialLength) {
        res.status(204).send(); // Send 204 No Content if successful (no body)
    } else {
        res.status(404).json({ message: 'Book not found' }); // If ID not found, send 404
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Use Postman to test the endpoints:');
    console.log('GET All Books: http://localhost:3000/books');
    console.log('GET Book by ID: http://localhost:3000/books/1');
    console.log('POST New Book: http://localhost:3000/books (with JSON body)');
    console.log('PUT Update Book: http://localhost:3000/books/1 (with JSON body)');
    console.log('DELETE Book by ID: http://localhost:3000/books/1');
});