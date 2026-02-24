import { startServer } from "./server/server.js";
import { gracefulShutdown } from "./server/server.js";

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();