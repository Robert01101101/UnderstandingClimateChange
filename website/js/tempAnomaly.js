//Function to keep everything local
(function(){

    var curYear = 1;
    var drawingYear = false;
    var origDelay = 0;
    var clickedSlider = false;

    function convertRemToPixels(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    ///////////////////////////////////////////////////////////////////////////
    //////////////////// Set up and initiate svg containers ///////////////////
    /////////////////////////////////////////////////////////////////////////// 

    var margin = {top: 25, right: 20, bottom: 120, left: 20},
        width = 1500 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom - 24;

    var domLow = -1.5,  //-15, low end of data
        domHigh = 1.25,  //30, high end of data
        axisTicks = [-1, 0, 1],   //[-20,-10,0,10,20,30];  [-2,-1,0,1,2,3];  [-1.5,-0.5,0.5,1.5];
        duration = 20000; //100000, 50000
    origDelay = duration;

    //SVG container
    var svg = d3v3.select("#d3_TEMPANOMALY")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

    //Parses a string into a date
    var parseDate = d3v3.time.format("%Y-%m-%d").parse;


    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Create scales ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


    //Loads data, everything below is within callback: 
    d3v3.text("data/HadCRUT.4.5.0.0.monthly_ns_avg.tsv", function(text) {

    var years = [];

    var climateData = d3v3.csv.parseRows(text, function(d) {
        var temp = d[0].split('   ').slice(0,2);
        //console.log(temp[0].split('/'))
        years.push(temp[0].split('/')[0]);
        return {date: parseDate(temp[0].replace('/', '-') + '-1'), mean_temp: +temp[1]}  //'-') + '-01'
    });
    //var data = d3v3.csv.parseRows(text);
    console.log(climateData);


    //Set the minimum inner radius and max outer radius of the chart
    var outerRadius = Math.min(width, height, 500)/2,
        innerRadius = outerRadius * 0.1;  //Sets the ratio.  Smaller magnifies differences. 0.1 good, 0.15

    //Base the color scale on average temperature extremes
    var colorScale = d3v3.scale.linear()
        .domain([domLow, (domLow+domHigh)/2, domHigh])
        .range(["#2c7bb6", "#ffff8c", "#d7191c"])
        .interpolate(d3v3.interpolateHcl);

    //Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
    var distScale = d3v3.scale.linear()
        .range([innerRadius, outerRadius])
        .domain([domLow, domHigh]); 

    //Scale to turn the date into an angle of 360 degrees in total
    //With the first datapoint (Jan 1st) on top
    // var angle = d3v3.scale.linear()
    //     .range([-180, 180])
    //     .domain(d3v3.extent(climateData, function(d) { return d.date; }));

    //Function to convert date into radians for path function
    //The radial scale in this case starts with 0 at 90 degrees
    //http://stackoverflow.com/questions/14404345/polar-plots-using-d3v3-js
    var radian = d3v3.scale.linear()
        .range([0, Math.PI*2*(climateData.length/12) ])  
        .domain(d3v3.extent(climateData, function(d) { return d.date; }));


    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Create Titles ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var textWrapper = svg.append("g").attr("class", "textWrapper")
        .attr("transform", "translate(" + -width/2 + "," + 0 + ")");
        //.attr("transform", "translate(" + Math.max(-width/2, -outerRadius - 170) + "," + 0 + ")");

    //Append play button
    var play = textWrapper.append("text")
        .attr("class", "play")
        .attr("x", 120)
        .attr("y", 40)
        .text("\u25B7")  //unicode triangle: U+25B2  \u25b2



    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Create Axes /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Wrapper for the bars and to position it downward
    var barWrapper = svg.append("g")
        .attr("transform", "translate(" + 0 + "," + 50 + ")");
        
    //Draw gridlines below the bars
    var axes = barWrapper.selectAll(".gridCircles")
        .data(axisTicks)
        .enter().append("g");
    //Draw the circles
    axes.append("circle")
        .attr("class", "axisCircles")
        .attr("r", function(d) { return distScale(d); });
    //Draw the axis labels
    axes.append("text")
        .attr("class", "axisText")
        .attr("y", function(d) { return distScale(d) - 8; })
        .attr("dy", "0.3em")
        .text(function(d) { return d + "°C"});

    //Add January for reference
    barWrapper.append("text")
        .attr("class", "january")
        .attr("x", 7)
        .attr("y", -outerRadius * 1.1)
        .attr("dy", "0.9em")
        .text("January");
    //Add a line to split the year
    barWrapper.append("line")
        .attr("class", "yearLine")
        .attr("x1", 0)
        .attr("y1", -innerRadius * 1.8)  //.65
        .attr("x2", 0)
        .attr("y2", -outerRadius * 1.1);

    //Add year in center
    barWrapper.append("text")
        .attr("class", "yearText")
        .attr("x", -22)
        .attr("y", 0)
        //.attr("dy", "0.9em")
        .text("1850");

    ///////////////////////////////////////////////////////////////////////////
    //////////////// Create radial gradient for the line //////////////////////
    ///////////////////////////////////////////////////////////////////////////


    //Extra scale since the color scale is interpolated
    // var radScale = d3v3.scale.linear()
    //     .domain([domLow, domHigh])
    //     .range([innerRadius, outerRadius]);

    //Calculate the variables for the temp gradient
    var numStops = 10;
    tempRange = distScale.domain();
    tempRange[2] = tempRange[1] - tempRange[0];
    tempPoint = [];
    for(var i = 0; i < numStops; i++) {
        tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
    }

    //Create the radial gradient
    var radialGradient = svg.append("defs")
        .append("radialGradient")
        .attr("id", "radial-gradient")
        .selectAll("stop") 
        .data(d3v3.range(numStops))               
        .enter().append("stop")
        .attr("offset", function(d,i) { return distScale(tempPoint[i])/ outerRadius; })      
        .attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });



    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Draw lines /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


    //Radial line, takes radians as argument
    //http://stackoverflow.com/questions/18487780/how-to-make-a-radial-line-segment-using-d3v3-js
    //http://stackoverflow.com/questions/14404345/polar-plots-using-d3v3-js
    //i/12 = month
    var line = d3v3.svg.line.radial()
        .angle(function(d) { return radian(d.date); })  
        .radius(function(d) { return distScale(d.mean_temp); });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////// DRAW ON PLAY
    //Append path drawing function to play button
    var playingAnim = false;
    play.on("click", function(){
        if (!playingAnim) {
            playingAnim = true;
            drawAnimated();
            play.text("\u25A1");
        } else {
            playingAnim = false;
            sliderUpdate(curYear);
        }
    });

    function drawAnimated (){
        clickedSlider = false;

        if (d3v3.selectAll("path.line")) {
            d3v3.selectAll("path.line").remove();
        }

        //Create path using line function
        var path = barWrapper.append("path")
            .attr("d", line(climateData))
            .attr("class", "line")
            .attr("x", -0.75)
            .style("stroke", "url(#radial-gradient)")
            //.datum(climateData);  attaches all data

        var totalLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            //Works, but kind of a hack:
            .tween("customTween", function() {
                return function(t) {
                    if (!clickedSlider){
                    d3v3.select("text.yearText").text(function(d){if(!clickedSlider)return years[Math.floor(t*years.length-1)]})
                        .append("div")
                        .attr("fake", d=> curYear = +years[Math.floor(t*years.length-1)] - 1849) //year text
                        //.attr("fake", d=> ) //year text
                        .attr("fake", function(d){
                            if (!clickedSlider) document.getElementById("mySlider").value = (years[Math.floor(t*years.length-1)]) - 1849
                        })
                        .transition()
                        .duration(t/1.5);}
                        
                };
            })
            .duration(duration)  
            .ease("linear")
            .attr("stroke-dashoffset", 0);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// TRY TO DRAW ONE YEAR
    (function(){
        //SELF EXECUTE
        drawAllYears();
        drawYear(1);
    })();


    function drawYear (year){
        console.log("drawYear: " + year)
        var line = d3v3.svg.line.radial()
        .angle(function(d, i) { if (i<year*12+1 ) return radian(d.date);})  
        .radius(function(d, i) { if ( i<year*12+1 ) return distScale(d.mean_temp); });

        //Create path using line function
        var path = barWrapper.append("path")
            .attr("d", line(climateData))
            .attr("class", "line")
            .attr("x", -0.75)
            .style("stroke", "url(#radial-gradient)")
            //.datum(climateData);  attaches all data

        drawingYear = false;
    }



    function drawAllYears (){
        drawingYear = true;
        console.log("drawAllYears")
        var line = d3v3.svg.line.radial()
        .angle(function(d) { return radian(d.date);})  
        .radius(function(d) { return distScale(d.mean_temp); });

        //Create path using line function
        var path = barWrapper.append("path")
            .attr("d", line(climateData))
            .attr("class", "line")
            .attr("x", -0.75)
            .style("stroke", "url(#radial-gradient)")
            .attr("opacity", 0.12)

        drawYear(curYear);
    }

     
    ///////////////////////////////////////////////////////////////////////////
    //////////////// Create the gradient for the legend ///////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Extra scale since the color scale is interpolated
    var tempScale = d3v3.scale.linear()
        .domain([domLow, domHigh])
        .range([0, width]);

    //Calculate the variables for the temp gradient
    var numStops = 10;
    tempRange = tempScale.domain();
    tempRange[2] = tempRange[1] - tempRange[0];
    tempPoint = [];
    for(var i = 0; i < numStops; i++) {
        tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
    }//for i

    //Create the gradient
    svg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-weather")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop") 
        .data(d3v3.range(numStops))                
        .enter().append("stop") 
        .attr("offset", function(d,i) { return tempScale( tempPoint[i] )/width; })   
        .attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// Draw the legend ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var legendWidth = Math.min(outerRadius*2, 400);

    //Color Legend container
    var legendsvg = svg.append("g")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + 0 + "," + (outerRadius + 90) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", -legendWidth/2)
        .attr("y", 0)
        .attr("rx", 8/2)
        .attr("width", legendWidth)
        .attr("height", 8)
        .style("fill", "url(#legend-weather)");
        
    //Append title
    legendsvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Temperature Anomaly");

    //Set scale for x-axis
    var xScale = d3v3.scale.linear()
        .range([-legendWidth/2, legendWidth/2])
        .domain([domLow, domHigh] );

    //Define x-axis
    var xAxis = d3v3.svg.axis()
        .orient("bottom")
        .ticks(5)
        .tickFormat(function(d) { return d + "°C"; })
        .scale(xScale);

    //Set up X axis
    legendsvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (10) + ")")
        .call(xAxis);


    ///////////////////////////////////////////////////////////////////////////////////////////////////// SLIDER
    // Function called when slider is used
    function sliderUpdate(value) {
      console.log("new selected year: " + value);
      play.text("\u25B7");
      clickedSlider = true;
      curYear = value;
      if (!drawingYear) {
        if (d3v3.selectAll("path.line")) {
            d3v3.selectAll("path.line").remove();
        }
        drawAllYears();
        d3v3.select("text.yearText").text(Math.round(+curYear+1849 + (curYear/166)));
        }
    }

    // Listen to the slider?
    d3v3.select("#mySlider").on("input", function(d){
      selectedValue = this.value
      sliderUpdate(selectedValue)
    })





    }); //End data callback








})();