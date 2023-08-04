(function (jQuery) {
	"use strict";

	jQuery.App = function() {
		return {
			BackButton: Telegram.WebApp.BackButton,
			MainButton: Telegram.WebApp.MainButton,

			init() {
				this.MainButton.hide()
				this.BackButton.hide()
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

			showAlert(message) {
				Telegram.WebApp.showAlert(message)
			},

			showConfirm(message, callback) {
				Telegram.WebApp.showConfirm(message, function(button_id) {
					callback(button_id)
				})
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
	}
}(jQuery))
