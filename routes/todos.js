var express = require('express');
var todoRouter = express.Router();
var httpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
// Connect to the database
var sequelize = new Sequelize('ToDo', 'n/a', 'n/a', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: __dirname + '/../data/todos.sqlite3'
});

// Used to interact with database tables
var todoDataModel = sequelize.import('../data/models/ToDo');
// Add middleware to ensure authentication before any responses are sent
todoRouter.use(function(request, response, next){

    var token = request.headers.authorization;
    if(token) {
        // Verify the token is valid
        jwt.verify(token, 'mySecret', function(err, decoded) {
            if(err) {
                console.error(err);
                response.status(httpStatus.FORBIDDEN).json({
                    success: false,
                    message: "Failed to authenticate user"
                }); 
            } else {
                request.decodedToken = decoded;
                next();
            }
        });
    } else {
        response.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Failed to authenticate user"
        });
    }
});

// GET: fetch all to-dos
todoRouter.get('/', function (request, response) {
    sendTodos(response);
});

// POST: create a new to-do
todoRouter.post('/', function(request, response) {
    var todo = { description: request.body.text }
    todoDataModel.create(todo).then(function(data) {
        sendTodos(response);  
    });
});

// DELETE - delete a to-do
todoRouter.delete('/:id', function(request, response) {
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

module.exports = todoRouter;