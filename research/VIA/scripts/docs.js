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


var term;
var term_present = false;
var doc_list = [];
var connected_nodes = [];
var connected_links = [];
var node_list = [];
var edge_list = [];
var searched_term;
var insideEmTag = false;
var notEmTag = [];


/*
 * Code for filtering/searching
 */
function drawDocList() {
    source.forEach(function (doc, index) {
        $("#document-view").append("<div class='doc panel panel-default' id=" + doc.docid + "></div>");
        $("#" + doc.docid).append("<h3 class='panel-heading doc-title'>" + doc.docid + "</h3>")
            .append("<div class='panel-body doc-content'>" + doc.doctext + "</div>");
    });

}


//add search textbox to UI/VIS
var searchText = d3.select("#document-view").append("input")
    .attr("id", "searchText")
    .attr("type", "text")
    .attr("placeholder", "Search for term/node")
    .attr("maxlength", 50)
    .attr("class", "form-control")

    /*This function is used for searching
     * I capture any key press. if it is code=13 this means that it is enter.If code =8 this means backspace
     * If user presses enter, I check to see if the textbox has value or not. If it has not value, I propmot the user
     *If it has value, I search the documents to see whicj
     */
    .on("keypress", function () {

        // console.log(d3.event.keyCode);
        if (d3.event.keyCode == 13) {
            term = document.getElementById('searchText').value;
            if (term == "")
                alert("You have to type a search term");
            if (term != "") {

                graph.links.forEach(function (d) {
                    if (d.source.name.includes(document.getElementById('searchText').value)) {
                        connected_nodes.push(d.target.name);
                        edge_list.push(d);
                    }
                    if (d.target.name.includes(document.getElementById('searchText').value)) {
                        connected_nodes.push(d.source.name);
                        edge_list.push(d);
                    }
                });

                graph.nodes.forEach(function (d) {
                    if (connected_nodes.indexOf(d.name) != -1) {

                        node_list.push(d)

                    }
                    if (d.name.includes(document.getElementById('searchText').value)) {
                        searchText = d;
                        console.log("searchText=" + searchText);
                    }
                });

            }
            /*
             * 
             * This code is used to check which documents contain this keyword
             * Two ways of implementation
             * 1) Look for documents containing this term, 
             * then remove all documents and re-draw this document 
             * 2)Look for documents not including this term and remove them
             * {I prefer this method}
             * I am implementing method two

             * I search for documents not includeing this term and remove them
             */
            source.forEach(function (doc, index) {
                /*
                 *We only include highlighted terms only
                 *So, in this code , I am making sure that we only filter  highlighted terms 
                 *if he searches for any term inside the doucment but not highlighted, alert will prompt him
                 */
                if (doc.doctext.includes(document.getElementById('searchText').value)) {

                    console.log("Term   " + document.getElementById('searchText').value + "  inside document " + doc.docid);
                    var arr = doc.doctext.match(/<em class=(.*?)>(.*?)<\/em>/g);

                    if (arr.length > 0) {
                        for (var i = 0; i < arr.length; i++) {

                            if (arr[i].indexOf(document.getElementById('searchText').value) != -1) {
                                console.log(document.getElementById('searchText').value + "   present in " + arr[i]);
                                insideEmTag = true;

                            }

                        }
                        if (insideEmTag == true) {

                            insideEmTag = false;
                            node_list.push(searchText);
                            console.log("True =inside document " + doc.docid + " " + document.getElementById('searchText').value);
                            console.log("notEmTag length = " + notEmTag.length);
                        }
                        else {
                            var length = document.getElementById('searchText').value.length;
                            var termpos = doc.doctext.search(document.getElementById('searchText').value);
                            console.log("length = " + length);
                            console.log("termpos=  " + termpos);
                            if (doc.doctext.slice(termpos - 1, termpos) == ' ') {
                                console.log("not substring");
                                notEmTag.push(doc.docid)
                            }
                            else {
                                console.log("substring");
                                console.log(doc.doctext.slice(termpos - 1, termpos));
                            }

                            // doc_list.push(doc.docid)
                            console.log("False = inside document " + doc.docid + " " + document.getElementById('searchText').value);
                            console.log("notEmTag length = " + notEmTag.length);
                        }
                    }
                }
                if (!doc.doctext.includes(document.getElementById('searchText').value)) {
                    console.log(document.getElementById('searchText').value + " not present in =" + doc.docid);
                    doc_list.push(doc.docid)
                }

            });

            /*If array mantaining documents = source.length 
             * This means this term is not in any 
             */
            if (source.length == doc_list.length && notEmTag.length == 0) {
                /*You can uncomment these if you want remove the list*/
                // d3.select("#document-view").selectAll("div").remove();
                //d3.select("#document-view").selectAll("h3").remove();
                alert("Cannot find this term in documents. Please only use highlighted entities as filter (case sensitive)");

            }
            else {

                if (notEmTag.length > 0) {

                    alert("Please search documents for highlighted terms only");
                }

                else {
                    doc_list.forEach(function (id) {


                        d3.select("#document-view").select("#" + id).remove();


                    });
                }
            }

            // change the vis view here
            d3.selectAll(".node")
                .attr("visibility", "hidden");
            
            d3.selectAll(".node")
                .filter(function (d) {
                    return (node_list.indexOf(d) != -1);
                })
                .attr("visibility", "visible")
                .select("circle")
                .attr("r", "5px")
                .attr("stroke-width", "1px")
                .attr("opacity", "1");

            d3.selectAll(".link")
                .attr("visibility", "hidden");
            
            d3.selectAll(".link")
                .filter(function (d) {
                    return (edge_list.indexOf(d) != -1 );
                })
                .attr("visibility", "visible");
            
            doc_list = [];
            connected_nodes = [];
            node_list = [];
            edge_list = [];
            notEmTag = [];
            insideEmTag = false

        }
        if (d3.event.keyCode == 8 && document.getElementById('searchText').value == "") {

            d3.select("#document-view").selectAll("div").remove();
            d3.select("#document-view").selectAll("h3").remove();
            d3.selectAll(".node").attr("visibility", "visible");
            d3.selectAll(".link").attr("visibility", "visible");

            drawDocList();
        }


    })
    .style("width", "450px");


drawDocList(); 


