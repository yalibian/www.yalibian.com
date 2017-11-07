// fill the document-view using the source dataset.

function docs() {
	
	source.forEach(function (doc, index) {
		// console.log(doc, index);
		
		$("#document-view").append("<div class='doc panel panel-default' id=" + doc.docid + "></div>");
		$("#" + doc.docid).append("<h3 class='panel-heading doc-title'>" + doc.docid + "</h3>")
			.append("<div class='panel-body doc-content'>" + doc.doctext + "</div>");
	});
	
	
	// for search box
	
	
}



