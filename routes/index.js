'use strict'

const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const smartApp = require('../lib/smartapp');

/**
 * Render the home page listing installed app instances, which we read from out local database
 */
router.get('/', (req, res) => {
	const installedAppIds = db.listInstalledApps()
	res.render('index', {installedAppIds})
})

/**
 * Render the installed app instance dashboard page
 */
router.get('/dashboard/:id', async (req, res) => {
	const context = await smartApp.withContext(req.params.id)

	const options = {
		installedAppId: req.params.id,
		scenes: [],
		switches: [],
		locks: [],
		devices: []
	}

	// Show the scenes, if enabled
	if (context.configBooleanValue('scenes')) {
		options.scenes = await context.api.scenes.list()
	}

	// Show the SmartThings switches, if enabled.
	if (context.configBooleanValue('switches')) {

		// Query SmartThings for all switches in the location
		const switches = (await context.api.devices.list({capability: 'switch'}))

			// Filter out the Acme switches based in the external ID, which was assigned when
			// we created the switches
			.filter(it => !(it.app && it.app.externalId && it.app.externalId.startsWith('acme-')))

		// Query the SmartThings API for the current status of each switch
		options.switches = await Promise.all(switches.map(it => {
			return context.api.devices.getCapabilityStatus(it.deviceId, 'main', 'switch').then(state => {
				return {
					deviceId: it.deviceId,
					label: it.label,
					value: state.switch.value
				}
			})
		}))
	}

	// Show the SmartThings locks, if enabled.
	if (context.configBooleanValue('locks')) {
		options.locks = await Promise.all((await context.api.devices.list({capability: 'lock'})).map(it => {
			return context.api.devices.getCapabilityStatus(it.deviceId, 'main', 'lock').then(state => {
				return {
					deviceId: it.deviceId,
					label: it.label,
					value: state.lock.value
				}
			})
		}))
	}

	// Show the Acme devices, if they were imported
	if (context.configBooleanValue('devices')) {
		const devices = db.getAcmeAccount(context.installedAppId).devices
		options.devices = Object.keys(devices).map(it => devices[it])
	}

	res.render('dashboard.ejs', options)
})

/* Execute a scene */
router.post('/isa/:id/scenes/:sceneId', async (req, res) => {
	const context = await smartApp.withContext(req.params.id)
	const result = await context.api.scenes.execute(req.params.sceneId)
	res.send(result)
});

/* Execute a device command. This endpoint is called from the dashboard when a SmartThings switch or lock is tapped. It makes and API
 * call to SmartThings to execute a command on the device.
 */
router.post('/isa/:id/devices/:deviceId/command', async (req, res) => {
	const context = await smartApp.withContext(req.params.id)
	const result = await context.api.devices.executeCommand(req.params.deviceId, req.body)
	res.send(result)
});

/* Send a device event. This endpoint is called from the dashboard when an Acme device is tapped. We don't execute a command in this
 * case because we own the Acme device. All we need to do is update its state.
 */
router.post('/isa/:id/devices/:deviceId/event', async (req, res) => {
	const context = await smartApp.withContext(req.params.id)
	const result = await context.api.devices.sendEvents(req.params.deviceId, req.body)
	res.send(result)
});

module.exports = router;
