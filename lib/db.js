'use strict'

const fs = require('fs')
const path = require('path')
const dataDirectory = process.env.DATA_DIRECTORY || 'data'
const contextDirectory = path.join(dataDirectory, 'smartthings')
const tokenDirectory = path.join(dataDirectory, 'acme')

const db = {
	listInstalledApps() {
		return fs.readdirSync(contextDirectory).map(it => it.substring(0, it.length - 5))
	},

	tokenFilePath(installedAppId) {
		return path.join(tokenDirectory, `${installedAppId}.json`)
	},

	putAcmeTokens(installedAppId, data) {
		fs.writeFileSync(this.tokenFilePath(installedAppId), JSON.stringify(data, null, 2), 'utf-8')
	},

	putAcmeDevices(installedAppId, ...devices) {
		const pathname = this.tokenFilePath(installedAppId)
		const data = JSON.parse(fs.readFileSync(pathname))
		if (!data.devices) {
			data.devices = {}
		}
		for (const device of devices) {
			data.devices[device.deviceId] = device
		}
		fs.writeFileSync(this.tokenFilePath(installedAppId), JSON.stringify(data, null, 2), 'utf-8')
	},

	updateAcmeDeviceState(installedAppId, deviceId, value) {
		const pathname = this.tokenFilePath(installedAppId)
		const data = JSON.parse(fs.readFileSync(pathname))
		if (data.devices && data.devices[deviceId]) {
			data.devices[deviceId].value = value
			fs.writeFileSync(this.tokenFilePath(installedAppId), JSON.stringify(data, null, 2), 'utf-8')
		} else {
			console.log(`DEVICE ${deviceId} NOT FOUND!`)
		}
	},

	deleteAllAcmeDevices(installedAppId) {
		const pathname = this.tokenFilePath(installedAppId)
		const data = JSON.parse(fs.readFileSync(pathname))
		delete data.devices
		fs.writeFileSync(this.tokenFilePath(installedAppId), JSON.stringify(data, null, 2), 'utf-8')
	},

	getAcmeAccount(installedAppId) {
		const pathname = this.tokenFilePath(installedAppId)
		if (fs.existsSync(pathname)) {
			return JSON.parse(fs.readFileSync(pathname))
		}
		return undefined
	},

	deleteAccount(installedAppId) {
		fs.unlinkSync(this.tokenFilePath(installedAppId))
	},

	contextDirectory: contextDirectory
}

module.exports = db;
