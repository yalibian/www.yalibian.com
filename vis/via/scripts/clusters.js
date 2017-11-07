/**
 * Created by bialy on 12/3/16.
 */

// 
// fill the cluster-view using cluster.

function renderClusterView() {
	// console.log(cluster);
	// source.each();
	
	console.log(cluster.length);
	cluster.forEach(function (c, index) {
		$("#cluster-view").append("<div class='doc panel panel-default' id=cluster_" + index + "></div>");
		
		var content = "";
		c.forEach(function (entity) {
			// console.log(entity);
			
			var result = $.grep(graph.nodes, function (e) {
				// console.log(e.name);
				// console.log(entity);
				return e.name === entity;
			});
			// console.log(result[0].category);
			content += '<em class=\"highlight ' + result[0].category + '\">' + entity + '</em> ';
		});
		
		$("#cluster_" + index).append("<h3 class='panel-heading doc-title'>" + "Cluster " + (index + 1) + "</h3>")
			.append("<div class='panel-body doc-content'>" + content + "</div>");
	});
}


// update Cluster List
function updateClusterView() {
	
	console.log("In updateClusterView");
	
	$("#cluster-view").empty();
	cluster.forEach(function (c, index) {
		$("#cluster-view").append("<div class='doc panel panel-default' id=cluster_" + index + "></div>");
		
		var content = "";
		c.forEach(function (entity) {
			// console.log(entity);
			
			var result = $.grep(graph.nodes, function (e) {
				// console.log(e.name);
				// console.log(entity);
				return e.name === entity;
			});
			// console.log(result[0].category);
			content += '<em class=\"highlight ' + result[0].category + '\">' + entity + '</em> ';
		});
		
		$("#cluster_" + index).append("<h3 class='panel-heading doc-title'>" + "Cluster " + (index + 1) + "</h3>")
			.append("<div class='panel-body doc-content'>" + content + "</div>");
	});
}
