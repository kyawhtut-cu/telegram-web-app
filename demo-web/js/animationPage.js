(function (jQuery) {

	let isShowing = true
	let id = null
	let page = null
	let animation = null

	function renderAnimation(path) {
		if (page === null) return

		page.empty()

		if (animation != null) {
			animation.stop()
		}

		isShowing = true
		page.show()

		animation = bodymovin.loadAnimation({
			container: document.getElementById(id),
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: path
		})

		animation.play()
	}

	jQuery.AnimationPage = function(div) {
		id = div.replace("#", "")
		page = $(div)
		page.hide()

		return {

			loading(path = "animation/loading.json") {
				renderAnimation(path)
			},

			error(path = "animation/error.json") {
				renderAnimation(path)
			},

			empty(path = "animation/empty_data.json") {
				renderAnimation(path)
			},

			isShowing() {
				return isShowing
			},

			hide() {
				isShowing = false
				animation.stop()
				animation = null
				page.empty()
				page.hide()
			}
		}
	}
}(jQuery))
