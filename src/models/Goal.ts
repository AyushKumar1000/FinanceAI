import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0'],
    set: (val: number) => Math.round(val * 100) / 100
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
    set: (val: number) => Math.round(val * 100) / 100
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be one of: low, medium, high'
    },
    default: 'medium'
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for progress percentage
GoalSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min(100, (this.currentAmount / this.targetAmount) * 100);
});

// Virtual for remaining amount
GoalSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.targetAmount - this.currentAmount);
});

// Indexes for faster queries
GoalSchema.index({ userId: 1, isCompleted: 1 });
GoalSchema.index({ userId: 1, priority: 1 });
GoalSchema.index({ userId: 1, targetDate: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema);
