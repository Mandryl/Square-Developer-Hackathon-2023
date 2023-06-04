const express = require("express");
const { fetchFirstLocation } = require("../square/locations.js");
const { fetchCatalogObjects, fetchCatalogItemsAndImages } = require("../square/catalog.js");
const { fetchOrderById, fetchOrders, createOrder, cancelOrder } = require("../square/orders.js");
const { fetchPayments, createPayment } = require("../square/payments.js");
const { bigIntToString, asyncHandler} = require("../square/utils/squareHelper.js");
const router = express.Router();

router.get("/locations", asyncHandler(async (req, res) => {
    const locationObj = await fetchFirstLocation();
    res.status(200).json(locationObj);
}));

router.get("/catalog/objects", asyncHandler(async (req, res) => {
    const types = req.query.type ? req.query.type.split(",") : [];
    const objects = await fetchCatalogObjects(types);
    res.status(200).json(JSON.parse(JSON.stringify(objects, bigIntToString)));
}));

router.get("/catalog/items", asyncHandler(async (req, res) => {
    const categoryNames = req.query.category ? req.query.category.split(",") : [];
    const itemsObj = await fetchCatalogItemsAndImages(categoryNames);
    res.status(200).json(JSON.parse(JSON.stringify(itemsObj, bigIntToString)));
}));

router.get("/orders/:orderId", asyncHandler(async (req, res) => {
    const order = await fetchOrderById(req.params.orderId);
    res.status(200).json(JSON.parse(JSON.stringify(order, bigIntToString)));
}));

router.get("/orders", asyncHandler(async (req, res) => {
    const statuses = req.query.status ? req.query.status.split(",") : [];
    const orders = await fetchOrders(statuses);
    res.status(200).json(JSON.parse(JSON.stringify(orders, bigIntToString)));
}));

router.post("/orders", asyncHandler(async (req, res) => {
    const { items, note } = req.body;
    if (!items) {
        return res.status(400).send({ message: "Items are required" });
    }
    const order = await createOrder(items, note);
    res.status(200).json(JSON.parse(JSON.stringify(order, bigIntToString)));
}));

router.put("/orders/:orderId/cancel", asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await cancelOrder(orderId);
    res.status(200).json(JSON.parse(JSON.stringify(order, bigIntToString)));
}));

router.get("/payments", asyncHandler(async (req, res) => {
    const statuses = req.query.status ? req.query.status.split(",") : [];
    const payments = await fetchPayments(statuses);
    res.status(200).json(JSON.parse(JSON.stringify(payments, bigIntToString)));
}));

router.post("/payments", asyncHandler(async (req, res) => {
    const { orderId, token } = req.body;
    const buyerSuppliedAmount = req.body.buyerSuppliedAmount ? req.body.buyerSuppliedAmount : null;
    const payment = await createPayment(orderId, token, buyerSuppliedAmount);
    res.status(200).json(JSON.parse(JSON.stringify(payment, bigIntToString)));
}));

module.exports = router;
