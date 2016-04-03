// This module is responsible for user login
(function(){
    var app = angular.module('Login', ['ngStorage']);

    app.controller("LoginController", ['$scope', '$http', '$localStorage', function($scope, $http, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.login = function() {
            var postData = { username: $scope.username, password: $scope.password}

            $http.post('/authenticate', postData).success(function(data) {
                  if(data.success) {
                    $scope.$storage.token = data.token;
                    window.location = "/TodoList.html"
                  } else {
                    // TODO: show error on screen
                  }
            });
        };

    }]);
})();