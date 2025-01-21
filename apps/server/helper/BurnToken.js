import { KeyringProvider } from "@unique-nft/accounts/keyring";
import TokenModel from "../models/TokenModel.js";
import UserModel from "../models/UserModel.js";
import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";

export const burnTokenHelper = async (userId, collectionId, tokenId) => {
  try {
    const user = await UserModel.findById(userId);

    const mnemonic = user.mnemonic;
    if (!mnemonic) {
      throw new Error("User mnemonic not found");
    }

    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const sdk = new Sdk({
      baseUrl: "https://rest.unique.network/opal/v1",
      signer: account,
    });

    const txBurn = await sdk.token.burn.submitWaitResult({
      collectionId,
      tokenId,
      address: user.accountAddress,
    });

    await TokenModel.findOneAndDelete({
      tokenId,
      collectionId,
    });

    return {
      success: true,
      message: `Token ${txBurn.parsed?.tokenId} was burned in the collection ${txBurn.parsed?.collectionId}`,
    };
  } catch (error) {
    throw error;
  }
};

// export const burnToken = async (req, res) => {
//   const { collectionId, tokenId } = req.body;
//   const userId = req.user.id;

//   try {
//     const result = await burnTokenHelper(userId, collectionId, tokenId);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
