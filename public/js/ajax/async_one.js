const express = require('express');
const app = express();
const cors = require('cors');
//const {books} = require('./models/books');
app.use(express.static(__dirname + "/public"));

//allow all origins to access this server
app.use(cors());

//encode document -- formerly: app.use(bodyParser.urlencode(...));
app.use(express.urlencoded({extended: false}));

// parsing JSON -- formerly: app.use(bodyParser.json());
app.use(express.json());

// a port number for this server is not currently used by another app
const port = 8900;
const url = `http://localhost:${port}`;

//listen at port number
app.listen(port, ()=>console.log(`Server is active: ${url}`));

app.get('/', (req, res)=>{
    res.send("Hello Earth!");
}); 

//Read all records
app.get('/api/', (req, res)=>{
    res.json(books)
})

//Read a single record
//this code doesn't check for duplicate IDs. How would I implement this to prevent duplicate data?
app.get('/api/:id', (req, res)=>{
    let id = req.params.id;
    //find the index of the element that matches the id
    let index = books.findIndex( book => book.id == id);
    //^ shorthand for
    // let index = books.findIndex(function(book){
        //return book.id == id;
    //})
    //if found then return record at index
    //else return appropriate message to sender
    let record = index != -1 ? books[index] : "No Record Found.";

    res.json(record);
})

//update existing record
app.put('/api/:id', (req, res)=>{
    let id = req.params.id;
    let message = "No Record Found.";

    //find index of element that matches id
    //if match is found, return index position
    //else return a -1 (not found)
    let index = books.findIndex( book => book.id == id);
    if(index != -1){
        let data = req.body;

        //check if updated ID already exists in DB
        if (books.some(book => book.id !== id && book.id === data.id)){
            message = "Duplicated ID exists. Cannot update record.";
        } else {
           books[index] = data;
        message = "Record Updated." 
        }
    }
    res.json(message);
})

//Delete a single record
app.delete('/api/:id', (req, res)=>{
    let id = req.params.id;
    let message = "Sorry, No Record Found.";

    //find index of element that matches id
    //if match is found, return index position
    //else return a -1 (not found)
    let index = books.findIndex (book => book.id == id);

    //if found then delete the record using splice()
    //otherwise return a not found message
    if (index != -1){
        books.splice(index,1);
        message = "Record Deleted."
    }

    res.json(message);
})

//Deleting All Records
app.delete('/api/', (req, res)=>{
    books.splice(0);
    res.json("All Records Deleted.");
})

