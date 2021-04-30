
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

function hideAllCharts() {
  var allCharts = new Array(8);
  allCharts[0] = document.getElementById("d3_CANADAMAP");
  allCharts[1] = document.getElementById("d3_TEMPANOMALY");
  allCharts[2] = document.getElementById("canadaMapSliders");
  allCharts[3] = document.getElementById("mySlider");
  allCharts[4] = document.getElementById("canadaMapLegendLeft");
  allCharts[5] = document.getElementById("canadaMapBtns");
  allCharts[6] = document.getElementById("ch1_Btm");
  allCharts[7] = document.getElementById("ch2_Btm");
  var i;
  for (i = 0; i < allCharts.length; i++) {
    if (!allCharts[i].classList.contains('hide')) allCharts[i].classList.add("hide");
  }
  window.scrollTo(0, 0); 
}

function chart1() {
  console.log("chart Canada Map");
  hideAllCharts();
  document.getElementById("d3_CANADAMAP").classList.remove("hide");
  document.getElementById("canadaMapSliders").classList.remove("hide");
  document.getElementById("canadaMapLegendLeft").classList.remove("hide");
  document.getElementById("canadaMapBtns").classList.remove("hide");
  document.getElementById("ch1_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Canadian Weather Data (1981 - 2020)";

}

function chart2() {
  console.log("chart Temp Anomaly");
  hideAllCharts();
  document.getElementById("d3_TEMPANOMALY").classList.remove("hide");
  document.getElementById("mySlider").classList.remove("hide");
  document.getElementById("ch2_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Global Temperature Anomaly (1850 - 2016)";
}
