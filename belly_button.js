// BELLY BUTTON PROJECT 

// Load the samples.json file
const samples = d3.json("samples.json");

// Implement the bar chart
const barChart = new Plotly.Bar({
  data: [{
    x: samples.map((sample) => sample.otu_ids),
    y: samples.map((sample) => sample.sample_values),
    name: "Top 10 OTUs",
    text: samples.map((sample) => sample.otu_labels),
  }],
  layout: {
    xaxis: {
      title: "OTU ID",
    },
    yaxis: {
      title: "Sample Value",
    },
  },
});

// Display the bubble chart
const bubbleChart = new Plotly.Bubble({
  data: samples,
  layout: {
    xaxis: {
      title: "OTU ID",
    },
    yaxis: {
      title: "Sample Value",
    },
    marker: {
      size: samples.map((sample) => sample.sample_values),
      color: samples.map((sample) => sample.otu_ids),
    },
  },
});

// Implement a dropdown menu
const select = d3.select("#select");

// Populate the dropdown menu with the sample names and ID
for (const sample of samples) {
  select.append("option").text(sample.name).value(sample.id);
}

// Update plots
select.on("change", () => {
  const id = select.value;

  // Set the bar chart x-axis values to the selected sample's OTU IDs
  barChart.data[0].x = samples.filter((sample) => sample.id === id).map((sample) => sample.otu_ids);
  barChart.data[0].y = samples.filter((sample) => sample.id === id).map((sample) => sample.sample_values);
  barChart.update();

  // Filter the bubble chart data to the selected sample
  bubbleChart.data = samples.filter((sample) => sample.id === id);
  bubbleChart.update();

  // Iterate over the selected sample's metadata and display each key-value pair in the metadata section
  const metadata = samples.find((sample) => sample.id === id);
  const div = d3.select("#metadata");
  div.empty();
  for (const key in metadata) {
    div.append("p").text(`${key}: ${metadata[key]}`);
  }
});