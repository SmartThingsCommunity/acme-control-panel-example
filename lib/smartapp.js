'use strict'

const FileContextStore = require('@smartthings/file-context-store')
const SmartApp = require('@smartthings/smartapp');
const db = require('./db')
const commandHandlers = require('./handlers/commands')
const oauthHandler = require('./handlers/oauth')
const pageHandlers = require('./handlers/pages')
const subscriptionHandlers = require('./handlers/subscriptions')
const updatedHandler = require('./handlers/updated')
const uninstalledHandler = require('./handlers/uninstalled')

/*
 * Persistent storage of SmartApp tokens and configuration data in local files
 */
const contextStore = new FileContextStore(db.contextDirectory)

/* Define the SmartApp */
module.exports = new SmartApp()
	// Configure the use of the i18n framework to SmartApp configuration page text. If you set
	// update: true the locale file will automatically be created, after which you can edit it.
    .configureI18n({updateFiles: false})

	// Respond with the scopes this app requires. You must also have selected these scopes in the
	// Dev Workspace when you created the app
    .permissions(['r:devices:*', 'x:devices:*', 'r:scenes:*', 'x:scenes:*', 'i:deviceprofiles:*'])

	// This three values come from the Dev Workspace
    .appId(process.env.ST_APP_ID)
    .clientId(process.env.ST_CLIENT_ID)
    .clientSecret(process.env.ST_CLIENT_SECRET)

	.enableEventLogging(2)

	// Configure a "context store" for you app. We are using a simple file-based context store in this
	// example. In production you'd want something more scalable, such as the DynamoDB context store.
	// By configuring a context store you allow the SmartApp SDK to manage the storable and retrieval
	// of access tokens and configuration options, for use when you make pro-active callbacks to the
	// SmartThings API. For example, when you tap switches on the dashboard of this example app
    .contextStore(contextStore)

	// Hide the field that allows the app to be renamed. Since this is a singleton app (only one instance is
	// allowed per location), there is no need to rename it.
    .disableCustomDisplayName()

    // Defines the SmartApp configuration pages. In this case we check whether or not the user has authenticated
    // with the Acme platform. If so then we render the SmartThings connection options. If not then we render
    // the link to the authentication page.
    .page('mainPage', pageHandlers.mainPage)

    // Handler called whenever app is installed or updated
    // Called for both INSTALLED and UPDATED lifecycle events if there is
    // no separate installed() handler
    .updated(updatedHandler)

    // Handler called when an app is uninstalled from an account. You should do any cleanup your system might
    // require here. In this case we are deleting the stored Acme OAuth tokens.
    .uninstalled(uninstalledHandler)

    // Handler called when the status of a switch changes
    .subscribedEventHandler('switchHandler', subscriptionHandlers.switchHandler)

    // Handler called when the status of a lock changes
    .subscribedEventHandler('lockHandler', subscriptionHandlers.lockHandler)

    // Handler called after SmartThings receives the redirect from the OAuth login page. In this case we call
    // the ACME server to exchange the code received in the redirect for access and refresh tokens. Note that in
    // the case of this test app we wouldn't have to call the server to do this exchange, but we do so because we
    // are simulating the case where you are using a service such as AWS Cognito to handle the OAuth rather than
    // implementing it yourself.
    .oauthHandler(oauthHandler)

	// Handler called when an on command is executed for an Acme device on the SmartThings platform
    .deviceCommand('switch/on', commandHandlers.onHandler)


	// Handler called when an off command is executed for an Acme device on the SmartThings platform
	.deviceCommand('switch/off', commandHandlers.offHandler)
