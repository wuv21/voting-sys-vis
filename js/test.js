/**
 * Created by Vincent Wu on 5/27/2016.
 */

document.addEventListener('DOMContentLoaded', function() {
    var testData = [];
    var names = ["a" , "b", "c"];
    var buckets = [1, 2, 3, 4];

    function generateData(n) {
        var test = [];

        for (var i = 1; i < n; i++) {
            var namesIndex = Math.floor(Math.random() * names.length);
            var bucketsIndex = Math.floor(Math.random() * buckets.length);

            test.push({
                name: names[namesIndex],
                bucket: buckets[bucketsIndex],
                value: i
            });
        }

        return test;
    }

    testData = generateData(500);
    
    var myChart = PebbleChart();
    var chartWrapper = d3.select('#vis').datum([testData]).call(myChart);


    d3.json("data/map/us.json", function(error, us) {
        d3.csv("data/map/2000_final.csv", function(stateData) {
            if (error) throw error;
            var data = topojson.feature(us, us.objects.states).features;
            d3.tsv("data/map/us-state-names.tsv", function(tsv){
                // attach id to proper state
                var names = {};
                tsv.forEach(function(d,i){
                    // e.g. 1 = AL (Alabama)
                    names[d.id] = d.code;
                });
                
                var myMapChart = MapChart().width(800).height(500);
                var mapChartWrapper = d3.select('#vis-map').datum([data, stateData, names]).call(myMapChart);

            });
        });
    });



    document.getElementById('btn-update').addEventListener('click', function() {
        console.log('here');
        buckets = ['sample 1', 'sample 2', 'sample 3'];
        myChart.colors(['blue', 'green']);
        testData = generateData(300);
        chartWrapper.datum([testData]).call(myChart);
    });

});

