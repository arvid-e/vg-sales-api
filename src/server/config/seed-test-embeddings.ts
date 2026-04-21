import dotenv from 'dotenv';
import mongoose from 'mongoose';
import GamesModel from '../models/GamesModel.js';
import { AIService } from '../services/ai-service.js';

dotenv.config();

const runSeed = async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Not in test environment, skipping test data seed.');
    process.exit(0);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    await seed();

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Critical Seed Error:', error);
    process.exit(1);
  }
};

const seed = async () => {
  const ai = new AIService();

  const games = await GamesModel.find({
    $or: [
      { title_embedding: { $exists: false } },
      { title_embedding: { $size: 0 } },
    ],
  }).limit(20);

  if (games.length === 0) return;

  const bulkOps = [];
  for (const game of games) {
    const textToEmbed = `${game.name} ${game.genre}`;
    const vector = await ai.generateVector(textToEmbed);

    bulkOps.push({
      updateOne: {
        filter: { _id: game._id },
        update: { $set: { title_embedding: vector } },
      },
    });
  }

  await GamesModel.bulkWrite(bulkOps);
};

runSeed();
