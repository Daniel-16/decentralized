import RedeemRequestModel from "../models/RedeemModel.js";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";
import { burnTokenHelper } from "../helper/BurnToken.js";

// initiate request to redeem
export const redeemCoupon = async (req, res) => {
  const { tokenId, collectionId } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const token = await TokenModel.findOne({
      tokenId,
      collectionId,
      isPurchased: true,
      tokenOwnerAddress: user.accountAddress,
    });

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });
    }

    // Check for existing redeem request
    const existingRequest = await RedeemRequestModel.findOne({
      initiator: userId,
      "couponToRedeem.tokenId": tokenId,
      "couponToRedeem.collectionId": collectionId,
    });

    if (existingRequest) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Redeem request already made for this coupon.",
        });
    }

    const redeemRequest = await RedeemRequestModel.create({
      initiator: userId,
      store: token.metadata.storeAddress,
      couponToRedeem: { tokenId, collectionId },
    });

    res.status(200).json({ success: true, redeemRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptRedeemRequest = async (req, res) => {
  const { redeemRequestId } = req.params;
  const storeId = req.user.id;

  try {
    const store = await UserModel.findById(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }
    const redeemRequest = await RedeemRequestModel.findById(redeemRequestId);

    if (!redeemRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Redeem request not found" });
    }

    if (redeemRequest.store !== store.accountAddress) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to accept this redeem request",
      });
    }

    if (redeemRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Redeem request is not in pending status",
      });
    }

    // Update the redeem request status
    redeemRequest.status = "completed";
    redeemRequest.resolvedAt = new Date();
    await redeemRequest.save();

    const token = await TokenModel.findOne({
      tokenId: redeemRequest.couponToRedeem.tokenId,
      collectionId: redeemRequest.couponToRedeem.collectionId,
    });

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });
    }

    const burnTokenResult = await burnTokenHelper(
      token.tokenOwnerId,
      redeemRequest.couponToRedeem.collectionId,
      redeemRequest.couponToRedeem.tokenId
    );

    res.status(200).json({
      success: true,
      message: "Redeem request accepted successfully",
      redeemRequest,
      burnTokenResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllRedeemRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // get the logged in users details from the UserModel, including their wallet address
    const loggedInUser = await UserModel.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // get the wallet address of the logged in user
    const loggedInUserWalletAddress = loggedInUser.accountAddress;

    // optional query params
    const { status, userId } = req.query;

    // query object for dfilter
    const query = {
      store: loggedInUserWalletAddress,
    };

    if (status) {
      query.status = status;
    }
    if (userId) {
      query.initiator = userId;
    }

    const redeemRequests = await RedeemRequestModel.find(query)
      .populate("initiator", "id username email") 
      .lean();

    if (redeemRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No redeem requests found",
        redeemRequests: [], 
      });
    }

    const enrichedRedeemRequests = await Promise.all(
      redeemRequests.map(async (redeemRequest) => {
        const token = await TokenModel.findOne({
          tokenId: redeemRequest.couponToRedeem.tokenId,
          collectionId: redeemRequest.couponToRedeem.collectionId,
        }).lean();

        if (token) {
          return {
            ...redeemRequest,
            tokenDetails: {
              tokenName: token.tokenName,
              tokenDescription: token.tokenDescription,
              priceOfCoupon: token.priceOfCoupon,
            },
          };
        } else {
          return redeemRequest;
        }
      })
    );

    res.status(200).json({
      success: true,
      redeemRequests: enrichedRedeemRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};