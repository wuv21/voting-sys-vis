var MapChart = function() {

    var width, height;
    

    function my(selection) {
    	selection.each(function(data) {
			var projection = d3.geo.albersUsa()
			    .scale(1000)
			    .translate([width / 2, height / 2]);

			var path = d3.geo.path()
			    .projection(projection);

			var svg = d3.select(this).append("svg")
			    .attr("width", width)
			    .attr("height", height);

			// each path is a state
			// i loop thru the stateData and see if the bush won the EV or not
			// if he won (aka his ev > 0, then i color it red)
			// nebraska and maine were accounted for i think

			// each data source is [topoData, stateData, names]
			var topoData = data[0][0];
			var stateData = data[0][1];
			var names = data[0][2];
			var redraw = data[0][3];

			svg.append("g")
				.attr("class", "states-bundle")
				.selectAll("path")
				.data(topoData, function(d) {return _.uniqueId(d.toString())})
				.enter()
				.append("path")
				.attr("d", path)
				.style("fill", function(d) {
					for (var i = 0; i < stateData.length; i++) {
						if (names[d.id] == stateData[i].state) {
							if (stateData[i].ev_bush != 0) {
								return "#A34846";
							} else {
								return "#467DA3";
							}
						}
					}
				})
				.attr("stroke", "white"); // draws state boundaries

			svg.selectAll("path")
				.data(topoData, function(d) {return _.uniqueId(d.toString())})
				.enter()
				.append("rect")
				.attr("width", function(d) {
					return getEv(d);
				})	
				.attr("height", function(d) {
					return getEv(d);
				})	
				.style("fill", "purple")
				.attr("x", function(d) {
					return path.centroid(d)[0] - getEv(d) / 2;
				})
				.attr("y", function(d) {
					return path.centroid(d)[1] - getEv(d) / 2;
				});


			function getEv(d) {
				for (var i = 0; i < stateData.length; i++) {
					if (names[d.id] == stateData[i].state) {
						if (stateData[i].ev_bush != 0) {
							return stateData[i].ev_bush;
						} else {
							return stateData[i].ev_gore;
						}
					}
				}
			}

			//do the transition by moving rects down
			if (redraw) {
				console.log("woo");
				svg.selectAll("rect")
					.transition()
					.duration(500)
					.attr("x", function(d) {return 0;})
					.attr("y", function(d) {return 0;});
			}

			//.attr("class", "states")

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

    my.redraw = function(value) {
    	if (!arguments.length) return redraw;
    	redraw = valuel
    	return my;
    }


    return my;
};