function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(obj => obj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // Create a variable that filters the metadata array 
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metadataArray[0];
    // Create a variable that holds the washing frequency
    var washingFreq = parseInt(metaResult.wfreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    var xticks = sample_values.slice(0,10).reverse();
    var labels = otu_labels.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels,
      marker: {
        color:'rgb(233,155,90)',
        line: {
          color: 'rgb(124,124,124)',
          width: 1.5
        }
      }
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
     };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: [
          ['0.000000000000', 'rgb(255,233,212)'],
          ['0.111111111111', 'rgb(255,222,186)'],
          ['0.222222222222', 'rgb(255,211,160)'],
          ['0.333333333333', 'rgb(255,200,140)'],
          ['0.444444444444', 'rgb(255,189,120)'],
          ['0.555555555556', 'rgb(255,178,100)'],
          ['0.666666666667', 'rgb(255,167,80)'],
          ['0.777777777778', 'rgb(255,156,60)'],
          ['0.888888888889', 'rgb(255,145,40)'],
          ['1.000000000000', 'rgb(255,134,20)']
        ],
        line: {
          color: 'rgb(124,124,124)',
          width: 1
        }
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

      // hovermode='x'

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);  

    // Deliverable 3
    // 1. Create the trace for the gauge chart.
    var gaugeData = {
      value: washingFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: 'rgb(192,189,183'},
        axis: {range: [0,10]},
        borderwidth: 1.5,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color:"#FFE9BA"},
          {range: [2,4], color:"#FFC88C"},
          {range: [4,6], color:"#FFB264"},
          {range: [6,8], color:"#FF9C3C"},
          {range: [8,10], color:"#FF8628"}
        ]
      }
    };
    
    // 2. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, 
      height: 450, 
      margin: {t: 0, b: 0}
    };

    // 3. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

  });
};


