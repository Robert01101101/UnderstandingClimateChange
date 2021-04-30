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
function yLabelText(linesArray, svgO, col){
  if (arguments.length == 2) col="black";
  for (i = 0; i < linesArray.length; ++i) {
    var yPadding = 20;

    svgO.append("text")
    .attr("fill", col)
    .attr("y", height/2 - ((yPadding*linesArray.length)/2) + yPadding*i)
    .attr("x",0-margin.left )
    .attr("dy", "1em")
    .attr("font-size", ".9em")
    .style("text-anchor", "start")
    .text(linesArray[i]);
  }
}

function yLabelRight(linesArray, svgO, col){
  if (arguments.length == 2) col="black";
  for (i = 0; i < linesArray.length; ++i) {
    var yPadding = 20;

    svgO.append("text")
    .attr("fill", col)
    .attr("y", height/2 - ((yPadding*linesArray.length)/2) + yPadding*i)
    .attr("x",width+100 )
    .attr("dy", "1em")
    .attr("font-size", ".9em")
    .style("text-anchor", "start")
    .text(linesArray[i]);
  }
}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;


//------------------------------------------------------------------------ Variables
//set margins
var margin = {top: 75, right: 300, bottom: 70, left: 180},
    width = 1500 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var colBlue = "#81B4DE";

var colWhite = "#C4C4C4";

var colOrange = "#D16A32";

var cursorPos = {x: 0, topY: -30, btmY: +30, h:30, w: 150};