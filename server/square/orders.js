const client = require("./utils/square-client");
const { SQUARE_LOCATION_ID } = process.env;
const { v4: uuidv4 } = require("uuid");

// Fetch order by ID
async function fetchOrderById(orderId) {
  const response = await client.ordersApi.retrieveOrder(orderId);
  return response.result;
}

// Fetch orders with optional status filter
async function fetchOrders(statuses = []) {
  let query;
  if (statuses.length > 0) {
    query.query = {
      filter: {
        stateFilter: {
          states: statuses,
        },
      },
    };
  }

  const {
    result: { orders },
  } = await client.ordersApi.searchOrders(query);

  return orders;
}

// Create a new order
async function createOrder(items, note = "") {
  const lineItems = items.map((item) => ({
    catalogObjectId: item.itemVarId,
    quantity: item.itemQuantity.toString(),
  }));

  let taxes = [];
  for (const item of items) {
    let {
      result: { object },
    } = await client.catalogApi.retrieveCatalogObject(item.itemId);
    if (!!object.itemData.taxIds && object.itemData.taxIds.length > 0) {
      for (let i = 0; i < object.itemData.taxIds.length; i++) {
        const taxId = object.itemData.taxIds[i];
        const isDuplicate = taxes.some((tax) => tax.catalogObjectId === taxId);
        if (!isDuplicate) {
          taxes.push({
            catalogObjectId: taxId,
            scope: "ORDER",
          });
        }
      }
    }
  }

  const {
    result: { order },
  } = await client.ordersApi.createOrder({
    order: {
      locationId: SQUARE_LOCATION_ID,
      lineItems,
      fulfillments: [
        {
          type: "PICKUP",
          state: "PROPOSED",
          pickupDetails: {
            recipient: {
              displayName: "GUEST",
            },
            pickupAt: `${new Date().toISOString()}`,
          },
          note: "These pickupetails are entered for the convenience of local payment by the guest customer.",
        },
      ],
      taxes,
      note,
    },
    idempotencyKey: uuidv4(),
  });

  return order;
}

// Cancel an existing order
async function cancelOrder(orderId) {
  let orderResponse = await fetchOrderById(orderId);
  if (!orderResponse || !orderResponse.order) {
    throw new Error(`Order with id ${orderId} not found.`);
  }

  let { order } = orderResponse;

  // Check if the order is already cancelled
  if (order.state === "CANCELED") {
    throw new Error(`Order with id ${orderId} has already been canceled.`);
  }

  order.fulfillments.map((fulfillment) => {
    fulfillment.state = "CANCELED";
  });

  let updateResponse1 = await client.ordersApi.updateOrder(orderId, { order });
  if (
    !updateResponse1 ||
    !updateResponse1.result ||
    !updateResponse1.result.order
  ) {
    throw new Error(
      `Failed to update fulfillments for order with id ${orderId}.`
    );
  }

  orderResponse = await fetchOrderById(orderId);
  if (!orderResponse || !orderResponse.order) {
    throw new Error(`Order with id ${orderId} not found.`);
  }

  let { order: updatedOrder } = orderResponse;
  updatedOrder.state = "CANCELED";

  let updateResponse2 = await client.ordersApi.updateOrder(orderId, {
    order: updatedOrder,
  });
  if (
    !updateResponse2 ||
    !updateResponse2.result ||
    !updateResponse2.result.order
  ) {
    throw new Error(
      `Failed to update order state for order with id ${orderId}.`
    );
  }

  return updateResponse2.result.order;
}

module.exports = {
  fetchOrderById,
  fetchOrders,
  createOrder,
  cancelOrder,
};
