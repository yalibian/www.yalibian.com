// D3 style Bubble Sets
// Author: Yali Bian
// Date: 11/12/2016

// Input: a set of nodes: 
// 这些sets的nodes 和 links 都是有位置信息的，来源于force-simulation，
// 然后用这些信息来产生多个paths，每个paths都是通过一些nodes和links生成的，然后将这些信息传回主界面上，都过select自行添加
// 相应是在 没吃forced nodes 和 links 进行成功以后，然后重新渲染（需要的是重新计算么？），（tick里面）


(function () {

    d3.bubbleSets = function () {

        var clusters, nodes, links, paths = [];
        var padding = 5;

        var bubbles = new BubbleSet();

        // var bubbles = new BubbleSet().debug(false);
        function bubbleSets(svg) {
            // Hello world.
            doBubbles();
            return paths;
        }

        bubbleSets.clusters = function (d) {
            clusters = d;
            return bubbleSets;
        };

        // When nodes and links update, make sure the paths returns paths.
        bubbleSets.update = function () {

            //console.log("Before update number of paths =" + paths.length);
            flushPaths();
            doBubbles();
            // console.log("After update number of paths =" + paths.length);
            return bubbleSets;
        };

        bubbleSets.nodes = function (d) {
            nodes = d;
            return bubbleSets;
        };

        bubbleSets.links = function (d) {
            links = d;
            return bubbleSets;
        };

        bubbleSets.size = function (x) {
            return bubbleSets;
        };

        bubbleSets.padding = function (x) {
            padding = x;
            return bubbleSets;
        };

        // create paths.
        function doBubble(rects, others, lines) {

            var list = bubbles.createOutline(
                BubbleSet.addPadding(rects, padding),
                BubbleSet.addPadding(others, padding),
                lines
            );

            var outline = new PointPath(list).transform([
                new ShapeSimplifier(0.0),
                new BSplineShapeGenerator(),
                new ShapeSimplifier(0.0),
            ]);

            return outline;
        }

        function flushPaths() {

            while (paths.length != 0) {
                paths.pop();
            }

        }

        // Set paths on the SVG file
        //create the bubbles based on clusters
        function doBubbles() {

            clusters.forEach(function (cluster, i) {

                var rects = nodes.filter(function (node) {
                    return !(cluster.indexOf(node.name) === -1)
                });

                rects.forEach(function (node) {
                    node.width = 2;
                    node.height = 2;
                });

                var others = nodes.filter(function (node) {
                    return (cluster.indexOf(node.name) === -1);
                });

                var lines = null;
                if(links != null){
                    
                    lines = links.filter(function(link){
                        return (cluster.indexOf(link.source) > -1) && (cluster.indexOf(link.target) > -1);
                    })
                }
               
                
                // var lines = links.filter(function (link) {
                //     return (cluster.indexOf(link.source) > -1) && (cluster.indexOf(link.target) > -1);
                // });

                var outline = doBubble(rects, others, lines);

                paths.push(outline);
            });
        }

        return bubbleSets;
    };

})();

