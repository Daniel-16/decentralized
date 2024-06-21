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
  const { collectionId, tokenId, redeemed } = req.body;
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
      collectionId,
      tokenId,
      redeemed,
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

export const getServices = async (_req, res) => {
  try {
    const services = await ServiceModel.find();
    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCoupons = async (_req, res) => {
  try {
    const coupons = await CouponModel.find();
    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const redeemCoupon = async (req, res) => {
  const { collectionId } = req.body;
  try {
    const redeemCoupon = await CouponModel.findOneAndUpdate(
      { collectionId },
      { redeemed: true }
    );
    if (!redeemCoupon) {
      res.status(404).json({
        success: false,
        error: "Coupon does not exist",
      });
    }
    res.status(200).json({
      success: true,
      redeemCoupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
