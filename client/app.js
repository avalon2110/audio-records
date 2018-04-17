var myApp = angular.module('myApp', ['ngRoute','ui-notification']);

myApp.config(($routeProvider) => {
    $routeProvider
        .when('/', {
            controller: 'UploadController',
            templateUrl: 'views/files.html'
        })
        .otherwise({
            redirectTo : '/'
        })
});
