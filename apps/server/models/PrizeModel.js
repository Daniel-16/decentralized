import mongoose from "mongoose";

const PrizeSchema = new mongoose.Schema({
  name: String,
  description: String,
  value: {
    type: Number,
    default: 50,
  },
});

const PrizeModel = mongoose.model("Prize", PrizeSchema);

export default PrizeModel;
