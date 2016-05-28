// anuglar d3 helped by module 14

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

myApp.directive('mapChart', function() {
    return {
        restrict: 'E', // this directive is specified as an html element <scatter>
        scope: false,
        // Create a link function that allows dynamic element creation
        link: function(scope, elem) {
            // Define you chart function and chart element
            var myChart = MapChart().width(800).height(500);

            // Wrapper element to put your chart in
            var chart = d3.select(elem[0]);

            // Use the scope.$watch method to watch for changes to the step, then re-draw your chart
            scope.$watch('data', function() {
                chart.call(myChart);
            }, true); // Watch for object consistency!
        }
    };
});

myApp.directive('pebbleChart', function() {
    return {
        restrict: 'E', // this directive is specified as an html element <scatter>
        scope: false,
        // Create a link function that allows dynamic element creation
        link: function(scope, elem) {
            // Define you chart function and chart element
            var myChart = PebbleChart()
                .width(500)
                .height(250);

            // Wrapper element to put your chart in
            var chart = d3.select(elem[0]);

            // Use the scope.$watch method to watch for changes to the step, then re-draw your chart
            scope.$watch('data', function() {
                chart.datum([scope.testData])
                    .call(myChart);
            }, true); // Watch for object consistency!
        }
    };
});

myApp.controller('mainController', function($scope, Election_2000) {
    Election_2000.getData.then(function(resp) {});

    $scope.testData = [];

    var names = ["a" , "b", "c"];
    var buckets = ["sample 1", "sample 2", "sample 3"];

    for (var i = 1; i < 307; i++) {
        var namesIndex = Math.floor(Math.random() * names.length);
        var bucketsIndex = Math.floor(Math.random() * buckets.length);

        $scope.testData.push({
            name: names[namesIndex],
            bucket: buckets[bucketsIndex],
            value: i
        });
    }

    window.onscroll = function(){

        // temporary scroll fix: http://stackoverflow.com/questions/21791512/how-to-make-a-fixed-positioned-div-until-some-point
        if(window.scrollY > 3000) { // change target to number
            document.getElementById('vis').style.position = 'absolute';
        } else {
            document.getElementById('vis').style.position = 'fixed';
        }

    };
});