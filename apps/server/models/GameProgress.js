import mongoose from "mongoose";

const gameProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  lastPlayed: {
    type: Date,
    required: true,
  },
  nextAvailablePlay: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("GameProgress", gameProgressSchema);
