import { Schema, model } from "mongoose";
import type { PlatformDocument } from "../types/game-types.js";

const platformSchema = new Schema<PlatformDocument>(
  {
    platform: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const PlatformModel = model<PlatformDocument>("Platform", platformSchema);
export default PlatformModel;
