'use strict'

const db = require('../db')
const sse = require('../sse')

/*
 * Handlers for process on and off commands for the Acme switch devices that this integration
 * creates on the SmartThings platform.
 */
module.exports = {

	onHandler: async (context, deviceId, cmd) => {
		await context.api.devices.createEvents(deviceId, [{
			component: cmd.componentId,
			capability: cmd.capability,
			attribute: 'switch',
			value: 'on'
		}])
		db.updateAcmeDeviceState(context.installedAppId, deviceId, 'on')
		sse.send({
			deviceId: deviceId,
			value: 'on'
		})
	},

	offHandler: async (context, deviceId, cmd) => {
		await context.api.devices.createEvents(deviceId, [{
			component: cmd.componentId,
			capability: cmd.capability,
			attribute: 'switch',
			value: 'off'
		}])
		db.updateAcmeDeviceState(context.installedAppId, deviceId, 'off')
		sse.send({
			deviceId: deviceId,
			value: 'off'
		})
	}
}
