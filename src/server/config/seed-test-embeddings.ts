import dotenv from 'dotenv';
import mongoose, { type AnyBulkWriteOperation } from 'mongoose';
import type { IGameDocument } from '../interfaces/game/game.js';
import GamesModel from '../models/GamesModel.js';

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
  const games = await GamesModel.find({
    $or: [
      { title_embedding: { $exists: false } },
      { title_embedding: { $size: 0 } },
    ],
  }).limit(20);

  if (games.length === 0) return;

  const bulkOps: AnyBulkWriteOperation<IGameDocument>[] = games.map((game) => ({
    updateOne: {
      filter: { _id: game._id },
      update: {
        $set: { title_embedding: [0.1, 0.2, 0.3] },
      },
    },
  }));

  await GamesModel.bulkWrite(bulkOps);
  console.log(`Successfully seeded ${bulkOps.length} games.`);
};

runSeed();
