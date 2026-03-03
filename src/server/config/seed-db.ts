import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import Game from '../models/game.js';
import Platform from '../models/platform.js';
import Publisher from '../models/publisher.js';

export const seedDatabase = async () => {
  try {
    await Promise.all([
      Game.deleteMany({}),
      Platform.deleteMany({}),
      Publisher.deleteMany({})
    ]);

    const platformsMap = new Map();
    const publishersMap = new Map();
    const gamesToInsert: any[] = [];

    const csvPath = path.resolve('data/vgsales.csv');
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', async (row) => {
        // Handle Platform 
        if (!platformsMap.has(row.Platform)) {
          const p = await Platform.findOneAndUpdate(
            { platform: row.Platform },
            { platform: row.Platform },
            { upsert: true, new: true }
          );
          platformsMap.set(row.Platform, p._id);
        }

        // Handle Publisher
        if (!publishersMap.has(row.Publisher)) {
          const pub = await Publisher.findOneAndUpdate(
            { publisher: row.Publisher },
            { publisher: row.Publisher },
            { upsert: true, new: true }
          );
          publishersMap.set(row.Publisher, pub._id);
        }

        // Prepare Game
        gamesToInsert.push({
          rank: Number(row.Rank),
          name: row.Name,
          year: Number(row.Year),
          genre: row.Genre,
          platform: platformsMap.get(row.Platform),
          publisher: publishersMap.get(row.Publisher),
          sales: {
            na: Number(row.NA_Sales),
            eu: Number(row.EU_Sales),
            jp: Number(row.JP_Sales),
            other: Number(row.Other_Sales),
            global: Number(row.Global_Sales)
          }
        });

        // Insert every 1000 rows to save memory
        if (gamesToInsert.length >= 1000) {
          const batch = gamesToInsert.splice(0, 1000);
          await Game.insertMany(batch);
          console.log(`Inserted ${batch.length} games...`);
        }
      })
      .on('end', async () => {
        if (gamesToInsert.length > 0) {
          await Game.insertMany(gamesToInsert);
        }
        console.log('Seeding complete!');
        process.exit(0);
      });

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};
