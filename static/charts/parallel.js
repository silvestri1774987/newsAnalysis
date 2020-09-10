function parallel() {
	var margin = { top: 30, right: 10, bottom: 10, left: 10 },
		width = 600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var x = d3v3.scale.ordinal().rangePoints([0, width], 1),
		y = {},
		dragging = {};

	var line = d3v3.svg.line(),
		axis = d3v3.svg.axis().orient("left"),
		background,
		foreground;

	var svg = d3v3.select("#parallel")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3v3.csv("pca.csv", function (error, articles) {

		// Extract the list of dimensions and create a scale for each.
		//console.log(articles[0])
		x.domain(dimensions = d3v3.keys(articles[0]).filter(function (d) {

			return d != "url" && d != "target" && d != "X1" && d != "X2" && d != "X3" && d != "X4" && d != "X5" && d != "X6" && d != "numWords" && d != "numMedia" && d != "successful" && (y[d] = d3v3.scale.linear()
				.domain(d3v3.extent(articles, function (p) { return +p[d]; }))
				.range([height, 0]));
		}));

		// Add grey background lines for context.
		background = svg.append("g")
			.attr("class", "background")
			.selectAll("path")
			.data(articles)
			.enter().append("path")
			.attr("d", path);

		// Add blue foreground lines for focus.
		foreground = svg.append("g")
			.attr("id", "foregroundpaths")
			.attr("class", "foreground")
			.selectAll("path")
			.data(articles)
			.enter().append("path")
			.attr("d", path)
			.style("stroke", function (d) {
				if (d['target'] == "1") {
					return "#F88017";
				} else {
					return "#008000"//GREEN
				}
			})


		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function (d) { return "translate(" + x(d) + ")"; })
			.call(d3v3.behavior.drag()
				.origin(function (d) { return { x: x(d) }; })
				.on("dragstart", function (d) {
					dragging[d] = x(d);
					background.attr("visibility", "hidden");
				})
				.on("drag", function (d) {
					dragging[d] = Math.min(width, Math.max(0, d3v3.event.x));
					foreground.attr("d", path);
					dimensions.sort(function (a, b) { return position(a) - position(b); });
					x.domain(dimensions);
					g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
				})
				.on("dragend", function (d) {
					delete dragging[d];
					transition(d3v3.select(this)).attr("transform", "translate(" + x(d) + ")");
					transition(foreground).attr("d", path);
					background
						.attr("d", path)
						.transition()
						.delay(500)
						.duration(0)
						.attr("visibility", null);
				}));

		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function (d) { d3v3.select(this).call(axis.scale(y[d])); })
			.append("text")
			.style("text-anchor", "middle")
			.style("font-size", "13px")
			.attr("y", -9)
			.text(function (d) { return d; });

		// Add and store a brush for each axis.
		g.append("g")
			.attr("class", "brush")
			.each(function (d) {
				d3v3.select(this).call(y[d].brush = d3v3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
			})
			.selectAll("rect")
			.attr("x", -8)
			.attr("width", 16);




		g.append("rect")
			.attr("id", "reset_rect_parallel")
			.attr("x", width - 70)
			.attr("y", 180)
			.attr("width", 12)
			.attr("height", 12)
			.style("fill","red")
			.on("click", function () {
				var paths = d3.select("#foregroundpaths").selectAll("path").filter(function () {
					return true;
				}).style("opacity", 1)
				.style("stroke", function (d) {
					if (d['target'] == "1") {
						return "#F88017";
					} else {
						return "#008000";
					}
				})
					.attr("stroke-width", 1)
					
			});
		

		g.append("text")
			.attr("id", "reset_text_parallel")
			.attr("x", width - 75)
			.attr("y", 200)
			.attr("dy", ".65em")
			.text("Reset")

	});



	function position(d) {
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
		return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
	}

	function brushstart() {
		d3v3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
		var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
			extents = actives.map(function (p) { return y[p].brush.extent(); });
		foreground.style("display", function (d) {
			return actives.every(function (p, i) {
				return extents[i][0] <= d[p] && d[p] <= extents[i][1];
			}) ? null : "none";
		});
	}

	function reset_parallel() {

		var paths = d3.select("#foregroundpaths").selectAll("path").filter(function () {
			return true;
		}).style("stroke", function (d) {
			if (d['target'] == "1") {
				return "#F88017";
			} else {
				return "#008000";
			}
		})
			.attr("stroke-width", 1)
			.style("opacity", 1)
	}

}
