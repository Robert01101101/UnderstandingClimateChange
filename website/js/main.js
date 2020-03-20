////////////////////////////////////////////////////////////////////////////// LOAD DATA ///////////////////////////////////////////////////////
var   url ="http://www.sfu.ca/~rmichels/355_Data/movies_IMDB.json";
var rawDataset;

d3.json(url, 
  function(data) {
  console.log(data);
  dataset = JSON.parse(JSON.stringify(data));
  jsonLoaded();
});

/////////////////////////////////////////////////////////////////////// DATA ANALYSIS METHODS //////////////////////////////////////////////////
//From: https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php
// sort array ascending
const sortArray = arr => arr.sort((a, b) => a - b);
const sum = arr => arr.reduce((a, b) => a + b, 0);
const mean = arr => sum(arr) / arr.length;
// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};
const quantile = (arr, q) => {
    const sorted = sortArray(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};
const q25 = arr => quantile(arr, .25);
const q50 = arr => quantile(arr, .50);
const q75 = arr => quantile(arr, .75);
const median = arr => q50(arr);


////////////////////////////////////////////////////////////////////// SCRIPT ////////////////////////////////////////////////////////
var jsonLoaded = function(){
   var arTitle = new Array();
   for (i = 0; i < dataset.length-1; i++) {
      arTitle.push(dataset[i].Title);
   }
   var arUS_Gross = new Array();
   for (i = 0; i < dataset.length-1; i++) {
      arUS_Gross.push(dataset[i].US_Gross);
   }
   var arWorldwide_Gross = new Array();
   for (i = 0; i < dataset.length-1; i++) {
      arWorldwide_Gross.push(dataset[i].Worldwide_Gross);
   }
   var arWorldwide_Gross = new Array();
   for (i = 0; i < dataset.length-1; i++) {
      arWorldwide_Gross.push(dataset[i].Worldwide_Gross);
   }

   console.log("Test: " + arTitle[0]);
   console.log("-- Finished defining datasets. --");

   /*
   //Process Dataset
   var orderedDataset = [...dataset];
   orderedDataset = sortArray(orderedDataset);
   var dmin = orderedDataset[0];
   var dmax = orderedDataset[orderedDataset.length-1];
   var dQ1 = q25(orderedDataset);
   var dM = q50(orderedDataset);
   var dQ3 = q75(orderedDataset);
   var dsum = sum(orderedDataset);
   var dstd = std(orderedDataset);
   var dmean = mean(orderedDataset);

   console.log("-- Finished analyzing datasets. --");
   console.log("dataset:        " + dataset);
   console.log("orderedDataset: " + orderedDataset);
   console.log("min:            " + dmin);
   console.log("max:            " + dmax);
   console.log("Q1:             " + dQ1);
   console.log("M:              " + dM);
   console.log("Q3:             " + dQ3);
   console.log("sum:            " + dsum);
   console.log("avg:            " + dmean);
   console.log("sd:             " + dstd);

   var writtenSummary = document.getElementById("SIDEBAR").innerHTML + "<br>Dataset Size: " + dataset.length + "<br>Min: " + dmin + "<br>Max: " + dmax + "<br>Q1: " + dQ1 + "<br>Median: " + dM + "<br>Q3: " + dQ3 + 
   "<br>IQR: " + (dQ3-dQ1) + "<br>Sum: " + dsum + "<br>Average: " + dmean + "<br>SD: " + dstd;

   document.getElementById("SIDEBAR").innerHTML = writtenSummary;


   //D3
   console.log("-- Starting d3 processing. --");


   //Create Canvas
   var w = 500;
   var h = 200;
   var barPadding = 1;
   var svg = d3.select("#TOP")
   	.append("svg")
   	.attr("width", w)
   	.attr("height", h);

   //Create Bars, by setting x, y pos, width and height, and fill mapped to value
   var barsTop = svg.selectAll("rect")
   	.data(dataset)
   	.enter()
   	.append("rect")
   	.attr("x", function(d, i) {										//i=n, d=data
   			   		return i * (w / dataset.length);
   			   })
   	.attr("y", function(d) {
   						return h-d*4;
   				   })
     .attr("width", w / dataset.length - barPadding)
     .attr("height", function(d) {
   		return d*4;
     })
     .attr("fill", function(d) {
   	    return "rgb(0, 0, " + (d * 5) + ")";
   	});

   //Create Text, use the positioning of the barsTop as reference
   svg.selectAll("text")
     .data(dataset)
     .enter()
     .append("text")
     .text(function(d) {
     		return d;
     })
     .attr("text-anchor", "middle")
     .attr("x", function(d, i) {
     		return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; //bar pos + half of bar width
     })
     .attr("y", function(d) {
     		return h - (d * 4) + 20;
     })
     .attr("font-size", "16px")
     .attr("fill", "white");
   				   

   d3.select("#BTM")
   	.selectAll("div")
   	.data(orderedDataset)
   	.enter()
   	.append("div")
   	.attr("class", "bar")
   	.style("height", function (d){return d*4+"px"});

   console.log("-- Finished d3 processing. --");
   */
}