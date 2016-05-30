// anuglar d3 helped by module 14

var votingSysApp = angular.module("votingSysApp", []);

// factory for 2000 election data
votingSysApp.factory('Election_2000', function($http) {
    var Election_2000 = {};

    Election_2000.getData = $http.get('data/2000_election/2000_final.csv').then(function(response) {
        var data = response.data.split('\n');

        var states = [];
        var header = data[0].split(',');

        for (var i = 1; i < data.length - 1; i++) {
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

// factory for json file of US state map
votingSysApp.factory('us_json', function($http) {
    var us_json = {};

    us_json.getData = $http.get('data/map/us.json').then(function(response) {
        var data = topojson.feature(response.data, response.data.objects.states).features;

        return data;
    });

    return us_json;
});

// factory for tsv file of US state names
votingSysApp.factory('stateNames', function($http) {
    var stateNames = {};

    stateNames.getData = $http.get('data/map/us-state-names.tsv').then(function(response) {
        var data = response.data.split('\n');

        var states = [];
        var header = data[0].split('\t');

        for (var i = 1; i < data.length - 1; i++) {
            var state_raw = data[i].split('\t');

            var state = {};
            for (var j = 0; j < header.length; j++) {
                state[header[j]] = state_raw[j];
            }

            states.push(state);

            var names = {};
            states.forEach(function(d){
                // e.g. 1 = AL (Alabama)
                names[d.id] = d.code;
            });
        }

        return names;
    });

    return stateNames;
});

votingSysApp.directive('mapChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            var myChart = MapChart()
                .width(800)
                .height(500);

            var chart = d3.select(elem[0]);

            scope.$watch('mapData', function() {
                if (scope.mapData.length == 3) {
                    chart.datum([scope.mapData])
                        .call(myChart);
                }
            }, true);
        }
    };
});

votingSysApp.directive('pebbleChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            var myChart = PebbleChart()
                .width(500)
                .height(250);

            var chart = d3.select(elem[0]);

            scope.$watch('testData', function() {
                if(!scope.testData[0].length < 3) {
                    chart.datum([scope.testData])
                        .call(myChart);
                }
            }, true);
        }
    };
});

votingSysApp.controller('mainController', function($scope, Election_2000, us_json, stateNames) {
    // Election_2000.getData.then(function(resp) {});

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

    $scope.mapData = [];
    us_json.getData.then(function(resp1) {
        $scope.mapData.push(resp1);

        Election_2000.getData.then(function(resp2) {
            $scope.mapData.push(resp2);

            stateNames.getData.then(function(resp3) {
                $scope.mapData.push(resp3);
            });
        });
    });

    window.onscroll = function(){
        // temporary scroll fix: http://stackoverflow.com/questions/21791512/how-to-make-a-fixed-positioned-div-until-some-point
        if(window.scrollY > 3000) { // change target to number
            document.getElementById('vis').style.position = 'absolute';
        } else {
            document.getElementById('vis').style.position = 'fixed';
        }

    };
});