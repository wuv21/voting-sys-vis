// inspired by waffle charts (https://gist.github.com/XavierGimenez/8070956)

function PebbleChart() {
    var squareSize = 6,
        squareMargin = 3,
        squareCols = 4,
        colors = ['red', 'blue'];

    var width = 450,
        height = 400;

    var margin = {left:10, top:10, bottom:10, right:10};

    function my(selection) {
        selection.each(function(data) {
            var buckets = _.uniqBy(data[0], function(x) {return x.bucket})
                .map(function(x) {return x.bucket})
                .sort();

            var xScale = d3.scale.linear().domain([1, buckets.length + 1]).range([margin.left, width - margin.right]);
            var rowScale = d3.scale.linear().domain([0, squareCols - 1]).range([0, squareSize*squareCols + ((squareCols - 1) * squareMargin)]);
            var colorScale = d3.scale.linear().domain([1, buckets.length + 1]).range(colors);

            var counters = [];
            for (var i = 0; i < buckets.length; i++) {
                counters.push({
                    xCounter: 0,
                    yCounter: 0,
                    hCounter: 0
                });
            }

            var svg = d3.select(this).selectAll('.pebbleCharts')
                .data(data, function(d) {return d.length});

            var svgEnter = svg.enter()
                .append('svg')
                .attr('class', '.pebbleCharts')
                .attr('width', width)
                .attr('height', height);

            svg.exit().remove();

            var pebbles = svgEnter.selectAll('.pebble').data(data[0]);

            pebbles.enter()
                .append("rect")
                .attr("class", ".pebble")
                .attr("width", squareSize)
                .attr("height", squareSize)
                .style("fill", function(d) {return colorScale(d.bucket)})
                .attr("x", function(d) {return xScale(d.bucket)})
                .attr("y", 0)
                .attr("title", function(x, i) {return x.bucket + '-' + i})
                .on('mouseover', function(d) {
                    d3.select(this)
                        .style('fill', 'cyan');
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', function(d) {return colorScale(d.bucket)});
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

            pebbles.exit().remove();
        })
    }

    my.width = function(val) {
        if (!arguments.length) return width;

        width = val;
        return my;
    };

    my.height = function(val) {
        if (!arguments.length) return height;

        height = val;
        return my;
    };

    my.squareSize = function(val) {
        if (!arguments.length) return squareSize;

        squareSize = val;
        return my;
    };

    my.squareMargin = function(val) {
        if (!arguments.length) return squareMargin;

        squareMargin = val;
        return my;
    };

    my.squareCols = function(val) {
        if (!arguments.length) return squareCols;

        squareCols = val;
        return my;
    };

    my.colors = function(val) {
        if (!arguments.length) return colors;

        colors = val;
        return my;
    };

    return my;
}