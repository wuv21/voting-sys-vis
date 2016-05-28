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

				    // each path is a state
				    // i loop thru the stateData and see if the bush won the EV or not
				    // if he won (aka his ev > 0, then i color it red)
				    // nebraska and maine were accounted for i think

				    svg.append("g")
				      .attr("class", "states-bundle")
				      .selectAll("path")
				      .data(data)
				      .enter()
				      .append("path")
				      .attr("d", path)
	  			      .style("fill", function(d) {
				      	for (var i = 0; i < stateData.length; i++) {
				      		if (names[d.id] == stateData[i].state) {
				      			if (stateData[i].ev_bush != 0) {
				      				return "#eaa";
				      			} else {
				      				return "#aae";
				      			}
				      		}
			      		}
				      })
				      .attr("stroke", "white"); // draws state boundaries
				      //.attr("class", "states")
				  });
	  			});
			});
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


    return my;
};
	