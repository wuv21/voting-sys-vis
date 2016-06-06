// anuglar d3 helped by module 14
var votingSysApp = angular.module("votingSysApp", []);

// factory for 2000 election data
votingSysApp.factory('Election_2000', function($http) {
    var Election_2000 = {};

    Election_2000.getData = $http.get('data/map/2000_final.csv').then(function(response) {
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
                .height(500)
                .fills(scope.mapColor);

            var chart = d3.select(elem[0]);

            scope.$watch('mapID', function() {
                if (scope.mapData.length == 3) {
                    chart.datum([{id: scope.mapID, values: scope.mapData, redraw: scope.mapRedraw}])
                        .call(myChart);
                }
            }, true);

            scope.$watch('mapColor', function() {
                if (scope.mapData.length == 3) {
                    myChart.fills(scope.mapColor);
                    chart.datum([{id: scope.mapID, values: scope.mapData, redraw: scope.mapRedraw}])
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
                .width(600)
                .height(600);

            var chart = d3.select(elem[0]);

            scope.$watch('pebbleID', function() {
                if(!scope.pebbleData[0].length < 3) {
                    chart.datum([{id: scope.pebbleID, values: scope.pebbleData}])
                        .call(myChart);
                }
            }, true);
        }
    };
});

// Scroll directive
votingSysApp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            // get pageYOffset + add buffer so middle (ish) of screen is where the step will happen
            var pos = this.pageYOffset + (this.innerHeight * 2 / 3);

            if (pos < scope.contentHeights[2] + 20) {
                scope.mapColor = ['#ddd', '#ddd'];
                scope.mapID = 0;

            } else if (scope.checkHeight(pos, 2, 4)) {
                // show map at content 3
                console.log('here 2');
                scope.mapColor = ['#467DA3', '#A34846'];
                scope.mapID = 15;
                scope.elementVisible.mapC = true;

            } else if (scope.checkHeight(pos, 4, 5)) {
                // todo remove map + show div stuff
                console.log('here 4');
                scope.mapRedraw = false;
                scope.elementVisible.mapC = false;

            } else if (scope.checkHeight(pos, 5, 6)) {
                // todo remove css + transition to map squares
                console.log('here 5');
                scope.pebbleData = scope.blankPebbleData;
                scope.pebbleID = 0;
                scope.elementVisible.pebbleC = false;

                scope.elementVisible.mapC = true;
                scope.mapRedraw = true;
                scope.mapID = 16;


            } else if (scope.checkHeight(pos, 6, 7) && pos < scope.contentHeights[7] - 150) {
                // todo convert into PC
                if (scope.pebbleID == 0) {
                    scope.pebbleData = scope.newPebbleData;
                    scope.pebbleID = 1;
                }
                scope.elementVisible.mapC = false;
                scope.elementVisible.pebbleC = true;

                console.log('here 6');
            } else if (pos > scope.contentHeights[7] - 150) {
                scope.elementVisible.pebbleC = false;
            }

            scope.$apply();
        })
    }
});

votingSysApp.controller('mainController', function($scope, Election_2000, us_json, stateNames) {
    $scope.testData = [];
    var names = ["a" , "b", "c"];
    var buckets = ["Democrats", "Republicans"];

    $scope.generateRandom = function(n) {
        var data = [];

        for (var i = 1; i < n; i++) {
            var namesIndex = Math.floor(Math.random() * names.length);
            var bucketsIndex = Math.floor(Math.random() * buckets.length);

            data.push({
                name: names[namesIndex],
                bucket: buckets[bucketsIndex],
                value: i
            });
        }

        return _.sortBy(data, function(d) {return d.name});
    };


    $scope.blankPebbleData = [{name: "a", bucket: "sample 1", value: 0},
        {name: "a", bucket: "sample 2", value: 0},
        {name: "a", bucket: "sample 3", value: 0}];
    $scope.pebbleID = 0;

    $scope.pebbleData = $scope.blankPebbleData;

    $scope.newPebbleData = $scope.generateRandom(250);

    $scope.mapData = [];
    $scope.mapToPebble = [];
    us_json.getData.then(function(resp1) {
        $scope.mapData.push(resp1);

        Election_2000.getData.then(function(resp2) {
            $scope.mapData.push(resp2);

            var stateData = $scope.mapData[1];
            for (var i = 0; i < stateData.length; i++) {
                if (stateData[i]["ev_bush"] > 0) {
                    var votes = stateData[i]["ev_bush"];
                    for (var j = 0; j < votes; j++) {
                        $scope.mapToPebble.push({
                            name: stateData[i]["state"],
                            bucket: buckets[1],
                            value: stateData[i]["ev_bush"]
                        });
                    }
                } else if (stateData[i]["ev_gore"] > 0) {
                    var votes = stateData[i]["ev_gore"];
                    for (var j = 0; j < votes; j++) {
                        $scope.mapToPebble.push({
                            name: stateData[i]["state"],
                            bucket: buckets[0],
                            value: stateData[i]["ev_gore"]
                        });
                    }
                }
            }

            $scope.mapToPebble = _.sortBy($scope.mapToPebble, function(d) {return d.name});
            $scope.newPebbleData = $scope.mapToPebble;

            stateNames.getData.then(function(resp3) {
                $scope.mapData.push(resp3);
            });
        });
        $scope.mapRedraw = false;
        $scope.mapID = 0;


    });
    $scope.elementVisible = {
        mapC: true,
        pebbleC: false
    };
    $scope.mapColor = ['#ddd', '#ddd'];

    $scope.settings = [
        {width: 800, height: 500},
        {width: 400, height: 250},
        {width: 600, height: 400}
    ];

    var test = document.getElementsByClassName("content-text");
    $scope.contentHeights = [];
    for (var i = 0; i < test.length; i++) {
        var rect = test[i].getBoundingClientRect();
        $scope.contentHeights.push(Math.floor(rect.top));
    }

    $scope.checkHeight = function(pos, indexStart, indexEnd) {
        var startCheck = pos > $scope.contentHeights[indexStart] - 20;
        var endCheck = pos < $scope.contentHeights[indexEnd] + 20;

        return startCheck && endCheck;
    };
});