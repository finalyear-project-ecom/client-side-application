const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  deliveryId:{
    type:String,
    default:"not alloted"
  },
  productLocation:{

    lat:{
      type:Number,
      default:12.9716
    },
    lng:{
      type:Number,
      default:77.5946
    },
  },
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
    lat:Number,
    lng:Number
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,


  qrCodeUrl: String,
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  damageStatus: String,
  productImages: [String],

  deliveryHistory: [
    {
      deliveryPersonId: mongoose.Schema.Types.ObjectId, // ID of delivery personnel
      name: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  currentDeliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Order", OrderSchema);
