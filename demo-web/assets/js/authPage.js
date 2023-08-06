(function(jQuery) {

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzid6fJqnEQnz5NxR-CL-r0E84AKfS280BeZuaYMha_1i9fC2COdZCvhYdh7N0G-9ahZg/exec`

	let Api = null
	let App = null
	let NetworkCallback = null
	let GoToHome = null
	let Page = null
	let isLogin = true
	let request = {
		user_email: null,
		user_password: null,
	}

	function parseJwt(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	function checkLoginAction() {
		App.showMainButton()

		let isEnable = request.user_email != null && request.user_password != null

		if (isEnable) {
			App.MainButton.color = App.themeParams().button_color
			App.MainButton.enable()
		} else {
			App.MainButton.color = "#d5d0d0"
			App.MainButton.disable()
		}
	}

	function goToLogin() {
		isLogin = false
		$.Utils().logout()

		Page.empty()

		Page.append(`
			<h3 class="text-center mt-5 mb-5">Login</h3>
			<div class="material-input-group mt-4 ms-5 me-5">
				<input type="email" required id="inputEmail">
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Email address</label>
			</div>
			<div class="material-input-group ms-5 me-5">
				<input type="password" required id="inputPassword">
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Password</label>
			</div>
			<div class="toast-container position-fixed bottom-0 end-0 p-3">
				<div id="loginError" class="align-items-center fade hide" role="alert" aria-live="assertive" aria-atomic="true">
					<div class="d-flex">
						<div class="alert alert-danger m-0">
							Email address or password is incorrect.
						</div>
					</div>
				</div>
			</div>
		`)

		App.MainButton.text = `Login`

		$(`#inputEmail`).on(`input`, function() {
			request.user_email = null
			if ($(this).val() != ``) {
				request.user_email = $(this).val()
			}
			checkLoginAction()
		})
		$(`#inputPassword`).on(`input`, function() {
			request.user_password = null
			if ($(this).val() != ``) {
				request.user_password = $(this).val()
			}
			checkLoginAction()
		})

		checkLoginAction()
	}

	function checkAuth() {
		let token = $.Utils().localStorage.token
		if (token == null) {
			$.Utils().localStorage.token = ``
			token = ``
		}

		if (token != ``) {
			let jwtData = parseJwt(token)
			if (new Date(jwtData.exp * 1000) < new Date()) {
				goToLogin()
				return
			}
		}

		Api.sheet({
			route: `get`,
			token: token,
			callback: function(response) {
				NetworkCallback(response)
				if (response.status_code === 200) {
					isLogin = true
					
					$.Utils().localStorage.user = JSON.stringify(response.data)
					
					if (GoToHome != null) GoToHome()
					
					Page.empty()
					Page.hide()
				} else if (response.status_code === 401) {
					goToLogin()
				}
			}
		})
	}

	function confirmLogin() {
		App.MainButton.disable()
		App.MainButton.color = "#d5d0d0"
		Page.hide()
		Api.sheet({
			route: `login`,
			payload: request,
			callback: function(response) {
				NetworkCallback(response)
				if (response.status_code === 200) {
					isLogin = true
					$.Utils().localStorage.token = response.data.token

					delete response.data.cache_order
					delete response.data.order_list
					delete response.data.token

					$.Utils().localStorage.user = JSON.stringify(response.data)

					if (GoToHome != null) GoToHome()

				} else if (response.status_code === 401) {
					Page.show()
					bootstrap.Toast.getOrCreateInstance($(`#loginError`)).show()
					checkLoginAction()
				}
			}
		})
	}

	jQuery.AuthPage = function(app) {
		Api = $.Api(BASE_URL)
		App = app

		Page = $(`<div>`, {
			'id': 'divAuthPage'
		})
		Page.appendTo(`.container`)

		let r = document.querySelector(":root")
		if (App.themeParams().button_color != null) {
			r.style.setProperty(`--input_color`, App.themeParams().button_color)
		}

		return {

			init() {
				checkAuth()
			},

			goToLogin() {
				goToLogin()
			},

			isLogin() {
				return isLogin
			},

			setNetworkCallback(callback) {
				NetworkCallback = callback
			},

			setGoToHome(goToHome) {
				GoToHome = goToHome
			},

			show() {
				div.show()
			},

			hide() {
				div.hide()
			},

			confirmLogin() {
				confirmLogin()
			}
		}
	}
}(jQuery))
