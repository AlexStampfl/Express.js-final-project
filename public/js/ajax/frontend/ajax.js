/* //API - URL endpoint
let url = "http://localhost:8900/ajax";//connection failed. 
let books = [];


//process ajax call
function processAJAX(type = 'GET', id = '', data = null) {
    //create ajax call
    if (type == 'GET' || type == 'DELETE') {
        data = null
    } else {
        data = JSON.stringify(data);//vid 7 changes
    }

    //get value from radio button
    let ajaxType = $("#ajax-type input:checked").val();

    if (ajaxType == 'ajax') {
        console.log('XMLHTTPREQUEST');

        var xhr = new XMLHttpRequest();
        xhr.open(type, url + id);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(data);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //convert data to js object
                books = JSON.parse(xhr.responseText)
                processResult(books, type);
            }
        }
        xhr.onerror = () => {
            $("#result").html("Error!");
        }
    } else {
        //jquery
        console.log('JQUERY AJAX')
        $.ajax({
            method: type,
            url: url + id,
            data: data,
            async: true,
        })
            .done((data) => {
                books = data;
                processResult(books, type);
            })
            .fail((data) => {
                $("#result").html("Error!");
            })
    }
}

$(document).ready(() => {

    //GET button
    $("#btn-get").on('click', () => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('get'))
        $("#go-get-delete").click(() => {
            //get id from form
            let id = $("#form-get-delete #id").val();
            processAJAX('GET', id, '');


        })
    })
    //DELETE button
    $("#btn-delete").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('delete'))
        $("#go-get-delete").click(() => {
            //get id from form
            let id = $("#form-get-delete #id").val();
            processAJAX('DELETE', id, '');

        })
    })

    //POST button
    $("#btn-post").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(postPutForm('post'))
        $("#go-post").click(() => {
            let book = buildBookObject();
            console.log(book); //vid 7 changes

            processAJAX('POST', '', book);
        });
    })
    //PUT button
    $("#btn-put").click(() => {
        $("#result").hide();
        processAJAX('GET');
    })
});

function getDeleteForm(type) {
    message = "Fetch Books";
    if (type == 'delete') {
        message = "Delete Books";
    }
    return (
        `
        <h1>${message}</h1>
        <form action="" id="form-get-delete" onsubmit="return false">
            <div class="form-controls">
                <label for="id">ID:</label>
                <input type="text" name="id" id="id">
                
                <p>(Leave Blank for all records)</p>
            </div>
            <div class="form-controls">
                <button id="go-get-delete">GO!</button>
            </div>
        </form>
        `
    );
}

function postPutForm(type) {
    message = "Insert a new book";
    disabled = "";
    if (type == 'put') {
        message = "Update a Book";
        disabled = "disabled";
    }
    return (
        ` 
        <h1>${message}</h1>
            <form id="form-put-post" onsubmit="return false;">
                <div class="form-controls">
                    <label for="id">ID:</label>
                    <input name="id" id="id" ${disabled}>
                </div>
                <div class="form-controls">
                    <label for="title">Title:</label>
                    <input name="title" id="title">
                </div>
                <div class="form-controls">
                    <label for="author">Author:</label>
                    <input name="author" id="author">
                </div>
                <div class="form-controls">
                    <label for="publisher">Publisher:</label>
                    <input name="publisher" id="publisher">
                </div>
                <div class="form-controls">
                    <label for="year">Year:</label>
                    <input name="year" id="year">
                </div>
                <div class="form-controls">
                    <button id="go-${type.toLowerCase()}">GO!</button>
                </div>
            </form>
        `
    )
}

//Build book table
function bookTable(books) {

    console.log(books);

    str = `<h1>Books</h1>
    <table class="table-books" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

    //Works for ARRAYs
    books.forEach(book => {
        str += ` 
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.year}</td>
                <td>
                    <button onclick="prepareUpdate(${book.id})">Edit</button>
                    <button onclick="prepareDelete(${book.id})">Delete</button>
                </td>
            </tr>`
    });


    str += `</tbody></table>`;
    return str;
}

//Process Result
function processResult(books, method) {
    $("#ajax-form").hide();
    $("#result").show();
    switch (method) {
        case 'GET':
            $("#result").html(bookTable(books));
            break;
        case 'PUT':
            $("#result").html(books);
            break;
        case 'POST':
            $("#result").html(books);
            break;
        case 'DELETE':
            $("#result").html(books);
            break;
    }
}

//Prepare Delete
function prepareDelete(id) {
    processAJAX('DELETE', id, '');
}

//prepare update
function prepareUpdate(id) {
    $("#ajax-form").html(postPutForm('put'))
    $("#ajax-form").show();
    $("#result").hide();

    let index = books.findIndex(book => book.id == id);
    if (index != -1) {
        let book = books[index];

        //Prefill form
        $("#form-put-post #id").val(book.id);
        $("#form-put-post #title").val(book.title);
        $("#form-put-post #author").val(book.author);
        $("#form-put-post #publisher").val(book.publisher);
        $("#form-put-post #year").val(book.year);
    }
    $("#go-put").click(() => {
        let newBook = buildBookObject();
        processAJAX('PUT', newBook.id, newBook);
    })
}

//Build book object
function buildBookObject() {
    return {
        "id": $("#form-put-post #id").val(),
        "title": $("#form-put-post #title").val(),
        "author": $("#form-put-post #author").val(),
        "publisher": $("#form-put-post #publisher").val(),
        "year": $("#form-put-post #year").val(),
    }
} */








// Original Hw
//API - URL endpoint
let url = "http://localhost:8900/ajax";//connection failed. 
let books = [];


//process ajax call
function processAJAX(type = 'GET', id = '', data = null) {
    //create ajax call
    if (type == 'GET' || type == 'DELETE') {
        data = null
    } else {
        data = JSON.stringify(data);//vid 7 changes
    }

    //get value from radio button
    let ajaxType = $("#ajax-type input:checked").val();

    if (ajaxType == 'ajax') {
        console.log('XMLHTTPREQUEST');
        
        var xhr = new XMLHttpRequest();
        xhr.open(type, url + id);

        xhr.setRequestHeader('Content-type', 'application/json', 'char-set=utf-8');
        xhr.send(data);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //convert data to js object
                books = JSON.parse(xhr.responseText)
                processResult(books, type);
            }
        }
        xhr.onerror = () => {
            $("#result").html("Error!");
        }
    }else{
        //jquery
        console.log('JQUERY AJAX')
        $.ajax({
           method:type,
           url:url + id,
           data: data,
           async: true,
        })
        .done((data)=>{
            books = data;
            processResult(books, type);
        })
        .fail((data)=>{
            $("#result").html("Error!");
        })
    }
}

$().ready(() => {

    //GET button
    $("#btn-get").on('click', () => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('get'))
        $("#go-get-delete").click(() => {
            //get id from form
            let id = $("#form-get-delete #id").val();
            processAJAX('GET', id, '');


        })
    })
    //DELETE button
    $("#btn-delete").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('delete'))
        $("#go-get-delete").click(() => {
            //get id from form
            let id = $("#form-get-delete #id").val();
            processAJAX('DELETE', id, '');

        })
    })

    //POST button
    $("#btn-post").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(postPutForm('post'))
        $("#go-post").click(() => {
            let book = buildBookObject();
            console.log(book); //vid 7 changes

            processAJAX('POST', '', book);
        });
    })
    //PUT button
    $("#btn-put").click(() => {
        $("#result").hide();
        processAJAX('GET');
    })
});

function getDeleteForm(type) {
    message = "Fetch Books";
    if (type == 'delete') {
        message = "Delete Books";
    }
    return (
        `
        <h1>${message}</h1>
        <form action="" id="form-get-delete" onsubmit="return false">
            <div class="form-controls">
                <label for="id">ID:</label>
                <input type="text" name="id" id="id">
                
                <p>(Leave Blank for all records)</p>
            </div>
            <div class="form-controls">
                <button id="go-get-delete">GO!</button>
            </div>
        </form>
        `
    );
}

function postPutForm(type) {
    message = "Insert a new book";
    disabled = "";
    if (type == 'put') {
        message = "Update a Book";
        disabled = "disabled";
    }
    return (
        ` 
        <h1>${message}</h1>
            <form id="form-put-post" onsubmit="return false;">
                <div class="form-controls">
                    <label for="id">ID:</label>
                    <input name="id" id="id" ${disabled}>
                </div>
                <div class="form-controls">
                    <label for="title">Title:</label>
                    <input name="title" id="title">
                </div>
                <div class="form-controls">
                    <label for="author">Author:</label>
                    <input name="author" id="author">
                </div>
                <div class="form-controls">
                    <label for="publisher">Publisher:</label>
                    <input name="publisher" id="publisher">
                </div>
                <div class="form-controls">
                    <label for="year">Year:</label>
                    <input name="year" id="year">
                </div>
                <div class="form-controls">
                    <button id="go-${type.toLowerCase()}">GO!</button>
                </div>
            </form>
        `
    )
}

//Build book table
function bookTable(books) {

    console.log(books);

    str = `<h1>Books</h1>
    <table class="table-books" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

    //Works for ARRAYs
    books.forEach(book => {
        str += ` 
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.year}</td>
                <td>
                    <button onclick="prepareUpdate(${book.id})">Edit</button>
                    <button onclick="prepareDelete(${book.id})">Delete</button>
                </td>
            </tr>`
    });


    str += `</tbody></table>`;
    return str;
}

//Process Result
function processResult(books, method) {
    $("#ajax-form").hide();
    $("#result").show();
    switch (method) {
        case 'GET':
            $("#result").html(bookTable(books));
            break;
        case 'PUT':
            $("#result").html(books);
            break;
        case 'POST':
            $("#result").html(books);
            break;
        case 'DELETE':
            $("#result").html(books);
            break;
    }
}

//Prepare Delete
function prepareDelete(id) {
    processAJAX('DELETE', id, '');
}

//prepare update
function prepareUpdate(id) {
    $("#ajax-form").html(postPutForm('put'))
    $("#ajax-form").show();
    $("#result").hide();

    let index = books.findIndex(book => book.id == id);
    if (index != -1) {
        let book = books[index];

        //Prefill form
        $("#form-put-post #id").val(book.id);
        $("#form-put-post #title").val(book.title);
        $("#form-put-post #author").val(book.author);
        $("#form-put-post #publisher").val(book.publisher);
        $("#form-put-post #year").val(book.year);
    }
    $("#go-put").click(() => {
        let newBook = buildBookObject();
        processAJAX('PUT', newBook.id, newBook);
    })
}

//Build book object
function buildBookObject() {
    return {
        "id": $("#form-put-post #id").val(),
        "title": $("#form-put-post #title").val(),
        "author": $("#form-put-post #author").val(),
        "publisher": $("#form-put-post #publisher").val(),
        "year": $("#form-put-post #year").val(),
    }
}