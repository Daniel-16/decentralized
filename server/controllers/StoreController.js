import CouponModel from "../models/CouponModel.js";
import ServiceModel from "../models/ServicesModel.js";
import StoreModel from "../models/StoreModel.js";

export const createStore = async (req, res) => {
  const { nameOfStore } = req.body;
  try {
    const store = await StoreModel.create({
      nameOfStore,
    });
    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createService = async (req, res) => {
  const { nameOfService } = req.body;
  const { storeId } = req.params;
  try {
    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        error: "Store not found!",
      });
    }
    const service = await ServiceModel.create({
      store: storeId,
      nameOfStore: store.nameOfStore,
      nameOfService,
    });
    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createCoupon = async (req, res) => {
  const { couponName, typeOfCoupon } = req.body;
  const { storeId } = req.params;
  try {
    const store = await StoreModel.findOne({ _id: storeId });
    if (!store) {
      return res.status(404).json({
        success: false,
        error: "Store not found",
      });
    }
    const coupon = await CouponModel.create({
      storeOwner: store.nameOfStore,
      couponName,
      typeOfCoupon,
    });
    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getStores = async (_req, res) => {
  try {
    const stores = await StoreModel.find();
    res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
