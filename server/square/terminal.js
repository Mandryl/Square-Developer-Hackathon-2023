const client = require('./utils/square-client')
const { v4: uuidv4 } = require('uuid')

async function createTerminalCheckout(orderId, amount) {
  // device id
  let device_id
  if (process.env.SQUARE_ENV === 'sandbox') {
    device_id = process.env.SQUARE_TERMINAL_DEVICE_ID
  } else if (process.env.SQUARE_ENV === 'production') {
    const {
      result: { devices }
    } = await client.devicesApi.listDevices()
    if (devices && devices.length > 0) {
      return devices[0].id
    } else {
      throw new Error('No devices found')
    }
  } else {
    throw new Error('No SquareEnv')
  }

  // create checkout
  const response = await client.terminalApi.createTerminalCheckout({
    idempotencyKey: uuidv4(),
    checkout: {
      amountMoney: {
        amount: amount,
        currency: 'USD'
      },
      orderId: orderId,
      deviceOptions: {
        deviceId: device_id,
        skipReceiptScreen: false,
        collectSignature: false,
        showItemizedCart: false
      }
    }
  })
  return response.result
}

module.exports = {
  createTerminalCheckout
}
