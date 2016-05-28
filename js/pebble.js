/**
 * Created by Vincent Wu on 5/26/2016.
 */

document.addEventListener('DOMContentLoaded', function() {
    var testData = [];
    var names = ["a" , "b", "c"];
    var buckets = [1, 2, 3, 4];

    for (var i = 1; i < 600; i++) {
        var namesIndex = Math.floor(Math.random() * names.length);
        var bucketsIndex = Math.floor(Math.random() * buckets.length);

        testData.push({
            name: names[namesIndex],
            bucket: buckets[bucketsIndex],
            value: i
        });
    }

    var squareSize = 6,
        squareMargin = 3,
        squareCols = 4;

    var width = 450,
        height = 400;


    var margin = {left:10, top:10, bottom:10, right:10};

    var xScale = d3.scale.linear().domain([1, buckets.length + 1]).range([margin.left, width - margin.right]);
    var rowScale = d3.scale.linear().domain([0, squareCols - 1]).range([0, squareSize*squareCols + ((squareCols - 1) * squareMargin)]);



    var counters = [];
    for (var i = 0; i < buckets.length; i++) {
        counters.push({
            xCounter: 0,
            yCounter: 0,
            hCounter: 0
        });
    }

    var svg = d3.select('#vis')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    var xAxisLabel = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')');

    // var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    // xAxisLabel.call(xAxis);

    var pebbles = svg.selectAll('.pebble').data(testData);

    pebbles.enter()
        .append("rect")
        .attr("class", "pebble")
        .attr("width", squareSize)
        .attr("height", squareSize)
        .style("fill", "#ccf")
        .attr("x", function(d) {return xScale(d.bucket)})
        .attr("y", 0)
        .attr("title", function(x, i) {return x.bucket + '-' + i})
        .on('mouseover', function(d) {
            console.log('here');
            d3.select(this)
                .style('fill', '#cfc');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .style('fill', '#ccf');
        });

    pebbles.exit().remove();

    pebbles.transition()
        .duration(250)
        .attr("x", function(d) {
            var index = buckets.indexOf(d.bucket);

            counters[index].xCounter++;
            return margin.left + xScale(d.bucket) + rowScale((counters[index].xCounter - 1) % squareCols);
        })
        .attr("y", function(d) {
            var index = buckets.indexOf(d.bucket);
            counters[index].yCounter++;

            if ((counters[index].yCounter - 1) % squareCols == 0) {
                counters[index].hCounter++;
            }

            return (height - margin.bottom) - (counters[index].hCounter * (squareMargin + squareSize));
        });

});