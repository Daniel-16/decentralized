import GameProgress from "../models/GameProgress.js";
import GameScoreModel from "../models/GameScore.js";

export const saveGameScore = async (req, res) => {
  const { game, score, moves, time } = req.body;
  const userId = req.user.id;

  try {
    const gameScore = new GameScoreModel({
      userId,
      game,
      score,
      moves,
      time,
      timestamp: new Date(),
    });

    await gameScore.save();

    res.status(200).json({
      success: true,
      message: "Score saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const checkGameProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Get game progress
    const progress = await GameProgress.findOne({
      userId,
      game: "coupon-match"
    });

    // Get last game stats
    const lastGameStats = await GameScoreModel.findOne({
      userId,
      game: "coupon-match"
    }).sort({ createdAt: -1 });

    const canPlay = !progress || now >= progress.nextAvailablePlay;

    res.status(200).json({
      success: true,
      canPlay,
      nextAvailablePlay: progress?.nextAvailablePlay,
      lastGameStats: lastGameStats ? {
        time: lastGameStats.time,
        moves: lastGameStats.moves,
        score: lastGameStats.score
      } : null
    });
    res.render('games/coupon-match', {lastGameStats: lastGameStats ? {
      time: lastGameStats.time,
      moves: lastGameStats.moves,
      score: lastGameStats.score
    } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateGameProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const nextPlay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await GameProgress.findOneAndUpdate(
      { userId, game: "coupon-match" },
      { lastPlayed: now, nextAvailablePlay: nextPlay },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      nextAvailablePlay: nextPlay,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
