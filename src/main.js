$(function () {

    var DEFAULTS = {
        tick_count: 10,
        x_tick_count: 16,

        top_circle_radius: 6,

        brush_height: 200,

        graph_width: 800,
        graph_height: 500
    };

    var margin = {top: 20, right: 20, bottom: 50, left: 60},
        width = DEFAULTS.graph_width - margin.left - margin.right,
        height = DEFAULTS.graph_height - margin.top - margin.bottom;


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select(".scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // GO GO GO :)
	
	
	
	
	
	
	
	
	/*
	var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;
	*/
	outerWidth = DEFAULTS.graph_width;
	outerHeight = DEFAULTS.graph_height;

	var x = d3.scaleLinear()
		.range([0, width]).nice();

	var y = d3.scaleLinear()
		.range([height, 0]).nice();

	var xCat = "case_days_to_death",
		yCat = "case_age_at_diagnosis";
		//rCat = "Protein (g)",
		//colorCat = "Manufacturer";

	d3.tsv("../tcga-cases.tsv", function(data) {
		/*
	  data.forEach(function(d) {
		d.Calories = +d.Calories;
		d.Carbs = +d.Carbs;
		d["Cups per Serving"] = +d["Cups per Serving"];
		d["Dietary Fiber"] = +d["Dietary Fiber"];
		d["Display Shelf"] = +d["Display Shelf"];
		d.Fat = +d.Fat;
		d.Potassium = +d.Potassium;
		d["Protein (g)"] = +d["Protein (g)"];
		d["Serving Size Weight"] = +d["Serving Size Weight"];
		d.Sodium = +d.Sodium;
		d.Sugars = +d.Sugars;
		d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];
	  });
	  */

	  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
		  xMin = d3.min(data, function(d) { return d[xCat]; }),
		  xMin = xMin > 0 ? 0 : xMin,
		  yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
		  yMin = d3.min(data, function(d) { return d[yCat]; }),
		  yMin = yMin > 0 ? 0 : yMin;

	  x.domain([xMin, xMax]);
	  y.domain([yMin, yMax]);

		/*
	  var xAxis = d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .tickSize(-height);
		  
		 var yAxis = d3.svg.axis()
		  .scale(y)
		  .orient("left")
		  .tickSize(-width);
		  */
		
	var xAxis = d3.axisBottom(x);
		
	var yAxis = d3.axisLeft(y);

	  

	  var color =  d3.scaleOrdinal(d3.schemeCategory10);

	  var tip = d3.tip()
		  .attr("class", "d3-tip")
		  .offset([-10, 0])
		  .html(function(d) {
			return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
		  });

		
		/*
	  var zoomBeh = d3.behavior.zoom()
		  .x(x)
		  .y(y)
		  .scaleExtent([0, 500])
		  .on("zoom", zoom);
		  
		
	  var svg = d3.select("#scatter")
		.append("svg")
		  .attr("width", outerWidth)
		  .attr("height", outerHeight);
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .call(zoomBeh);
		  */
		  

	  svg.call(tip);

	  svg.append("rect")
		  .attr("width", width)
		  .attr("height", height);

	  svg.append("g")
		  .classed("x axis", true)
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .classed("label", true)
		  .attr("x", width)
		  .attr("y", margin.bottom - 10)
		  .style("text-anchor", "end")
		  .text(xCat);

	  svg.append("g")
		  .classed("y axis", true)
		  .call(yAxis)
		.append("text")
		  .classed("label", true)
		  .attr("transform", "rotate(-90)")
		  .attr("y", -margin.left)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(yCat);

	  var objects = svg.append("svg")
		  .classed("objects", true)
		  .attr("width", width)
		  .attr("height", height);

	  objects.append("svg:line")
		  .classed("axisLine hAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", width)
		  .attr("y2", 0)
		  .attr("transform", "translate(0," + height + ")");

	  objects.append("svg:line")
		  .classed("axisLine vAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", 0)
		  .attr("y2", height);

	
	  objects.selectAll(".dot")
		  .data(data)
		.enter().append("circle")
		  .classed("dot", true)
		  .attr("r", function (d) {
		  	//return 6 * Math.sqrt(d[rCat] / Math.PI);
		  return 4;
	  		})
		  .attr("transform", transform)
		  .style("fill", function(d) {
		  	//return color(d[colorCat]);
		  	return "#fff";
	  		})
		  .on("mouseover", tip.show)
		  .on("mouseout", tip.hide);

	  var legend = svg.selectAll(".legend")
		  .data(color.domain())
		.enter().append("g")
		  .classed("legend", true)
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("circle")
		  .attr("r", 3.5)
		  .attr("cx", width + 20)
		  .attr("fill", color);

	  legend.append("text")
		  .attr("x", width + 26)
		  .attr("dy", ".35em")
		  .text(function(d) { return d; });

		
		/*
	  d3.select("input").on("click", change);

	  function change() {
		xCat = "Carbs";
		xMax = d3.max(data, function(d) { return d[xCat]; });
		xMin = d3.min(data, function(d) { return d[xCat]; });

		zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

		var svg = d3.select("#scatter").transition();

		svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

		objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
	  }

	  function zoom() {
		svg.select(".x.axis").call(xAxis);
		svg.select(".y.axis").call(yAxis);

		svg.selectAll(".dot")
			.attr("transform", transform);
	  }
	  */

	  function transform(d) {
		return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
	  }
	  

	});
































	

})
