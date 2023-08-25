// main.js

// Constants
const author = "Alex Stampfl"; // Change it to your name

// DOM elements
const footer = document.querySelector("footer")
const nav = document.getElementById("top-nav");

function updateDOM(){
// Update the DOM immediately
nav.innerHTML = `
    <ul>
        <li><a href="index.hbs">Home</a></li>
        <li><a href="about.hbs">About</a></li>
        <li><a href="contact.hbs">Contact</a></li>
        <li><a href="portfolio.hbs">Portfolio</a></li>
        <li><a href="chat.hbs">Chat</a></li>
        <li><a href="crud.hbs">Crud</a></li>
        <li><a href="notfound.hbs">404</a></li>
        <li><a href="ajax.hbs">AJAX</a></li>
    </ul>
`
footer.innerHTML = `&copy; ${author}. Open Source. MIT License`;

}
document.addEventListener('DOMContentLoaded', updateDOM);