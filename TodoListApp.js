var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');

// Connect to the database
var sequelize = new Sequelize('ToDo', 'n/a', 'n/a', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'data/todos.sqlite3'
});

// Used to interact with the ToDo table in the database
var todoDataModel = sequelize.import(__dirname + "/data/models/ToDo")
var userDataModel = sequelize.import(__dirname + "/data/models/User")

// Add middleware
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // used to parse json
app.use(bodyParser.urlencoded({ extended: true })); // used to parse form data

/*var myRouter = express.Router();

myRouter.get('*', function (request, response) {
    console.log("router");
    response.sendFile(__dirname + '/public/Login.html');
});*/

// GET: fetch all to-dos
app.get('/todos', function (request, response) {
    sendTodos(response);
});

app.get('/', function (request, response) {
    console.log("normal");
    response.sendFile(__dirname + '/public/Login.html');
});

// POST: create a new to-do
app.post('/todos', function(request, response) {

    var todo = { description: request.body.text }

    todoDataModel.create(todo).then(function(data) {
        sendTodos(response);  
    });
});

// DELETE - delete a to-do
app.delete('/todos/:id', function(request, response) {
    // Find the todo with the mathing ID to delete
    todoDataModel.destroy({ where: { id: request.params.id }}).then(function(data) {
        sendTodos(response);
    });
});

// Fetch all to-dos from the database and send them to the client as JSON
function sendTodos(response) {
    todoDataModel.findAll().then(function(data) {
        response.json(data);
    }).catch(function(err) {
        console.error('Failed to read from the database: ' + err);
    });
}

app.listen(8080);

