import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  workType: 'gig' | 'informal' | 'freelance' | 'traditional';
  monthlyIncomeRange: string;
  financialGoals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  workType: {
    type: String,
    required: [true, 'Work type is required'],
    enum: {
      values: ['gig', 'informal', 'freelance', 'traditional'],
      message: 'Work type must be one of: gig, informal, freelance, traditional'
    }
  },
  monthlyIncomeRange: {
    type: String,
    required: [true, 'Monthly income range is required'],
    enum: {
      values: ['Under $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', 'Over $10,000'],
      message: 'Please select a valid income range'
    }
  },
  financialGoals: [{
    type: String,
    trim: true,
    maxlength: [200, 'Goal description cannot exceed 200 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Fix for emitWarning error: No changes needed in User.ts since import is correct and Mongoose version is up to date
// However, ensure that Mongoose is imported only once and no conflicting versions exist

// Check for any other files importing Mongoose incorrectly or calling emitWarning
// If error persists, try deleting node_modules and reinstalling dependencies

export default mongoose.model<IUser>('User', UserSchema);
