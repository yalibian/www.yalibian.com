// Load dataset from backend, and generate clusters and networks.

var cluster = null;
var graph = null;
var source = null;
var currentState = 0;

// var hypo = null;

var dispatch = d3.dispatch("graph", "cluster", "source", "update");

// call the network, wigmore, and docs function when all needed data sets loaded to mem.
// dispatch.on("cluster.graph", network);
dispatch.on("source", docs);
dispatch.on("graph.cluster", function () {
    network();
    renderClusterView();
});
// dispatch.on("graph.cluster", renderClusterView);
// dispatch.on("graph.cluster", network);

d3.json("./data/graph.json", function (data) {
    graph = data;
    dispatch.call("graph");
});

d3.json("./data/cluster.json", function (data) {
    cluster = data;
    dispatch.call("cluster");
});

d3.json("./data/source.json", function (data) {
    source = data;
    dispatch.call("source");
});


// With JQuery
$("#ex8").slider({
    tooltip: 'always'
})
    .on("slide", function (slideEvt) {
        // console.log(slideEvt.value);
        updateLinks("votes",slideEvt.value);
    });

$("#obvious").slider({
    tooptip: 'alway'
}).on("slide", function(slideEvt){
    updateLinks("obviousness", slideEvt.value);
});

$('#create-bubble').on('click', function(){
    // console.log("click"); 
    if(currentState == 0){
        currentState = 1; // create-bubble mode
        createBubble();
    } 
});

$('#update-bubble').on('click', function(){
    // console.log("click"); 
    // if(currentState == 1){
        // currentState = 1; // create-bubble mode
        updateBubble();
        currentState = 0;
    // } 
});

$('#cancel-bubble').on('click', function(){
    // console.log("click"); 
    currentState = 0;
    cancelBubble();
});

$('#delete-bubble').on('click', function(){
    deleteBubble();
});

