import mongoose, { Document, Schema } from 'mongoose';

export interface IAIInsight extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'warning' | 'tip' | 'achievement' | 'recommendation';
  title: string;
  message: string;
  actionable: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const AIInsightSchema = new Schema<IAIInsight>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  type: {
    type: String,
    required: [true, 'Insight type is required'],
    enum: {
      values: ['warning', 'tip', 'achievement', 'recommendation'],
      message: 'Type must be one of: warning, tip, achievement, recommendation'
    }
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  actionable: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    required: [true, 'Priority is required'],
    min: [1, 'Priority must be at least 1'],
    max: [10, 'Priority cannot exceed 10'],
    default: 5
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
AIInsightSchema.index({ userId: 1, type: 1 });
AIInsightSchema.index({ userId: 1, priority: -1 });
AIInsightSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IAIInsight>('AIInsight', AIInsightSchema);
