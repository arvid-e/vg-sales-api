import { Schema, model } from "mongoose";
import type { IPlatformDocument } from "../interfaces/game.js";

const platformSchema = new Schema<IPlatformDocument>(
  {
    platform: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const PlatformModel = model<IPlatformDocument>("Platform", platformSchema);
export default PlatformModel;
