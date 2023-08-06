(function (jQuery) {
	"use strict";

	jQuery.App = function() {
		let app = {
			BackButton: Telegram.WebApp.BackButton,
			MainButton: Telegram.WebApp.MainButton,
			initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
			id: null,
			username: null,
			displayname: null,

			init() {
				this.MainButton.hide()
				this.BackButton.hide()

				try {
					this.id = this.initDataUnsafe.user.id || null
					this.username = this.initDataUnsafe.user.username || null
					this.displayname = this.initDataUnsafe.user.first_name || ``
					let lastname = this.initDataUnsafe.user.last_name || ``
					if (lastname != ``) {
						this.displayname += ` ` + lastname
					}
				} catch (e) {
					this.id = $.Utils().getParameter("id")
					console.log(e)
				}

				return this
			},

			enableClosingConfirmation() {
				Telegram.WebApp.enableClosingConfirmation()
			},

			disableClosingConfirmation() {
				Telegram.WebApp.disableClosingConfirmation()
			},

			showMainButton() {
				this.MainButton.show()
			},

			hideMainButton() {
				this.MainButton.hide()
			},

			showBackButton() {
				this.BackButton.show()
			},

			hideBackButton() {
				this.BackButton.hide()
			},

			sendData(data) {
				Telegram.WebApp.sendData(data)
			},

			expandApp() {
				Telegram.WebApp.expand()
			},

			showAlert(message, callback) {
				Telegram.WebApp.showAlert(message, callback)
			},

			showConfirm(message, callback) {
				Telegram.WebApp.showConfirm(message, function(button_id) {
					callback(button_id)
				})
			},

			themeParams() {
				return Telegram.WebApp.themeParams
			},

			showPopup(title, message, buttons, callback) {
				// [
				// 	{
				// 		id: 'delete', 
				// 		type: 'destructive', 
				// 		text: 'Delete all'
				// 	},
				// 	{
				// 		id: 'faq', 
				// 		type: 'default', 
				// 		text: 'Open FAQ'
				// 	},
				// 	{
				// 		type: 'cancel'
				// 	},
				// ]
				Telegram.WebApp.showPopup({
					title: title,
					message: message,
					buttons: buttons
				}, function(button_id) {
					callback(button_id)
					if (buttonId === 'delete') {
					DemoApp.showAlert("'Delete all' selected");
					} else if (buttonId === 'faq') {
					Telegram.WebApp.openLink('https://telegram.org/faq');
					}
				})
			},

			close() {
				Telegram.WebApp.close()
			}
		}
		return app.init()
	}
}(jQuery))
