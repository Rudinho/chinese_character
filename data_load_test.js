
document.addEventListener("DOMContentLoaded", function(event) {
  var network;

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  var gephiImported;
  var fixedCheckbox = document.getElementById("fixed");
  fixedCheckbox.onchange = redrawAll;
  
  var parseColorCheckbox = document.getElementById("parseColor");
  parseColorCheckbox.onchange = redrawAll;
  
  var nodeContent = document.getElementById("nodeContent");
  
  loadJSON("new_chars.json", redrawAll, function (err) {
    console.log("error");
  });
  
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "dot",
      font: {
        face: "Tahoma",
      },
    },
    edges: {
      width: 0.15,
      smooth: {
        type: "continuous",
      },
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -10000,
        springConstant: 0.002,
        springLength: 150,
      },
    },
  };
  
  network = new vis.Network(container, data, options);
  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      var data = nodes.get(params.nodes[0]); // get the data from selected node
      nodeContent.innerText = JSON.stringify(data, undefined, 3); // show the data in the div
    }
  });
  
  /**
   * This function fills the DataSets. These DataSets will update the network.
   */
  function redrawAll(gephiJSON) {
    if (gephiJSON.nodes === undefined) {
      gephiJSON = gephiImported;
    } else {
      gephiImported = gephiJSON;
    }
  
    nodes.clear();
    edges.clear();
  
    var fixed = fixedCheckbox.checked;
    var parseColor = parseColorCheckbox.checked;
  
    var parsed = vis.parseGephiNetwork(gephiJSON, {
      fixed: fixed,
      parseColor: parseColor,
    });
  
    // add the parsed data to the DataSets.
    nodes.add(parsed.nodes);
    edges.add(parsed.edges);
  
    var data = nodes.get(2); // get the data from node 2 as example
    nodeContent.innerText = JSON.stringify(data, undefined, 3); // show the data in the div
    network.fit(); // zoom to fit
  }

})