var myApp = angular.module("myApp", []);

// factory for 2000 election data
myApp.factory('Election_2000', function($http) {
    var Election_2000 = {};

    Election_2000.getData = $http.get('data/2000_election/2000_final.csv')
        .then(function(response) {
            var data = response.data.split('\n');

            var states = [];
            var header = data[0].split(',');

            for (var i = 1; i < data.length; i++) {
                var state_raw = data[i].split(',');

                var state = {};
                for (var j = 0; j < header.length; j++) {
                    state[header[j]] = state_raw[j];
                }

                states.push(state);
            }

            return states;
        });

    return Election_2000;
});

myApp.directive('stackedBarChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            //todo bar chart instantiation
        }
    }
});

myApp.directive('mapChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            //todo map chart instantiation
        }
    }
});

myApp.controller('mainController', function($scope, Election_2000) {
    Election_2000.getData.then(function(resp) {
        console.log(resp);
    });
});