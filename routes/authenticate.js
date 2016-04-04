var express = require('express');
var authRouter = express.Router();
var httpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var Sequelize = require('sequelize');
// Connect to the database
var sequelize = new Sequelize('ToDo', 'n/a', 'n/a', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: __dirname + '/../data/todos.sqlite3'
});

var userDataModel = sequelize.import('../data/models/User');
authRouter.post('/', function(request, response) {
    // Find the user trying to authenticate
    userDataModel.findOne({ where: { username: request.body.username }}).then(function(data) {
        // Verify the password matches
        var isPasswordValid = passwordHash.verify(request.body.password, data.password);
        if(isPasswordValid) {
            var payload = { username: data.dataValues.username }
            var token = jwt.sign(payload, 'mySecret', { expiresIn: 300 });
            // Username and password are valid, send the token back
            response.status(httpStatus.OK)
                .json({ success: true, message: 'Authenticated', token: token });
                
        } else {
            SendUnauthorized(response);
        }
    }).catch(function(err) {
        console.error(err);
        SendUnauthorized(response);
    });
});

function SendUnauthorized(response) {
    response.status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid username or password'});
}

module.exports = authRouter;