// This module is responsible for CRUD operations on the to-do list
(function(){
    var app = angular.module('TodoList', ['ngStorage']);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('APIInterceptor');
    }]);

    app.service('APIInterceptor', function($q, $localStorage, $window) {

        var service = this;

        service.request = function(config) {
            config.headers.authorization = $localStorage.token;
            return config;
        };

        service.responseError = function(response) {
            if (response.status === 401) {
                $window.location.href = "/";
                return $q.reject(response);
            } else {
                return response;
            }
        };
    });

    app.controller('TodoListController', ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {

        // When the page loads, fetch all todos from the server
        $http.get('/todos').success(function(data) {
            $scope.todos = data;
        });

        // Create a new todo
        $scope.create = function(formData) {

            if(formData.text.length > 0) {
                $http.post('/todos', formData).success(function(data) {
                    $scope.todos = data;
                });

                // Clear the text box
                $scope.formData = {};
            }
        };

        // Delete a todo from the list
        $scope.delete = function(id) {
            
            $http.delete('/todos/' + id).success(function(data) {
                $scope.todos = data;
            });
        };

    }]);
})();