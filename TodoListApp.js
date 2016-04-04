var express = require("express");
var app = express();
var bodyParser = require('body-parser');

// Configuration
app.set('secret', 'mySecret');
app.set('port', 8080);

// Add middleware
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // used to parse json
app.use(bodyParser.urlencoded({ extended: true })); // used to parse form data

var authRouter = require(__dirname + '/routes/authenticate.js');
app.use('/authenticate', authRouter);

var todoRouter = require(__dirname + '/routes/todos.js');
app.use('/todos', todoRouter);

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/Login.html');
});

app.listen(app.get('port'));
