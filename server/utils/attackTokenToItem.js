import ItemModel from "../models/ItemsModel.js";
import TokenModel from "../models/TokenModel.js";

export const attachTokenToItem = async () => {
  try {
    // Get all items and winning tokens
    const items = await ItemModel.find({});
    const winningTokens = await TokenModel.find({ isWinningToken: true });

    for (const token of winningTokens) {
      // Find items that belong to the same owner as the token
      const matchingItems = items.filter(
        (item) =>
          item.itemOwnerId.toString() === token.tokenOwnerId.toString() &&
          !item.attachedToken
      );

      if (matchingItems.length > 0 && Math.random() < 0.1) {
        // Randomly select one of the matching items
        const randomIndex = Math.floor(Math.random() * matchingItems.length);
        const selectedItem = matchingItems[randomIndex];

        // Attach the token to the selected item
        selectedItem.attachedToken = token._id;
        await selectedItem.save();

        console.log(`Attached token ${token._id} to item ${selectedItem._id}`);
      }
    }

    console.log("Token attachment process completed");
  } catch (error) {
    console.error("Error in attachTokenToItem:", error);
  }
};
