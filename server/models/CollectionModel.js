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
  // tokenUrl: String,
  walletAddress: {
    type: String,
    required: true,
  },
  // token: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Token",
  //   },
  // ],
});

const CollectionModel = mongoose.model("Collection", CollecionSchema);
export default CollectionModel;
