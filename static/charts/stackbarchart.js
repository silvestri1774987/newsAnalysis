function stackbarchart(t, div_present) {

  var flag_col =""
  var type = t;
  var values, labels;
  var sort_age = false;

  if (!div_present) {
    var svg = d3.select("#stackbarcharts")
      .append("div").attr("id", "div-" + type)
      .append("svg").attr("id", type);
  }
  else {
    var svg = d3.select("#stackbarcharts")
      .select("#div-" + type)
      .append("svg").attr("id", type);
  }
  if (t == "day") {
    svg.attr("width", 350).attr("height", 250).style("float", "left")
    values = ["1", "2", "3", "4", "5", "6", "7"]
    labels = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  }
  if (t == "argument") {
    svg.attr("width", 350).attr("height", 250).style("float", "left")
    values = ["1", "2", "3", "4", "5", "6"]
    labels = ["LifeStyle", "Entertainment", "Business", "Social Media", "Tech", "World"]
  }
  if (t=="numWords"){
    svg.attr("width", 350).attr("height", 250).style("float", "left")
    values = ["1","2","3","4"]
    labels = ["<500","500-1000","1000-1500",">1500"]
  }
  if (t=="numMedia"){
    svg.attr("width", 350).attr("height", 250).style("float", "left")
    values = ["1","2","3","4"]
    labels = ["<20","20-40","40-60",">60"]
  }
  

  var margin = { top: 20, right: 20, bottom: 80, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .rangeRound([0, width - 100])
    .paddingInner(0.05)
    .align(0.1);

  var y = d3.scaleLinear()
    .rangeRound([height, 0])

  var z = d3.scaleOrdinal(d3.schemeCategory10);

  d3.csv(type + "_frequency.csv", compute_total, draw_stack);

  function draw_stack(data) {
    var keys = data.columns.slice(1);

    x.domain(data.map(function (d) { return d[type]; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys).order(d3.stackOrderReverse)(data))
      .enter().append("g")
      .attr("id", "g-" + type)
      .attr("fill", function (d) {
        if(d.key == 0){
          flag_col = "#008000"
          return flag_col
        }
        else{ 
          flag_col = "#F88017"
          return flag_col
        }
        //return z(d.key);
      })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("id", function (d) {
        return type + "_" + d.data[type]
      })
      .attr("x", function (d) { return x(d.data[type]); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

    g.selectAll("rect").filter(function () {
      return this.getAttribute("id") != "is_sorting_rect"
    })
      .on('mouseover', function (d) {
        d3.select(".text_" + d.data[type] + this.getAttribute("y")).remove()
        var y = parseInt(this.getAttribute("y")), height = parseInt(this.getAttribute("height") / 2)
        d3.select("#g-" + type)
          .append('text')
          .attr('x', (parseInt(this.getAttribute("x")) + parseInt(this.getAttribute("width") / 2)))
          .attr('y', function () {
            if (y == 0)
              return (height)
            return y
          })
          .attr('fill', "black")
          .attr('class', "text_" + d.data[type] + this.getAttribute("y"))
        get_num_instances(type, d.data[type], this.getAttribute("y"))
      })

    g.selectAll("rect").filter(function () {
      return this.getAttribute("id") != "is_sorting_rect"
    })
      .on('mouseout', function (d) {
        d3.select(".text_" + d.data[type] + this.getAttribute("y"))
          .transition()
          .duration(500)
          .style('opacity', 0)
          .attr('transform', 'translate(10, -10)')
          .remove()
      })


    g.selectAll("rect").filter(function () {
      return this.getAttribute("id") != "is_sorting_rect"
    })
      .on('click', function () {
        var bar = d3.selectAll("#day").selectAll("rect").filter(function () {
          return this.getAttribute("fill") == "red"
        })
        if (bar != null)
          bar.attr("fill", null)
        bar = d3.selectAll("#argument").selectAll("rect").filter(function () {
          return this.getAttribute("fill") == "red"
        })
        if (bar != null)
          bar.attr("fill", null)
        bar = d3.selectAll("#numWords").selectAll("rect").filter(function () {
          return this.getAttribute("fill") == "red"
        })
        if (bar != null)
          bar.attr("fill", null)
        bar = d3.selectAll("#numMedia").selectAll("rect").filter(function () {
          return this.getAttribute("fill") == "red"
        })
        if (bar != null)
          bar.attr("fill", null)
        highlight_points(this.getAttribute("id"), this.getAttribute("y"))
        highlight_parallel(this.getAttribute("id"), this.getAttribute("y"))
      });

    g.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text(type);

    var x_axis;
    if (type != "argument" || type != "day" || type != "numWords" || type != "numMedia") {
      x_axis = d3.axisBottom(x)
        .tickValues(values)
        .tickFormat(function (d, i) { return labels[i] });

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    }
    else {
      x_axis = d3.axisBottom(x);
      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis)
    }

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "-1.0em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text("Success Rate")

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
      .attr("class", "legend-" + type)
      .attr("classification", function (d) {
        return d;//return 0 or 1
      })
      .on("click", to_barchart);
      
    //console.log(keys.slice().reverse())
    flag_col = "used"  
    legend.append("rect")
      .attr("x", width - 75)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function(d){
        //console.log("d "+d)
        if(d == 0) return "#008000"//green
        else return "#F88017"
      })

    legend.append("text")
      .attr("x", width - 50)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) {
        if(d == 0) return "Unpopular"
        else return "Popular"
      });
  }

  function to_barchart(sel_legend) {
    //console.log("To bar"+sel_legend)
    var selected_legend
    if (sel_legend != 0 && sel_legend != 1)
      selected_legend = sel_legend
    else
      selected_legend = this
    d3.selectAll(".legend-" + type).attr("opacity", "0.4");
    d3.select(selected_legend).attr("opacity", "1");
    d3.csv(type + "_frequency.csv",
      function (d, i, columns) {
        if (d3.select(selected_legend).attr("classification") == "0") {
          var t = d[0] = +d[[0]];
          d.total = t;
        }
        else {
          var t = d[1] = +d[1];
          d.total = t;
        }
        return d;

      },
      function (data) {
        var prev_height = d3.select("#" + type).attr("height");
        var prev_width = d3.select("#" + type).attr("width");
        d3.selectAll("#" + type).remove()

        var svg = d3.select("#div-" + type)
          .append("svg")
          .attr("width", prev_width)
          .attr("height", prev_height)
          .attr("id", type)
          .style("float", "left");

        g = svg.append("g")
          .attr("id", "g-" + type)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (type == "argument") {
          g.append("rect")
            .attr("id", "is_sorting_rect")
            .attr("x", 710)
            .attr("y", 200)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", "grey")
            .on("click", function () {
              to_barchart(selected_legend);
            })

          g.append("text")
            .attr("x", 740)
            .attr("y", 215)
        }
        if (type == "day") {
          g.append("rect")
            .attr("id", "is_sorting_rect")
            .attr("x", 710)
            .attr("y", 200)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", "grey")
            .on("click", function () {
              to_barchart(selected_legend);
            })

          g.append("text")
            .attr("x", 740)
            .attr("y", 215)
        }
        if (type == "numWords") {
          g.append("rect")
            .attr("id", "is_sorting_rect")
            .attr("x", 710)
            .attr("y", 200)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", "grey")
            .on("click", function () {
              to_barchart(selected_legend);
            })

          g.append("text")
            .attr("x", 740)
            .attr("y", 215)
        }
        if (type == "numMedia") {
          g.append("rect")
            .attr("id", "is_sorting_rect")
            .attr("x", 710)
            .attr("y", 200)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", "grey")
            .on("click", function () {
              to_barchart(selected_legend);
            })

          g.append("text")
            .attr("x", 740)
            .attr("y", 215)
        }


        var x = d3.scaleBand()
          .rangeRound([0, width - 100])
          .paddingInner(0.05)
          .align(0.1);

        var y = d3.scaleLinear()
          .rangeRound([height, 50]);


        var z = d3.scaleOrdinal(d3.schemeCategory10)

        x.domain(data.map(function (d) { return d[type]; }));
        y.domain([0, d3.max(data, function (d) {
          return d.total;
        })]).nice();
        z.domain(["0", "1"])

        var keys = data.columns.slice(1);

        g.append("g")
          .selectAll("g")
          .data(data)
          .enter().append("rect")
          .attr("id", function (d) {
            return type + "_" + d[type]
          })
          .attr("x", function (d) { return x(d[type]); })
          .attr("width", x.bandwidth())
          .attr("y", function (d) { return y(d[d3.select(selected_legend).attr("classification")]); })
          .transition()
          .duration(750)
          .attr("height", function (d) {
            return height - y(d[d3.select(selected_legend).attr("classification")]);
          })
          .attr("fill",function(d){
            //console.log(d3.select(selected_legend).attr("classification"))
            if(d3.select(selected_legend).attr("classification") == 0) return "#008000"
            else return "#F88017"
          });//Devi cambiare qui

          //console.log("selected Leg"+selected_legend)
        g.selectAll("rect").filter(function () {
          return this.getAttribute("id") != "is_sorting_rect"
        })
          .on('mouseover', function (d) {
            d3.select(".text_" + d[type] + selected_legend.getAttribute("classification")).remove()
            var y = parseInt(this.getAttribute("y")), height = parseInt(this.getAttribute("height") / 2)
            d3.select("#g-" + type)
              .append('text')
              .attr('x', (parseInt(this.getAttribute("x")) + parseInt(this.getAttribute("width") / 2)))
              .attr('y', function () {
                if (y == 0)
                  return (height)
                return y
              })
              .attr('fill', "black")
              .attr('class', "text_" + d[type] + selected_legend.getAttribute("classification"))
            get_num_instances(type, d[type], selected_legend.getAttribute("classification"))
          })

        g.selectAll("rect").filter(function () {
          return this.getAttribute("id") != "is_sorting_rect"
        })
          .on('mouseout', function (d) {
            d3.select(".text_" + d[type] + selected_legend.getAttribute("classification"))
              .transition()
              .duration(500)
              .style('opacity', 0)
              .attr('transform', 'translate(10, -10)')
              .remove()
          })

        g.append("text")
          .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 50) + ")")
          .style("text-anchor", "middle")
          .text(type);

        var x_axis;
        if (type != "AGE") {
          x_axis = d3.axisBottom(x)
            .tickValues(values)
            .tickFormat(function (d, i) { return labels[i] });

          g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(x_axis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        }
        else {
          x_axis = d3.axisBottom(x);
          g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(x_axis)
        }

        g.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y).ticks(5))
          .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks().pop()) + 0.5)
          .attr("dy", "-1.0em")
          .attr("fill", "black")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("percentage");

        var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "start")
          .selectAll("g")
          .data(keys.slice().reverse())
          .enter().append("g")
          .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
          .attr("class", "legend-" + type)
          .attr("classification", function (d) {
            return d;
          })
          .attr("opacity", function (d) {
            if (d == d3.select(selected_legend).attr("classification")) {
              return "1";
            }
            else {
              return "0.4"
            }
          })
          .on("click", to_barchart);
        console.log(d3.select(selected_legend).attr("classification"))
        legend.append("rect")
          .attr("x", width - 63)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", function(d){
            if(d == 0) return "#008000"
            else return "#F88017"
          })

        legend.append("text")
          .attr("x", width - 40)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function (d) {
            if(d == 0) return "Unpopular"
            else return "Popular"
          });

        g.append("rect")
          .attr("id", "reset_rect_" + type)
          .attr("x", width - 63)
          .attr("text-anchor", "start")
          .attr("y", 50)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", "red")
          .on("click", function (d) { re_draw_stack(type) })

        g.append("text")
          .attr("x", width - 40)
          .attr("y", 63)
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "start")
          .text("Reset")

      }
    );
  }


}

function re_draw_stack(type) {
  d3.select("#" + type).remove();
  stackbarchart(type, true);
}
function compute_total(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}