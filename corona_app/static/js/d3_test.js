
function buildChart(country) {


var cList = d3.select('.selection').select("ul").selectAll('.select2-selection__choice');
cList.attr('title');

  // //           var dateString = data1[i];
//.attr('title');
// Use `.html("") to clear any existing metadata
//cList.selectAll("li").title;

console.log(cList);
d3.select("#bubble").selectAll("svg").remove();

var svgWidth = 960;
var svgHeight = 540;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
url1 = "/new_cases/"+country;
url2 = "/countries/"+country;


// parse the date / time
var parseTime = d3.timeParse("%m/%d/%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.new_cases); });



    var svg = d3
  .select("#bubble")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
console.log('before graph');
// Append an SVG group
//var g = 
// svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

//d3.json(url2).then(function(data2) {
  d3.json(url1).then(function(data) {

    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.new_cases = +d.new_cases;
  });
    console.log(data[0]);



   // Scale the range of the data
   x.domain(d3.extent(data, function(d) { return d.date; }));
   y.domain([0, d3.max(data, function(d) { return d.new_cases; })]);
 
   // Add the valueline path.
   svg.append("path")
       .data([data])
       .attr("class", "line")
       .attr("d", valueline);
 
   // Add the X Axis
   svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));
 
   // Add the Y Axis
   svg.append("g")
       .call(d3.axisLeft(y).ticks(7));



});
  // function type(d) {
  //   d.date = parseDate(d.date);
  // //  d.price = +d.price;
  //   return d;
  // }   


}

