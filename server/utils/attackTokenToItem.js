import ItemModel from "../models/ItemsModel.js";
import TokenModel from "../models/TokenModel.js";

export const attachTokenToItem = async () => {
  const items = await ItemModel.find({ attachedToken: null });
  const tokens = await TokenModel.find({});

  for (const item of items) {
    if (Math.random() < 0.9) {
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      item.attachedToken = randomToken._id;
      await item.save();
    }
  }
};
