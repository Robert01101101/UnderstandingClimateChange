// The svg
var svg = d3.select("#CC_IMPACT_SUM").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g");

// Map and projection
var path = d3.geoPath();/*
var projection = d3.geoMercator()
  .scale(200)
  .center([-160,75])
  .translate([width / 2, height / 2]);*/
var projection = d3['geo' + "Orthographic"]();

/* https://bl.ocks.org/d3indepth/f7ece0ab9a3df06a8cecd2c0e33e54ef */
var geoGenerator = d3.geoPath().Orthographic;

projection
    .scale(900)
    .translate([520, -150])
    .center([-200, 110])
    .rotate([105, -34, 0])


// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([-24, -18, -12, -6, 0, 6, 12, 18, 24])
  .range(d3.schemeRdBu[9]);


//////////////////////////////////////////////////////////////////////////////////// LOAD CLIMATE DATA
var climateDataNest;

var climateData = d3.csv("data/03_2020_Sum.csv", function(d) {
  console.log("loading climate data");
  return {
    prov: d.prov,
    tMean: +d.tMean,
    precipitation: +d.precipitation,
  };
}, function(error, rows) {
  console.log(rows);

  //http://learnjsdata.com/group_data.html
  //Rollup: provide a function that takes the array of values for each group and it produces a value based on that array
  //NEST DATA
  climateDataNest = d3.nest()
  .key(function(d) { return d.prov; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.tMean; }); }) //set value to mean of all values for that province
  .entries(rows);

  console.log("climateDataNest:");
  console.log(climateDataNest);
  //ClimateDataNest is an array of objects. Each object is a province, with a key and an array of values (prov, tMean, precipitation)
  console.log("BC mean");
  //console.log(climateDataNest[0].value);


  function getValueByKey(arrayP, keyN){
    var outVal;
    arrayP.forEach(element => {
      if (element.key == keyN) outVal =  element.value;
    });
    console.log(outVal)
    return outVal;
  }

  function convertName(longName){
    var shortName = "ERROR";
    switch (longName) {
      case "Alberta":
        shortName = "AB";
        break;
      case "Saskatchewan":
        shortName = "SK";
        break;
      case "Manitoba":
        shortName = "MB";
        break;
      case "Newfoundland & Labrador":
        shortName = "NL";
        break;
      case "Prince Edward Island":
        shortName = "PE";
        break;
      case "Nova Scotia":
        shortName = "NS";
        break;
      case "Northwest Territories":
        shortName = "NT";
        break;
      case "Nunavut":
        shortName = "NU";
        break;
      case "Ontario":
        shortName = "ON";
        break;
      case "New Brunswick":
        shortName = "NB";
        break;
      case "Yukon Territory":
        shortName = "YT";
        break;
      case "British Columbia":
        shortName = "BC";
        break;
      case "Quebec":
        shortName = "QC";
        break;
    }
    return shortName;
  }





//////////////////////////////// Stack data
  var mygroups = ["BC", "YT", "NT", "NU",  "AB", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL"]


//////////////////////////////////////////////////////////////////////////////////// LOAD MAP
// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/mdgnkm/SIG-Map/master/canada.json")
  .await(ready);

function ready(error, topo) {

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each province
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      //----------------------------------------------------- set the color of each country
      .attr("fill", function (d, i) {
        console.log("_____________________________")
        console.log(d.properties.NAME);
        console.log(d);
        console.log("i: " + i);
        return colorScale(-getValueByKey(climateDataNest, convertName(d.properties.NAME)));
      });
    }


});