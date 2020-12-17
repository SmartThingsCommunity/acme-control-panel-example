# Acme Control Panel Example

This SmartApp hosts a web page dashboard that allows the control of scenes, locks, and switches. 
It also creates two devices in the SmartThings location, which are also reflected on
the dashboard. It's an example of how to:
* Execute scenes
* Execute device commands
* Subscribe to device state change events by capability
* Store the auth tokens and settings of installed app instances and use them when making 
  calls to the SmartThings API that are not in response to SmartApp lifecycle events.
* Create devices
* Respond to device commands

## File Structure

* lib
  * db.js &mdash; module for listing installed app instances from the context store
  * smartapp.js &mdash; the SmartApp implementation
  * sse.js &mdash; Server-Sent Event object used to update the web page  
* locales
  * en.json &mdash; English version of the app configuration page text
* public
  * images &mdash; web image files
  * javascript &mdash; web page JavaScript files
  * stylesheets &mdash; web page css files
* routes
  * index.js -- defines routes for the dashboard and SmartApp endpoint
  * oauth.js - defines routes for the OAuth server (not normally part of a SmartApp)
* server.js &mdash; the Express server that hosts the SmartApp as a web-hook
* views
  * index.ejs &mdash; the home page
  * dashboard.ejs &mdash; the installed app instance control page
  * login.js &mdash the OAuth login page

## Prerequisites
- A [Samsung Developer Workspace account](https://smartthings.developer.samsung.com/workspace/)

- [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed

- [ngrok](https://ngrok.com/) or similar tool to create a secure tunnel to a publicly available URL
  
## Getting Started

### Clone this GitHub repository
```bash
git clone https://github.com/SmartThingsCommunity/device-scene-example-nodejs.git
```

### Start the server
```bash
cd device-scene-example-nodejs
npm install
node server.js
```

### Start ngrok and point it to your server
```
ngrok http localhost:3001
```
Make note of the HTTPS forwarding URL, for example `https://c79461932dfc.ngrok.io`

### Create an automation in the developer workspace

Go to the SmartThings developer workspace and create an Automation SmartApp. This app should have the scopes:
```
r:devices:*
x:devices:*
r:scenes:*
x:scenes:*
i:deviceprofiles:*
```
Choose the web-hook option when creating the app. The _targetURI_ should be set to the ngrok forwarding
URL, for example `https://c79461932dfc.ngrok.io`

Take note of the `appId`, `clientId`, and `clientSecret` displayed after creating your app.

### Confirm that your app is ready to receive lifecycle events

Look in your server log for a line with a URL to use for verifying your app. Visit this URL to confirm
the location of your app (you can do this in a web browser).

### Create a .env file and restart the server

Create a file named `.env` in the project directory that sets your `appId`, `clientId`, and `clientSecret`.
For example:
```
APP_ID=912e0214-5706-4407-a299-b3796a57cf56
CLIENT_ID=61225bef-d2db-4ab0-82f6-d28c0f11911d
CLIENT_SECRET=94c2b3df-b0ab-4abd-84bf-1823d63b944c
```

and restart your NodeJS server. Do not restart ngrok or the URL will change (unless your are using a 
paid account)

### Install your SmartApp and visit the web page

Install your SmartApp using the SmartThings mobile app. Then visit your local web server
to see and control devices and scenes.

http://localhost:3001
