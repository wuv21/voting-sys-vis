// pebble chart inspired by waffle charts (https://gist.github.com/XavierGimenez/8070956)
// hover bar inspired by https://bl.ocks.org/mbostock/3902569

function PebbleEnhancedChart() {
    var squareSize = 6,
        squareMargin = 5,
        squareCols = 7,
        color = d3.scale.category20(),
        fills = ['#467DA3', '#5CAE5A', '#D6C171', '#A34846'],
        transitionDelay = 6000;

    var width = 800,
        height = 400;

    var margin = {left:10, top:10, bottom:20, right:10};

    function my(selection) {
        selection.each(function(data) {
            var resp = data[0].values;

            // var buckets = _.uniqBy(resp, function(x) {return x.party})
            //     .map(function(x) {return x.party})
            //     .sort();

            var buckets = ["Democrat", "Green", "Independent", "Republican"];

            var xScale = d3.scale.ordinal().domain(buckets).rangeBands([margin.left, width - margin.right], 0);
            var rowScale = d3.scale.linear().domain([0, squareCols - 1]).range([0, squareSize*squareCols + ((squareCols - 1) * squareMargin)]);
            var colorScale = d3.scale.ordinal().domain(buckets).range(fills);

            var counters = [];
            for (var i = 0; i < buckets.length; i++) {
                counters.push({
                    xCounter: 0,
                    yCounter: 0,
                    hCounter: 0
                });
            }

            var svg = d3.select(this)
                .selectAll('.pebbleEnhancedCharts')
                .data(data, function(d) {return d.id});

            var svgEnter = svg.enter()
                .append('svg')
                .attr('class', 'pebbleEnhancedCharts')
                .attr('width', width)
                .attr('height', height);


            var projection = d3.geo.albersUsa()
                .scale(1000)
                .translate([width / 2, height / 2]);

            var path = d3.geo.path()
                .projection(projection);

            var paths = svgEnter.append("g")
                .attr("class", "states-bundle")
                .selectAll(".state-path")
                .data(data[0].topodata, function(d) {return _.uniqueId(d.toString())});

            paths.enter()
                .append("path")
                .attr('class', 'state-path')
                .style("fill", '#c6c6c6')
                .attr('stroke', '#c6c6c6')
                .transition()
                .duration(function(d, i) {return i / data[0].topodata.length * 2000})
                .attr("d", path)
                .style("fill", "#EEE")
                .attr("stroke", "#EEE");

            var xAxisLabel = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.top - margin.bottom) + ')');

            var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            xAxisLabel.transition().duration(400).call(xAxis);

            svg.exit().remove();

            var g = svgEnter.append('g')
                .attr('id', 'pebbleECHover')
                .attr('width', width - margin.left)
                .attr('height', 5);

            g.append('line')
                .attr('x1', margin.left)
                .attr('x2', width - margin.left)
                .attr('y1', 0)
                .attr('y2', 0)
                .style('stroke-width', 2)
                .style('stroke', '#CCC');

            g.append('text')
                .attr('id', 'hoverText')
                .attr('x', (width - margin.left) / 2 - 5)
                .attr('y', 0)
                .attr('font-size', 14)
                .fill("#CCC");


            var pebbles = svgEnter.selectAll('.pebbleEnhanced').data(resp);

            pebbles.enter()
                .append("rect")
                .attr("class", "pebbleEnhanced")
                .attr("width", squareSize)
                .attr("height", squareSize)
                .style("fill", function(d) {return colorScale(d.party)})
                .attr("x", function(d) {return d.x})
                .attr("y", function(d) {return d.y})
                .attr("title", function(x, i) {return x.party + '-' + i})
                .on('mouseover', function(d) {
                    d3.select(this)
                        .style('fill', '#AAA');

                    d3.select('#hoverText')
                        .text(d.state);
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', function(d) {return colorScale(d.party)});
                    d3.select('#hoverText')
                        .text('');
                });

            pebbles.exit().remove();
            // paths.transition().delay(6000).remove();

            pebbles.transition()
                .delay(1000)
                .duration(function(d, i) {return i / resp.length * transitionDelay;})
                .style("fill", function(d) {return colorScale(d.party)})
                .attr("x", function(d) {
                    var index = buckets.indexOf(d.party);

                    counters[index].xCounter++;
                    var adjustment = xScale.rangeBand() / 2 - (squareSize * squareCols + squareMargin * (squareCols - 1)) / 2;

                    return margin.left + xScale(d.party) + adjustment + rowScale((counters[index].xCounter - 1) % squareCols);
                })
                .attr("y", function(d) {
                    var index = buckets.indexOf(d.party);
                    counters[index].yCounter++;

                    if ((counters[index].yCounter - 1) % squareCols == 0) {
                        counters[index].hCounter++;
                    }

                    return (height - margin.bottom -margin.top) - (counters[index].hCounter * (squareMargin + squareSize));
                });

            pebbles.exit().transition().duration(function(d, i) {return i/resp.length * transitionDelay}).remove();



            // var yScale = d3.scale.linear().domain([height - margin.bottom - 5, 0]).rangeBands([0, resp.length /2]);

            svgEnter.on("mousemove", function() {
                var mousePos = d3.mouse(this);

                if (mousePos[1] < height - margin.bottom) {
                    d3.select('#pebbleECHover')
                        .attr('transform', 'translate(' + margin.left + ', ' + d3.mouse(this)[1] + ')');
                } else {
                    d3.select('#pebbleECHover')
                        .attr('transform', 'translate(' + margin.left + ', ' + (height - margin.bottom)+ ')');
                }


            });
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

    my.transitionDelay = function(val) {
        if (!arguments.length) return transitionDelay;

        transitionDelay = val;
        return my;
    };

    return my;
}
