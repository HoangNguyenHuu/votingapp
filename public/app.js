angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/newpoll', {
                templateUrl: 'views/newpoll.html',
                controller: 'NewpollCtrl'
            })
            .when('/polldetail/:idPoll', {
                templateUrl: 'views/polldetail.html',
                controller: 'PollDetailCtrl'
            })
            .when('/mypoll', {
                templateUrl: 'views/mypoll.html',
                controller: 'MyPollCtrl'
            })
            .when('/update/:idPoll', {
                templateUrl: 'views/newpoll.html',
                controller: 'UpdatePollCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
