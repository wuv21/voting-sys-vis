var MapChart = function() {

    var width = 800,
		height = 500,
        fills = ['#467DA3', '#A34846'];

    function my(selection) {
    	selection.each(function(data) {
			var projection = d3.geo.albersUsa()
			    .scale(1000)
			    .translate([width / 2, height / 2]);

			var path = d3.geo.path()
			    .projection(projection);

			var svg = d3.select(this)
                .selectAll('.mapChart')
                .data(data, function(d) {return _.uniqueId(d.toString())});

            var svgEnter = svg.enter()
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'mapChart');

            svg.exit().remove();

			// each path is a state
			// i loop thru the stateData and see if the bush won the EV or not
			// if he won (aka his ev > 0, then i color it red)
			// nebraska and maine were accounted for i think

			// each data source is [topoData, stateData, names]
			var topoData = data[0][0];
			var stateData = data[0][1];
			var names = data[0][2];

			var paths = svgEnter.append("g")
				.attr("class", "states-bundle")
				.selectAll("path")
				.data(topoData, function(d) {return _.uniqueId(d.toString())});

            paths.enter()
				.append("path")
				.transition()
				.duration(function(d, i) {return i / topoData.length * 2000})
				.attr("d", path)
				.style("fill", function(d) {
					for (var i = 0; i < stateData.length; i++) {
						if (names[d.id] == stateData[i].state) {
							if (stateData[i].ev_bush != 0) {
								return fills[1];
							} else {
								return fills[0];
							}
						}
					}
				})
				.attr("stroke", "#EEE"); // draws state boundaries
			//.attr("class", "states")

            paths.exit().remove();

    	})
    }

    // change the map's width
    my.width = function(value) {
    	if(!arguments.length) return width;
		width = value;
		return my; // return the object to allow method chaining
    };

    // change the map's height
    my.height = function(value) {
	    if(!arguments.length) return height;
    	height = value;
    	return my; // return the object to allow method chaining
    };

    my.fills = function(value) {
        if(!arguments.length) return fills;
        fills = value;

        return my;
    };

    return my;
};
