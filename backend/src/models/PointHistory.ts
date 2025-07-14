import mongoose, { Document, Schema } from 'mongoose';

export interface IPointHistory extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  pointsAwarded: number;
  totalPointsAfter: number;
  claimedAt: Date;
}

const pointHistorySchema = new Schema<IPointHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  pointsAwarded: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  totalPointsAfter: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IPointHistory>('PointHistory', pointHistorySchema);
