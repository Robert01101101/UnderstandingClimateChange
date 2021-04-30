//Function to keep everything local
(function(){

  var sliderYear = 2020;
  var sliderMonth = 471;
  var curYear = 0;
  var curMonth = 0;
  var usingMonth = false;
  var curProvince = "";
  var showingCanada = true;
  const colorCoding = {
      T: 'T',
      TD: 'TD',
      P: 'P',
      PD: 'PD'
  }
  var curColorCode = colorCoding.TD;
  var switchingInterval = false;

  var margin = {top: 25, right: 20, bottom: 120, left: 20},
      width = 1500 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom - 24;

  // The svg
  var svg = d3.select("#d3_CANADAMAP").append("svg")
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
      .scale(820)
      .translate([500, -150])
      .center([-200, 110])
      .rotate([105, -37.3, 0])


  // Data and color scale
  var data = d3.map();

  var colorScaleT = d3.scaleThreshold()
    .domain([-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15])
    .range(d3.schemeRdBu[11]);

  var colorScaleTD = d3.scaleThreshold()
    .domain([-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5])
    .range(d3.schemeRdBu[11]);

  var colorScaleP = d3.scaleThreshold()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    .range(d3.schemeBrBG[11]);

  var colorScalePD = d3.scaleThreshold()
    .domain([-30, -24, -18, -12, -6, 0, 6, 12, 18, 24, 30])
    .range(d3.schemeBrBG[11]);


  //////////////////////////////////////////////////////////////////////////////////// LOAD CLIMATE DATA
  var climateDataNest, dataNestYear, dataNestMonth, dataNestProvince, dataNest;

  var climateData = d3.csv("data/all_canadaClimateData.csv", function(d) {
    console.log("loading climate data");
    return {
      year : +d.year,
      month : +d.month,
      prov: d.prov,
      n_tMean : +d.n_tMean,
      tMean: +d.tMean,
      n_pMean: +d.n_pMean,
      pMean: +d.pMean,
    };
  }, function(error, rows) {
    //http://learnjsdata.com/group_data.html
    //Rollup: provide a function that takes the array of values for each group and it produces a value based on that array
    //NEST DATA

    dataNest = d3.nest()
      .key(function(d) { return d.year; })
      .key(function(d) { return d.month; })
      .key(function(d) { return d.prov; })
      .entries(rows);
      /*
    console.log("rows:");
    console.log(rows);
    console.log("nest:");
    console.log(dataNest);
    console.log("tMean:" + getValueByMonth(dataNest, "BC", 2010, 1, "tMean"));
    console.log("tNorm:" + getValueByMonth(dataNest, "BC", 2010, 1, "n_tMean"));
    console.log("tDiff:" + getValueByMonth(dataNest, "BC", 2010, 1, "tDiff"));*/
    //ClimateDataNest is an array of objects. Each object is a province, with a key and an array of values (prov, tMean, precipitation)

    //////////////////////////////////////////////////////////////////////////////////// GET VALUE METHODS
    function getAverageByYear(arrayP, keyY, keyV){
      var outVal;
      var i;
      var tmpArray = new Array(12);
      for (i = 1; i < 13; i++) {
        tmpArray[i] = getAverageByMonth(arrayP, keyY, i, keyV)
      }
      var filtered = tmpArray.filter(function (el) {
        return el != null;
      });
      outVal = d3.mean(filtered);
      console.log("Average Year: " + outVal);
      return outVal;
    }

    function getAverageByMonth(arrayP, keyY, keyM, keyV){
      var outVal;
      arrayP.forEach(element => {
        if (element.key == keyY){
          element.values.forEach(element2 => {
            if (element2.key == keyM){
              var tmpArray = new Array(element2.length);
              var i =0;
              element2.values.forEach(element3 => {
                  switch (keyV) {
                    case "tMean":
                      tmpArray[i] = element3.values[0].tMean;
                      break;
                    case "n_tMean":
                      tmpArray[i] = element3.values[0].n_tMean;
                      break;
                    case "tDiff":
                      tmpArray[i] = element3.values[0].tMean - element3.values[0].n_tMean;
                      break;
                    case "pMean":
                      tmpArray[i] = element3.values[0].pMean;
                      break;
                    case "n_pMean":
                      tmpArray[i] = element3.values[0].n_pMean;
                      break;
                    case "pDiff":
                      tmpArray[i] = element3.values[0].pMean - element3.values[0].n_pMean;
                      break;
                }
                i++;
              })
              var filtered = tmpArray.filter(function (el) {
                return el != null;
              });
              outVal = d3.mean(filtered);
            }
          })
        }
      })
      console.log("Average Month: " + outVal);
      return outVal;
    }

    function getValueByYear(arrayP, keyP, keyY, keyV){
      var outVal;
      var i;
      var tmpArray = new Array(12);
      for (i = 1; i < 13; i++) {
        tmpArray[i] = getValueByMonth(arrayP, keyP, keyY, i, keyV)
      }
      var filtered = tmpArray.filter(function (el) {
        return el != null;
      });
      outVal = d3.mean(filtered);
      console.log("value Year: " + outVal);
      return outVal;
    }

    function getValueByMonth(arrayP, keyP, keyY, keyM, keyV){
      var outVal;
      arrayP.forEach(element => {
        if (element.key == keyY){
          element.values.forEach(element2 => {
            if (element2.key == keyM){
              element2.values.forEach(element3 => {
                if (element3.key == keyP) 
                  switch (keyV) {
                  case "tMean":
                    outVal = element3.values[0].tMean;
                    break;
                  case "n_tMean":
                    outVal = element3.values[0].n_tMean;
                    break;
                  case "tDiff":
                    outVal = element3.values[0].tMean - element3.values[0].n_tMean;
                    break;
                  case "pMean":
                    outVal = element3.values[0].pMean;
                    break;
                  case "n_pMean":
                    outVal = element3.values[0].n_pMean;
                    break;
                  case "pDiff":
                    outVal = element3.values[0].pMean - element3.values[0].n_pMean;
                    break;
                }
                  
              })
            }
          })
        }
      })
      console.log("value Month: keyV=" + keyV + ", val=" + outVal);
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////// SLIDER Y
  // Function called when slider is used
  function sliderUpdateY(value) {
    console.log("____________________________________________________________________________________");
    console.log("new selected year: " + value);
    sliderYear = value;
    updateDate();
  }

  // Listen to the slider?
  d3.select("#mySliderY").on("input", function(d){
    selectedValue = this.value
    if (!switchingInterval) sliderUpdateY(selectedValue);
  })

  ///////////////////////////////////////////////////////////////////////////////////////////////////// SLIDER M
  // Function called when slider is used
  function sliderUpdateM(value) {
    console.log("____________________________________________________________________________________");
    console.log("new selected month: " + value);
    sliderMonth = value;
    updateDate();
  }

  // Listen to the slider?
  d3.select("#mySliderM").on("input", function(d){
    selectedValue = this.value
    if (!switchingInterval) sliderUpdateM(selectedValue);
  })

  function updateDate(){
    if (usingMonth){
      curYear = 1981+(Math.floor((+sliderMonth-1)/12));
      curMonth = sliderMonth - (Math.floor((+sliderMonth-1)/12)*12);
    } else {
      curYear = sliderYear;
      curMonth = 1;
    }

    lblYear.text(curYear);
    var monthLabel = "";
    switch (curMonth) {
                  case 1: monthLabel = "January"; break;   case 2: monthLabel = "February"; break;
                  case 3: monthLabel = "March"; break;   case 4: monthLabel = "April"; break;
                  case 5: monthLabel = "May"; break;   case 6: monthLabel = "June"; break;
                  case 7: monthLabel = "July"; break;   case 8: monthLabel = "August"; break;
                  case 9: monthLabel = "September"; break;   case 10: monthLabel = "October"; break;
                  case 11: monthLabel = "November"; break;   case 12: monthLabel = "December"; break; }
    lblMonth.text(monthLabel);

    
    var tempText = "";
    tempText = d3.format(".3f")(getAverageByMonth(dataNest, curYear, curMonth, "tDiff"));
    if (isNaN(tempText)) { tempText="Invalid Data"} else { tempText = tempText + "°C"};
    lbl_C_tD.text(tempText);


    updateDateData(true);
    updateDateData(false);
    drawMap();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  var playingAnim = false;

  async function animateSlider() {
    console.log("animating");
    var sliderID;
    if (usingMonth){
      sliderID = document.getElementById("mySliderM")
    } else {
      sliderID = document.getElementById("mySliderY")
    }
    var sleepDur = 8000 / (sliderID.max - sliderID.min);
    // Sleep in loop
    for (let i = sliderID.min; i <= sliderID.max; i++) {
      if (!playingAnim) {play.text("\u25B7"); break; }
      sliderID.value = i;
      console.log("Animation: curVal = " + i);
      if (usingMonth) { sliderUpdateM(i); } else { sliderUpdateY(i); }
      if (i == sliderID.max) play.text("\u25B7");
      await sleep(sleepDur);
    }
  }

  //Append play button
  var play = svg.append("text")
      .attr("class", "play")
      .attr("x", 120)
      .attr("y", 50)
      .style("alignment-baseline", "middle")
      .text("\u25B7")  //unicode triangle: U+25B2  \u25b2

  play.on("click", function(){
        if (!playingAnim) {
          play.text("\u25A1");
          playingAnim = true;
          animateSlider();
        } else {
          play.text("\u25B7");
          playingAnim = false;
        }
    });


   /////////////////////////////////////////////////////////////////////////////////////////////////////// Listen to Radio Buttons

  function chart1() {
    console.log("chart Canada Map");
    hideAllCharts();
    document.getElementById("d3_CANADAMAP").classList.remove("hide");
    document.getElementById("canadaMapSliders").classList.remove("hide");
    document.getElementById("CHARTTITLE").innerHTML = "Canadian Weather Data";
    playingAnim = false;
  }

  function chart2() {
    console.log("chart Temp Anomaly");
    hideAllCharts();
    document.getElementById("d3_TEMPANOMALY").classList.remove("hide");
    document.getElementById("mySlider").classList.remove("hide");
    document.getElementById("CHARTTITLE").innerHTML = "Global Temperature Anomaly";
    playingAnim = false;
  }

  //____________________________________________________________________________ Radio Btn Time Interval
  var radios = document.forms["timeIntervalForm"].elements["timeInterval"];
  for(var i = 0, max = radios.length; i < max; i++) {
      radios[i].onclick = function() {
        switchingInterval = true;
        var buttonName = "";
          if (document.getElementById('rbYear').checked) {
            usingMonth = false;
            document.getElementById("mySliderY").classList.remove("hide");
            document.getElementById("mySliderM").classList.add("hide");
            document.getElementById("headerMonth").classList.add("hide");
            document.getElementById("lblMonth").classList.add("hide");
            document.getElementById("mySliderY").value = curYear;
            buttonName = document.getElementById('rbYear').value;
            sliderYear = curYear;
          }

          else if (document.getElementById('rbMonth').checked) {
            usingMonth = true;
            document.getElementById("mySliderY").classList.add("hide");
            document.getElementById("mySliderM").classList.remove("hide");
            document.getElementById("headerMonth").classList.remove("hide");
            document.getElementById("lblMonth").classList.remove("hide");
            document.getElementById("mySliderM").value = curMonth + ((curYear-1981)*12);
            buttonName = document.getElementById('rbMonth').value;
            sliderMonth = curMonth + ((curYear-1981)*12);
          }
          console.log("____________________________________________________________________________________");
          console.log("radio Click:" + buttonName);
          switchingInterval = false;
          playingAnim = false;
          updateDate();
      }
  }

  //____________________________________________________________________________ Radio Btn Color
  var radios2 = document.forms["colorMappingForm"].elements["colorMapping"];
  document.getElementById('colMin').style.backgroundColor = colorScaleTD(2.6);
  document.getElementById('colMid').style.backgroundColor = colorScaleTD(0);
  document.getElementById('colMax').style.backgroundColor = colorScaleTD(-2.6);
  for(var i = 0, max = radios2.length; i < max; i++) {
      radios2[i].onclick = function() {
        var buttonName = "";
          if (document.getElementById('rbTemperature').checked) {
            curColorCode = colorCoding.T;
          }
          else if (document.getElementById('rbPercipitation').checked) {
            curColorCode = colorCoding.P;
          }
          else if (document.getElementById('rbTemperatureD').checked) {
            curColorCode = colorCoding.TD;
          }
          else if (document.getElementById('rbPercipitationD').checked) {
            curColorCode = colorCoding.PD;
          }
          if (curColorCode == colorCoding.T) {
            document.getElementById('colMin').style.backgroundColor = colorScaleT(-15.1);
            document.getElementById('colMid').style.backgroundColor = colorScaleT(0);
            document.getElementById('colMax').style.backgroundColor = colorScaleT(15.1);
            document.getElementById('colMin').innerHTML = "-15°C";
            document.getElementById('colMid').innerHTML = "0°C";
            document.getElementById('colMax').innerHTML = "15°C";
          } else if (curColorCode == colorCoding.TD) {
            document.getElementById('colMin').style.backgroundColor = colorScaleTD(-2.6);
            document.getElementById('colMid').style.backgroundColor = colorScaleTD(0);
            document.getElementById('colMax').style.backgroundColor = colorScaleTD(2.6);
            document.getElementById('colMin').innerHTML = "-2.5°C";
            document.getElementById('colMid').innerHTML = "0°C";
            document.getElementById('colMax').innerHTML = "+2.5°C";
          } else if (curColorCode == colorCoding.P) {
            document.getElementById('colMin').style.backgroundColor = colorScaleP(0);
            document.getElementById('colMid').style.backgroundColor = colorScaleP(51);
            document.getElementById('colMax').style.backgroundColor = colorScaleP(101);
            document.getElementById('colMin').innerHTML = "0mm";
            document.getElementById('colMid').innerHTML = "50mm";
            document.getElementById('colMax').innerHTML = "100mm";
          } else {
            document.getElementById('colMin').style.backgroundColor = colorScalePD(-31);
            document.getElementById('colMid').style.backgroundColor = colorScalePD(0);
            document.getElementById('colMax').style.backgroundColor = colorScalePD(31);
            document.getElementById('colMin').innerHTML = "-30mm";
            document.getElementById('colMid').innerHTML = "0mm";
            document.getElementById('colMax').innerHTML = "+30mm";
          }
          updateUnderline();
          console.log("____________________________________________________________________________________");
          console.log("radio Click:" + buttonName);
          playingAnim = false;
          drawMap();
      }
  }

  function updateUnderline(){
        if (curColorCode == colorCoding.T) { 
          lbl_C_tM.style("text-decoration", "underline");
          lbl_L_tM.style("text-decoration", "underline");
        } else {
          lbl_C_tM.style("text-decoration", "none");
          lbl_L_tM.style("text-decoration", "none");
        }
        if (curColorCode == colorCoding.TD) { 
          lbl_C_tD.style("text-decoration", "underline");
          lbl_L_tD.style("text-decoration", "underline");
        } else {
          lbl_C_tD.style("text-decoration", "none");
          lbl_L_tD.style("text-decoration", "none");
        }
        if (curColorCode == colorCoding.P) { 
          lbl_C_pM.style("text-decoration", "underline");
          lbl_L_pM.style("text-decoration", "underline");
        } else {
          lbl_C_pM.style("text-decoration", "none");
          lbl_L_pM.style("text-decoration", "none");
        }
        if (curColorCode == colorCoding.PD) { 
          lbl_C_pD.style("text-decoration", "underline");
          lbl_L_pD.style("text-decoration", "underline");
        } else {
          lbl_C_pD.style("text-decoration", "none");
          lbl_L_pD.style("text-decoration", "none");
        }
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////// ADD LEGEND RIGHT
  ////////////////////////////////////// Generate Legend
  var lW = 380;
  var lH = 400;
  var lX = width-lW+10;
  var lY = 50;
  var legend = svg
      .append("svg")
      .attr("x", lX)
      .attr("y", lY)
      .attr("width", lW)
      .attr("height", lH)
      .append("g");
  legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", lW)
            .attr("height", lH)
            .style("fill", "#333")

  var legendPg1 = legend.append("g").attr("id", "legendPg1");
  var legendPg2 = legend.append("g").attr("id", "legendPg2").attr("class", "hide");

  ////////////////////////////////////// Generate Text
  var padding = 8;
  var groupPadding = 22;
  var textH = 20;
  var posX = 20;

  var lblYear, lblMonth, lblProvince, headerMonth;

  generateLegendText(0, "Year", 0, true);
  lblYear = generateLegendText(0, "", 0, false);
  headerMonth = generateLegendText(0, "Month", 0, true, 2, 2, "headerMonth", true);
  lblMonth = generateLegendText(0, "", 0, false, 2, 2, "lblMonth", true);
  generateLegendText(2, "Province", 1, true);
  lblProvince = generateLegendText(2, "Hover to view", 1, false);

  generateLegendText(2, "tDeviation", 2, true);
  lbl_L_tD = generateLegendText(2, "hover to view", 2, false);
  generateLegendText(2, "tMean", 2, true, 2, 3);
  lbl_L_tM = generateLegendText(2, "hover to view", 2, false, 2, 3);
  generateLegendText(2, "tMean_Norm", 2, true, 3, 3);
  lbl_L_tN = generateLegendText(2, "hover to view", 2, false, 3, 3);

  generateLegendText(2, "pDeviation", 3, true);
  lbl_L_pD = generateLegendText(2, "hover to view", 3, false);
  generateLegendText(2, "pMean", 3, true, 2, 3);
  lbl_L_pM = generateLegendText(2, "hover to view", 3, false, 2, 3);
  generateLegendText(2, "pMean_Norm", 3, true, 3, 3);
  lbl_L_pN = generateLegendText(2, "hover to view", 3, false, 3, 3);

  generateLegendText(1, "tDeviation", 2, true);
  lbl_C_tD = generateLegendText(1, "", 2, false);
  generateLegendText(1, "tMean", 2, true, 2, 3);
  lbl_C_tM = generateLegendText(1, "", 2, false, 2, 3);
  generateLegendText(1, "tMean_Norm", 2, true, 3, 3);
  lbl_C_tN = generateLegendText(1, "", 2, false, 3, 3);

  generateLegendText(1, "pDeviation", 3, true);
  lbl_C_pD = generateLegendText(1, "", 3, false);
  generateLegendText(1, "pMean", 3, true, 2, 3);
  lbl_C_pM = generateLegendText(1, "", 3, false, 2, 3);
  generateLegendText(1, "pMean_Norm", 3, true, 3, 3);
  lbl_C_pN = generateLegendText(1, "", 3, false, 3, 3);


  function generateLegendText(inLegend, text, row, header, col, colCnt, id, hide) {
    var extraPadding = 0;
    var tmpLegend = legend;
    switch(inLegend){
        case 0: tmpLegend = legend; break;
        case 1: tmpLegend = legendPg1; break;
        case 2: tmpLegend = legendPg2; break;
    }
    tmpText = tmpLegend.append("text");
    if (!header) extraPadding = textH+padding;
    // Add labels
    tmpText
        .attr("x", posX)
        .attr("y", posX + row*(padding*2+groupPadding+textH*2) + extraPadding)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "hanging")
        .attr("fill", "var(--colWhite)")
        .attr("font-family", "Lato, sans-serif")
        .text(text);

    if (id != null) tmpText.attr("id", id)
    if (hide) tmpText.attr("class", "hide")
    if (col == 2) tmpText.attr("x", lW/2)
    if (colCnt == 3){
      if (col == 2) tmpText.attr("x", posX/2+lW/3)
      if (col == 3) tmpText.attr("x", lW/3*2)
    }

    if (header){
      tmpText
        .attr("font-weight", "700")
    } else {
      tmpText
        .attr("font-weight", "300")
    }

    return tmpText;
  }

  lbl_L_tD.style("text-decoration", "underline")
  lbl_C_tD.style("text-decoration", "underline")

  ///////////////////////////////////////////////////////////////////////////////////////////////////// BUTTONS
  // Listen to Buttons
  d3.select("#canadaMapShowCanadian").on("click", function(d){
    showPg1();
  })
  d3.select("#canadaMapShowProvincial").on("click", function(d){
    showPg2();
  })
  function showPg1(){
    document.getElementById("legendPg1").classList.remove("hide");
    document.getElementById("legendPg2").classList.add("hide");
    document.getElementById("canadaMapShowCanadian").classList.add("btnSelected");
    document.getElementById("canadaMapShowProvincial").classList.remove("btnSelected");
    showingCanada = true;
  }
  function showPg2(){
    document.getElementById("legendPg1").classList.add("hide");
    document.getElementById("legendPg2").classList.remove("hide");
    document.getElementById("canadaMapShowCanadian").classList.remove("btnSelected");
    document.getElementById("canadaMapShowProvincial").classList.add("btnSelected");
    showingCanada = false;
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////// Hover
   let mouseOver = function(d) {
      if (!showingCanada){
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
        console.log("mouseOver d=");
        console.log(d);
        console.log(d.properties.NAME); // Name
        curProvince = d.properties.NAME;
        lblProvince.text(d.properties.NAME);
        updateDateData(false);
      } else {
        document.getElementById("canadaMapShowProvincial").classList.add("highlightPbtn");
      }
    }

    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 1)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
      if (showingCanada) document.getElementById("canadaMapShowProvincial").classList.remove("highlightPbtn");
    }

    function getValue(yearlySum, keyV){
      if (yearlySum) {
        if (usingMonth){
          return getAverageByMonth(dataNest, curYear, curMonth, keyV);
        } else {
          return getAverageByYear(dataNest, curYear, keyV);
        }
      } else {
        if (usingMonth){
          return getValueByMonth(dataNest, convertName(curProvince), curYear, curMonth, keyV);
        } else {
          return getValueByYear(dataNest, convertName(curProvince), curYear, keyV);
        }
      }
    }

    function updateDateData(yearlySum){
      var tmpTxt_tMean = "";
      var tmpTxt_tNorm = "";
      var tmpTxt_tDiff = "";

      tmpTxt_tMean = getValue(yearlySum, "tMean");
      tmpTxt_tNorm = getValue(yearlySum, "n_tMean");
      tmpTxt_tDiff = getValue(yearlySum, "tDiff");
      tmpTxt_pMean = getValue(yearlySum, "pMean");
      tmpTxt_pNorm = getValue(yearlySum, "n_pMean");
      tmpTxt_pDiff = getValue(yearlySum, "pDiff");

      var textArray = [tmpTxt_tMean, tmpTxt_tNorm, tmpTxt_tDiff, tmpTxt_pMean, tmpTxt_pNorm, tmpTxt_pDiff];

      var i;
      for (i = 0; i < textArray.length; i++) {
        if (i<3) { 
          textArray[i] = d3.format(".3f")(textArray[i]); 
          if (isNaN(textArray[i])) { textArray[i]="No Data"} else { textArray[i] = textArray[i] + "°C"};
        } else { 
          textArray[i] = d3.format(".3")(textArray[i]); 
          if (isNaN(textArray[i])) { textArray[i]="No Data"} else { textArray[i] = textArray[i] + "mm"};
        }
        
      }

      if (yearlySum) {
        lbl_C_tM.text(textArray[0]);
        lbl_C_tN.text(textArray[1]);
        lbl_C_tD.text(textArray[2]);
        lbl_C_pM.text(textArray[3]);
        lbl_C_pN.text(textArray[4]);
        lbl_C_pD.text(textArray[5]);
      } else {
        lbl_L_tM.text(textArray[0]);
        lbl_L_tN.text(textArray[1]);
        lbl_L_tD.text(textArray[2]);
        lbl_L_pM.text(textArray[3]);
        lbl_L_pN.text(textArray[4]);
        lbl_L_pD.text(textArray[5]);
      }
    }


  //////////////////////////////////////////////////////////////////////////////////////////////// DRAW MAP (called on load and Slider change)

  var gTopo;
  function ready(error, topo) {
    gTopo = topo;

    updateDate();
    drawMap();
  }

  function drawMap() {
    if (d3.selectAll(".oldChart")) {
          d3.selectAll(".oldChart").remove();
      }


    // Draw the map
    svg.append("g")
      .attr("class", "oldChart")
      .selectAll("path")
      .data(gTopo.features)
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
          //console.log(d);
          //console.log("i: " + i);
          console.log("curYear:" + curYear);
          //console.log(sliderMonth);
          //console.log((1981+(Math.floor((+sliderMonth-1)/12))));
          //console.log(+sliderMonth - (Math.floor((+sliderMonth-1)/12)*12));
          var output;
          if (usingMonth){
            switch(curColorCode){
                case colorCoding.T: output = colorScaleT(-getValueByMonth(dataNest, convertName(d.properties.NAME), curYear, curMonth, "tMean")); break;
                case colorCoding.TD: output = colorScaleTD(-getValueByMonth(dataNest, convertName(d.properties.NAME), curYear, curMonth, "tDiff")); break;
                case colorCoding.P: output = colorScaleP(getValueByMonth(dataNest, convertName(d.properties.NAME), curYear, curMonth, "pMean")); break;
                case colorCoding.PD: output = colorScalePD(getValueByMonth(dataNest, convertName(d.properties.NAME), curYear, curMonth, "pDiff")); break;
            }
          } else {
            switch(curColorCode){
                case colorCoding.T: output = colorScaleT(-getValueByYear(dataNest, convertName(d.properties.NAME), curYear, "tMean")); break;
                case colorCoding.TD: output = colorScaleTD(-getValueByYear(dataNest, convertName(d.properties.NAME), curYear, "tDiff")); break;
                case colorCoding.P: output = colorScaleP(getValueByYear(dataNest, convertName(d.properties.NAME), curYear, "pMean")); break;
                case colorCoding.PD: output = colorScalePD(getValueByYear(dataNest, convertName(d.properties.NAME), curYear, "pDiff")); break;
            }
          }
          return output;
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", 1)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave );
  }

  });


})();