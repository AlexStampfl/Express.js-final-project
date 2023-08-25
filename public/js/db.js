/**
 * Date: 8/7/23
 * Author: Alex S.
 * FileName: db.js
 * Function: Contains the relevant code for connecting to MongoDB database. 
 */
const { MongoClient, ObjectId } = require('mongodb');

const db_url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(db_url);
let db;

// Middleware to handle database connection
const connectDB = async (req, res, next) => {
    try {
        await client.connect();
        db = client.db('test');
        next();
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

// Function to get the MongoDB database instance
function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
}

module.exports = { connectDB, getDb };
