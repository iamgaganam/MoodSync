import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

// User interface with Document extension for Mongoose
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobileNumber: string; // Added field
  emergencyContact: string; // Added field
  password: string;
  role: "user" | "doctor" | "admin";
  isActive: boolean;
  lastLogin?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    mobileNumber: {
      // Added field
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    emergencyContact: {
      // Added field
      type: String,
      required: [true, "Emergency contact is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create index for efficient querying
UserSchema.index({ email: 1 });

// Middleware: Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified("password")) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(
      Number(process.env.BCRYPT_SALT_ROUNDS) || 12
    );

    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method: Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // Note: this.password might not be available if 'select: false' is in effect
    // In such cases, the password needs to be explicitly selected in the query
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Create and export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
