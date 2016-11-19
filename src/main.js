$(function () {

	var DEFAULTS = {
		tick_count: 10,
		x_tick_count: 16,

		top_circle_radius: 6,

		brush_height: 200,

		graph_width: 800,
		graph_height: 500
	};

	var margin = {
			top: 20,
			right: 20,
			bottom: 50,
			left: 60
		},
		width = DEFAULTS.graph_width - margin.left - margin.right,
		height = DEFAULTS.graph_height - margin.top - margin.bottom,
		height2 = 100;


	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select(".scatter-plot").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom + height2)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "focus");
		
	var context = d3.select(".scatter-plot svg")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + (height + margin.top + 30) + ")")
		.attr("class", "context");


	// GO GO GO :)



	var x = d3.scaleLinear().range([0, width]),
		x2 = d3.scaleLinear().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		y2 = d3.scaleLinear().range([height2, 0]);

	var xAxis = d3.axisBottom(x),
		xAxis2 = d3.axisBottom(x2),
		yAxis = d3.axisLeft(y);




	var xCat = "case_days_to_death",
		yCat = "case_age_at_diagnosis",
		colorCat = "case_pathologic_stage";


	d3.tsv("../tcga-cases.tsv", function (data) {

		x.domain(d3.extent(data, function (d) {
			return d.case_days_to_death | 0;
		}));
		y.domain([0, d3.max(data, function (d) {
			return d.case_age_at_diagnosis | 0;
		})]);
		x2.domain(d3.extent(data, function (d) {
			return d.case_days_to_death | 0;
		}));


		var color = d3.scaleOrdinal(d3.schemeCategory10);

		var tip = d3.tip()
			.attr("class", "d3-tip")
			.offset([-10, 0])
			.html(function (d) {
				return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
			});

		var symbol = d3.symbol();

		var DOT_SHAPE = symbol.type(function (d) {

			if (d.case_gender === 'MALE') {
				return d3.symbolTriangle;
			}

			return d3.symbolCircle;

		});


		svg.call(tip);

		svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "#fff");

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
			.enter().append("path")
			.classed("dot", true)
			.attr("transform", transform)
			.attr('d', DOT_SHAPE)
			.style("stroke", function (d) {
				return color(d[colorCat]);
			})
			.style("fill", "none")
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide);
		
		
		
		context.append("rect")
			.attr("width", width)
			.attr("height", height2)
			.attr("fill", "#fff");
		
		context.append("g")
			.classed("x2 axis", true)
			.attr("transform", "translate(0," + height2 + ")")
			.call(xAxis2)
			.append("text")
			.classed("label", true)
			.attr("x", width)
			.attr("y", margin.bottom - 10)
			.style("text-anchor", "end")
			.text(xCat);
		
		var brush = d3.brushX()
			.extent([[0, 0], [width, height2]])
			.on("brush end", brushed);
		
		context.append("g")
			.attr("class", "brush")
			.call(brush)
			.call(brush.move, x.range());





		/*
		

		var legend = svg.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
			.classed("legend", true)
			.attr("transform", function (d, i) {
				return "translate(0," + i * 20 + ")";
			});

		legend.append("circle")
			.attr("r", 3.5)
			.attr("cx", width + 20)
			.attr("fill", color);

		legend.append("text")
			.attr("x", width + 26)
			.attr("dy", ".35em")
			.text(function (d) {
				return d;
			});
				
				
		*/








		function transform(d) {
			return "translate(" + x(d.case_days_to_death) + "," + y(d.case_age_at_diagnosis) + ")";
		}


		function brushed() {
			var s = d3.event.selection || x2.range();
			x.domain(s.map(x2.invert, x2));
			
			svg.selectAll(".dot")
				.attr("transform", function(d){
					var _x = x(d.case_days_to_death),
						_y = y(d.case_age_at_diagnosis);
				
					return "translate(" + _x + "," + _y + ")";
			});
		}

		function type(d) {
			d.date = parseDate(d.date);
			d.price = +d.price;
			return d;
		}






	});

});