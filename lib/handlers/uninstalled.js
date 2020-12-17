'use strict'

const db = require('../db')

// Handler called when an app is uninstalled from an account. You should do any cleanup your system might
// require here. In this case we are deleting the stored Acme OAuth tokens.

module.exports = (context, uninstallData) => {
	db.deleteAccount(context.installedAppId)
}
