import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  storeOwner: {
    type: mongoose.Schema.Types.String,
    ref: "Store",
    required: true,
  },
  collectionId: Number,
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  tokenId: {
    type: Number,
    required: true,
  },
  redeemed: { type: Boolean, default: false },
});

const CouponModel = mongoose.model("Coupon", CouponSchema);
export default CouponModel;
