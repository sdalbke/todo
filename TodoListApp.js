var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var todos = [];

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // used to parse json
app.use(bodyParser.urlencoded({ extended: true })); // used to parse form data

app.get('/todos', function (request, response) {
    response.json(todos);
});

app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/TodoList.html');
});

app.post('/todos', function(request, response) {
    todos.push({id:todos.length, description: request.body.text, complete:false});
    response.json(todos);
});

app.delete('/todos/:id', function(request, response) {
    // Find the todo with the mathing ID to delete
    var index = -1;
    for(var i = 0; i < todos.length; i++) {
        if(todos[i].id == request.params.id) {
            index = i;
            break;
        }
    }

    // Delete the todo if it was found
    if(index >= 0) {
        todos.splice(index, 1);
    }

    response.json(todos);
});

app.listen(8080);

