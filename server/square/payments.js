const logger = require("../common/logger");
const client = require("./utils/square-client");
const { SQUARE_LOCATION_ID } = process.env;
const { v4: uuidv4 } = require("uuid");

// Fetch payments with optional status filter
async function fetchPayments(statuses = []) {
  const {
    result: { payments }
  } = await client.paymentsApi.listPayments();

  // Filter payments based on statuses if statuses is not empty
  const paymentsWithStatuses =
    statuses.length > 0
      ? payments.filter((payment) => statuses.includes(payment.status))
      : payments;

  return paymentsWithStatuses;
}

// Create a new payment
async function createPayment(orderId, token, buyerSuppliedAmount) {
  const idempotencyKey = uuidv4();
  const { result: { orders }, errors } = await client.ordersApi.batchRetrieveOrders({
    locationId: SQUARE_LOCATION_ID,
    orderIds: [orderId],
  });
  if (errors) {
    logger.error(errors);
    throw new Error("Error retrieving orders");
  }
  const order = orders[0];
  
  let cashDetails = {};
  if (token === "CASH") {
    if (!buyerSuppliedAmount) {
      throw new Error("Buyer supplied amount is required for CASH payment method");
    }
    cashDetails = {
      buyerSuppliedMoney: {
        amount: buyerSuppliedAmount,
        currency: order.totalMoney.currency,
      },
    };
  }

  if (order.totalMoney.amount > 0) {
    let requestParams = {
      sourceId: token,
      amountMoney: order.totalMoney,
      orderId: order.id,
      idempotencyKey: idempotencyKey,
    };
    if (token === "CASH") {
      requestParams.cashDetails = cashDetails;
    }

    const { result: { payment }, errors } = await client.paymentsApi.createPayment(requestParams);

    if (errors) {
      logger.error(errors);
      throw new Error("Error creating payment");
    }

    return payment;
  } else {
    const { result: { payment }, errors } = await client.ordersApi.payOrder(orderId, {
      idempotencyKey
    });

    if (errors) {
      logger.error(errors);
      throw new Error("Error paying order");
    }

    return payment;
  }
}


module.exports = { fetchPayments, createPayment };
