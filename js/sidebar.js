//var w = window.innerWidth * (1 / 4);
//var h = window.innerHeight * 98/100;

var w = $("#sidebar").width();
//var svg_height = window.innerHeight * 100/100;
var svg_height = $("#sidebar").height();
var h = svg_height;
var trans = -20;
var ratio = 3; // radus of big circle : radus of small circle

console.log(h);

//var h = Math.ceil(w*0.5);
var oR = 0; // 半径
var nTop = 0;

var svgContainer = d3.select("#mainBubble")
	.style("height", h + "px")
	.style("width", w + "px");

var svg = d3.select("#mainBubble")
	.append("svg")
	//.attr("transform", "translate(0, " + "1000" +  " )")
	.attr("class", "mainBubbleSVG")
	.attr("width", w)
	.attr("height", h)
	.on("mouseleave", function () {
		return resetBubbles();
	});

// notation
var mainNote = svg.append("text")
	.attr("id", "bubbleItemNote")
	.attr("x", 0)
	.attr("y", h - 15)
	.attr("font-size", 12)
	.attr("dominant-baseline", "middle")
	.attr("alignment-baseline", "middle")
	.style("fill", "#888888")
	.text(function (d) {
		return "Home";
	});


d3.json("data/sidebar.json", function (error, root) {
	console.log(error);
	
	var bubbleObj = svg.selectAll(".topBubble")
		.data(root.children)
		.enter().append("g")
		.attr("id", function (d, i) {
			return "topBubbleAndText_" + i;
		});
	
	console.log(root);
	nTop = root.children.length;
	oR = w / 5;
	
	//h = Math.ceil(w / nTop * 2);
	svgContainer.style("width", w + "px");
	
	var colVals = d3.scale.category10();
	
	bubbleObj.append("circle")
		.attr("class", "topBubble")
		.attr("id", function (d, i) {
			return "topBubble" + i;
		})
		.attr("r", function (d) {
			return oR;
		})
		.attr("cx", function (d, i) {
			return w / 2;
		})
		.attr("cy", function (d, i) {
			return oR * (3 * (1 + i) - 1);
		})
		.style("fill", function (d, i) {
			return colVals(i);
		})
		.style("opacity", 0.3)
		.on("click", function (d, i) {
			window.open(d.address);
		})
		.on("mouseover", function (d, i) {
			
			var noteText = "";
			if (d.description == null || d.description == "") {
				noteText = d.address;
			} else {
				noteText = d.description;
			}
			d3.select("#bubbleItemNote").text(noteText);
			
			return activateBubble(d, i);
		})
		.attr("transform", "translate(0, " + trans + " )")
	;
	
	bubbleObj.append("text")
		.attr("class", "topBubbleText")
		.attr("x", function (d, i) {
			return w / 2;
		})
		.attr("y", function (d, i) {
			return oR * (3 * (1 + i) - 1);
		})
		.style("fill", function (d, i) {
			return colVals(i);
		}) // #1f77b4
		.attr("font-size", 30)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.attr("alignment-baseline", "middle")
		.attr("cursor", "pointer")
		.text(function (d) {
			return d.name;
		})
		.attr("transform", "translate(0, " + trans + " )")
		.on("click", function (d, i) {
			window.open(d.address);
		})
		.on("mouseover", function (d, i) {
			var noteText = "";
			if (d.description == null || d.description == "") {
				noteText = d.address;
			} else {
				noteText = d.description;
			}
			d3.select("#bubbleItemNote").text(noteText);
			
			return activateBubble(d, i);
		});
	
	// 二级 泡泡
	for (var iB = 0; iB < nTop; iB++) {
		var childBubbles = svg.selectAll(".childBubble" + iB)
			.data(root.children[iB].children)
			.enter().append("g");
		
		//var nSubBubble = Math.floor(root.children[iB].children.length/2.0);
		childBubbles.append("circle")
			.attr("transform", "translate(0, " + trans + " )")
			.attr("class", "childBubble" + iB)
			.attr("id", function (d, i) {
				return "childBubble_" + iB + "sub_" + i;
			})
			.attr("r", function (d) {
				return oR / ratio;
			})
			.attr("cx", function (d, i) {
				//return w/2+ oR*(1+1.0/ratio+1.0/ratio/4) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				return w / 2 + oR * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("cy", function (d, i) {
				//return oR * (3 * (1 + iB) - 1) + oR*(1+1.0/ratio+1.0/ratio/4) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				return oR * (3 * (1 + iB) - 1) + oR * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("cursor", "pointer")
			.style("opacity", 0.5)
			.style("fill", "#eee")
			.on("click", function (d, i) {
				window.open(d.address);
			})
			.on("mouseover", function (d, i) {
				//window.alert("say something");
				var noteText = "";
				if (d.note == null || d.note == "") {
					noteText = d.address;
				} else {
					noteText = d.note;
				}
				d3.select("#bubbleItemNote").text(noteText);
			})
			.append("svg:title")
			.text(function (d) {
				return d.address;
			})
		;
		
		childBubbles.append("text")
			.attr("transform", "translate(0, " + trans + " )")
			.attr("class", "childBubbleText" + iB)
			.attr("x", function (d, i) {
				//return w/2+ oR*(1+1.0/ratio+1.0/ratio/4) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				return w / 2 + oR * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("y", function (d, i) {
				//return oR * (3 * (1 + iB) - 1) + oR*(1+1.0/ratio+1.0/ratio/4) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				return oR * (3 * (1 + iB) - 1) + oR * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
			})
			.style("opacity", 0.5)
			.attr("text-anchor", "middle")
			.style("fill", function (d, i) {
				return colVals(iB);
			}) // #1f77b4
			.attr("font-size", 6)
			.attr("cursor", "pointer")
			.attr("dominant-baseline", "middle")
			.attr("alignment-baseline", "middle")
			.text(function (d) {
				return d.name;
			})
			.on("click", function (d, i) {
				window.open(d.address);
			});
		
	}
	
	
});

resetBubbles = function () {
	
	w = $("#sidebar").width();
	//h = window.innerHeight * 98/100;
	h = svg_height;
	//h = Math.ceil(w / nTop * 2);
	svgContainer.style("height", h + "px");
	
	mainNote.attr("y", h - 15);
	
	svg.attr("width", w);
	svg.attr("height", h);
	
	d3.select("#bubbleItemNote").text("Home");
	
	var t = svg.transition()
		.duration(650);
	
	t.selectAll(".topBubble")
		.attr("transform", "translate(0, " + trans + " )")
		.attr("r", function (d) {
			return oR;
		})
		
		.attr("cx", function (d, i) {
			return w / 2; // 圆心 x 坐标
		})
		
		.attr("cy", function (d, i) {
			return oR * (3 * (1 + i) - 1); // 圆心 y 坐标
		});
	
	t.selectAll(".topBubbleText")
		.attr("transform", "translate(0, " + trans + " )")
		.attr("font-size", 30)
		.attr("x", function (d, i) {
			return w / 2;
		})
		.attr("y", function (d, i) {
			return oR * (3 * (1 + i) - 1);
		});
	
	// 大圆中 小圆的配置 : 半径 oR/3 : 位置 在两大圆中心点:(3.5oR) : 小圆心到大圆心距离(oR+1/2*oR)
	for (var k = 0; k < nTop; k++) {
		t.selectAll(".childBubbleText" + k)
			.attr("transform", "translate(0, " + trans + " )")
			.attr("x", function (d, i) {
				//return w/2+ oR*(1+1.0/ratio+1.0/ratio/4) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				return w / 2.0 + oR * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("y", function (d, i) {
				//return oR * (3 * (1 + k) - 1) + oR*(1+1.0/ratio+1.0/ratio/4) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				return oR * (3 * (1 + k) - 1) + oR * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("font-size", 6)
			.style("opacity", 0.5);
		
		t.selectAll(".childBubble" + k)
			.attr("transform", "translate(0, " + trans + " )")
			.attr("r", function (d) {
				return oR / 3.0;
			})
			.style("opacity", 0.5)
			.attr("cx", function (d, i) {
				//return w/2+ oR*(1+1.0/ratio+1.0/ratio/4) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				return w / 2.0 + oR * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("cy", function (d, i) {
				//return oR * (3 * (1 + k) - 1) + oR*(1+1.0/ratio+1.0/ratio/4) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				return oR * (3 * (1 + k) - 1) + oR * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
			});
		
	}
};


function activateBubble(d, i) {
	
	console.log("In activateBubble");
	// increase this bubble and decrease others
	var t = svg.transition()
		.duration(d3.event.altKey ? 7500 : 350);
	
	t.selectAll(".topBubble")
		.attr("cy", function (d, ii) {
			if (i == ii) {
				// Nothing to change
				//return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
				return oR * (3 * (1 + ii) - 1);
			} else {
				// Push away a little bit
				if (ii < i) {
					// left side
					return oR * 0.6 * (3 * (1 + ii) - 1);
				} else {
					// right side
					return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
				}
			}
		})
		.attr("r", function (d, ii) {
			if (i == ii)
				return oR * 1.3;
			else
				return oR * 0.8;
		});
	
	t.selectAll(".topBubbleText")
		.attr("y", function (d, ii) {
			if (i == ii) {
				// Nothing to change
				//return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
				return oR * (3 * (1 + ii) - 1);
			} else {
				// Push away a little bit
				if (ii < i) {
					// left side
					return oR * 0.6 * (3 * (1 + ii) - 1);
				} else {
					// right side
					return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
				}
			}
		})
		.attr("font-size", function (d, ii) {
			if (i == ii)
				return 30 * 1.5;
			else
				return 30 * 0.6;
		});
	//.on("click", function(d,i) {
	// window.open(d.address);
	//});
	
	
	var signSide = -1;
	var focus_buble_id = i;
	for (var k = 0; k < nTop; k++) {
		signSide = 1;
		if (k < nTop / 2) signSide = 1;
		t.selectAll(".childBubbleText" + k)
			.attr("x", function (d, i) {
				if (focus_buble_id == k) {
					return w / 2.0 + (1.3 * oR) * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				}
				return w / 2 + signSide * oR * (1 + 1.0 / ratio + 1.0 / ratio / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("y", function (d, i) {
				if (focus_buble_id == k) {
					return oR * (3 * (1 + k) - 1) + (oR * 1.3) * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				}
				return oR * (3 * (1 + k) - 1) - 0.6 * oR * (k - 1) + signSide * oR * (1 + 1.0 / ratio + 1.0 / ratio / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI) + oR;
			})
			.attr("font-size", function () {
				//return (k==i)?12:6;
				return (k == i) ? 12 : 0;
			})
			.style("opacity", function () {
				return (k == i) ? 1 : 0;
			});
		
		t.selectAll(".childBubble" + k)
			.attr("cx", function (d, i) {
				if (focus_buble_id == k) {
					return w / 2.0 + (1.3 * oR) * (3.0 / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
				}
				return w / 2 + signSide * oR * (1 + 1.0 / ratio + 1.0 / ratio / 2) * Math.sin((i - 1) * 45 / 180 * Math.PI);
			})
			.attr("cy", function (d, i) {
				if (focus_buble_id == k) {
					return oR * (3 * (1 + k) - 1) + (oR * 1.3) * (3.0 / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI);
				}
				return oR * (3 * (1 + k) - 1) - 0.6 * oR * (k - 1) + signSide * oR * (1 + 1.0 / ratio + 1.0 / ratio / 2) * Math.cos((i - 1) * 45 / 180 * Math.PI) + oR;
			})
			.attr("r", function () {
				return (k == i) ? (oR * 0.55) : 0;
			})
			.style("opacity", function () {
				return (k == i) ? 1 : 0;
			});
		
	}
	
}

window.onresize = resetBubbles;
