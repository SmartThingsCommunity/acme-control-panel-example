'use strict'

const express = require('express');
const router = express.Router();
const randToken = require('rand-token');

/**
 * OAuth login page displayed by ST mobile app
 */
router.get('/login', (req, res) => {
	req.session.redirect_uri = req.query.redirect_uri;
	if (req.query.state) {
		req.session.client_state = req.query.state
	}
	res.render('login', {
		query: req.query,
		errorMessage: '',
		infoMessage: ''
	})
})

/**
 * Processes OAuth logins
 */
router.get("/login/authenticate", async (req, res) => {
	//console.log(`${new Date().toISOString()} AUTHENTICATING...`)
	const code = randToken.generate(12)
	if (req.session.redirect_uri) {
		const redirectUri = req.session.redirect_uri;
		let location = `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}code=${code}`;
		if (req.session.client_state) {
			location += "&state=" + req.session.client_state;
		}
		console.log(`${new Date().toISOString()} REDIRECTING TO ${location}`)
		res.writeHead(307, {"Location": location});
	}
	res.end();
});

/**
 * Processes redemption of OAuth codes and refresh tokens
 */
router.post('/token', async (req, res) => {
	//console.log(`${new Date().toISOString()} PROCESSING TOKEN REQUEST ${JSON.stringify(req.body)}`)
	const token = {
		access_token: randToken.generate(24),
		refresh_token: randToken.generate(24),
		expires_in: 86400,
		token_type: "Bearer"
	}
	res.send(token)
});

module.exports = router;
