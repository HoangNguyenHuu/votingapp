angular.module('MyApp')
    .controller('NavbarCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
        $scope.logout = function() {
            Auth.logout();
        };
        $location.path('/');
    }]);
