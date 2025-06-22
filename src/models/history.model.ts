import { Schema, model, Types } from 'mongoose';

interface iHistory {
    user: Types.ObjectId;
    weather: Types.ObjectId;
    lat: number;
    lon: number;
    requestedAt: Date;
}

const historySchema = new Schema<iHistory>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weather: { type: Schema.Types.ObjectId, ref: 'Weather', required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  requestedAt: { type: Date, default: Date.now, index: true }
});

historySchema.index({ user: 1, requestedAt: -1 });

export const History = model<iHistory>('History', historySchema);