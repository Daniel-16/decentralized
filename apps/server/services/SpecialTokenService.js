import TransactionModel from "../models/TransactionModel.js";
import SpecialTokenModel from "../models/SpecialToken.js";
import Sdk from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

export async function checkAndTransferSpecialToken(
  buyer,
  seller,
  sellerAddress,
  sellerAccount
) {
  const sdk = new Sdk({
    baseUrl: "https://rest.unique.network/opal/v1",
    signer: sellerAccount,
  });

  const purchaseCount = await TransactionModel.countDocuments({
    buyerId: buyer._id,
    storeOwnerId: seller._id,
  });

  if (purchaseCount === 2) {
    const specialToken = await SpecialTokenModel.findOne({
      tokenOwnerId: seller._id,
      wonByUser: false,
      tokenOwnerAddress: seller.accountAddress,
    });

    if (specialToken) {
      const specialTokenTransfer = await sdk.token.transfer.submitWaitResult({
        collectionId: specialToken.collectionId,
        tokenId: specialToken.tokenId,
        address: sellerAddress,
        to: buyer.accountAddress,
      });

      if (specialTokenTransfer.isCompleted) {
        await SpecialTokenModel.findByIdAndUpdate(specialToken._id, {
          tokenOwnerAddress: buyer.accountAddress,
          tokenOwnerId: buyer._id,
          wonByUser: true,
        });

        console.log(`Special token transferred to buyer: ${buyer._id}`);
        return true;
      }
    }
  }

  return false;
}
