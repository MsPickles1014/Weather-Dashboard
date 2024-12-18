import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;

////=================>  Serve static files of entire client dist folder<=======
import path from 'node:path';
app.use(express.static(path.join(__dirname, 'dist')));// Serve static files from the 'dist' directory


///=======> Implement middleware for parsing JSON and urlencoded form data,<===========
app.use(express.json());// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));// Middleware to parse URL-encoded form data

///////////==========> Implement middleware to connect the routes
app.use(routes);
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`)); // Start the server on the port

