console.log('client js')



$(document).ready(function() {
  $('#selDataset').select2();
});

function buildMetadata(country) {


  var url = "/countries/"+country;
  //Use `d3.json` to fetch the metadata for a sample
  
  var data = []

   d3.json(url).then(function(data) { 

  console.log(data);
  


    // Use d3 to select the panel with id of `#sample-metadata`
var sampleMetadata = d3.select("#sample-metadata")
// Use `.html("") to clear any existing metadata
sampleMetadata.selectAll("h2").remove();
sampleMetadata.selectAll("p").remove();
sampleMetadata.selectAll("a").remove();


d3.select("#sample-metadata").append("h2").text(data[0]);
d3.select("#sample-metadata").append("p").text(data[1]);
d3.select("#sample-metadata").append("p").text(data[2]);
d3.select("#sample-metadata").append("p").text(data[3]);
d3.select("#sample-metadata").append("p").text(data[4]);
d3.select("#sample-metadata").append("p").text(data[5]);
d3.select("#sample-metadata").append("a").text("more info").attr("href",data[6]);


  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
  
    buildMetadata(firstSample);

    buildChart(firstSample);

  });
}

function optionChanged(selector) {
  /// figure out how to get the items from the selector...
  /// not very hard

  buildMetadata(newSample);

  buildChart(newSample);
//FINISH THIS ONE
  //buildNewChart(newSample);

}


// Initialize the dashboard
init();
