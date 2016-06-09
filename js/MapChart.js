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
			var topoData = data[0].values[0];
			var stateData = data[0].values[1];
			var names = data[0].values[2];

			var paths = svgEnter.append("g")
				.attr("class", "states-bundle")
				.selectAll(".state-path")
				.data(topoData, function(d) {return _.uniqueId(d.toString())});

			paths.enter()
				.append("path")
				.attr('class', 'state-path')
				.style("fill", '#c6c6c6')
				.attr('stroke', '#c6c6c6')
				.transition()
				.duration(function(d, i) {return i / topoData.length * 2000})
				.attr("d", path)
				.style("fill", function(d, i) {
					for (var i = 0; i < stateData.length; i++) {
						if (names[d.id] == stateData[i].state) {
							if (stateData[i].ev_bush != 0) {
								return fills[1];
							} else {
								return fills[0];
							}
						}
					}

					// return !stateData[i].isNaN && stateData[i].ev_bush != 0 ?  fills[1] : fills[0];
				})
				.attr("title", function(d) {return names[d.id]})
				.attr("stroke", "#EEE"); // draws state boundaries
			//.attr("class", "states")

			var test = [];
			if (data[0].redraw) {
				svgEnter.selectAll("path")
					.data(topoData, function(d) {return _.uniqueId(d.toString())})
					.enter()
					.append("text")
					// .attr("width", function(d) {
					// 	return 5;
					// })
					// .attr("height", function(d) {
					// 	return 5;
					// })
					.style("fill", "#222")
					.attr("font-size", 12)
					.attr("x", function(d) {
						return path.centroid(d)[0] - 5;
					})
					.attr("y", function(d) {
						return path.centroid(d)[1] + 5;
					})
					.text(function(d) {
						for (var i = 0; i < stateData.length; i++) {
							if (names[d.id] == stateData[i].state) {
								return stateData[i].ev_bush != 0 ? stateData[i].ev_bush : stateData[i].ev_gore;
							}
						}
					});


				// svgEnter.selectAll("rect")
				// 	.transition()
				// 	.duration(5000)
				// 	.attr("x", width / 2)
				// 	.attr("y", height);
			}

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


			// console.log(data[0].redraw);
			// if (data[0].redraw) {
			// 	console.log("woo");
			// 	svg.selectAll("rect")
			// 		.transition()
			// 		.duration(500)
			// 		.append("rect")
			// 		.attr("x", function(d) {return 0;})
			// 		.attr("y", function(d) {return 0;});
			// }

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