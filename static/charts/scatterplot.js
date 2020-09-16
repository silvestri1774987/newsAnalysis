
function scatterplot(rows) {
  //console.log(rows);
  rows = rows.sort(function (a, b) { return d3.ascending(a.target, b.target); });
  var max_id = (d3.max(rows, function (d) {
    return +d.url
  }))


  var flag_col = ""
  var t1
  var x = d3.scaleLinear()
    .range([0, width - 10]);

  var y = d3.scaleLinear()
    .range([height, 0]);
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);
  var x = d3.scaleLinear()
    .domain(d3.extent(rows, function (d) {
      return +d.X1
    }))
    .range([10, width - 10]);
  var y = d3.scaleLinear()
    .domain(d3.extent(rows, function (d) {
      return +d.X2
    }))
    .range([10, height - 10]);

  var svg = d3.select("#scatterplot")
    .attr("width", width)
    .attr("height", height + 52)
    .append("g")
    .attr("transform", "translate(" + 25 + "," + (-8) + ")")

  svg.selectAll("circle").data(rows).enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.X1);
    })
    .attr("cy", function (d) {
      return height - y(d.X2);
    })
    .attr("r", "3")
    .attr("fill", function (d) {
      if (d.target == 0) return "#008000" //green
      if (d.target == 1) return "#F88017" //grey #708090
      //return color(d.target)
    })
    .attr("target", function (d) {
      /* if(d.target == 0) return "#008000" //green
      if(d.target == 1) return "#708090" //grey */
      return d.target
    })
    .attr("clicked", "false")
    .attr("class", "selected")
    .attr("identifier", function (d) {
      return d.url;
    })
    .on("mouseover", function (d) {
      d3.select(this).transition().duration(200).attr("r", 5);
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.url)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .style("height", "auto")
        .style("width", "auto");
      console.log("URL selected: " + d.url)
    })
    .on("mouseout", function (d) {//these are the points selected by the user from scatterplot
      if (this.getAttribute("fill") != "red") {
        d3.select(this).transition().duration(200).attr("r", 3);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      }
      else { //these are the points selected by the stack barcharts
        d3.select(this).transition().duration(200).attr("r", 5);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      }
    })
    .on("click", function (d) {//points clicked from the user to the scatterplot
      var points = d3.select("#scatterplot").selectAll("circle").filter(function () {
        return this.getAttribute("fill") == "red"
      })
      this.setAttribute("clicked", "false");
      for (i = 0; i < points["_groups"][0].length; i++) {//come back the points to the original
        //console.log(points["_groups"][0][i].getAttribute("target"))
        if (points["_groups"][0][i].getAttribute("target") == 0) flag_col = "#008000"
        else flag_col = "#F88017"
        points["_groups"][0][i].setAttribute("fill", flag_col);
        points["_groups"][0][i].setAttribute("r", "3");
        
      }
      //draw_line(d);
      if (this.getAttribute("target") == 0) flag_col = "#008000"
      else flag_col = "#F88017"
      highlight_parallel_by_id(d.url)
      highlight_bars(d.day, d.argument, d.numWords, d.numMedia, flag_col)
      //highlight_parallel_by_id(this.getAttribute("identifier"));
      if (this.getAttribute("clicked") == "false") {

        this.setAttribute("clicked", "true");
        this.setAttribute("r", "5");
        this.setAttribute("fill", "red");
      }
      else {
        this.setAttribute("clicked", "false");
        this.setAttribute("r", "3");
        this.setAttribute("fill", flag_col);
      }
    });


  svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", height)
    .style("text-anchor", "start")
    .text("X1");

  svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("X2");

  var legend = d3.select("svg").selectAll(".legend")
    .data(["#F88017", "#008000"])
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })
    .attr("class", "selected");



  legend.append("rect")
    .attr("x", width - 10)
    .attr("y", 20)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", function (d) {
      return d
    })
    .on("click", function (t) {
      draw_reset_rect(d3.select("svg"));
      d3.select("#scatterplot").selectAll("rect").attr("class", "unselected");
      d3.select(this).attr("class", "selected");
      d3.selectAll("[label]").each(function () {
        var x = d3.select(this)
        if (t != "#008000") {

          if (x.text() == "Popular") {
            console.log("x= " + x.text())
            x.attr("class", "selected")
          }
          else {
            x.attr("class", "unselected")
          }
        }
        else {
          if (x.text() == "Popular") x.attr("class", "unselected")
          else x.attr("class", "selected")
        }
      });
      if (t == "#008000") t1 = 0
      else t1 = 1
      d3.selectAll("circle").filter(function (d) { return d.target == t1; }).attr("class", "selected");
      d3.selectAll("circle").filter(function (d) { return d.target == !+t1; }).attr("class", "unselected");
    });







  legend.append("text")
    .attr("label", "text_legend")
    .attr("x", width - 100)
    .attr("y", 20)
    .attr("dy", ".65em")
    .text(function (d) {
      if (d == "#008000") {//controlla la colonna success per vedere se sono popular o no
        return "Unpopular";
      }
      else {
        return "Popular";
      }
    });

  function draw_reset_rect(g) {
    g.append("rect")
      .attr("id", "reset_rect_scatterplot")
      .attr("x", width - 10)
      .attr("y", 68)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", flag_col)
      .on("click", function (d) { re_draw_scatterplot(rows) })

    g.append("text")
      .attr("id", "reset_text_scatterplot")
      .attr("x", width - 80)
      .attr("y", 70)
      .attr("dy", ".65em")
      .text("Reset")
  }

}
function re_draw_scatterplot(rows) {
  d3.select("#scatterplot").selectAll("g").remove()
  d3.select("#reset_rect_scatterplot").remove()
  d3.select("#reset_text_scatterplot").remove()
  d3.csv('pca.csv', function loadCallback(error, data) {
    scatterplot(data)
  })
}