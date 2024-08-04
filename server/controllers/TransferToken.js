import Sdk, { CHAIN_CONFIG } from "@unique-nft/sdk";
import { KeyringProvider } from "@unique-nft/accounts/keyring";

export const transferTokenController = async (req, res) => {
  const { mnemonic, collectionId, tokenId, toAddress, fromAddress } = req.body;

  if (!mnemonic || !collectionId || !tokenId || !toAddress) {
    return res.status(400).json({
      success: false,
      message: "Mnemonic, collectionId, tokenId, and toAddress are required",
    });
  }

  try {
    const account = await KeyringProvider.fromMnemonic(mnemonic);
    const address = account.address;

    const sdk = new Sdk({
      baseUrl: CHAIN_CONFIG.opal.restUrl,
      signer: account,
    });

    const txTransfer = await sdk.token.transfer.submitWaitResult({
      collectionId,
      tokenId,
      address,
      to: toAddress,
      // from: fromAddress || address, // Use provided fromAddress or default to the signer's address
    });

    const parsedTransfer = txTransfer.parsed;

    res.status(200).json({
      success: true,
      message: "Token transferred successfully",
      newOwner: parsedTransfer?.to,
      tokenId: parsedTransfer?.tokenId,
      collectionId: parsedTransfer?.collectionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while transferring the token",
      error: error.message,
    });
  }
};
