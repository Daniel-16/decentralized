import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  nameOfStore: {
    type: String,
    required: true,
  },
});

const StoreModel = mongoose.model("Store", StoreSchema);
export default StoreModel;
