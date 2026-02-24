import { Server } from 'http';
import { app } from './app.js';
import 'dotenv/config';

const port = process.env.API_PORT;

let server: Server | undefined;

const startServer = async () => {
  try {
    server = app.listen(port, () => {
      console.log(`Server running at port: ${port}`);
    });
  } catch (error: unknown) {
    console.error('An unknown error occurred during server startup.');
  }
};

const gracefulShutdown = async (signal: NodeJS.Signals) => {
  console.log(`\n${signal} signal received: Closing HTTP server.`);

  if (!server) {
    console.error('Server was not running or initialized.');
    process.exit(1);
  }

  server.close(() => {
    console.log('HTTP server closed.');
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
