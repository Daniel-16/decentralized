import SpecialTokenModel from "../models/SpecialToken.js";
import TokenModel from "../models/TokenModel.js";

export const applyCouponDiscount = async (buyer, seller, item, specialTokenId, specialCollectionId) => {
  let discountAmount = 0;
  let coupon = null;

  if (item.priceOfCoupon > 5000) {
    // Check if the buyer has an unused coupon from this store
    // coupon = await TokenModel.findOne({
    //   tokenOwnerId: buyer._id,
    //   isPurchased: true,
    //   "metadata.storeId": seller._id,
    // });
    coupon = await SpecialTokenModel.findOne({
      tokenOwnerId: buyer._id,
      tokenId: specialTokenId,
      collectionId: specialCollectionId,
      isPurchased: true,
      "metadata.storeId": seller._id,
    });

    if (coupon) {
      discountAmount = coupon.priceOfCoupon;
    }
  }

  const finalPrice = Math.max(item.priceOfCoupon - discountAmount, 0);

  return { finalPrice, discountAmount, coupon };

  // TODO: burn the used coupon
};
