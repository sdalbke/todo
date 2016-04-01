// This module is responsible for user login
(function(){
    var app = angular.module('Login', []);

    app.controller("LoginController", ['$scope', '$http', function($scope, $http) {

        $scope.login = function() {
            alert($scope.username);
            alert($scope.password);
        };

    }]);
})();