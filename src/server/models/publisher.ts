import { Schema, model } from "mongoose";
import type { PublisherDocument } from "../types/game-types.js";

const publisherSchema = new Schema<PublisherDocument>(
  {
    publisher: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const PublisherModel = model<PublisherDocument>("Publisher", publisherSchema);
export default PublisherModel;
