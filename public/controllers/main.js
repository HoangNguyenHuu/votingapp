angular.module('MyApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.polls = [];
        $http({
            method: "GET",
            url: "/api/getAllPoll"
        }).then(function(result) {
            console.log(result);
            $scope.polls = result.data;
            console.log($scope.polls);
        }).then(function(error) {
            console.log(error);
        })

        $scope.getDetail = function(idPoll) {
            $location.path('/polldetail/' + idPoll);
        }
    }]);
