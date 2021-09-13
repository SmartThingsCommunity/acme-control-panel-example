'use strict'

const context = {
    api: {
        devices: {
            list: jest.fn(() => Promise.resolve([{deviceId: 'xxx', app: {profile: {id: 'yyy'}, externalId: 'abcdefghi'}}])),
            getCapabilityStatus: jest.fn(() => Promise.resolve({presenceStatus: {value: 'Available'}})),
            createEvents: jest.fn(() => Promise.resolve({})),
            create: jest.fn(() => Promise.resolve({})),
            sendCommands: jest.fn(() => Promise.resolve({})),
            update: jest.fn(() => Promise.resolve({}))
        },
        installedApps: {
            delete: jest.fn(() => Promise.resolve({})),
            update: jest.fn(() => Promise.resolve({}))
        },
        scenes: {
            execute: jest.fn(() => Promise.resolve({}))
        }
    },
    config: {
    },
    installedAppId: '3fc7ef74-aff2-4429-83dc-8323c4b886b3',
    configStringValue: configStringValue
}

function configStringValue(name) {
    const entry = context.config[name]
    if (entry && entry.length > 0) {
        return entry[0].stringConfig.value
    }
    return undefined
}

module.exports = context
