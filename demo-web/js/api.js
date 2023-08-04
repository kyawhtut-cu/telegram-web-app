(function (jQuery) {
	"use strict"

	let ajax = {}

	const STATUS = {
		LOADING: "loading",
		SUCCESS: "success",
		ERROR: "error"
	}

	function Api(base_url) {
		this.baseURL = base_url
	}

	Api.prototype.get = function(path, callback) {

		let route = this.baseURL + path

		if (ajax != null && ajax[route] != null) {
			ajax[route].abort()
		}

		let response = {
			status: STATUS.LOADING,
			data: null,
			error: null
		}

		ajax[route] = $.ajax({
			url: route,
			type: `get`,
			beforeSend: function() {
				callback(response)
			},
			complete: function() {
			},
			success: function(resp) {
				if (resp.status === 200) {
					response.status = STATUS.SUCCESS
				} else {
					response.status = STATUS.ERROR
				}
				response.error = resp.message
				response.data = resp.data
				callback(response)
			},
			error: function(jqXHR, exception) {
				response.status = STATUS.ERROR
				response.error = parseError(jqXHR, exception)
				callback(response)
			}
		})
	}

	function post({path, method, jsonData, callback}) {

		let route = this.base_url + path

		if (ajax != null && ajax[route] != null) {
			ajax[route].abort()
		}

		let response = {
			status: STATUS.LOADING,
			data: null,
			error: null
		}

		ajax[route] = $.ajax({
			url: route,
			type: method,
			data: JSON.stringify(jsonData),
			contentType: `application/json; charset=utf-8`,
			beforeSend: function() {
				callback(response)
			},
			complete: function() {
			},
			success: function(resp) {
				if (resp.status === 200) {
					response.status = STATUS.SUCCESS
				} else {
					response.status = STATUS.ERROR
				}
				response.error = resp.message
				response.data = resp.data
				callback(response)
			},
			error: function(jqXHR, exception) {
				response.status = STATUS.ERROR
				response.error = parseError(jqXHR, exception)
				callback(response)
			}
		})
	}

	function parseError(jqXHR, exception) {
		var msg = ``
		let status = jqXHR.status

		if (status === `(failed)net:ERR_INTERNET_DISCONNECTED`) {
			msg = `Uncaught Error.\n${jqXHR.responseText}`
		} else if (status === 0) {
			msg = `Not connect.\nVerify Network.`
		} else if (status === 413) {
			msg = `Image size is too large`
		} else if (status == 404) {
			msg = `Requested page not found [404]`
		} else if (status == 405) {
			msg = `Image size is too large`
		} else if (status == 500) {
			msg = `Internal Server Error [500]`
		} else if (exception === `parsererror`) {
			msg = `Requested JSON parse failed.`
		} else if (exception === `timeout`) {
			msg = `Time out error.`
		} else if (exception === `abort`) {
			msg = `Ajax request aborted.`
		} else {
			msg = `Uncaught Error.\n${jqXHR.responseText}`
		}

		return msg
	}

	jQuery.Api = function(base_url) {
		return new Api(base_url)
	}
}(jQuery))
