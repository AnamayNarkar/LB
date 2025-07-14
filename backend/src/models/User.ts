import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  totalPoints: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
