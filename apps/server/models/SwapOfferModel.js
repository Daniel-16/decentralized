import mongoose from "mongoose";

const SwapOfferSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownTokenId: {
    type: Number,
    required: true,
  },
  ownCollectionId: {
    type: Number,
    required: true,
  },
  desiredTokenId: {
    type: Number,
    required: true,
  },
  desiredCollectionId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SwapOfferModel = mongoose.model("SwapOffer", SwapOfferSchema);

export default SwapOfferModel;
