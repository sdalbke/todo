// This module is responsible for CRUD operations on the to-do list
(function(){
    angular.module('TodoList')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('APIInterceptor');
    }])
    .service('APIInterceptor', function($q, $localStorage, $window) {

        // Add the authorization header with the token on any requests
        // made to the todo API
        this.request = function(config) {
            config.headers.authorization = $localStorage.token;
            return config;
        };

        this.responseError = function(response) {
            // If the API doesn't except the token, redirect to the login page
            if (response.status === 401 || response.status === 403) {
                $window.location.href = "/";
                return $q.reject(response);
            } else {
                return response;
            }
        };
    })
    .controller('TodoListController', ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {

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