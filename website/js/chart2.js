//////////////////////////////////////////////////////////////////// CO2 IN ATMOSTHPHERE (recent) /////////////////////////////////////////////////////////////////
var url = "data/co2-concentration-long-term_capToEmissions.csv";


//Function to keep everything local
(function(){
  // Append SVG object with defined margins. Append group.
  //var svg = d3.select("#CH2")
  var svg = d3.select("#UNDERSTANDING_CC")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "d3_CH2")
      .attr("class", "hide")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read data
  d3.csv(url,
    // Format data
    function(d){
      return { year : d3.timeParse("%-Y")(d.year), co2 : d.co2 }
    },

    // Use dataset for visualization
    function(data) {

      ///////////////////////////////////////// X Axis
      var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("class", "axisWhite")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%Y")));

      // text label for the x axis
      svg.append("text") 
      .attr("fill", "#C4C4C4")            
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .text("Date");


      ///////////////////////////////////////// Y Axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.co2; })])
        .range([ height, 0 ]);
      svg.append("g")
        .attr("class", "axisWhite")
        .call(d3.axisLeft(y));

      // text label for the y axis
      var yLabels = ["Atmospheric", "concentration", "of CO2,", "measured in", "parts per", "million (ppm)" ];
      yLabelText(yLabels, svg, "#C4C4C4");

      // https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
      // gridlines in x axis function
      function make_x_gridlines() {   
          return d3.axisBottom(x)
      }

      // gridlines in y axis function
      function make_y_gridlines() {   
          return d3.axisLeft(y)
      }

          // add the X gridlines
      svg.append("g")     
          .attr("class", "gridLine")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          )

      // add the Y gridlines
      svg.append("g")     
          .attr("class", "gridLine")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          )


      ///////////////////////////////////////// Draw Line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colBlue)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(d.co2) })
          )








    ///////////////////////////////////////// Interaction: Cursor details on Hover
    //https://www.d3-graph-gallery.com/graph/line_cursor.html
    // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function(d) { return d.year; }).left;

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('circle')
      .style("fill", "none")
      .style("pointer-events", "none")
      .attr("stroke", colWhite)
      .attr('r', 8.5)
      .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("fill", colWhite)
      .style("pointer-events", "none")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focus.style("opacity", 1)
    focusText.style("opacity",1)
  }

  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);
    selectedData = data[i]
    focus
      .attr("cx", x(selectedData.year))
      .attr("cy", y(Math.round(parseFloat(selectedData.co2))))
    focusText
      .html("year:" + selectedData.year.getFullYear() + "    |    " + "ppm:" + Math.round(parseFloat(selectedData.co2)))
      .attr("x", x(selectedData.year))
      .attr("y", y(Math.round(parseFloat(selectedData.co2)))+30)
    }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }

  })
})();

