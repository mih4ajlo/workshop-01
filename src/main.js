$(function() {

    var DEFAULTS = {
        tick_count: 10,
        x_tick_count: 16,

        top_circle_radius: 6,

        brush_height: 100,

        graph_width: 800,
        graph_height: 500,
        legend_width: 100
    };

    var margin = { top: 20, right: 20, bottom: 50, left: 60 },
        width = DEFAULTS.graph_width - margin.left - margin.right,
        height = DEFAULTS.graph_height - margin.top - margin.bottom,
        margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
        height2 = DEFAULTS.brush_height;



    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right + DEFAULTS.legend_width)
        .attr("height", height + margin.top + margin.bottom )
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var legendSvg = d3.select(".legend-wrapper").append("svg")
        .attr("width", 300)
        .attr("height", height + margin.top + margin.bottom + DEFAULTS.brush_height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var brushSvg = d3.select(".scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right + DEFAULTS.legend_width)
        .attr("height", height2)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var context = brushSvg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    var x = d3.scaleLinear()
        .range([0, width]).nice();

    var y = d3.scaleLinear()
        .range([height, 0]).nice();


    var x2 = d3.scaleLinear()
        .range([0, width]).nice();
    var y2 = d3.scaleLinear().range([height2, 0]);

    var brush = brushSvg;

    //height = height + 120;

    brush.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(d3.axisBottom(x2)
            .ticks(DEFAULTS.x_tick_count));

    brush.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(d3.axisBottom(x2));

    brush.append("g")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([
                [0, -50],
                [width, 0]
            ])
            .on("end", brushended));




    var xCat = "DaysTD",
        yCat = "AgeAD",
        xCatCol = "case_days_to_death",
        yCatCol = "case_age_at_diagnosis",
        rCat = "Protein (g)",
        colorCat = "case_pathologic_stage";



    var xAxis2 = d3.axisBottom(x2);
    var xAxis = d3.axisBottom(x);

    // selektovati ko 


    d3.tsv("../tcga-cases.tsv", function(data) {

        // case_age_at_diagnosis  case_days_to_death\

        data.forEach(function(d) {
            d.ageAD = +d.case_age_at_diagnosis;
            d.daysTD = +d.case_days_to_death;
        });



        x.domain(d3.extent(data, function(d) {
            return d.case_days_to_death | 0;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.case_age_at_diagnosis | 0;
        })]);

        x2.domain(x.domain());
        y2.domain(y.domain());



        var color = d3.scaleOrdinal(d3.schemeCategory20);
        //d3.schemeCategory10();

        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                return xCat + ": " + d[xCatCol] + "<br>" + yCat + ": " + d[yCatCol];
            });



        svg.call(tip);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);
        //.on("click", change);

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
            .call(d3.axisLeft(y))
            .append("text")
            .classed("label", true)
            //.attr("transform", "rotate(-180deg)")
            .attr("y", margin.left)
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


        var symbol = d3.symbol();

        var DOT_SHAPE = symbol.type(function(d) {

            if (d.case_gender === 'MALE') {
                return d3.symbolTriangle;
            }

            return d3.symbolCircle;

        });




        context.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        /*context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());*/

        objects.selectAll(".dot")
            .data(data)
            .enter().append("path")
            .classed("dot", true)
            .attr('d', DOT_SHAPE)
            .attr("r", function(d) {
                return 2 /*Math.sqrt(d[rCat] / Math.PI)*/ ;
            })
            .attr("transform", transform)
            .style("fill", function(d) {
                return "none";
            })
            .style("stroke", function(d) {
                return color(d[colorCat]);
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);



        var legend = legendSvg
            .selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .classed("legend", true)
            .attr("transform", function(d, i) {
                return "translate(-20," + i * 20 + ")";
            });

        legend
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", 20)
            .attr("fill", color)

        legend
            .append("text")
            .attr("x", 26)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.case_pathologic_stage;
            });


        function transform(d) {
            return "translate(" + x(+d[xCatCol]) + "," + y(+d[yCatCol]) + ")";
        }






    });


    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        svg.select(".area").attr("d", area);
        svg.select(".x.axis").call(xAxis);
        brushSvg.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function brushended() {
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));

        svg.selectAll(".dot")
            .attr("transform", function(d) {
                var _x = x(d.case_days_to_death),
                    _y = y(d.case_age_at_diagnosis);

                return "translate(" + _x + "," + _y + ")";
            });
    }





})
