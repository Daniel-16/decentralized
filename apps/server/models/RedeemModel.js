import mongoose from "mongoose";

const RedeemRequestSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "User",
    },
    couponToRedeem: {
      tokenId: {
        type: Number,
        required: true,
      },
      collectionId: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    requestedAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const RedeemRequestModel = mongoose.model("RedeemRequest", RedeemRequestSchema);

export default RedeemRequestModel;
