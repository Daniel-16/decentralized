import mongoose from "mongoose";

const CollecionSchema = new mongoose.Schema({
  collectionOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  collectionId: {
    type: Number,
    required: true,
  },
  // tokenId: {
  //   type: String,
  //   required: true,
  // },
  collectionUrl: String,
  name: String,
  description: String,
  // tokenUrl: String,
  walletAddress: {
    type: String,
    required: true,
  },
  collectionImageUrl: String,
  tokens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CollectionModel = mongoose.model("Collection", CollecionSchema);
export default CollectionModel;
