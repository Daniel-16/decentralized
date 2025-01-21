import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    moves: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('GameScore', gameScoreSchema); 