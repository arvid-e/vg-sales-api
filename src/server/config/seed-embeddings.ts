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

  let remaining = true;
  while (remaining) {
    const games = await GamesModel.find({
      $or: [
        { title_embedding: { $exists: false } },
        { title_embedding: { $size: 0 } },
      ],
    }).limit(500); // Process in batches of 500 to avoid memory issues

    if (games.length === 0) {
      console.log('All games have been embedded!');
      remaining = false;
      break;
    }

    console.log(`Found ${games.length} games to embed...`);

    for (const game of games) {
      // Combine title and genre for better search context
      const textToEmbed = `${game.name} ${game.genre}`;
      const vector = await ai.generateVector(textToEmbed);

      game.title_embedding = vector;
      await game.save();
    }

    console.log('Batch complete!');
  }
};

runSeed();
