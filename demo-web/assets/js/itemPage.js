(function (jQuery) {

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzid6fJqnEQnz5NxR-CL-r0E84AKfS280BeZuaYMha_1i9fC2COdZCvhYdh7N0G-9ahZg/exec`

	let page = null
	let itemList = []

	function calculateTotalCount() {
		let App = $.App()

		let totalCount = 0
		itemList.forEach(item => {
			let count = item.count
			if (count != null) {
				totalCount += count
			}
		})

		App.MainButton.text = "စျေးဝယ်ခြင်း ကြည့်ရန်"
		if (totalCount > 0) App.showMainButton()
		else App.hideMainButton()
	}

	function addToCart(count, item_id) {

		let item = itemList[itemList.findIndex(item => item.item_id == item_id)]

		if (item == null) return

		let newCount = 0

		if (item.count != null) {
			newCount = item.count
		}

		newCount += count
		if (newCount < 0) {
			newCount = 0
		}

		item["count"] = newCount

		itemList[itemList.indexOf(item => item.item_id == item_id)] = item

		calculateTotalCount()

		$(`#span-${item_id}`).text(newCount)
		
		if (newCount === 0) {
			$(`#span-${item_id}`).hide()
			$(`#div-${item_id}`).hide()
			$(`#btn-${item_id}`).show()
		} else {
			$(`#span-${item_id}`).show()
			$(`#div-${item_id}`).show()
			$(`#btn-${item_id}`).hide()
		}
	}


	function renderPage() {

		page.empty()

		if (itemList.length == 0) return

		let row = $(`<table>`, {
			'class': `row`
		})
		itemList.forEach(item => {
			let parent = $(`<div>`, {
				'class': `col-4 mt-2 mb-3 text-center`,
			})

			let divFood = $(`<div>`, {
				'class': `product-container`
			}).append($(`<img>`, {
				'src': item.item_image
			})).append($(`<span>`, {
				'id': `span-${item.item_id}`,
				'style': `display: none;`
			}))
			parent.append(divFood)

			parent.append($(`<p>`, {
				'class': `product-name mt-2`
			}).text(item.item_name))
			parent.append($(`<p>`, {
				'class': `product-price`
			}).text(`SGD ${item.item_price}`))

			let btnAddToCart = $(`<button>`, {
				'id': `btn-${item.item_id}`,
				'type': `button`,
				'class': `btn btn-warning btn-sm product-add`
			}).text(`Add`)
			btnAddToCart.click(function() {
				addToCart(1, item.item_id)
			})
			parent.append(btnAddToCart)

			let btnAdd = $(`<button>`, {
				'id': `btnAdd-${item.item_id}`,
				'class': `btn btn-warning btn-sm product-add-action`
			}).text(`+`)
			btnAdd.click(function() {
				addToCart(1, item.item_id)
			})
			let btnRemove = $(`<button>`, {
				'id': `btnRemove-${item.item_id}`,
				'class': `btn btn-danger btn-sm product-add-action`,
				'style': `margin-right: 0.5rem;`
			}).text(`-`)
			btnRemove.click(function() {
				addToCart(-1, item.item_id)
			})
			let divAction = $(`<div>`, {
				'id': `div-${item.item_id}`,
				'style': `display: none;`,
			}).append(btnRemove).append(btnAdd)
			parent.append(divAction)

			row.append(parent)
		})

		page.append(row)
	}

	jQuery.ItemPage = function(div) {
		page = $(div)
		page.empty()

		return {
			isHasSelectedItem() {
				return getCartItemList().length > 0
			},

			getCartItemList() {
				return itemList.filter(item => {
					item.count != null && item.count > 0
				})
			},

			show() {
				$.App().MainButton.text = "စျေးဝယ်ခြင်း ကြည့်ရန်"
				page.show()
			},

			hide() {
				page.hide()
			},

			fetch(callback) {
				let brand_id = $.Utils().getParameter("brand_id")
				let api = $.Api(BASE_URL)
				api.get(
					`?route=item_list_by_brand_id&brand_id=${brand_id}`,
					function(response) {
						callback(response)
						if (response.status === "success") {
							if (response.data != null) itemList = response.data
							renderPage()
						}
					}
				)
			}
		}
	}
}(jQuery))
