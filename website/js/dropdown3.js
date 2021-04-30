
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function hideAllCharts(){
  var d3_T = document.getElementById("d3_T");
  var d3_TA = document.getElementById("d3_TA");
  var d3_P = document.getElementById("d3_P");
  var d3_PA = document.getElementById("d3_PA");
  var ch1 = document.getElementById("ch1_Btm");
  var ch2 = document.getElementById("ch2_Btm");
  var ch3 = document.getElementById("ch3_Btm");
  var ch4 = document.getElementById("ch4_Btm");
  var all = [d3_T, d3_TA, d3_P, d3_PA];
  var filtered = all.filter(function (el) {
    return el != null;
  });
  for (i=0; i<filtered.length; i++){
    filtered[i].remove();
  }
  var all2 = [ch1, ch2, ch3, ch4];
  var filtered2 = all2.filter(function (el) {
    return el != null;
  });
  for (i=0; i<filtered2.length; i++){
    if (!filtered2[i].classList.contains('hide')) filtered2[i].classList.add("hide");
  }
  window.scrollTo(0, 0); 
}

function chart1() {
  console.log("Dropdown: mtDiff");
  hideAllCharts();
  drawSumChartT();
  document.getElementById("CHARTTITLE").innerHTML = "Temperature Deviation";
  document.getElementById("ch1_Btm").classList.remove("hide");
}

function chart2() {
  console.log("Dropdown: mtDiffAbs");
  hideAllCharts();
  drawSumChartTA();
  document.getElementById("CHARTTITLE").innerHTML = "Temperature Deviation (Absolute)";
  document.getElementById("ch2_Btm").classList.remove("hide");
}

function chart3() {
  console.log("Dropdown: mpDiff");
  hideAllCharts();
  drawSumChartP();
  document.getElementById("CHARTTITLE").innerHTML = "Precipitation Deviation";
  document.getElementById("ch3_Btm").classList.remove("hide");
}

function chart4() {
  console.log("Dropdown: mpDiffAbs");
  hideAllCharts();
  drawSumChartPA();
  document.getElementById("CHARTTITLE").innerHTML = "Precipitation Deviation (Absolute)";
  document.getElementById("ch4_Btm").classList.remove("hide");
}