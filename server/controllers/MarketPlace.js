import SpecialTokenModel from "../models/SpecialToken.js";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";

export const getAllCoupons = async (req, res) => {
  try {
    const { item, category, priceRange } = req.query;

    let searchQuery = {
      isPurchased: false,
      isItem: false,
    };

    if (item) {
      searchQuery.isItem = true;
    }

    if (category && category !== "all") {
      searchQuery.category = category; // Assuming coupons have a `category` field
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      searchQuery.finalPriceOfCoupon = { $gte: minPrice, $lte: maxPrice }; // Assuming coupons have `finalPriceOfCoupon` field
    }

    const coupons = await TokenModel.find(searchQuery);

    const couponsWithOwners = await Promise.all(
      coupons.map(async (coupon) => {
        const ownerDetails = await UserModel.findById(coupon.tokenOwnerId);
        return {
          ...coupon._doc,
          ownerName: ownerDetails ? ownerDetails.username : "Unknown",
        };
      })
    );

    res.status(200).json({
      success: true,
      coupons: couponsWithOwners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getStoreCoupons = async (req, res) => {
  const { accountAddress } = req.params;
  const userId = req.user.id;

  try {
    const loggedInUser = await UserModel.findById(userId);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const storeOwner = await UserModel.findOne({ accountAddress });
    if (!storeOwner) {
      return res.status(404).json({
        success: false,
        error: "Store owner not found",
      });
    }
    const coupons = await TokenModel.find({
      tokenOwnerAddress: accountAddress,
      isPurchased: false,
    });
    const items = await TokenModel.find({
      tokenOwnerAddress: accountAddress,
      isPurchased: true,
      isItem: true,
    });

    res.status(200).json({
      success: true,
      storeOwner,
      coupons,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns view: initiate-coupon-swap
 */
export const initiateCouponSwap = async (req, res) => {
  const {
    cid: collectionId = defaultCollectionId,
    tid: tokenId = defaultTokenId,
  } = req.query;
  try {
    const coupon = await TokenModel.findOne({ collectionId, tokenId });
    // console.log("coupon: ", coupon);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: "Coupon not found",
      });
    }

    const swappableCoupons = await TokenModel.find({
      isPurchased: false,
      isItem: false,
      // priceOfCoupon: {$lte: coupon.priceOfCoupon},
      _id: { $ne: coupon._id },
      tokenOwnerAddress: { $ne: coupon.tokenOwnerAddress },
    });

    // console.log("coupon: ", coupon);
    res.render("token/init_swap", {
      coupon,
      swappableCoupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCoupon = async (req, res) => {
  const { collectionId, tokenId } = req.params;
  try {
    const coupon = await TokenModel.findOne({ collectionId, tokenId });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: "Coupon not found",
      });
    }

    // console.log("coupon: ", coupon);
    const ownerDetails = await UserModel.find({
      accountAddress: coupon.tokenOwnerAddress,
    });

    const moreCoupons = await TokenModel.find({
      collectionId,
      isPurchased: false,
    }).limit(5);

    const moreCouponsWithOwnerDetails = await Promise.all(
      moreCoupons.map(async (moreCoupon) => {
        const ownerDetail = await UserModel.findOne({
          accountAddress: moreCoupon.tokenOwnerAddress,
        });
        return {
          ...moreCoupon._doc,
          ownerName: ownerDetail ? ownerDetail.username : "Unknown",
        };
      })
    );
    // console.log("ownerDetails: ", ownerDetails);
    // res.status(200).json({
    //   success: true,
    //   coupon: {
    //     ...coupon._doc,
    //     ownerName: ownerDetails ? ownerDetails.username : "Unknown",
    //   },
    // });
    res.render("token/tokenDetail", {
      token: {
        ...coupon._doc,
        ownerName:
          ownerDetails && ownerDetails.length > 0
            ? ownerDetails[0].username
            : "Unknown",
      },
      moreCoupons: moreCouponsWithOwnerDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getItem = async (req, res) => {
  const { collectionId, tokenId } = req.params;
  try {
    const coupon = await TokenModel.findOne({ collectionId, tokenId });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: "Coupon not found",
      });
    }

    // console.log("coupon: ", coupon);
    const ownerDetails = await UserModel.find({
      accountAddress: coupon.tokenOwnerAddress,
    });

    const moreCoupons = await TokenModel.find({
      collectionId,
      isPurchased: false,
    }).limit(5);

    const moreCouponsWithOwnerDetails = await Promise.all(
      moreCoupons.map(async (moreCoupon) => {
        const ownerDetail = await UserModel.findOne({
          accountAddress: moreCoupon.tokenOwnerAddress,
        });
        return {
          ...moreCoupon._doc,
          ownerName: ownerDetail ? ownerDetail.username : "Unknown",
        };
      })
    );

    // console.log(moreCouponsWithOwnerDetails);

    // Fetch user's coupons based on the account address
    const myCoupons = await TokenModel.find({
      // tokenOwnerAddress: coupon.tokenOwnerAddress,
      // isPurchased: false,
      priceOfCoupon: { $lte: coupon.priceOfCoupon },
      _id: { $ne: coupon._id },
    }).lean();

    // Fetch user's special coupons
    const mySpecialCoupons = await SpecialTokenModel.find({
      // tokenOwnerAddress: coupon.tokenOwnerAddress,
      // isPurchased: false,
      priceOfCoupon: { $lte: coupon.priceOfCoupon },
      _id: { $ne: coupon._id },
    }).lean();

    const combinedCoupons = [
      ...myCoupons.map((coupon) => ({ ...coupon, type: "standard" })),
      ...mySpecialCoupons.map((coupon) => ({ ...coupon, type: "special" })),
    ];

    // console.log(combinedCoupons)

    res.render("items/itemDetail", {
      token: {
        ...coupon._doc,
        ownerName:
          ownerDetails && ownerDetails.length > 0
            ? ownerDetails[0].username
            : "Unknown",
      },
      moreCoupons: moreCouponsWithOwnerDetails,
      myCoupons,
      mySpecialCoupons,
      combinedCoupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getMoreCouponsByCollectionId = async (req, res) => {
  const { collectionId } = req.params;
  try {
    const coupons = await TokenModel.find({
      collectionId,
      isPurchased: false,
    });
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

export const getAllMyCoupons = async (req, res) => {
  const { accountAddress } = req.params;
  const { expectedPriceOfCoupon } = req.query;
  // console.log(expectedPriceOfCoupon);
  const userId = req.user.id;

  try {
    const loggedInUser = await UserModel.findById(userId);
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // console.log(loggedInUser._id)

    const coupons = await TokenModel.find({
      tokenOwnerId: loggedInUser._id,
      // isPurchased: false,
      isItem: false,
      priceOfCoupon: { $lte: expectedPriceOfCoupon },
    })
      .select("collectionId tokenId tokenName priceOfCoupon tokenDescription")
      .lean();

    const specialCoupons = await SpecialTokenModel.find({
      tokenOwnerId: loggedInUser._id,
      // tokenOwnerAddress: accountAddress,
      // isPurchased: false,
      // priceOfCoupon: { $gt: 5000 },
      priceOfCoupon: { $lte: expectedPriceOfCoupon },
    })
      .select("collectionId tokenId tokenName priceOfCoupon tokenDescription")
      .lean();

    const combinedCoupons = [
      ...coupons.map((coupon) => ({ ...coupon, type: "standard" })),
      ...specialCoupons.map((coupon) => ({ ...coupon, type: "special" })),
    ];

    res.status(200).json({
      success: true,
      coupons,
      specialCoupons,
      combinedCoupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
