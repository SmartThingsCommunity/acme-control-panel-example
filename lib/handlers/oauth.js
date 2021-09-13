'use strict'

const axios = require('axios')
const qs = require('querystring')
const db = require('../db')

// Handler called after SmartThings receives the redirect from the OAuth login page. In this case we call
// the ACME server to exchange the code received in the redirect for access and refresh tokens. Note that in
// the case of this test app we wouldn't have to call the server to do this exchange, but we do so because we
// are simulating the case where you are using a service such as AWS Cognito to handle the OAuth rather than
// implementing it yourself.

const ACME_SERVER_URL = process.env.ACME_SERVER_URL
const ACME_CLIENT_ID = process.env.ACME_CLIENT_ID
const ACME_CLIENT_SECRET = process.env.ACME_CLIENT_SECRET

module.exports = async (context, event) => {
	let params = qs.parse(event.urlPath);
	const data = {
		client_id: ACME_CLIENT_ID,
		client_secret: ACME_CLIENT_SECRET,
		grant_type: "authorization_code",
		code: params.code,
		scope: params.scope
	}

	try {
		// Call the OAuth server to exchange the code for tokens
		const resp = await axios.post(`${ACME_SERVER_URL}/oauth/token`, data)

		// Store the tokens in our local database so that they can be used to talk to the
		// cloud we are connecting to SmartThings. We don't actually use these tokens in this
		// example app, since we aren't calling another cloud. They are used to keep track of
		// the number of installations and to drive the dashboard page.
		db.putAcmeTokens(event.installedAppId, resp.data)
	} catch (e) {
		console.log('Error authenticating with Acme', e)
	}
}
