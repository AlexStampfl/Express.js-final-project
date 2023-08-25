//CRUD APIs

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {books} = require('./models/books');

const port = 8080;
const server = `http://localhost:${port}`;
app.listen(port, ()=> console.log(`Server is running at: ${server}`));

//not a secure method
//CORS - cross-origin resource sharing
app.use(cors());

//encode document
app.use(bodyParser.urlencoded({extended: false}));

//parsing JSON
app.use(bodyParser.json());

// APIs and rest code


//Test server
app.get('/', (req, res)=>{
    res.json("It's working!!");
});

//GET ALL records: /api/
app.get('/api/',(req, res)=>{
    res.json(books);
})

//GET ONE record
app.get('/api/:id', (req, res)=>{
   let id = req.params.id;
    let record = "No Record Found.";
   //if found record, return index position
   //else return -1
   let index = books.findIndex( (book)=> book.id==id )
   
   if(index != -1){
    record = books[index];
   }
   res.json([record]);
})

//DELETE ONE RECORD /api/:id
app.delete('/api/:id', (req, res)=>{
    let id = req.params.id;
    let message = "No Record Found.";
   //if found record, return index position
   //else return -1
   let index = books.findIndex( (book)=> book.id==id )
   
   if(index != -1){
    //record = books[index];
        books.splice(index, 1);
        record = "Record Deleted";
   }
   res.json(message);
})

//DELETE ALL RECORDS: /api/
app.delete('/api/', (req, res)=>{
    books.splice(0, 1);
    res.json("All Records Deleted.");
})

//POST  - Insert new record: /api/
app.post('/api/', (req, res)=>{
    let newBook = req.body;
    books.push(newBook);

    //cehck for duplicated
    res.json("New Book Added.");
})

//PUT - Updating existing record: /api/id
app.put('/api/:id', (req,res)=>{
    let message = "No Record Found."
    let newBook = req.body;
    let id = req.params.id;
    let index = books.findIndex( (book)=> book.id==id )
   
   if(index != -1){
    //record = books[index];
        books[index] = newBook;
        record = "Record Updated";
   }
   res.json(message);

})

