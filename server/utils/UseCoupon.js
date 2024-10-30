import { burnTokenHelper } from "../helper/BurnToken.js";
import SpecialTokenModel from "../models/SpecialToken.js";
import TokenModel from "../models/TokenModel.js";
export const applyCouponDiscount = async (
  buyer,
  seller,
  item,
  applyTokenId,
  applyCollectionId,
  tokenType
) => {
  let discountAmount = 0;
  let coupon = null;
  let burnTokenResult = null; 

  if (item.priceOfCoupon > 500) {
    // Check if the buyer has an unused coupon from this store
    if (tokenType === "special") {
      coupon = await SpecialTokenModel.findOne({
        tokenOwnerId: buyer._id,
        tokenId: applyTokenId,
        collectionId: applyCollectionId,
        isPurchased: true,
        "metadata.storeId": seller._id,
      });
    } else if (tokenType === "standard") {
      coupon = await TokenModel.findOne({
        tokenOwnerId: buyer._id,
        tokenId: applyTokenId,
        collectionId: applyCollectionId,
        isPurchased: true,
        "metadata.storeId": seller._id,
      });
    }

    if (coupon) {
      discountAmount = coupon.priceOfCoupon;
    }
  }

  const finalPrice = Math.max(item.priceOfCoupon - discountAmount, 0);

  // Burn the used coupon if one is found
  if (coupon) {
    burnTokenResult = await burnTokenHelper(
      coupon.tokenOwnerId,
      applyTokenId,
      applyCollectionId
    );
  }

  return { finalPrice, discountAmount, coupon, burnTokenResult };
};