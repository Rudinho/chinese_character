
document.addEventListener("DOMContentLoaded", function(event) {
   /*function loadNodesJSON(callback) {   
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', 'chars.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
     }

     function loadEdgesJSON(callback) {   

        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', 'chars_edge.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);  
     }
     function initEdges() {
        loadEdgesJSON(function(response) {
         // Parse JSON string into object
           var actual_JSON = JSON.parse(response);
            Object.entries(actual_JSON).forEach(element => addEdge(element[1].Source, element[1].Target))
        });
       }

       function addEdge(origin, destiny){
           edges.add({from : origin, to: destiny })
       }

    function initNodes() {
        loadNodesJSON(function(response) {
         // Parse JSON string into object
           var actual_JSON = JSON.parse(response);
           Object.entries(actual_JSON).forEach(element => addNode(element[1].Id, element[1].Label));
        });
       }
       function addNode(newId,Label) {
        nodes.add({ id: newId, label: Label });
      }
// Load JSON text from server hosted file and return JSON parsed object
*/
//initNodes();
//initEdges();
//console.log(test_nodes);



var nodes = new vis.DataSet([
  ]);
  // create an array with edges
  var edges = new vis.DataSet([
   /* { from: 1, to: 3 },
    { from: 3, to: 4 },
    { from: 3, to: 5 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },*/
  ]);

  Object.entries(test_nodes).forEach(element => {
    addNode(element[1].Id, element[1].Label);
  });
  function addNode(newId,Label) {
    nodes.add({ id: newId, label: Label });
  }

  Object.entries(edges_data).forEach(element => {
    addEdge(element[1].Source, element[1].Target);
  });

  function addEdge(origin, destiny) {
    edges.add({ from : origin, to: destiny });
  }
  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {edges: { smooth: false }};
  var network = new vis.Network(container, data, options);
  network.on("stabilizationIterationsDone", function() {
    network.setOptions({ physics: { enabled: false }});
  });

})