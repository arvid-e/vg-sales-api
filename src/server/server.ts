import 'dotenv/config';
import { Server } from 'http';
import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDB } from './config/mongoose.js';
import { isErrorWithMessage } from './utils/type-guards.js';

let server: Server | undefined;

export const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running at port: ${PORT}`);
    });
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      console.error('Failed to start server:', error.message);
    } else {
      console.error('An unknown error occurred during server startup.');
    }
  }
};

export const gracefulShutdown = async (signal: NodeJS.Signals) => {
  console.log(`\n${signal} signal received: Closing HTTP server.`);

  if (!server) {
    console.error('Server was not running or initialized.');
    process.exit(1);
  }

  server.close(() => {
    console.log('HTTP server closed.');

    mongoose
      .disconnect()
      .then(() => {
        console.log('Mongoose connection disconnected.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error disconnecting Mongoose:', err);
        process.exit(1);
      });
  });
};
