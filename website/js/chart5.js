//////////////////////////////////////////////////////////////////// CO2 IN ATMOSTHPHERE (recent) /////////////////////////////////////////////////////////////////
var url = "data/co2-concentration-long-term_capToEmissions.csv";
var url2 = "data/annual-co-emissions-world.csv";

//Function to keep everything local
(function(){

  // Append SVG object with defined margins. Append group.
  //var svg = d3.select("#CH5")
  var svg = d3.select("#UNDERSTANDING_CC")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "d3_CH5")
      .attr("class", "hide")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  ///Using nested functions so that we can respond to multiple mouse interactions easily for the cursors
  ///////////////////////////////////////////////////////////////////////////////////////////////////////// CONCENTRATION
  //Read data
  d3.csv(url,
    // Format data
    function(d){
      return { year : d3.timeParse("%-Y")(d.year), co2 : d.co2 }
    },

    // Use dataset for visualization
    function(data1) {
      ///////////////////////////////////////////////////////////////////////////////////////////////////////// EMISSIONS
    //Read data
    d3.csv(url2,
      // Format data
      function(d){
        return { year : d3.timeParse("%-Y")(d.year), co2 : d.co2 }
      },

      // Use dataset for visualization
      function(data2) {

        ///////////////////////////////////////// X Axis
        var x1 = d3.scaleTime()
          .domain(d3.extent(data1, function(d) { return d.year; }))
          .range([ 0, width ]);

        // text label for the x axis
        svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .attr("fill", "#C4C4C4")
        .text("Date");


        ///////////////////////////////////////// Y Axis
        var y1 = d3.scaleLinear()
          .domain([0, d3.max(data1, function(d) { return +d.co2; })])
          .range([ height, 0 ]);
        svg.append("g")
          .attr("transform", "translate( " + width + ", 0 )")
          .attr("class", "axisBlue")
          .call(d3.axisRight(y1));

        var y1Labels = ["Annual", "total CO2",  "emissions,", "in tonnes", "(World)"];
        yLabelText(y1Labels, svg, colOrange);

        // Add the line
        svg.append("path")
          .datum(data1)
          .attr("fill", "none")
          .attr("stroke", colBlue)
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(function(d) { return x1(d.year) })
            .y(function(d) { return y1(d.co2) })
            )



        ///////////////////////////////////////////////////////////////////////////////////////////////////////// CONCENTRATION
        ///////////////////////////////////////// X Axis
        var x2 = d3.scaleTime()
          .domain(d3.extent(data2, function(d) { return d.year; }))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "axisWhite")
          .call(d3.axisBottom(x2)
            .tickFormat(d3.timeFormat("%Y")));

        ///////////////////////////////////////// Y Axis
        var y2 = d3.scaleLinear()
          .domain([0, d3.max(data2, function(d) { return +d.co2; })])
          .range([ height, 0 ]);
        svg.append("g")
          .attr("class", "axisOrange")
          .call(d3.axisLeft(y2)
              .tickFormat(d3.format(".0s")));

        // text label for the y axis
        var y2Labels = ["Atmospheric", "concentration", "of CO2,", "measured in", "parts per", "million (ppm)" ];
        yLabelRight(y2Labels, svg, colBlue);

        // Add the line
        svg.append("path")
          .datum(data2)
          .attr("fill", "none")
          .attr("stroke", colOrange)
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(function(d) { return x2(d.year) })
            .y(function(d) { return y2(d.co2) })
            )

        function make_x_gridlines() {   
          return d3.axisBottom(x2)
        }

            // add the X gridlines
        svg.append("g")     
            .attr("class", "gridLine")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )



        ///////////////////////////////////////////////////////////////////////////////////////////////////////// CONCENTRATION - Cursor
        ///////////////////////////////////////// Interaction: Cursor details on Hover
        //https://www.d3-graph-gallery.com/graph/line_cursor.html
        // This allows to find the closest X index of the mouse:
        var bisect1 = d3.bisector(function(d) { return d.year; }).left;

        var w1 = 120;

        // Create the circle that travels along the curve of chart
        var focus1G = svg
          .append('g')

        var focus1 = focus1G
          .append('g')
          .append('circle')
            .style("fill", "none")
            .style("pointer-events", "none")
            .attr("stroke", colBlue)
            .attr('r', 8.5)
            .style("opacity", 0)

        var focus1BG = focus1G
          .append('g')
          .append('rect')
            .style("fill", "#191919")
            .style("pointer-events", "none")
            .attr("stroke", colBlue)
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', w1+20)
            .attr('height', cursorPos.h)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText1 = focus1G
          .append('g')
          .attr("class", "axisBlue")
          .append('text')
            .style("opacity", 0)
            .style("pointer-events", "none")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "0.8em")

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
          .append('rect')
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('width', width)
          .attr('height', height)
          .on('mouseover', mouseoverB)
          .on('mousemove', mousemoveB)
          .on('mouseout', mouseoutB);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////// EMISSIONS - Cursor
        ///////////////////////////////////////// Interaction: Cursor details on Hover
        //https://www.d3-graph-gallery.com/graph/line_cursor.html
        // This allows to find the closest X index of the mouse:
        var bisect2 = d3.bisector(function(d) { return d.year; }).left;

        var w2 = 142;

        var focus2G = svg
          .append('g')

        // Create the circle that travels along the curve of chart
        var focus2 = focus2G
          .append('g')
          .append('circle')
            .style("fill", "none")
            .style("pointer-events", "none")
            .attr("stroke", colOrange)
            .attr('r', 8.5)
            .style("opacity", 0)

        var focus2BG = focus2G
          .append('g')
          .append('rect')
            .style("fill", "#191919")
            .style("pointer-events", "none")
            .attr("stroke", colOrange)
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', w2+20)
            .attr('height', cursorPos.h)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText2 = focus2G
          .append('g')
          .attr("class", "axisOrange")
          .append('text')
            .style("opacity", 0)
            .style("pointer-events", "none")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "0.8em")


        ///////////////////////////////////////////////////////////////////////////////////////////////////////// EMISSIONS - Cursor Mouse
        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseoverA() {
          focus2.style("opacity", 1)
          focusText2.style("opacity",1)
          focus2BG.style("opacity", 0.9)
        }

        function mousemoveA(x0) {
          // recover coordinate we need
          //console.log("mousemoveA");
          var i = bisect2(data2, x0, 1);
          selectedData2 = data2[i]
          focus2
            .attr("cx", x2(selectedData2.year))
            .attr("cy", y2(Math.round(parseFloat(selectedData2.co2))))
          focusText2
            .html("year:" + selectedData2.year.getFullYear() + "    |    " + "tonnes:" + d3.format(".3s")(parseInt(selectedData2.co2)))
            .attr("x", x2(selectedData2.year)-w2/2)
            .attr("y", y2(Math.round(parseFloat(selectedData2.co2)))+cursorPos.btmY+cursorPos.h/2)
          focus2BG
            .attr('x', x2(selectedData2.year)-w2/2-10)
            .attr('y', y2(Math.round(parseFloat(selectedData2.co2)))+cursorPos.btmY)
          }

          
        function mouseoutA() {
          focus2.style("opacity", 0)
          focusText2.style("opacity", 0)
          focus2BG.style("opacity", 0)
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////// CONCENTRATION - Cursor Mouse
        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseoverB() {
          focus1.style("opacity", 1)
          focusText1.style("opacity",1)
          focus1BG.style("opacity", 0.9)
          mouseoverA();
        }

        var p = d3.precisionPrefix(1e5, 1.3e6),
        f = d3.formatPrefix("." + p, 1.3e6);

        function mousemoveB() {
          // recover coordinate we need
          //console.log("mousemoveB");
          var x0 = x1.invert(d3.mouse(this)[0]);
          var i = bisect1(data1, x0, 1);
          selectedData1 = data1[i]
          focus1
            .attr("cx", x1(selectedData1.year))
            .attr("cy", y1(Math.round(parseFloat(selectedData1.co2))))
          focusText1
            .html("year:" + selectedData1.year.getFullYear() + "    |    " + "ppm:" + Math.round(parseFloat(selectedData1.co2)))
            .attr("x", x1(selectedData1.year)-w1/2)
            .attr("y", y1(parseInt(selectedData1.co2))+cursorPos.topY-cursorPos.h/2)
          focus1BG
            .attr('x', x1(selectedData1.year)-w1/2-10)
            .attr('y', y1(Math.round(parseFloat(selectedData1.co2)))+cursorPos.topY-cursorPos.h)
          mousemoveA(x0);
          }
        function mouseoutB() {
          focus1.style("opacity", 0)
          focusText1.style("opacity", 0)
          focus1BG.style("opacity", 0)
          mouseoutA();
        }


  })

})
      

})();



