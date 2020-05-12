console.log('client js')



$(document).ready(function() {
  $('#selDataset').select2();
});

function buildMetadata(countries) {
  var sampleMetadata = d3.select("#sample-metadata")
  // Use `.html("") to clear any existing metadata
  //sampleMetadata.selectAll(".well").remove();
  sampleMetadata.selectAll("div").remove();
  sampleMetadata.selectAll("h2").remove();
  sampleMetadata.selectAll("p").remove();
  sampleMetadata.selectAll("a").remove();
  
  for (i=0;i<countries.length;i++) {

  var url = "/countries/"+countries[i];
  //Use `d3.json` to fetch the metadata for a sample
  
  var data = []


  function nFormatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }

   d3.json(url).then(function(data) { 

  console.log(data);
  var selecteddiv = d3.selectAll("#sample-metadata").append("div")  
if (data[5]==='Full'){

selecteddiv
 .classed("well", true).style("border-color", "red");
selecteddiv.append("h3").text(data[0].toUpperCase());
selecteddiv.append("p").text("Population:   "+nFormatter(data[1], 1));
selecteddiv.append("p").text("Density (p/km"+'\xB2): '+data[2]);
selecteddiv.append("p").text("Median age: "+data[3]);
if (data[4]){
selecteddiv.append("a").text(data[5]+" lockdown ").attr("href",data[6]);
selecteddiv.append("em").text("on "+data[4]);
}
else {
  selecteddiv.append("p").text(data[5]+" lockdown ")
}
// selecteddiv.append("p").text(data[5]);
// selecteddiv.append("a").text("more info").attr("href",data[6]);
}

else if (data[5]==='Partial') {
  var selecteddiv = d3.selectAll("#sample-metadata").append("div")
 .classed("well", true).style("border-color", "gold");
selecteddiv.append("h3").text(data[0].toUpperCase());
selecteddiv.append("p").text("Population: "+nFormatter(data[1], 1));
selecteddiv.append("p").text("Density (p/km"+'\xB2): '+data[2]);
selecteddiv.append("p").text("Median age: "+data[3]);
if (data[4]){
selecteddiv.append("a").text(data[5]+" lockdown ").attr("href",data[6]);
selecteddiv.append("em").text("on "+data[4]);
}
else {
  selecteddiv.append("p").text(data[5]+" lockdown ")
}
}

else if(data[5]==='No'){
  var selecteddiv = d3.selectAll("#sample-metadata").append("div")
  .classed("well", true).style("border-color", "yellowgreen");
 selecteddiv.append("h3").text(data[0].toUpperCase());
 selecteddiv.append("p").text("Population: "+nFormatter(data[1], 1));
 selecteddiv.append("p").text("Density (p/km"+'\xB2): '+data[2]);
 selecteddiv.append("p").text("Median age: "+data[3]);
 if (data[4]){
 selecteddiv.append("a").text(data[5]+" lockdown ").attr("href",data[6]);
 selecteddiv.append("em").text(data[4]|| '');
 }
 else {
   selecteddiv.append("p").text(data[5]+" lockdown ")
 }
}
  });
}
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
console.log(selector);
  // Use the list of sample names to populate the select options
  d3.json("/namelist").then((symbolNames) => {
    symbolNames.forEach((symbol) => {
      selector
        .append("option")
        .text(symbol)
        .property("value", symbol);
    });

    // Use the first sample from the list to build the initial plots
   // const firstSample = symbolNames[0];
   const firstSample = 'US';
  
    buildMetadata([firstSample]);

    buildChart(firstSample);

  });
}

function optionChanged(selector) {
  /// figure out how to get the items from the selector...
  /// not very hard  

  console.log(selector);
  console.log(selector.selectedOptions);
  console.log(selector.selectedOptions.length);
  var selectedArray = []
for (i=0; i<selector.selectedOptions.length; i++) {
  console.log(selector.selectedOptions[i].value);
  selectedArray.push(selector.selectedOptions[i].value)
}
console.log(selectedArray);
    // Use the list of sample names to populate the select options


  buildMetadata(selectedArray);

  buildChart(selectedArray);
//FINISH THIS ONE
  //buildNewChart(newSample);

}

function buildChart(countries) {
console.log(countries);
 d3.select("#bubble").selectAll("svg").remove();
  
 var margin = {top: 100, right: 100, bottom: 100, left: 100},
 width = 900 - margin.left - margin.right,
 height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble")
.append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom);
// .append("g")
//  .attr("transform",
//        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
url = "new_cases_all"
var parseTime = d3.timeParse("%m/%d/%y")
function filterCountries(d) {     if( countries.includes(d.country)){
  console.log(d);
  return d;

}
}

var chosenXAxis = "date";
var chosenYAxis = "new_cases";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {

  if (chosenXAxis === "date") {


  // create scales

 //d3.scaleTime().range([0, width])
  var xLinearScale = d3.scaleTime()
    .domain([d3.min(healthData, d => d[chosenXAxis]),
      d3.max(healthData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;
  }

  else {
      // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
    d3.max(healthData, d => d[chosenXAxis]) * 1.2
  ])
  .range([0, width]);

return xLinearScale;
  }
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) 
    ])
    .range([height, 0]);
 

  return yLinearScale;

}

function renderYAxes(newYScale, yAxis) {
  console.log(yAxis)
  if (chosenYAxis === 'new_cases_perc'){
  var leftAxis = d3.axisLeft(newYScale).tickFormat("");

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
  }
  else{
    var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
  }
}


d3.json(url).then(function(data) {



  data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.new_cases_perc = +d.new_cases_perc;
    d.new_cases = +d.new_cases;
    d.days_death = +d.days_death;
    d.days_lock = +d.days_lock;
    countries.includes(d.country);

});

console.log(data.filter(d=>d.country =='US'));
data = data.filter(d=>countries.includes(d.country));

var xLinearScale = xScale(data, chosenXAxis);
var yLinearScale = yScale(data, chosenYAxis);
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

var yAxis = chartGroup.append("g")

.classed("y-axis", true)
    //.attr("transform", `translate(0, ${width})`)
    .call(leftAxis);
    


// }
console.log(data);


//THIS WORKS


// group the data: I want to draw one line per group
var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
 .key(function(d) { return d.country;})
 .entries(data);




// color palette
var res = sumstat.map(function(d){ return d.key }) // list of group names
var color = d3.scaleOrdinal()
 .domain(res)
 .range(['#f781bf','#377eb8','#FF7F50','#984ea3','#a65628','#999999'])


 var legend = svg.selectAll('.line')
 .data(sumstat)
 .enter()
 .append('g')
 .attr('class', 'legend');

legend.append('rect')
 .attr('x', 230)
 .attr('y', function(d, i) {
   return i * 20+50;
 })
 .attr('width', 15)
 .attr('height', 15)
 .style('fill', function(d) {
   return color(d.key);
 })

legend.append('text')
 .attr('x', 250)
 .attr('y', function(d, i) {
   return (i * 20) + 61;
 })
 .text(function(d) {
   return d.key;
 });

function renderLines(linesGroup, newXScale, chosenXaxis) {
  console.log(chosenXAxis);
    linesGroup
  
       .transition()
       .duration(1000)
         .attr("d", function(d){
  
           return d3.line()
           .curve(d3.curveBasis)
             .x(function(d) { return newXScale(d[chosenXAxis]); })
             .y(function(d) { return yLinearScale(d[chosenYAxis]); })
             (d.values)

         })
  
  
         return linesGroup
  
        }






function renderYLines(linesGroup, newYScale, chosenYaxis) {
console.log(chosenYAxis);
  linesGroup

     .transition()
     .duration(1000)
       .attr("d", function(d){

         return d3.line()
         .curve(d3.curveBasis)
           .x(function(d) { return xLinearScale(d[chosenXAxis]); })
           .y(function(d) { return newYScale(d[chosenYAxis]); })
           (d.values)

       })


       return linesGroup

      }
// Draw the line
var linesGroup = 
chartGroup.selectAll(".line")
   .data(sumstat)
   .enter()
   .append("path")
     .attr("fill", "none")
     .attr("stroke", function(d){ return color(d.key) })
     .attr("stroke-width", 1.5)
     .attr("d", function(d){

       return d3.line()
        .curve(d3.curveBasis)
         .x(function(d) { return xLinearScale(d[chosenXAxis]); })
         .y(function(d) { return yLinearScale(d[chosenYAxis]); })
         (d.values)
  
     })
    
    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width /2}, ${height + 20})`);
  
    var dateLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "date") // value to grab for event listener
      .classed("active", true)
      .text("Date");
  
    var deathLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "days_death") // value to grab for event listener
      .classed("inactive", true)
      .text("Days since first death");


    var lockLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "days_lock") // value to grab for event listener
      .classed("inactive", true)
      .text("Days since lockdown");


// Create group for  2 y- axis labels
var labelsGroupY = chartGroup.append("g")
// .attr("transform", `translate(${width /2}, ${height + 20})`);
.attr("transform", "rotate(-90)")


var new_casesLabel = labelsGroupY.append("text")
//.attr("y", 0 - margin.left)?????????????????
.attr("y",0-60)
.attr("dy", "1em")

.attr("x", 0 - (height / 2))
.attr("value", "new_cases") // value to grab for event listener
.classed("active", true)
.text("New cases");

var new_cases_percLabel = labelsGroupY.append("text")
//.attr("y", 0 - margin.left)
.attr("y",0-90)
.attr("dy", "1em")
.attr("x", 0 - (height / 2))
.attr("value", "new_cases_perc") // value to grab for event listener
.classed("inactive", true)
.text("New cases per capita");


labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  

          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates  new x values
          linesGroup = renderLines(linesGroup, xLinearScale, chosenXAxis);

  
          // changes classes to change bold text
          if (chosenXAxis === "date") {
            dateLabel
              .classed("active", true)
              .classed("inactive", false);
            deathLabel
              .classed("active", false)
              .classed("inactive", true);
            lockLabel
              .classed("active", false)
              .classed("inactive", true);

          }
          else if (chosenXAxis === "days_death") {
            dateLabel
            .classed("active", false)
            .classed("inactive", true);
          deathLabel
            .classed("active", true)
            .classed("inactive", false);
          lockLabel
            .classed("active", false)
            .classed("inactive", true);
          }
          else {
            dateLabel
            .classed("active", false)
            .classed("inactive", true);
          deathLabel
            .classed("active", false)
            .classed("inactive", true);
          lockLabel
            .classed("active", true)
            .classed("inactive", false); 

          }
        }
      });

      labelsGroupY.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // replaces chosenXAxis with value
          chosenYAxis = value;
  
          console.log(chosenYAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(data, chosenYAxis);
  
          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);
  
          // updates circles with new x values
          linesGroup = renderYLines(linesGroup, yLinearScale, chosenYAxis);
          //circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);
          // // updates tooltips with new info
          // linesGroup = updateToolTipY(chosenYAxis, linesGroup);
  
          // changes classes to change bold text
          if (chosenYAxis === "new_cases") {
            new_casesLabel
              .classed("active", true)
              .classed("inactive", false);
            new_cases_percLabel
              .classed("active", false)
              .classed("inactive", true);

  
          }

          else {
            new_casesLabel
            .classed("active", false)
            .classed("inactive", true);

          new_cases_percLabel
            .classed("active", true)
            .classed("inactive", false); 
  
          }
        }
      });




})

  
  }
  



// Initialize the dashboard
init();
