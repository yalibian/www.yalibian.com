/**
 * Created by Yali, Mai on 11/6/16.
 */

/*color scheme*/
var color = {
    "Person": "#d9b8f1",
    "Location": "#BDC03F",
    "Organization": "#ffe543",
    "Money": "#FF9B14",
    "Misc": "#F69AC1",
    "Phone": "#8EB4FF",
    "Interesting": "#f1f1b8",
    "Date": "#67E1D8"
};

var highlightedBubbleId = -1;
var highlightedBubblePath = null; // SVGPathElement 


// useless varaibles
//function to move object to front
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

//function to move object to back
d3.selection.prototype.moveToBack = function () {
    console.log("Inside move to background");
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

var index = null;
var add = false;
var check = false;


var svg = d3.select("#vis");

var radius = 10;
// get width and height of network svg
var width = parseInt(svg.style("width").slice(0, -2)),
    height = parseInt(svg.style("height").slice(0, -2));

var link;
var votes = 0;
var obviousness = 0;
var mode = "undefined";
var nodesInNewBubble = [];
var simulation;

// When the needed JSON files ("graph" and "cluster") loaded, exe this script.
function network() {

    // svg.selectAll('g').call(d3.zoom()
    //     .scaleExtent([1 / 2, 8])
    //     .on("zoom", zoomed));

    
    // var zoom = d3.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoomed);
    
    // function zoomed() {
    //     circle.attr("transform", transform);
    // }

    svg.call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

    function zoomed() {
        d3.selectAll('.zoom').attr("transform", d3.event.transform);
    }

    



    var bubbleSets = d3.bubbleSets()
        .clusters(cluster)
        .nodes(graph.nodes)
        .links(graph.links);

    var bubbleColor = d3.schemeCategory20;
    var pathColors = [];

    //draw forced directed graph    
    //draw(linksValue,nodesValue);
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.name;
        }))
        .force("charge", d3.forceManyBody().strength(-125))
        // .force("y", d3.forceY(height / 2).strength(0.225))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on('end', function () {
            // placed = true;
        });

    simulation.nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);


    // bubbles
    var paths = bubbleSets();
    var bubbles = svg.append("g")
        .attr("class", "bubbles zoom")
        .selectAll('path')
        .data(paths)
        .enter()
        .append('path')
        .attr('d', function (d) {
            return d;
        })
        .attr("class", "bubble")
        .attr("stroke-width", 2)
        .attr("opacity", 0.3)
        .on('click', function (d, i) {
            bubbleClicked(d, i, this);
        })
        .attr("fill", function (d, i) {
            // pathColors[i] = bubbleColor[i];
            return bubbleColor[i];
        });

    link = svg.append("g")
        .attr("class", "links zoom")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append('g').append("line")
        .attr('class', 'link')
        .attr("stroke", "#999")
        .attr("stroke-opacity", "0.6")
        .attr("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    console.log(d3.selectAll('.zoom'));
    var node = svg.append("g")
        .attr("id", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .append("circle")
        .attr('class', 'zoom')
        .attr("r", 6)
        // .on("dblclick", dblclick)
        .attr("fill", function (d) {
            return color[d.category];
        })
        // .on('click', nodeClicked)
        .call(d3.drag()
            .on("start", nodeDragStarted)
            .on("drag", nodeDragged)
            .on("end", nodeDragEnded));

    var label = d3.selectAll(".node")
        .append("text")
        .attr("class", "label zoom")
        .text(function (d) {
            return d.name;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("font", "3px")
        .attr("color", "black");
    
    // var hasRelatedLinks;
    // function nodeClicked(d, i){
    //    
    //     console.log('Node Clicked!!!');
    //     console.log(graph.links);
    //    
    //     highlightNode(this);
    //     // highlightRelatedNodesAndLinks(d);
    //     node.attr('stroke', function(dd){
    //         // console.log(d.name);
    //         // console.log(dd.name);
    //             hasRelatedLinks = graph.links.filter(function(e){
    //                 return (dd.name == e.source.name && d.name == e.target.name) || (dd.name == e.target.name && d.name == e.source.name); 
    //             });
    //             console.log(hasRelatedLinks);
    //             if(hasRelatedLinks.length > 0){
    //                 return 'yellow'; 
    //             } else {
    //                 return null;
    //             }
    //         })
    //         .attr('stroke-width', function(d) {
    //             if(hasRelatedLinks.length > 0) {
    //                 return '2px';
    //             } else {
    //                 return '0px';
    //             }
    //         });
    //    
    //     var isInLinks = null;
    //     link.attr("stroke", function(dd){
    //         isInLinks = (dd.target == d.name || dd.source == d.name);
    //         if(isInLinks > 0){
    //             return 'steelblue';
    //         } else {
    //             return '#999';
    //         }
    //     })
    //     .attr("stroke-opacity", "0.6")
    //     .attr("stroke-width", function (d) {
    //         return Math.sqrt(d.value);
    //     });
    //    
    // }

    function nodeDragStarted(d) {

        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    function nodeDragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;

        // determine if node is in the highlighted bubble
        var node = {x: d.fx, y: d.fy};
        if (highlightedBubbleId >= 0) {
            // var highlightedBubblePath = null;
            if (collide(node, highlightedBubblePath)) {
                highlightNode(this);
            } else {
                unhilightNode(this);
            }
        } else if (highlightedBubbleId == -2) {
            if (node.x <= 8 || node.y <= 8) {
                highlightNode(this);
            } else {
                unhilightNode(this);
            }
        }
    }

    function nodeDragEnded(d) {
        // restart the force simulation
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }

        // Update cluster
        var node = {x: d.x, y: d.y};
        if (highlightedBubbleId >= 0) {
            var s = new Set(cluster[highlightedBubbleId]);
            if (collide(node, highlightedBubblePath)) {
                // insert the node into the highlightedBubble cluster
                s.add(d.name);
                cluster[highlightedBubbleId] = Array.from(s);
                // cluster[highlightedBubbleId];
            }
            else {
                // remove the node from the highlightedBubble cluster
                s.delete(d.name);
                cluster[highlightedBubbleId] = Array.from(s);
            }
        } else if (highlightedBubbleId == -2) {


            var s = new Set(nodesInNewBubble);
            console.log(node);
            if (node.x <= 10 || node.y <= 10) {
                // fill the nodesInNewBubble with nodes
                nodesInNewBubble.push(d.name);
                console.log(s);
                s.add(d.name);
                console.log(s);
                nodesInNewBubble = Array.from(s);
            }
            else {
                // remove the node from the highlightedBubble cluster
                console.log(s);
                s.delete(d.name);
                console.log(s);
                nodesInNewBubble = Array.from(s);
            }
        }
    }

    function ticked() {
        
         // data update
        var b = svg.selectAll(".bubble")
            .data(paths)
            .attr('d', function (d) {
                return d;
            });

        b.enter()
            .append('path')
            .attr('d', function (d) {
                return d;
            })
            .attr("class", "bubble zoom")
            .attr("stroke-width", 2)
            .attr("opacity", 0.3)
            .on('click', function (d, i) {
                bubbleClicked(d, i, this);
            })
            .attr("fill", function (d, i) {
                return bubbleColor[i];
            })
            .attr("stroke-width", 2);
        // .attr('stroke', function (d, i) {
        // pathColors[i] = bubbleColor[i];
        // return 'black';
        // return bubbleColor[i];
        // });


        // data exit
        b.exit().remove();
        

        link
            .attr("x1", function (d, i) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                d.x = Math.max(radius, Math.min(width - radius, d.x));
                return d.x;// = Math.max(radius, Math.min(width - radius, d.x));
            })
            .attr("cy", function (d) {
                //  console.log(d.name + "Y= "+ d.y);
                return d.y = Math.max(radius, Math.min(height - radius, d.y));
            });

        label
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });

        if (highlightedBubbleId >= 0) {
            var highlightedBubblePath = paths[highlightedBubbleId];
            bubbleSets.update();
            paths[highlightedBubbleId] = highlightedBubblePath;
        } else {
            bubbleSets.update();
        }

       
    }
}


// create an empty bubble
function createBubble() {

    // mark current mode
    highlightedBubbleId = -2;
    // flush the nodesInNewBubble Array
    nodesInNewBubble = [];


    var hiddenNodes = [{name: 'A', x: 0, y: 0}, {name: 'B', x: width, y: 0}, {name: 'C', x: 0, y: height}];
    var hiddenCluster = [['A', 'B', 'C']];
    var newBubble = d3.bubbleSets()
        .clusters(hiddenCluster)
        .nodes(hiddenNodes);

    var newBubblePath = newBubble();

    // highlightedBubbleId = cluster.length;
    // highlightedBubblePath = newBubblePath[0];


    console.log(svg.select('.bubbles'));
    var bubble = svg.select(".bubbles")
        .append('path')
        .datum(newBubblePath[0])
        .attr('d', function (d) {
            return d;
        })
        .attr("class", "newBubble")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);
    // .on('click', function () {
    //     bubbleClicked(d, (cluster.length-1), this);
    // });

    // bubbleClicked("null", (cluster.length-1), bubble);
}

//根据nodes 的位置，来判断是不是在currentBubblePath里面，如果是的话，就创建一个bubble,然后relayout
function updateBubble() {

    if (highlightedBubbleId >= 0) {
        // update the edited bubbles
    } else if (highlightedBubbleId == -2) {
        // remove newBubble
        d3.select('.newBubble').remove();

        // update cluster array
        cluster.push(nodesInNewBubble);
    }

    highlightedBubbleId = -1;
    highlightedBubblePath = null;

    // unfreeze all the nodes 
    svg.selectAll("circle")
        .attr('stroke', function (d) {
            d.fx = null;
            d.fy = null;
            return null;
        })
        .attr('stroke-width', '0px');

    simulation.alphaTarget(0.3).restart();

    // change the cluster on the cluster list, thanks for Mai's remind
    updateClusterView();
}

// remove the newBubble
function cancelBubble() {
    d3.select('.newBubble').remove();
    highlightedBubbleId = -1;
    nodesInNewBubble = [];

    // unfreeze all the nodes 
    svg.selectAll("circle")
        .attr('stroke', function (d) {
            d.fx = null;
            d.fy = null;
            return null;
        })
        .attr('stroke-width', '0px');

    simulation.alphaTarget(0.3).restart();
}

// delete highlighted Bubble
function deleteBubble() {

    // change the color of each bubble
    if (highlightedBubbleId >= 0) {
        cluster.splice(highlightedBubbleId, 1);
    }

    highlightedBubbleId = -1;
    unfreezeNodes();
    unhighlightBubble();
    updateBubble();
}

// unfreeze all the nodes 
function unfreezeNodes() {
    svg.selectAll("circle")
        .attr('stroke', function (d) {
            d.fx = null;
            d.fy = null;
            return null;
        })
        .attr('stroke-width', '0px');
}

function updateLinks(str, value) {

    // console.log(votes);
    if (str == 'votes') {
        votes = value;
    } else {
        obviousness = value;
    }

    link.attr("opacity", function (d) {
        if (d['votes'] >= votes && d['obviousness'] >= obviousness) {
            return 1;
        } else {
            return 0;
        }
    });
}

function bubbleClicked(d, i, bubble) {

    console.log("Clicked!!!");
    highlightedBubblePath = d3.select(bubble).node();
    // console.log(highlightedBubblePath);
    if (highlightedBubbleId == i) {
        unhighlightBubble();
    } else {
        highlightBubble(i);
    }
}

function highlightBubble(i) {

    highlightedBubbleId = i;

    // change the color of each bubble
    svg.selectAll('.bubble')
        .attr('opacity', function (d, j) {
            if (i == j) {
                return 0.6;
            } else {
                return 0.1;
            }
        });

    svg.selectAll("circle")
        .attr('cx', function (d) {
            if (cluster[i].indexOf(d.name) > -1) {
                d.fx = d.x;
            }
            return d.x;
        })
        .attr('cy', function (d) {
            if (cluster[i].indexOf(d.name) > -1) {
                d.fy = d.y;
            }
            return d.y;
        });

    // highlight nodes in this highlighted bubble
    highlightNodes(i);
}

// highlight nodes in the bubble i
function highlightNodes(i) {
    console.log(cluster[i]);
    svg.selectAll("circle")
        .attr('stroke', function (d) {
            // console.log(d.name);
            if (cluster[i].indexOf(d.name) > -1) {
                return 'yellow';
            } else {
                return null;
            }
        })
        .attr('stroke-width', function (d) {
            if (cluster[i].indexOf(d.name) > -1) {
                return '2px';
            } else {
                return '0px';
            }
        });
}

function unhighlightNodes() {
    svg.selectAll("circle")
        .attr('stroke', null)
        .attr('stroke-width', '0px');
}

// highlight the selected node through selection
function highlightNode(node) {
    d3.select(node)
        .attr('stroke', 'yellow')
        .attr('stroke-width', '2px');
}

// unhighlight the selected node through selection
function unhilightNode(node) {
    d3.select(node)
    // .attr('stroke', null)
        .attr('stroke-width', '0px');
}

function unhighlightBubble() {

    highlightedBubbleId = -1;

    // change to default color of 
    svg.selectAll('.bubble')
        .attr('opacity', 0.3);

    unhighlightNodes();
}

// collide detection based on ray-casting algorithm
function collide(node, path) {

    var pathSegList = path.pathSegList,
        xi, xj, intersect,
        x = node.x,
        y = node.y,
        inside = false;

    for (var i = 0, j = pathSegList.numberOfItems - 1; i < pathSegList.numberOfItems; j = i++) {
        xi = pathSegList.getItem(i).x;
        yi = pathSegList.getItem(i).y;

        xj = pathSegList.getItem(j).x;
        yj = pathSegList.getItem(j).y;

        intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}


