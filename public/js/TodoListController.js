// This module is responsible for CRUD operations on the to-do list
(function(){
    var app = angular.module('TodoList', []);

    app.controller("TodoListController", ['$scope', '$http', function($scope, $http) {

        // When the page loads, fetch all todos from the server
        $http.get('/todos').success(function(data) {
            $scope.todos = data;
        });

        // Create a new todo
        $scope.create = function(formData) {

            $http.post('/todos', formData).success(function(data) {
                // Once the new todo posts, refresh the list from the server
                $http.get('/todos').success(function(data) {
                    $scope.todos = data;
                });    
            });

            // Clear the text box
            $scope.formData = {};
        };

        // Delete a todo from the list
        $scope.delete = function(id) {
            
            $http.delete('/todos/' + id).success(function(data) {
                // Once the new todo is deleted, refresh the list from the server
                $http.get('/todos').success(function(data) {
                    $scope.todos = data;
                });
            });
        };

    }]); // end controller
})();