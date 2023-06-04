const { Client } = require("square");
require("dotenv").config();

const OrderInfo = require("../models/order-info");
const LocationInfo = require("../models/location-info");

const env = process.env.SQUARE_ENV;
const accessToken = process.env["SQUARE_ACCESS_TOKEN"];
const squareApplicationId = process.env["SQUARE_APPLICATION_ID"];

// Set Square credentials
const config = {
  accessToken,
  environment: env,
};

// Extract instances of Api that are used
// You can add additional APIs here if you so choose
const {
  catalogApi,
  locationsApi,
  ordersApi,
  paymentsApi,
} = new Client(config);

/**
 * Description:
 * Retrieve the order and location informaiton that are widely used in many pages in this example.
 *
 * @param {*} orderId The id of the order
 * @param {*} locationId The id of the location where the order belongs to
 *
 * @returns object{ orderInfo, locationInfo }
 */
const retrieveOrderAndLocation = async (orderId, locationId) => {
  const { result: { orders } } = await ordersApi.batchRetrieveOrders({
    locationId,
    orderIds: [orderId],
  });
  const { result: { location } } = await locationsApi.retrieveLocation(locationId);
  if (!orders || orders.length == 0 || !location) {
    const error = new Error("Cannot find order");
    error.status = 404;
    throw error;
  }

  return {
    orderInfo: new OrderInfo(orders[0]),
    locationInfo: new LocationInfo(location),
  };
};



// Makes API instances and util functions importable
module.exports = {
  squareApplicationId,
  catalogApi,
  locationsApi,
  paymentsApi,
  ordersApi,
  retrieveOrderAndLocation,
};