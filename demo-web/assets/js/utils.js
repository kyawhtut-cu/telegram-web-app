(function(jQuery) {

	jQuery.Utils = function() {
		return {
			getParameter(key) {
				key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
				var regx = new RegExp("[\\?&]" + key + "=([^&#]*)")
				let results = regx.exec(location.search)
				return results === null ? `` : decodeURIComponent(results[1].replace(/\+/g, " "))
			},
		}
	}
}(jQuery))
