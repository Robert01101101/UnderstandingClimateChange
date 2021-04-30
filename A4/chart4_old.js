//////////////////////////////////////////////////////////////////// CO2 EMISSIONS BY ENTITY /////////////////////////////////////////////////////////////////
var url = "http://www.sfu.ca/~rmichels/355_Data/annual-co-emissions-by-region.csv";


//Function to keep everything local
(function(){
  //Custom margins
  var margin = {top: 0, right: 280, bottom: 50, left: 140},
    width = 1400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append SVG object with defined margins. Append group.
  var svg = d3.select("#CH4")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  //Read data
  d3.csv(url, function(data) {
    // Group the data: one array per year entry
    var sumstat = d3.nest()
      .key(function(d) { return d.year;})
      .entries(data);

    // Stack the data: each group will be represented on top of each other
    var mygroups = ["EU-28", ["Europe (other)"], ["United States"], ["Americas (other)"], ["Middle East"], "Africa", "India", "China", 
    ["Asia and Pacific (other)"], ["International transport"], ["Statistical differences"]] // list of group names
    var mygroup = [0,1,2,3,4,5,6,7,8,9,10]
    var stackedData = d3.stack()
      .keys(mygroup)
      .value(function(d, key){
        return d.values[key].co2 //retrieve co2 value
      })
      (sumstat)

    ///////////////////////////////////////// X Axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
          .tickFormat(d3.format("c")));

    // text label for the x axis
      svg.append("text")             
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
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0s")));


    var yLabels = ["Annual", "total CO2",  "emissions,", "in tonnes"];
    yLabelText(yLabels, svg);

    // color palette
    var color = d3.scaleOrdinal()
      .domain(mygroups)
      .range(['#5A77E8','#63ABFF','#62B385','#9DC96D','#EB985A','#E6C17E','#A274D4','#FF7A62','#55BCCC', "#95C25F",'#666666'])

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .style("fill", function(d) { entity = mygroups[d.key] ;  return color(entity); })
        .attr("d", d3.area()
          .x(function(d, i) { return x(d.data.key); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); })
      )




      // Add one dot in the legend for each name.
      var size = 20;
      var padding = 50;
      var legend = svg.append("g");
      var lX = 400-padding/2;
      var lY = 10-padding/2;
      var lW = 194+padding;
      var lH = 11*(size+5)-5+padding;
      legend.append("rect")
              .attr("x", lX)
              .attr("y", lY)
              .attr("width", lW)
              .attr("height", lH)
              .style("fill", "#eaeaea");
      legend.selectAll("myrect")
        .data(mygroups)
        .enter()
        .append("rect")
          .attr("x", 400)
          .attr("y", function(d,i){ return -5 + (mygroups.length-i)*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return color(d)})

      // Add one dot in the legend for each name.
      legend.selectAll("mylabels")
        .data(mygroups)
        .enter()
        .append("text")
          .attr("x", 400 + size*1.2)
          .attr("y", function(d,i){ return -5 + (mygroups.length-i)*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")

      legend.attr("transform",
            "translate(" + (width-lW-100) + " ," + 
                           0 + ")");
            

  })
})();