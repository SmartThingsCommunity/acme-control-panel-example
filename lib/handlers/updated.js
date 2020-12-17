'use strict'

const db = require('../db')
const DEVICE_PROFILE_ID = process.env.DEVICE_PROFILE_ID

// Handler called whenever app is installed or updated
// It is calle for both INSTALLED and UPDATED lifecycle events if there is
// no separate installed() handler

module.exports = async (context, updateData) => {
	// Delete any existing subscriptions
	await context.api.subscriptions.delete()

	// Subscribe to switch status change events for all devices in the installed location
	if (context.configBooleanValue('switches')) {
		await context.api.subscriptions.subscribeToCapability('switch', 'switch', 'switchHandler')
	}

	// Subscribe to lock status change events for all devices in the installed location
	if (context.configBooleanValue('locks')) {
		await context.api.subscriptions.subscribeToCapability('lock', 'lock', 'lockHandler')
	}

	// See if we have already created the Acme devices
	const devices = await context.api.devices.list({installedAppId: context.installedAppId})

	// Check if importation of devices is enabled
	if (context.configBooleanValue('devices')) {
		if (devices.length === 0) {

			// Importation is enabled but devices have not been created. Start by creating two
			// devices in SmartThings to represent the two Acme control panel devices
			const newDevices = await Promise.all([
				context.api.devices.create({
					label: 'Acme Switch 1',
					app: {
						profileId: DEVICE_PROFILE_ID,
						externalId: 'acme-1'
					}
				}),
				context.api.devices.create({
					label: 'Acme Switch 2',
					app: {
						profileId: DEVICE_PROFILE_ID,
						externalId: 'acme-2'
					}
				})
			])

			// Send events to set the initial states of these two devices
			const newDeviceState = {
				component: 'main',
				capability: 'switch',
				attribute: 'switch',
				value: 'off'
			}
			const deviceData = await Promise.all(newDevices.map(async (it) => {
				await context.api.devices.createEvents(it.deviceId, [newDeviceState])
				return {
					deviceId: it.deviceId,
					value: newDeviceState.value,
					label: it.label
				}
			}))

			// Save these devies in our local database
			db.putAcmeDevices(context.installedAppId, ...deviceData)
		}
	} else if (devices.length > 0) {

		// Importation is disabled. Delete the existing devices if there are any
		await Promise.all(devices.map(it => {
			return context.api.devices.delete(it.deviceId)
		}))
		db.deleteAllAcmeDevices(context.installedAppId)
	}
}
