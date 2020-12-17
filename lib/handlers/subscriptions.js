'use strict'

const sse = require('../sse')

// Handlers called when the status of a lock or switch changes. All these do in this example
// are to send events to the web page. You would replace this implementation that updates the
// status of these devices in the connected cloud

module.exports = {
	lockHandler: (context, event) => {
		if (event.componentId === 'main') {
			sse.send({
				deviceId: event.deviceId,
				value: event.value
			})
		}
	},

	switchHandler: (context, event) => {
		if (event.componentId === 'main') {
			sse.send({
				deviceId: event.deviceId,
				value: event.value
			})
		}
	}
}
