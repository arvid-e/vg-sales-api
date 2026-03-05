import csv from 'csv-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Game from '../models/GamesModel.js';
import Platform from '../models/PlatformModel.js';
import Publisher from '../models/PublisherModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected! Starting seed...');

    await seedDatabase();

    await mongoose.disconnect();
    console.log('Seeding complete and disconnected.');

    process.exit(0);
  } catch (error) {
    console.error('Critical Seed Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await Promise.all([
      Game.deleteMany({}),
      Platform.deleteMany({}),
      Publisher.deleteMany({}),
    ]);

    const csvPath = path.resolve('data/vgsales.csv');
    const rawRows: any[] = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => rawRows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Read ${rawRows.length} rows. Starting processing...`);

    const platformsMap = new Map();
    const publishersMap = new Map();
    let gamesToInsert: any[] = [];

    for (const row of rawRows) {
      // Handle Platform
      if (!platformsMap.has(row.Platform)) {
        const p = await Platform.findOneAndUpdate(
          { platform: row.Platform },
          { platform: row.Platform },
          { upsert: true, returnDocument: 'after' }
        );
        platformsMap.set(row.Platform, p?._id);
      }

      // Handle Publisher
      if (!publishersMap.has(row.Publisher)) {
        const pub = await Publisher.findOneAndUpdate(
          { publisher: row.Publisher },
          { publisher: row.Publisher },
          { upsert: true, returnDocument: 'after' }
        );
        publishersMap.set(row.Publisher, pub?._id);
      }

      const yearValue = Number(row.Year);

      gamesToInsert.push({
        rank: Number(row.Rank),
        name: row.Name,
        // Handle "N/A" values
        year: isNaN(yearValue) ? 0 : yearValue,
        genre: row.Genre,
        platform: platformsMap.get(row.Platform),
        publisher: publishersMap.get(row.Publisher),
        sales: {
          na: Number(row.NA_Sales) || 0,
          eu: Number(row.EU_Sales) || 0,
          jp: Number(row.JP_Sales) || 0,
          other: Number(row.Other_Sales) || 0,
          global: Number(row.Global_Sales) || 0,
        },
      });

      // Batch insert every 1000 rows to keep things moving
      if (gamesToInsert.length >= 1000) {
        await Game.insertMany(gamesToInsert);
        console.log(`Successfully saved ${gamesToInsert.length} games...`);
        gamesToInsert = [];
      }
    }

    // Final insert for the remainder
    if (gamesToInsert.length > 0) {
      await Game.insertMany(gamesToInsert);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

runSeed()
  .then(() => console.log('Seed process finished'))
  .catch((err) => console.error('Seed process crashed', err));
