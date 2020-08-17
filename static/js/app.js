var dropDownList = d3.select("#selDataset");

function sampleInfo(data) {
    samplesData = []

    for (var i = 0; i < data.sample_values.length; i++) {
        samplesData[i] = {
            "values": data.sample_values[i],
            "labels": data.otu_labels[i],
            "otu_ids": data.otu_ids[i]
        }
    }

    var newData = samplesData.sort((a, b) => b.values - a.values);
    var newData2 = newData.slice(0, 10);
    // Reverse the array to accommodate Plotly's defaults
    var data1 = newData2.reverse()

    var traceBar = {
        x: data1.map(row => row.values),
        y: data1.map(row => "OTU " + row.otu_ids.toString()),
        text: data1.map(row => row.labels),
        type: "bar",
        orientation: "h"
    };
    // data
    var dataBar = [traceBar];
    // Apply the group bar mode to the layout
    var layoutBar = { showlegend: false,
    margin:{t:0}};
    Plotly.newPlot("bar", dataBar, layoutBar);

    var traceBubble = {
        x: samplesData.map(row => row.otu_ids),
        y: samplesData.map(row => row.values),
        text: samplesData.map(row => row.labels),
        mode: 'markers',
        marker: {
            color: samplesData.map(row => row.otu_ids),
            size: samplesData.map(row => row.values),
        },
        type: "scatter"
    };
    var dataBubble = [traceBubble];
    var layoutBubble = {showlegend: false, height:auto};
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
};

function metadataInfo(data) {

    var wfreq = data.wfreq;
    //Calculate Indicator Angle Radians
    var radians = Math.PI * (9-wfreq) / 9;
    var radius = 0.5;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
        pathX = x.toString(),
        space = ' ',
        pathY = y.toString(),
        pathEnd = ' Z';

    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    var gauge = [{
        type: 'scatter',
        x:[0],
        y:[0],
        marker:{size:14,color:'850000'},
        showlegend:false,
        hoverinfo:'none',
        text: wfreq},
        {values:[1,1,1,1,1,1,1,1,1,9],
        rotation:90,
        text:['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        textinfo:'text',
        textposition:'inside',
        marker:{colors:['#008000','#009900','#00b300','#00e600','#1aff1a','#4dff4d','#80ff80','#b3ffb3','#e6ffe6','#ffffff']},
        hoverinfo:'none',
        hole:.5,
        type:'pie',
        showlegend:false
    }];

    var layoutGauge ={
        shapes:[{
            type:'path',
            path: path,
            fillcolor:'850000',
            line:{color:'850000'}
        }],
        height:500,
        width:500,
        title:'<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        xaxis:{zeroline:false,
        showticklabels:false,
        showgrid:false,
        range:[-1,1]},
        yaxis:{zeroline:false,
            showticklabels:false,
            showgrid:false,
            range:[-1,1]}
    }

    Plotly.newPlot("gauge", gauge, layoutGauge);

    var infoPanel = d3.select("#sample-metadata");

    infoPanel.html("")

    var keys = Object.keys(data);
    var values = Object.values(data);
    for(var j=0; j<keys.length;j++){

        infoPanel.append("p").text(`${keys[j]}:${values[j]}`)
    };


};

function init() {
    d3.json("static/data/samples.json").then(function(data) {
        var samplesId = data.names;
        var samplesMetadata = data.metadata;
        var samplesInfo = data.samples;

        var options = dropDownList.selectAll("option")
            .data(samplesId)
            .enter()
            .append("option")
            .text(function(d) { return d })
            .attr("value",function(d) { return d });

        //indexOf

        sampleInfo(samplesInfo[0]);
        metadataInfo(samplesMetadata[0])
    });
};


d3.selectAll("#selDataset").on("change", updatePlotly)

function updatePlotly(){
    var dropDownList = d3.select("#selDataset");
    dataset = dropDownList.property("value");
    
    d3.json("static/data/samples.json").then(function(data) {
        var samplesId = data.names;
        var samplesMetadata = data.metadata;
        var samplesInfo = data.samples;

        var indexSample = samplesId.indexOf(dataset);

        sampleInfo(samplesInfo[indexSample]);
        metadataInfo(samplesMetadata[indexSample]);
    });
};


init()