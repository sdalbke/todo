// This module contains directives shared across all pages
(function(){
    angular.module('TodoList')
    .directive('appHeader', function() {
        return {
            restrict: 'E',
            templateUrl: '../Header.html'
        };
    });
})();