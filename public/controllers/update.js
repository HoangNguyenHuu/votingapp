angular.module('MyApp')
    .controller('UpdatePollCtrl', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$alert', function($scope, $http, $rootScope, $location, $routeParams, $alert) {
        $scope.update = true;
        var obj = {
            "idPoll": $routeParams.idPoll
        }
        console.log(obj);
        $http.post('/api/getonepoll', obj)
            .success(function(data) {
                // console.log(data);
                $scope.title = data[0].title;
                $scope.options = '';
                for (var i = 0; i < data[0].option.length; i++) {
                    $scope.options += data[0].option[i] + '\n';
                }
            })
            .error(function() {
                alert("error");
            });

        $scope.updatepoll = function() {
            var arr = $scope.options.split("\n");

            var votearr = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== '') {
                    votearr.push(0);
                } else {
                    arr.splice(i, 1);
                    i--;
                }
            }
            var obj = {
                "id": $routeParams.idPoll,
                "email": $rootScope.currentUser.email,
                "title": $scope.title,
                "options": arr,
                "vote": votearr
            };
            // console.log(obj);
            $http.post('/api/updatepoll', obj)
                .success(function(data) {
                    $location.path('/polldetail/' + $routeParams.idPoll);
                    // console.log(data)
                    $alert({
                        title: 'Cheers!',
                        content: 'You have successfully updated poll.',
                        placement: 'top-right',
                        type: 'success',
                        duration: 3
                    });
                })
                .error(function() {
                    alert("error");
                });
        }

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
                })
                .error(function() {
                    alert("error");
                });

            // console.log($rootScope.currentUser);
        }
    }]);
