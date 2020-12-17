'use strict'

const db = require('../db')

// Defines the SmartApp configuration pages. In this case we check whether or not the user has authenticated
// with the Acme platform. If so then we render the SmartThings connection options. If not then we render
// the link to the authentication page.

const ACME_SERVER_URL = process.env.ACME_SERVER_URL
const ACME_CLIENT_ID = process.env.ACME_CLIENT_ID

module.exports = {
	mainPage: (context, page) => {
		const account = db.getAcmeAccount(context.installedAppId)
		if (account) {
			// If the account exists, i.e. the user has logged in via the OAuth process, then display
			// the connection options
			page.section('types', section => {
				section.booleanSetting('scenes').defaultValue(true)
				section.booleanSetting('switches').defaultValue(true)
				section.booleanSetting('locks').defaultValue(true)
			});

			page.section('acme', section => {
				section.booleanSetting('devices').defaultValue(true)
			})
		} else {
			// If the account does not exist, prompt the user to log in via the OAuth process

			// Image heading
			page.section('heading', section => {
				section.imageSetting('acme').image(`${ACME_SERVER_URL}/images/acme.png`)
			});

			// Introductory text
			page.section('text', section => {
				section.paragraphSetting('intro')
			});

			// Link to the OAuth server
			page.section('oauth', section => {
				// The SmartThings URL to redirect back to after login, to complete the OAuth process
				const redirectUri = encodeURIComponent('https://api.smartthings.com/oauth/callback')

				// The URL of the OAuth server. The "scope" parameter in this case is whatever is required by the cloud
				// you are integrating with. So not include SmartThings app scopes here. Those are specified in the
				// SmartApp implementation
				const url = `${ACME_SERVER_URL}/oauth/login?client_id=${ACME_CLIENT_ID}&scope=XXXXX&response_type=code&redirect_uri=${redirectUri}`
				section.oauthSetting('link').urlTemplate(url)
			});
		}
	}
}
