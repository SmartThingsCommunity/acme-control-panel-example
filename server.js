'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session')
const path = require('path')
const sse = require('./lib/sse')
const indexRouter = require('./routes/index');
const oauthRouter = require('./routes/oauth');

// Configure the Express web server
const PORT = process.env.PORT || 3001;
const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs')

// Customize logging to include SmartApp lifecycle information on HTTP log, for debug purposes
server.use(morgan((tokens, req, res) => {
    const result = [
        tokens.date(req, res, 'iso'),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ]
    if (req.path === '/smartapp') {
        const body = req.body
        let suffix = ''
        if (body.eventData) {
            suffix = '/' + body.eventData.events.map(it => it.eventType).join(', ')
        } else if (body.configurationData) {
            suffix = '/' + body.configurationData.phase
        }
        result.push(`- Lifecycle: ${body.lifecycle}${suffix}`)
    }
    return result.join(' ')
}))

// Router for the dashboard. The dashboard in this case represents your device and/or cloud platform.
// It's not part of a typical SmartApp. It's included here to simulate physical actuation of the devices
// and/or user of the connected cloud or mobile app
server.use('/', indexRouter);

// Router for the OAuth journey. This could be provided by a plugin or external service such as AWS Cognito.
// It's included here to make this demo project self-contained and to illustrate the details of the OAuth
// process
server.use('/oauth', oauthRouter);

// The SmartApp implementation
const smartApp = require('./lib/smartapp');

// The route that handles lifecycle event requests from SmartThings
server.post('/smartapp', (req, res, next) => {
    smartApp.handleHttpCallback(req, res);
});

// The route that handles Server-Sent Events to update the dashboard web page. This would not normally be part
// of a SmartApp
server.get('/events', sse.init)

// Start listening on the designated port
server.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`)
});

