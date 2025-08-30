import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    set: (val: number) => Math.round(val * 100) / 100
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative'],
    set: (val: number) => Math.round(val * 100) / 100
  },
  period: {
    type: String,
    required: [true, 'Budget period is required'],
    enum: {
      values: ['monthly', 'weekly', 'yearly'],
      message: 'Period must be one of: monthly, weekly, yearly'
    },
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining budget
BudgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - this.spent);
});

// Virtual for budget utilization percentage
BudgetSchema.virtual('utilizationPercentage').get(function() {
  if (this.amount === 0) return 0;
  return Math.min(100, (this.spent / this.amount) * 100);
});

// Indexes for faster queries
BudgetSchema.index({ userId: 1, isActive: 1 });
BudgetSchema.index({ userId: 1, category: 1 });
BudgetSchema.index({ userId: 1, period: 1 });
BudgetSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model<IBudget>('Budget', BudgetSchema);
