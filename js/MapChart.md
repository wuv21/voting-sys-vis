# MapChart Documentation/API

![MapChart Example](../img/colorless_mapchart.png)

## General Notes
This chart requires a TopoJSON file in order to be used. In our example we created the United States map with [this TopoJSON file](../data/map/us.json).

-- say something about data join stuff and how to call the chart? and other required info (MapChart.datum([]))



##  MapChart Functions

\# MapChart().width(n)
> Sets MapChart's width to n. Default is 800.

\# MapChart().height(n)
> Sets MapChart's height to n. Default is 500.

\# MapChart().fills([color1, color2, ...])
> Sets the possible colors for the map. Pass in an array of colors (accepts in hexadecimal or string).