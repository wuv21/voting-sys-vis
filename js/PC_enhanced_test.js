/**
 * Created by Vincent Wu on 6/4/2016.
 */
document.addEventListener('DOMContentLoaded', function() {
    var chart = PebbleEnhancedChart();
    var chartwrapper = d3.select('#vis').datum([1,2,3]).call(chart);

});
