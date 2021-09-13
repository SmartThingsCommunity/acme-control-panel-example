'use strict'

require('dotenv').config({ path: `__tests__/.env.test` })
const context = require('../__mocks__/context')
const db = require('../lib/db')
const uninstalledHandler = require('../lib/handlers/uninstalled')

jest.mock('../lib/db')

describe('Uninstalled Handler Tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Handle event', async () => {
        db.deleteAccount.mockImplementationOnce(() => Promise.resolve({}))
        await uninstalledHandler(context)
        expect(db.deleteAccount).toHaveBeenCalledTimes(1)
        expect(db.deleteAccount).toHaveBeenCalledWith(context.installedAppId)
    })
})
