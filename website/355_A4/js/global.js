////////////////////////////////////////////////////////////////////////// GLOBAL VARIABLES AND FUNCTIONS /////////////////////////////////////////////////////////////////

//------------------------------------------------------------------------ Functions
//create new svg
function newSvg(targetDOMobject, width, height){
  var output = d3.select(targetDOMobject)//"#TOP"
    .append("svg")
    .attr("width", width)//w
    .attr("height", height);//h
  return output;
}


//convert float to int
function float2int (value) {
    return value | 0;
}


//Y-Axis Label line breaks (add labels left of Y-Axis, centered to the diagram)
function yLabelText(linesArray, svgO){
  for (i = 0; i < linesArray.length; ++i) {
    var yPadding = 20;

    svgO.append("text")
    .attr("y", height/2 - ((yPadding*linesArray.length)/2) + yPadding*i)
    .attr("x",0-margin.left )
    .attr("dy", "1em")
    .attr("font-size", ".9em")
    .style("text-anchor", "start")
    .text(linesArray[i]);
  }
}


//------------------------------------------------------------------------ Variables
//set margins
var margin = {top: 0, right: 200, bottom: 50, left: 140},
    width = 1400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var colCo2Concentration = "steelblue";