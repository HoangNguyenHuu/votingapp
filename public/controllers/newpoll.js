angular.module('MyApp')
    .controller('NewpollCtrl', ['$scope', '$http', '$rootScope', '$location', '$alert', function($scope, $http, $rootScope, $location, $alert) {

        $scope.new = true;
        $scope.makepoll = function() {
            var arr = $scope.options.split("\n");
            var votearr = [];
            for (var i = 0; i < arr.length; i++) {
                votearr.push(0);
            }
            var obj = {
                "email": $rootScope.currentUser.email,
                "title": $scope.title,
                "options": arr,
                "vote": votearr
            };
            console.log(obj);
            $http.post('/api/newpoll', obj)
                .success(function(data) {
                    $location.path('/polldetail/' + data.idPoll);
                    // console.log(data.idPoll);
                    $alert({
                        title: 'Cheers!',
                        content: 'You have successfully created new poll.',
                        placement: 'top-right',
                        type: 'success',
                        duration: 3
                    });
                })
                .error(function() {
                    alert("error");
                });

            // console.log($rootScope.currentUser);
        }
    }]);
