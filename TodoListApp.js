var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status-codes');
var passwordHash = require('password-hash');

// Connect to the database
var sequelize = new Sequelize('ToDo', 'n/a', 'n/a', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'data/todos.sqlite3'
});

// Configuration
app.set('secret', 'mySecret');

// Used to interact with the ToDo table in the database
var todoDataModel = sequelize.import(__dirname + "/data/models/ToDo")
var userDataModel = sequelize.import(__dirname + "/data/models/User")

// Add middleware
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // used to parse json
app.use(bodyParser.urlencoded({ extended: true })); // used to parse form data

var secureRouter = express.Router();

secureRouter.use(function(request, response, next){
    
    var token = request.body.token;

    if(token) {
        // Verify the token is valid
        jwt.verify(token, app.get('secret'), function(err, decoded) {
            if(err) {
                response.status(httpStatus.FORBIDDEN).json({
                    success: false,
                    message: "Failed to authenticate user"
                }); 
            } else {
                request.decodedToken = decoded;
                next();
            }
        });

        response.status(httpStatus.OK).json({
            success: true,
            message: "Authentication successful"
        });
    } else {
        response.status(httpStatus.FORBIDDEN).json({
            success: false,
            message: "Failed to authenticate user"
        });
    }
});

app.use('/todos', secureRouter);

// GET: fetch all to-dos
app.get('/todos', function (request, response) {
    sendTodos(response);
});

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/Login.html');
});

// POST: create a new to-do
app.post('/todos', function(request, response) {

    var todo = { description: request.body.text }

    todoDataModel.create(todo).then(function(data) {
        sendTodos(response);  
    });
});

app.post('/authenticate', function(request, response) {
    // Find the user trying to authenticate
    userDataModel.findOne({ where: { username: request.body.username }}).then(function(data) {

        // Verify the password matches
        var isPasswordValid = passwordHash.verify(request.body.password, data.password);

        if(isPasswordValid) {
            var payload = { username: data.dataValues.username }
            var token = jwt.sign(payload, 'hardCodedSecret', { expiresIn: 300 });
            response.json({ success: true, message: 'Authenticated', token: token });
        } else {
            response.json({ success: false, message: 'Invalid password'});
        }

    }).catch(function(err) {
        console.error(err);
        response.json({ success: false, message: 'Failed to find user' });
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

