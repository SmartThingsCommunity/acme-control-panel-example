'use strict'

const SSE = require('express-sse')

// Used to send device state changes to the dashboard web UI

module.exports = new SSE()
