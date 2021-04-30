


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
  var allCharts = new Array(10);
  allCharts[0] = document.getElementById("d3_CH1");
  allCharts[1] = document.getElementById("d3_CH2");
  allCharts[2] = document.getElementById("d3_CH3");
  allCharts[3] = document.getElementById("d3_CH4");
  allCharts[4] = document.getElementById("d3_CH5");
  allCharts[5] = document.getElementById("ch1_Btm");
  allCharts[6] = document.getElementById("ch2_Btm");
  allCharts[7] = document.getElementById("ch3_Btm");
  allCharts[8] = document.getElementById("ch4_Btm");
  allCharts[9] = document.getElementById("ch5_Btm");
  var i;
  for (i = 0; i < allCharts.length; i++) {
    if (!allCharts[i].classList.contains('hide')) allCharts[i].classList.add("hide");
  }
  window.scrollTo(0, 0); 
}

function chart1() {
  console.log("chart1");
  hideAllCharts();
  document.getElementById("d3_CH1").classList.remove("hide");
  document.getElementById("ch1_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Atmospheric CO2 concentration (Historic)";
}

function chart2() {
  console.log("chart2");
  hideAllCharts();
  document.getElementById("d3_CH2").classList.remove("hide");
  document.getElementById("ch2_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Atmospheric CO2 concentration (Recent)";
}

function chart3() {
  console.log("chart3");
  hideAllCharts();
  document.getElementById("d3_CH3").classList.remove("hide");
  document.getElementById("ch3_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Human CO2 emissions";
}

function chart4() {
  console.log("chart4");
  hideAllCharts();
  document.getElementById("d3_CH4").classList.remove("hide");
  document.getElementById("ch4_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Human CO2 emissions (by region)";
}

function chart5() {
  console.log("chart5");
  hideAllCharts();
  document.getElementById("d3_CH5").classList.remove("hide");
  document.getElementById("ch5_Btm").classList.remove("hide");
  document.getElementById("CHARTTITLE").innerHTML = "Comparing emissions and atmospheric concentration";
}