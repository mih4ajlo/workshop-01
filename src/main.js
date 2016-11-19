$(function() {

    var DEFAULTS = {
        tick_count: 10,
        x_tick_count: 16,

        top_circle_radius: 6,

        brush_height: 200,

        graph_width: 800,
        graph_height: 500,
        legend_width:100,
        brush_height:50
    };

    var margin = { top: 20, right: 20, bottom: 50, left: 60 },
        width = DEFAULTS.graph_width - margin.left - margin.right,
        height = DEFAULTS.graph_height - margin.top - margin.bottom;


    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right + DEFAULTS.legend_width)
        .attr("height", height + margin.top + margin.bottom + DEFAULTS.brush_height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



    var x = d3.scaleLinear()
        .range([0, width]).nice();

    var y = d3.scaleLinear()
        .range([height, 0]).nice();


    var xCat = "DaysTD",
        yCat = "AgeAD",
        xCatCol = "case_days_to_death",
        yCatCol = "case_age_at_diagnosis",
        rCat = "Protein (g)",
        colorCat = "Manufacturer";


    d3.tsv("../tcga-cases.tsv", function(data) {

      console.log(data);

    // case_age_at_diagnosis  case_days_to_death\


      data.forEach(function(d) {
            d.ageAD = +d.case_age_at_diagnosis;
            d.daysTD = +d.case_days_to_death;
        });

        var xMax = d3.max(data, function(d) {
                return d[xCatCol]; }) * 1.05,
            xMin = d3.min(data, function(d) {
                return d[xCatCol]; }),
            xMin = xMin > 0 ? 0 : xMin,
            yMax = d3.max(data, function(d) {
                return d[yCatCol]; }) * 1.05,
            yMin = d3.min(data, function(d) {
                return d[yCatCol]; }),
            yMin = yMin > 0 ? 0 : yMin;

        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);

       /* var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);*/

         /* d3.select(".axis")
              .call(d3.axisBottom(x));*/

        /*var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width);*/

           /* d3.select(".axis")
              .call(d3.axisLeft(y));*/

        var color =  d3.scaleOrdinal(d3.schemeCategory10);
        //d3.schemeCategory10();

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                return xCatCol + ": " + d[xCatCol] + "<br>" + yCatCol + ": " + d[yCatCol];
            });

        /*var zoomBeh = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0, 500])
            .on("zoom", zoom);

        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomBeh);*/

        svg.call(tip);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .classed("label", true)
            .attr("x", width)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "end")
            .text(xCat);

        svg.append("g")
            .classed("y axis", true)
             .call(d3.axisLeft(x))
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
            .attr("r", function(d) {
                return 2 /*Math.sqrt(d[rCat] / Math.PI)*/; })
            .attr("transform", transform)
            .style("fill", function(d) {
                return color(d[colorCat]); })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .classed("legend", true)
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")"; });

        legend.append("circle")
            .attr("r", 3.5)
            .attr("cx", width + 20)
            .attr("fill", color);

        legend.append("text")
            .attr("x", width + 26)
            .attr("dy", ".35em")
            .text(function(d) {
                return d; });


         function transform(d) {
            return "translate(" + x(+d[xCatCol]) + "," + y(+d[yCatCol]) + ")";
          }     




    });









})
