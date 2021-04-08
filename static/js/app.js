// FUNCTION #1 of 4
function buildCharts(UID) {

    var barChart = d3.select("#bar");
    var bubbleChart = d3.select("#bubble");
    var guageChart = d3.select("#guage");

    d3.json("samples.json").then(data => {
        console.log(data)
    })
};

// FUNCTION #2 of 4
function populateDemoInfo(UID){
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

// FUNCTION #3 of 4
function optionChanged(UID) {
    buildCharts(UID);
    populateDemoInfo(UID);
}

// FUNCTION #4 of 4
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