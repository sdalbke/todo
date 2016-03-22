var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

// Connect to the database
var sequelize = new Sequelize('ToDo', 'n/a', 'n/a', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'data/todos.sqlite3'
});

// Used to interact with the ToDo table in the database
var todoDataModel = sequelize.import(__dirname + "/data/models/ToDo")

// Add middleware
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // used to parse json
app.use(bodyParser.urlencoded({ extended: true })); // used to parse form data

// GET: fetch all to-dos
app.get('/todos', function (request, response) {
    refreshData();
});

app.get('*', function (request, response) {
    response.sendFile(__dirname + '/public/TodoList.html');
});

// POST: create a new to-do
app.post('/todos', function(request, response) {

    var todo = { description: request.body.text }

    todoDataModel.create(todo).then(function(data) {
        refreshData();  
    });
});

// DELETE - delete a to-do
app.delete('/todos/:id', function(request, response) {
    // Find the todo with the mathing ID to delete
    todoDataModel.destroy({ where: { id: request.params.id }}).then(function(data) {
        refreshData();
    });
});

// Fetch all to-dos from the database
function refreshData() {
    todoDataModel.findAll().then(function(data) {
        response.json(data);
    }).catch(function(err) {
        console.error('Failed to read from the database: ' + err);
    });
}

app.listen(8080);

