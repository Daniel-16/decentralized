import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  serviceOwner: {
    type: mongoose.Schema.Types.String,
    ref: "Service",
  },
  couponName: {
    type: String,
    required: true,
  },
});

const CouponModel = mongoose.model("Coupon", CouponSchema);
export default CouponModel;
