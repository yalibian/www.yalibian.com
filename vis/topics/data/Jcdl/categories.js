function hereDoc(e) {
	return e.toString().replace(/^[^\/]+\/\*!?\s?/, "").replace(/\*\/[^\/]+$/, "")
}

var categories_str = hereDoc(function () {
});