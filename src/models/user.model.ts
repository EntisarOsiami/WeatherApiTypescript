import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface iUser extends Document {
  email: string;
  password: string;
  role: string;
  comparePassword(inputPassword: string): Promise<boolean>;
}

const userSchema = new Schema<iUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (inputPassword: string) {
  return bcrypt.compare(inputPassword, this.password);
};

export const User = model<iUser>('User', userSchema);
