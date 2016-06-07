// inspired by waffle charts (https://gist.github.com/XavierGimenez/8070956)

function PebbleEnhancedChart() {
    var squareSize = 6,
        squareMargin = 5,
        squareCols = 7,
        color = d3.scale.category20(),
        transitionDelay = 6000;

    var width = 800,
        height = 400;

    var margin = {left:10, top:10, bottom:20, right:10};

    function my(selection) {
        selection.each(function(data) {
            var resp = data[0].values;

            var buckets = _.uniqBy(resp, function(x) {return x.party})
                .map(function(x) {return x.party})
                .sort();

            var xScale = d3.scale.ordinal().domain(buckets).rangeBands([margin.left, width - margin.right], 0);
            var rowScale = d3.scale.linear().domain([0, squareCols - 1]).range([0, squareSize*squareCols + ((squareCols - 1) * squareMargin)]);

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

            var xAxisLabel = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.top - margin.bottom) + ')');

            var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
            xAxisLabel.transition().duration(400).call(xAxis);

            svg.exit().remove();

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
                .transition()
                .duration(function(d, i) {return i / data[0].topodata.length * 2000})
                .attr("d", path)
                .style("fill", "#EEE")
                .attr("stroke", "#EEE");


            var pebbles = svgEnter.selectAll('.pebbleEnhanced').data(resp);

            pebbles.enter()
                .append("rect")
                .attr("class", "pebbleEnhanced")
                .attr("width", squareSize)
                .attr("height", squareSize)
                .style("fill", function(d) {return color(d.state)})
                .attr("x", function(d) {return d.x})
                .attr("y", function(d) {return d.y})
                .attr("title", function(x, i) {return x.party + '-' + i})
                .on('mouseover', function(d) {
                    d3.select(this)
                        .style('fill', 'cyan');
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', function(d) {return color(d.name)});
                })
                .append("rect:title")
                .text(function(d, i) {return d.state});


            pebbles.exit().remove();
            // paths.transition().delay(6000).remove();

            pebbles.transition()
                .delay(1000)
                .duration(function(d, i) {return i / resp.length * transitionDelay;})
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
                .attr('x', margin.left)
                .attr('y', 0)
                .attr('font-size', 14)
                .fill("#CCC");

            // var yScale = d3.scale.linear().domain([height - margin.bottom - 5, 0]).rangeBands([0, resp.length /2]);

            svgEnter.on("mousemove", function() {
                d3.select('#pebbleECHover')
                    .attr('transform', 'translate(' + margin.left + ', ' + d3.mouse(this)[1] + ')');

                d3.select('#hoverText')
                    .text(d3.mouse(this)[1]);
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