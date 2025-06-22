import { Schema, model } from 'mongoose';

interface iWeather {
    lat: number;
    lon: number;
    data: any;
    fetchedAt: Date;
}

const weatherSchema = new Schema<iWeather>({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  fetchedAt: { type: Date, default: Date.now }
});

weatherSchema.index({ lat: 1, lon: 1 }, { unique: true });

export const Weather = model<iWeather>('Weather', weatherSchema);
