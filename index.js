/**
 * Date: 8/5/23
 * Author: Alex S.
 * FileName: Index.js
 * This is the entry point for my program/application
 * Index.js should be lean and mean
 */

// Don't get Es6 and Commonjs mixed up, keep it all one thing and consistent


const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const setupRoutes = require('./routes'); // Require the routes.js file
const { connectDB, getDb } = require('./public/js/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'index', //main layout
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));
app.set("view engine", "hbs"); //set the view engine

app.use(express.static(__dirname + "/public"));

app.use(connectDB);

const port = 8900;
server.listen(port, () => {
    console.log(`Listening to server: http://localhost:${port}`);
});

// Pass the app instance to setupRoutes function
setupRoutes(app);

const chatProgram = require('./chatprogram');
chatProgram.setupChatProgram(io);

