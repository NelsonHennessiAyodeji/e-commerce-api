const Order = require("../model/Order");
const Product = require("../model/Product");
const { searchPermissions } = require("../utilities");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../error");
const { STATUS_CODES } = require("http");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cartItems provided");
  }

  if (!tax || !shippingFee) {
    throw new BadRequestError("please provide tax and shipping fee");
  }

  // we cant use map not for each in await so we go with for of
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with id: ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrder = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id
    };
    //add item to order
    orderItems = [...orderItems, singleOrder];
    //Calculate sub total
    subtotal += item.amount * price;
  }

  //calculate total
  const total = tax + shippingFee + subtotal;
  /*this a pseudo stripe function, as it would be too far fetched to make the real thing in a
    mock project like this, not to say i cant do it but im just not really feeling if 
    cos im not pushing up this project*/

  //get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "ngn"
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError("This ID does not exists");
  }

  searchPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json(order);
};

const getCurrentUserOrders = async (req, res) => {
  const userOrders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json(userOrders);
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body; //payment intent id is gotten when the payment goeds throgh
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new NotFoundError("This ID does not exists");
  }

  searchPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
};
