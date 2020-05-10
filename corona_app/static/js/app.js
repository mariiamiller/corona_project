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

   d3.json(url).then(function(data) { 

  console.log(data);
  


    // Use d3 to select the panel with id of `#sample-metadata`
// var sampleMetadata = d3.select("#sample-metadata")
// // Use `.html("") to clear any existing metadata
// sampleMetadata.selectAll("h2").remove();
// sampleMetadata.selectAll("p").remove();
// sampleMetadata.selectAll("a").remove();

//d3.select("#sample-metadata").select(".well");
var selecteddiv = d3.selectAll("#sample-metadata").append("div")
 .classed("well", true);
// d3.select("#sample-metadata").select(".well").append("h2").text(data[0]);
// d3.select("#sample-metadata").append("p").text(data[1]);
// d3.select("#sample-metadata").append("p").text(data[2]);
// d3.select("#sample-metadata").append("p").text(data[3]);
// d3.select("#sample-metadata").append("p").text(data[4]);
// d3.select("#sample-metadata").append("p").text(data[5]);
// d3.select("#sample-metadata").append("a").text("more info").attr("href",data[6]);
selecteddiv.append("h2").text(data[0]);
selecteddiv.append("p").text(data[1]);
selecteddiv.append("p").text(data[2]);
selecteddiv.append("p").text(data[3]);
selecteddiv.append("p").text(data[4]);
selecteddiv.append("p").text(data[5]);
selecteddiv.append("a").text("more info").attr("href",data[6]);

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
    const firstSample = symbolNames[0];
  
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
  
 var margin = {top: 10, right: 30, bottom: 30, left: 60},
 width = 600 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble")
.append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
.append("g")
 .attr("transform",
       "translate(" + margin.left + "," + margin.top + ")");

//Read the data
url = "new_cases_all"
var parseTime = d3.timeParse("%m/%d/%y")
function filterCountries(d) {     if( countries.includes(d.country)){
  console.log(d);
  return d;

}
}
d3.json(url).then(function(data) {

  data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.new_cases_perc = +d.new_cases_perc;
    countries.includes(d.country);

});

console.log(data.filter(d=>d.country =='US'));
data = data.filter(d=>countries.includes(d.country));
// function getCountries(c) {
//   return countries.includes(c.country);
// }
// data.filter(getCountries);


// if( countries.includes(d.country)){
//   console.log(d);

// }
console.log(data);

// group the data: I want to draw one line per group
var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
 .key(function(d) { return d.country;})
 .entries(data);



// Add X axis --> it is a date format
var x = d3.scaleTime()
 .domain(d3.extent(data, function(d) { return d.date; }))
 .range([ 0, width ]);
svg.append("g")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x).ticks(12));

// Add Y axis
var y = d3.scaleLinear()
 .domain([0, d3.max(data, function(d) { return +d.new_cases_perc; })])
 .range([ height, 0 ]);
svg.append("g")
 .call(d3.axisLeft(y));

// color palette
var res = sumstat.map(function(d){ return d.key }) // list of group names
var color = d3.scaleOrdinal()
 .domain(res)
 .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

// Draw the line
svg.selectAll(".line")
   .data(sumstat)
   .enter()
   .append("path")
     .attr("fill", "none")
     .attr("stroke", function(d){ return color(d.key) })
     .attr("stroke-width", 1.5)
     .attr("d", function(d){
       return d3.line()
         .x(function(d) { return x(d.date); })
         .y(function(d) { return y(d.new_cases_perc); })
         (d.values)
     })

})


  // var svgWidth = 960;
  // var svgHeight = 540;
  
  // var margin = {
  //   top: 20,
  //   right: 40,
  //   bottom: 80,
  //   left: 100
  // };
  // var width = svgWidth - margin.left - margin.right;
  // var height = svgHeight - margin.top - margin.bottom;
  // // url1 = "/new_cases/"+country;
  // // url2 = "/countries/"+country;
  // url = "new_cases_all"
  
  // // parse the date / time
  // var parseTime = d3.timeParse("%m/%d/%y");
  
  // // set the ranges
  // var x = d3.scaleTime().range([0, width]);
  // var y = d3.scaleLinear().range([height, 0]);
  
  
  // // define the line
  // var valueline = d3.line()
  //     .x(function(d) { return x(d.date); })
  //     .y(function(d) { return y(d.new_cases); });
  
  
  
  //     var svg = d3
  //   .select("#bubble")
  //   .append("svg")
  //   .attr("width", svgWidth)
  //   .attr("height", svgHeight);
  // console.log('before graph');
  // // Append an SVG group
  // //var g = 
  // // svg.append("g")
  // //   .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // //d3.json(url2).then(function(data2) {
  //   d3.json(url).then(function(data) {
  
  //     data.forEach(function(d) {
  //       d.date = parseTime(d.date);
  //       d.new_cases = +d.new_cases;
  //       if( countries.includes(d.country)){
  //         console.log(d);
  //       }
  //   });

  //   var valueline = d3.line()
  //   .x(function(d) { return x(d.date); })
  //   .y(function(d) { return y(d.new_cases); });
  
  
  
  //    // Scale the range of the data
  //    x.domain(d3.extent(data, function(d) { return d.date; }));
  //    y.domain([0, d3.max(data, function(d) { return d.new_cases; })]);
   
  //    // Add the valueline path.
  //    svg.append("path")
  //        .data([data])
  //        .attr("class", "line")
  //        .attr("d", valueline);
   
  //    // Add the X Axis
  //    svg.append("g")
  //        .attr("transform", "translate(0," + height + ")")
  //        .call(d3.axisBottom(x));
   
  //    // Add the Y Axis
  //    svg.append("g")
  //        .call(d3.axisLeft(y).ticks(7));
  
  
  
  // });







    // function type(d) {
    //   d.date = parseDate(d.date);
    // //  d.price = +d.price;
    //   return d;
    // }   
  
  
  }
  



// Initialize the dashboard
init();
