//////////////////////////////////////////////////////////////////// EMISSIONS IMPACT CANADIAN WEATHER /////////////////////////////////////////////////////////////////
var url = "data/all_canadaClimateData_lineChart.csv";
var url2 = "data/annual-co-emissions-world_TrimToCanada.csv";


//Function to keep everything local
function drawSumChartPA(){
  // Append SVG object with defined margins. Append group.
  //var svg = d3.select("#CH1")
  var svg = d3.select("#SUMCHART")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "d3_PA")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  ///Using nested functions so that we can respond to multiple mouse interactions easily for the cursors
  ///////////////////////////////////////////////////////////////////////////////////////////////////////// CANADIAN WEATHER
  //Read data
  d3.csv(url,
    // Format data
    function(d){
      return { 
        year : d3.timeParse("%-Y")(d.year), 
        mpDiffAbs : +d.mpDiffAbs, 
      }
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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////// CANADIAN WEATHER
        ///////////////////////////////////////// X Axis
        var x1 = d3.scaleTime()
          .domain(d3.extent(data1, function(d) { return d.year; }))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "axisWhite")
          .call(d3.axisBottom(x1)
            .tickFormat(d3.timeFormat("%Y")));

        // text label for the x axis
        svg.append("text")    
        .attr("fill", colWhite)          
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");


        ///////////////////////////////////////// Y Axis
        var y1 = d3.scaleLinear()
          .domain([d3.min(data1, function(d) { return d.mpDiffAbs; }), d3.max(data1, function(d) { return d.mpDiffAbs; })])
          .range([ height, 0 ]);
        svg.append("g")
          .attr("class", "axisBlue")
          .call(d3.axisLeft(y1));

        // text label for the y axis
        var yLabels1 =  ["Canadian", "Precipitation", "Deviation" , "(average,", "absolute),", "in mm"];
        yLabelText(yLabels1, svg, colBlue);


        // https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
        // gridlines in x axis function
        function make_x_gridlines() {   
            return d3.axisBottom(x1)
        }

        // gridlines in y axis function
        function make_y_gridlines() {   
            return d3.axisLeft(y1)
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

        // Add the line
        svg.append("path")
          .datum(data1)
          .attr("fill", "none")
          .attr("stroke", colBlue)
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(function(d) { return x1(d.year) })
            .y(function(d) { return y1(d.mpDiffAbs) })
            )

    ///////////////////////////////////////////////////////////////////////////////////////////////////////// EMISSIONS
    ///////////////////////////////////////// Y Axis
    var y2 = d3.scaleLinear()
      .domain([0, d3.max(data2, function(d) { return +d.co2; })])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("class", "axisOrange")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y2)
        .tickFormat(d3.format(".0s")));

    var yLabels2 = ["Annual", "total CO2",  "emissions,", "in tonnes", "(World)"];
    yLabelRight(yLabels2, svg, colOrange);

    // Add the line
    svg.append("path")
      .datum(data2)
      .attr("fill", "none")
      .attr("stroke", colOrange)
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x1(d.year) })
        .y(function(d) { return y2(d.co2) })
        )




      ///////////////////////////////////////////////////////////////////////////////////////////////////////// CANADIAN WEATHER - Cursor
        ///////////////////////////////////////// Interaction: Cursor details on Hover
        //https://www.d3-graph-gallery.com/graph/line_cursor.html
        // This allows to find the closest X index of the mouse:
        var bisect1 = d3.bisector(function(d) { return d.year; }).left;

        var w1 = 175;

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
          .on('mouseover', mouseoverA)
          .on('mousemove', mousemoveA)
          .on('mouseout', mouseoutA);

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
          focus1.style("opacity", 1);
          focusText1.style("opacity",1);
          focus1BG.style("opacity", 0.9);
          mouseoverB();
        }

        function mousemoveA(x0) {
          // recover coordinate we need
          //console.log("mousemoveA");
          var x0 = x1.invert(d3.mouse(this)[0]);
          var i = bisect1(data1, x0, 1);
          selectedData1 = data1[i]
          focus1
            .attr("cx", x1(selectedData1.year))
            .attr("cy", y1(parseFloat(selectedData1.mpDiffAbs)))
          focusText1
            .html("year: " + selectedData1.year.getFullYear() + "&nbsp; |  &nbsp;" + "pDiffAbs: " + d3.format(".3")(parseFloat(selectedData1.mpDiffAbs)) + "mm")
            .attr("x", x1(selectedData1.year)-w2/2)
            .attr("y", y1(parseFloat(selectedData1.mpDiffAbs))+cursorPos.btmY+cursorPos.h/2)
          focus1BG
            .attr('x', x1(selectedData1.year)-w2/2-10)
            .attr('y', y1(parseFloat(selectedData1.mpDiffAbs))+cursorPos.btmY)
          mousemoveB(x0);
        }

          
        function mouseoutA() {
          focus1.style("opacity", 0);
          focusText1.style("opacity", 0);
          focus1BG.style("opacity", 0);
          mouseoutB();
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////// CANADIAN WEATHER - Cursor Mouse
        
        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseoverB() {
          focus2.style("opacity", 1);
          focusText2.style("opacity",1);
          focus2BG.style("opacity", 0.9);
        }

        var p = d3.precisionPrefix(1e5, 1.3e6),
        f = d3.formatPrefix("." + p, 1.3e6);

        function mousemoveB(x0) {
          // recover coordinate we need
          //console.log("mousemoveB");
          var i = bisect1(data2, x0, 1);
          selectedData2 = data2[i]
          if (data2[i] != undefined) {
            focus2
              .attr("cx", x1(selectedData2.year))
              .attr("cy", y2(Math.round(parseFloat(selectedData2.co2))))
            focusText2
              .html("year:" + selectedData2.year.getFullYear() + "&nbsp; |&nbsp; tonnes: " + d3.format(".3s")(parseInt(selectedData2.co2)))
              .attr("x", x1(selectedData2.year)-w1/2)
              .attr("y", y2(parseInt(selectedData2.co2))+cursorPos.topY-cursorPos.h/2)
            focus2BG
              .attr('x', x1(selectedData2.year)-w1/2-10)
              .attr('y', y2(Math.round(parseFloat(selectedData2.co2)))+cursorPos.topY-cursorPos.h)
          }
          }
        function mouseoutB() {
          focus2.style("opacity", 0);
          focusText2.style("opacity", 0);
          focus2BG.style("opacity", 0);
        }
    }) 
  })
}
