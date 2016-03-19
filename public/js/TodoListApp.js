// This module is responsible for manipulating items in the to-do list
(function(){
    var app = angular.module('TodoList', []);

    app.controller("TodoListController", ['$scope', function($scope) {

        $scope.todos = [];

        // Create a new todo
        $scope.create = function(description) {
            // Add a new todo
            $scope.todos.push({ id: $scope.todos.length, description: description, complete: false});
            // Clear the text box
            $scope.formData = {};
        };

        // Delete a todo from the list
        $scope.delete = function(id) {
            
            // Find the todo with the mathing ID to delete
            var index = -1;
            for(var i = 0; i < $scope.todos.length; i++) {
                if($scope.todos[i].id === id) {
                    index = i;
                    break;
                }
            }

            // Delete the todo if it was found
            if(index >= 0) {
                $scope.todos.splice(index, 1);
            }
        };
    }]);

})();