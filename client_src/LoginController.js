// This module is responsible for user login
(function(){
    angular.module('Login', ['ngStorage'])
    .controller("LoginController", ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {

        $scope.errorMessage = '';

        // Used to show/hide login related error messages
        $scope.showError = function() {
            return ($scope.errorMessage.length > 0);
        }

        // Send login data to the server and redirect into the app if successful
        $scope.login = function() {
            var postData = { username: $scope.username, password: $scope.password}

            // Ask the server for a token
            $http.post('/authenticate', postData).success(function(data) {
                  $scope.errorMessage = '';
                  if(data.success) {
                    // Save the token in local storage and proceed to the app
                    $localStorage.token = data.token;
                    window.location = "/TodoList.html"
                  } else {
                    $scope.errorMessage = "Invalid username or password";
                  }
            });
        };
    }]);
})();