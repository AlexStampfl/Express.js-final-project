/* /// <reference path="jquery-3.7.0.js"/> */
var socket;

$(document).ready(function () {
    socket = io('http://localhost:8900');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);
});

function addUser() {
    var username = prompt("What's your name?");
    console.log('Adding user:', username);
    socket.emit('adduser', username);
}
function processMessage(username, data) {
    console.log('Received message:', username, data);
    $('<b>' + username + ':</b> ' + data + '<br />')
        .insertAfter($('#conversation'));
}
function updateUserList(data) {
    console.log('Updating user list:', data);
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
}
function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
    $('#data').focus();
}
function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}