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

// map chart directive
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

            scope.$watch('elementID.mapC', function() {
                if (scope.mapData.length == 3) {
                    chart.datum([{id: scope.elementID.mapC, values: scope.mapData, redraw: scope.mapRedraw}])
                        .call(myChart);
                }
            }, true);

            scope.$watch('mapColor', function() {
                if (scope.mapData.length == 3) {
                    myChart.fills(scope.mapColor);
                    chart.datum([{id: scope.elementID.mapC, values: scope.mapData, redraw: scope.mapRedraw}])
                        .call(myChart);
                }
            }, true);
        }
    };
});


// peblle chart directive
votingSysApp.directive('pebbleChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            var myChart = PebbleChart()
                .width(800)
                .height(500);

            var chart = d3.select(elem[0]);

            scope.$watch('elementID.pebbleC', function() {
                if(!scope.pebbleData[0].length < 3) {
                    chart.datum([{id: scope.elementID.pebbleC, values: scope.pebbleData}])
                        .call(myChart);
                }
            }, true);
        }
    };
});

// pebble enhanced chart directive
votingSysApp.directive('pebbleEnhancedChart', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem) {
            var myChart = PebbleEnhancedChart()
                .width(800)
                .height(500);

            var chart = d3.select(elem[0]);

            scope.$watch('elementID.pebbleEC', function() {
                if (scope.mapData.length > 0) {
                    chart.datum([{id: scope.elementID.pebbleEC, topodata: scope.mapData[0], values:scope.pebbleECdata}]).call(myChart);
                }
            });
        }
    };
});

// scroll directive for fptp
votingSysApp.directive("scrollFptpSection", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            // get pageYOffset + add buffer so middle (ish) of screen is where the step will happen
            var pos = this.pageYOffset + (this.innerHeight * 2 / 3);

            if (pos < scope.contentHeights[3] + 20) {
                scope.mapRedraw = false;
                scope.elementVisible.pebbleEC = false;
                scope.elementVisible.mapC = true;
                scope.elementVisible.ballotFPTP = false;
                scope.mapColor = ['#D6D6D6', '#D6D6D6'];
                scope.elementID.mapC = 0;

            } else if (scope.checkHeight(pos, 3, 4)) {
                scope.mapRedraw = true;
                scope.elementID.mapC = 1;


            } else if (scope.checkHeight(pos, 4, 5)) {
                scope.mapRedraw = false;
                scope.elementVisible.mapC = false;
                scope.elementVisible.ballotFPTP = true;
                scope.mapColor = ['#D6D6D6', '#D6D6D6'];

            } else if (scope.checkHeight(pos, 5, 6)) {
                scope.elementVisible.ballotFPTP = false;
                scope.elementVisible.pebbleEC = false;
                scope.elementID.pebbleEC = 0;
                scope.elementVisible.mapC = true;
                scope.mapColor = ['#467DA3', '#A34846'];
                scope.elementID.mapC = 2;

            } else if (scope.checkHeight(pos, 6, 7)) {
                scope.pebbleECdata = scope.ECdata_fptp;
                scope.elementVisible.pebbleEC = true;
                scope.elementID.pebbleEC = 2;
                scope.elementVisible.mapC = false;

            } else if (scope.checkHeight(pos, 8, 10)) {
                scope.pebbleECdata = scope.ECdata_fptp;
                scope.elementVisible.pebbleEC = false;
                scope.elementVisible.mapC = false;
                scope.elementVisible.pebbleC = false;

            }
            scope.$apply();
        })
    }
});

// scroll directive for AV section
votingSysApp.directive("scrollAvSection", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            // get pageYOffset + add buffer so middle (ish) of screen is where the step will happen
            var pos = this.pageYOffset + (this.innerHeight * 2 / 3);

            if (scope.checkHeight(pos, 10, 11)) { // AV SECTION
                scope.elementVisible.ballotAV = false;
                scope.mapColor = ['#D6D6D6', '#D6D6D6'];
                scope.elementID.mapC = 0;
                scope.elementVisible.mapC = true;

            } else if (scope.checkHeight(pos, 11, 12)) {
                scope.elementVisible.ballotAV = true;
                scope.changeToAv = true;
                scope.elementVisible.mapC = false;
                scope.elementVisible.pebbleEC = false;
                scope.elementID.pebbleEC = 4;

            } else if (scope.checkHeight(pos, 12, 13)) {
                scope.elementVisible.ballotAV = false;
                scope.elementVisible.pebbleEC = true;
                scope.pebbleECdata = scope.oregonECData;
                scope.elementID.pebbleEC = 6;
                scope.elementVisible.mapC = false;

                scope.pebbleData = scope.blankPebbleData;
                scope.elementID.pebbleC = 0;
                scope.elementVisible.pebbleC = false;

            } else if (scope.checkHeight(pos, 13, 14)) {
                scope.pebbleECdata = scope.oregonECData_AV;
                scope.elementID.pebbleEC = 8;

            } else if (scope.checkHeight(pos, 14, 15)) {
                scope.elementVisible.pebbleEC = true;
                scope.pebbleECdata = scope.countryECData_AV;
                scope.elementID.pebbleEC = 10;

            } else if (scope.checkHeight(pos, 15, 17)) {
                scope.elementVisible.pebbleEC = false;
                scope.elementVisible.mapC = false;
            }

            scope.$apply();
        })
    }
});

// scroll directive for SV section
votingSysApp.directive("scrollSvSection", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            // get pageYOffset + add buffer so middle (ish) of screen is where the step will happen
            var pos = this.pageYOffset + (this.innerHeight * 2 / 3);

            if (scope.checkHeight(pos, 17, 18)) { // SV SECTION
                scope.elementVisible.ballotSV = false;
                scope.mapColor = ['#D6D6D6', '#D6D6D6'];
                scope.elementID.mapC = 0;
                scope.elementVisible.mapC = true;

            } else if (scope.checkHeight(pos, 18, 19)) {
                scope.elementVisible.ballotSV = true;
                scope.elementVisible.mapC = false;
                scope.elementVisible.pebbleEC = false;
                scope.elementID.pebbleEC = 4;

            } else if (scope.checkHeight(pos, 19, 20)) {
                scope.elementVisible.ballotSV = false;
                scope.elementVisible.pebbleEC = true;
                scope.pebbleECdata = scope.oregonECData;
                scope.elementID.pebbleEC = 6;
                scope.elementVisible.mapC = false;


                scope.pebbleData = scope.blankPebbleData;
                scope.elementID.pebbleC = 0;
                scope.elementVisible.pebbleC = false;

            } else if (scope.checkHeight(pos, 20, 21)) {
                scope.pebbleECdata = scope.oregonECData_AV;
                scope.elementID.pebbleEC = 8;


            } else if (scope.checkHeight(pos, 21, 22)) {
                scope.elementVisible.pebbleEC = true;
                scope.pebbleECdata = scope.countryECData_AV;
                scope.elementID.pebbleEC = 10;

            } else if (pos > scope.contentHeights[22]) {
                scope.elementVisible.pebbleEC = false;
                scope.elementVisible.pebbleC = false;
                scope.elementVisible.mapC = false;
            }

            scope.$apply();
        })
    }
});

// main controller
votingSysApp.controller('mainController', function($scope, $http, Election_2000, us_json, stateNames) {

    // Generates random data for use in pebble charts
    $scope.testData = [];

    //state names
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

    // unique IDs for keeping track of which chart variants to show
    $scope.elementID = {
        mapC: null,
        pebbleC: null,
        pebbleEC: null
    };

    // Maps chart data to data that pebble can use
    $scope.blankPebbleData = [{name: "a", bucket: "sample 1", value: 0},
        {name: "a", bucket: "sample 2", value: 0},
        {name: "a", bucket: "sample 3", value: 0}];

    $scope.pebbleData = $scope.blankPebbleData;
    $scope.newPebbleData = $scope.generateRandom(250);

    // map settings
    $scope.mapData = [];
    $scope.mapToPebble = [];
    $scope.mapColor = ['#ddd', '#ddd'];

    // get and parse map data
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
        // initial map settings
        $scope.mapRedraw = false;
        $scope.elementID.mapC = 0;

    });


    // element visibility settings
    $scope.elementVisible = {
        mapC: true,
        pebbleC: false,
        pebbleEC: false,
        ballotFPTP: false,
        ballotAV: false,
        ballotSV: false
    };


    // pebble EC data and settings
    $scope.pebbleECdata = [];
    $scope.changeToAv = false;

    $scope.ECdata_fptp = [];
    $http.get('js/coord.json').then(function(resp) {
        $scope.pebbleECdata = resp.data;
        $scope.ECdata_fptp = resp.data;
    });

    $scope.avData = [];
    $scope.countryData = [];
    var state = {}

    $scope.oregonData = {
        Democrats: 0,
        Republicans: 0,
        Green: 0,
        Independent: 0,
        Total: 0
    };

    $scope.oregonECData = [];
    $scope.oregonECData_AV = [];
    $scope.countryECData_AV = [];
    $http.get('data/2000_election/all_final_votes_2000.csv').then(function(resp) {
        $scope.avData = $scope.CSVToArray(resp.data);
        for (var i = 1; i < $scope.avData.length; i++) {
            var current = $scope.avData[i];
            var total = 0;
            var independent = 0;
            for (var j = 1; j < current.length; j++) {
                if (current[j].length > 0) {
                    var num = parseInt(current[j].replace(/,/g,""));
                    total += num;
                    if (j != 6 && j != 4 && j != 12) {
                        independent += num;
                    }
                }
            }
            $scope.countryData.push({
                State: current[0],
                Democrats: parseInt(current[6].replace(/,/g,"")),
                Republicans: parseInt(current[4].replace(/,/g,"")),
                Green: parseInt(current[12].replace(/,/g,"")),
                Independent: independent,
                Total: total,
                EV: current[current.length - 1]
            });
        }
        for (var i = 0; i < $scope.countryData.length; i++) {
            if ($scope.countryData[i].State == "OR") {
                var stateData = $scope.countryData[i];
                $scope.oregonData.Democrat = stateData.Democrats;
                $scope.oregonData.Republican = stateData.Republicans;
                $scope.oregonData.Green = stateData.Green;
                $scope.oregonData.Independent = stateData.Independent;
                $scope.oregonData.Total = stateData.Total;
            }
        }

        var buckets = ["Democrat", "Green", "Independent", "Republican"];
        buckets.forEach(function(name) {
            var portion = Math.round($scope.oregonData[name] / $scope.oregonData.Total * 200);

            for (var i = 0; i < portion; i++) {
                $scope.oregonECData.push({
                    "x":103.95733194587466,
                    "y":118.53353715850244,
                    state: 'OR',
                    party: name
                });
            }
        });

        var oregonDataAV = {
            Democrat: $scope.oregonData['Democrat'] + ($scope.oregonData['Independent'] * 0.416667) + ($scope.oregonData['Green'] * 0.62931),
            Green: 0,
            Independent: 0,
            Republican: $scope.oregonData['Republican'] + ($scope.oregonData['Independent'] * 0.58338) + ($scope.oregonData['Green'] * 0.314655),
            Total: $scope.oregonData.Total
        };


        buckets.forEach(function(name) {
            var portion = Math.round(oregonDataAV[name] / oregonDataAV.Total * 200);

            for (var i = 0; i < portion; i++) {
                $scope.oregonECData_AV.push({
                    "x":103.95733194587466,
                    "y":118.53353715850244,
                    state: 'OR',
                    party: name
                });
            }
        });

        var test = _.uniqBy($scope.ECdata_fptp, function(d) {return d.x + d.y + d.state});

        $scope.countryData.forEach(function(state) {
            var stateAV = {
                Democrat: state['Democrats'] + (state['Independent'] * 0.416667) + (state['Green'] * 0.62931),
                Green: 0,
                Independent: 0,
                Republican: state['Republicans'] + (state['Independent'] * 0.58338) + (state['Green'] * 0.314655),
                Total: state.Total
            };

            buckets.forEach(function(name) {
                var portion = Math.round(stateAV[name] / state.Total * state.EV);

                for (var i = 0; i < portion; i++) {
                    $scope.countryECData_AV.push({
                        "x": test[_.findIndex(test, function(o) {return o.state == state.State})].x,
                        "y": test[_.findIndex(test, function(o) {return o.state == state.State})].y,
                        state: state.State,
                        party: name
                    });
                }
            });
        });
    });


    // get sections and their heights
    var contents = document.getElementsByClassName("content-text");
    $scope.contentHeights = [];
    for (var i = 0; i < contents.length; i++) {
        var rect = contents[i].getBoundingClientRect();
        $scope.contentHeights.push(Math.floor(rect.top));
    }

    // height checking function
    $scope.checkHeight = function(pos, indexStart, indexEnd) {
        var startCheck = pos > $scope.contentHeights[indexStart] - 20;
        var endCheck = pos < $scope.contentHeights[indexEnd] + 20;

        return startCheck && endCheck;
    };

    //From this link: http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
    $scope.CSVToArray = function( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }
});
