// // Get the data first 
// function getData(UID) {
//     d3.json("samples.json").then(data => {
//         var bacteriaData = data.metadata
//         console.log(bacteriaData);
//     });
//     console.log(UID)
// };

// Function to populate the demographic data
function populateDemoInfo(UID) {
    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html("")
    d3.json("samples.json").then(data => {
        var demoData = data.metadata
        demoData = demoData.filter(patientRow => patientRow.id == UID)[0]
        console.log(demoData)
        Object.entries(demoData).forEach(([key, value]) => {
            demographicInfoBox.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
    console.log(UID)
}

// Function for select option 
function optionChanged(UID) {
    buildCharts(UID);
    populateDemoInfo(UID);
}

// Set up the init function
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var names = data.names;
        names.forEach(UID => {
            dropdown.append("option").text(UID).property("value", UID)
        })
        buildCharts(names[0]);
        populateDemoInfo(names[0]);
    });
};

initDashboard();

// Function for Graphs

function buildCharts(UID) {

    // Use `d3.json` to fetch the sample data for the plots
    d3.json("samples.json").then((data) => {
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        var samples = data.samples;
        var result = samples.filter(sampleRow => sampleRow.id == UID)[0];
        console.log(result)

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        //  Build a bar Chart

        var barData = [
            {
                y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"

            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
        };

        Plotly.newPlot("bar", barData, barLayout);
        // Build a Bubble Chart using the sample data
        var LayoutBubble = {
            margin: { t: 0 },
            xaxis: { title: "Id Number" },
            hovermode: "closest",
        };

        var DataBubble = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        Plotly.plot("bubble", DataBubble, LayoutBubble);

  
        // The guage chart
  
        var guageChart = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 1], color: "lightgray" },
                    { range: [1, 2], color: "lightgray"},
                    { range: [2, 3], color: "lightgray" },
                    { range: [3, 4], color: "lightgray" },
                    { range: [4, 5], color: "lightgray" },
                    { range: [5, 6], color: "lightgray" },
                    { range: [6, 7], color: "lightgray" },
                    { range: [7, 8], color: "lightgray" },
                    { range: [8, 9], color: "gray" },
                  ]}
              
          }
        ];
        var guageLayout = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", guageChart, guageLayout);
    });
}
