const express = require("express");

const {
  getAllOrdersOfAllUsers,
  selectDeliveryBoy,
  getOrderDetailsForDelivery,
  getAllDeliveryUsers,
} = require("../../controllers/delivery/order-controller");

const router = express.Router();

router.get("/duser", getAllDeliveryUsers);
router.get("/get/:id", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForDelivery);
router.put("/update/:id", selectDeliveryBoy);

module.exports = router;
