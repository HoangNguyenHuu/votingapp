angular.module('MyApp')
    .controller('PollDetailCtrl', ['$scope', '$http', '$rootScope', '$routeParams', '$location', function($scope, $http, $rootScope, $routeParams, $location) {

        var obj = {
            "idPoll": $routeParams.idPoll
        }
        $scope.pollvote = [];
        // console.log(obj);

        var ctx = document.getElementById("myChart");
        var myChart;
        $http.post('/api/getonepoll', obj)
            .success(function(data) {
                // console.log(data);
                $scope.poll = data[0];
                console.log($scope.poll);
                var vote = $scope.poll.vote;
                var option = $scope.poll.option;
                var mylabels = [];
                var mydata = [];
                if ($rootScope.currentUser) {
                    if ($scope.poll.email === $rootScope.currentUser.email) {
                        $scope.isOwn = true;
                    }
                }
                for (var i = 0; i < option.length; i++) {
                    mylabels.push(option[i]);
                    mydata.push(vote[i]);
                    var obj = {
                        label: option[i],
                        value: vote[i]
                    }
                    $scope.pollvote.push(obj);
                }
                // console.log($scope.pollvote);


                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: mylabels,
                        datasets: [{
                            label: 'Votes',
                            data: mydata,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

            })
            .error(function() {
                alert("error");
            });
        $scope.submit = function() {
            // console.log($scope.selectvote);
            $scope.pollvote[$scope.selectvote].value += 1;
            $scope.poll.vote[$scope.selectvote] += 1;
            // mydata[$scope.selectvote] += 1;

            // myChart.data.datasets[0].data[1].value = 10;
            myChart.data.datasets[0].data[$scope.selectvote] += 1;
            // Would update the first dataset's value of 'March' to be 50
            myChart.update();

            $http({
                method: "POST",
                url: "/api/vote",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.poll
            }).then(function(result) {
                // console.log(result);
            }, function(error) {
                console.log(error)
            });
        }

        $scope.tweetout = function() {
            // var url = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="' + quotes[pre] + ' - ' + authors[pre] + '"';
            // console.log(x);
            console.log("twitter");
            // var url = 'https://twitter.com/intent/tweet?url=https://vast-scrubland-42486.herokuapp.com/#/polldetail/' + $scope.poll.id;
            var url = 'https://twitter.com/intent/tweet?url=https://vast-scrubland-42486.herokuapp.com/polldetail/'+ $scope.poll.id;
            window.open(url, '_blank');
        }


        $scope.update = function() {
            $location.path('/update/' + $routeParams.idPoll);
        }

        $scope.remove = function() {
            $http({
                method: "POST",
                url: "/api/removepoll",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.poll
            }).then(function(result) {
                // console.log(result);
                $location.path('/');
            }, function(error) {
                alert('error');
            });
        }

    }]);
