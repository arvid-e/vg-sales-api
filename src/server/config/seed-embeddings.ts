import dotenv from 'dotenv';
import mongoose from 'mongoose';
import GamesModel from '../models/GamesModel.js';
import { AIService } from '../services/ai-service.js';

dotenv.config();

const runSeed = async () => {
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

/**
 * Seed the database, attaching embeddings to each game to enable Semantic Search
 */
const seed = async () => {
  const ai = new AIService();
  let processedCount = 0;
  let remaining = true;

  while (remaining) {
    const games = await GamesModel.find({
      $or: [
        { title_embedding: { $exists: false } },
        { title_embedding: { $size: 0 } },
      ],
    }).limit(500);

    if (games.length === 0) {
      console.log('All games have been embedded!');
      remaining = false;
      break;
    }

    // Prepare the bulk operations
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

    // 3Execute bulk write
    if (bulkOps.length > 0) {
      await GamesModel.bulkWrite(bulkOps);
      processedCount += bulkOps.length;
      console.log(
        `Successfully embedded batch. Total processed: ${processedCount}`
      );
    }
  }
};

runSeed();
