import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  nameOfStore: {
    type: mongoose.Schema.Types.String,
    ref: "Store",
  },
  nameOfService: {
    type: String,
    required: true,
  },
  coupon: {
    type: Array,
    required: true,
  },
});

const ServiceModel = mongoose.model("Service", ServiceSchema);
export default ServiceModel;
