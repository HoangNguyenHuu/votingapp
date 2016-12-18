angular.module('MyApp')
    .controller('MyPollCtrl', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
        $scope.polls = [];
        var obj = {
            "email": $rootScope.currentUser.email
        }
        $http({
            method: "POST",
            url: "/api/getuserpoll",
            headers: {
                'Content-Type': 'application/json'
            },
            data: obj
        }).then(function(result) {
            $scope.polls = result.data;
            // console.log(result);
        }).then(function(error) {
            console.log(error);
        });

        $scope.getDetail = function(idPoll) {
            $location.path('/polldetail/' + idPoll);
        }
    }]);
