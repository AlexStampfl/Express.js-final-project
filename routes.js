/**
 * Date: 8/7/23
 * Author: Alex S.
 * FileName: routes.js
 * Function: Contains all of the routes in the app/site
 */

const { connectDB, getDb } = require('./public/js/db');
const { ObjectId } = require('mongodb');

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

// Use the middleware for all routes that need database connection
app.use(connectDB);

//Routes
function setupRoutes(app) {
    app.get('/', (req, res) => {
        res.render("main", { title: 'Welcome to my home page!' });
    });

    app.get('/about', (req, res) => {
        res.render("about", { title: 'About Me' });
    });

    app.get('/contact', (req, res) => {
        res.render("contact", { title: 'Contact Us' });
    });

    app.get('/portfolio', (req, res) => {
        res.render("portfolio", { title: 'My Work' });
    });

    app.get('/ajax', (req, res) => {
        res.render("ajax", { title: 'Asynchronous Operations: AJAX!' });
    });

    /* app.get('/crud', (req, res) => {
        res.render('crud', { title: 'CRUD REST APIs' });
    }) */


    //this works, it gets all the users from the MongoDB 'test' database, 'users' collection
    app.get('/crud', async (req, res) => {
        try {
            const db = getDb();
            const coll = db.collection('users'); // Change 'users' to your actual collection name
            const usersData = await coll.find({}).toArray();

            res.render('crud', { title: 'CRUD REST APIs', users: usersData });
        } catch (err) {
            console.log('Error reading users data:', err);
            res.status(500).send('Internal Server Error: Failed to read users data.');
        }
    });


    // to get a single user
    app.get('/crud/users/:userid', async (req, res) => {
        //const uid = req.params.userid;
        const uid = parseInt(req.params.userid); // convert the string to a number
        console.log('User ID:', uid); // Add this line to log the value of uid
        try {
            const db = getDb();
            const coll = db.collection('users');
            //const userId = req.params.userid;

            // convert the user id string to an objectid
           // const userIdObj = new ObjectId(uid);

            // Query for the user based on the ObjectId
            const user = await coll.findOne({ userid: uid });

            if (!user) {
                console.log('User with userid ${uid} not found');
                return res.status(404).send('User not found');
            }

            const usersData = await coll.find({}).toArray();

            res.render('crud', { title: 'CRUD REST APIs', data: usersData, singleUser: user });
        } catch (err) {
            console.log('Error reading user data:', err);
            res.status(500).send('Internal Server Error: Failed to read user data.');
        }
    });


    /* app.get('/test-users', async (req, res) => {
        try {
            const db = getDb(); // Get the MongoDBj database instance
            const coll = db.collection('users'); // Access a collection
            const usersData = await coll.find({}).toArray(); // Query data

            res.json(usersData); // Display the data as JSON in the browser
        } catch (err) {
            console.log('Error reading users data:', err);
            res.status(500).send('Internal Server Error: Failed to read users data.');
        }
    }); */

    app.get('/drag', (req, res) => {
        res.render("drag", { title: 'Drag and Drop' });
    });

    app.get('/chat', (req, res) => {
        res.render("chat", { title: 'Chat With Me!' });
    });

    app.get('*', (req, res) => {
        res.render("notfound", { title: 'Sorry, file not found!' });
    });
}

module.exports = setupRoutes; //CommonJS