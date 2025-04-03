const Order = require("../../models/Order");
const User = require("../../models/User");


const getAllDeliveryUsers = async (req, res) => {
  try {
    const deliveryBoy = await User.find({role:"delivery"});

    if (!deliveryBoy.length) {
      return res.status(404).json({
        success: false,
        message: "No Delivery boy found!",
      });
    } 


    res.status(200).json({
      success: true,
      data: deliveryBoy,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const { id } = req.params;


    const orders = await Order.find({deliveryId:id});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    } 

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("the request came")


    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const selectDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }


    await Order.findByIdAndUpdate(id, { deliveryId });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForDelivery,
  selectDeliveryBoy,
  getAllDeliveryUsers
};
