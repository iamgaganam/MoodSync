import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { CallbackError } from "mongoose";

// Define User interface to enforce TypeScript types
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber?: string;
  emergencyContact?: string;
  profileImage?: string;
  role: "user" | "admin" | "doctor" | "therapist";
  specialization?: string;
  hospital?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other" | "";
  diagnosis?: string;
  status: "active" | "inactive";
  lastActive: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  // Add timestamp fields from Mongoose
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't return password by default
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "/api/placeholder/150/150", // Default image path
    },
    role: {
      type: String,
      enum: ["user", "admin", "doctor", "therapist"],
      default: "user",
    },
    // Doctor specific fields
    specialization: {
      type: String,
      required: function (this: IUser) {
        return this.role === "doctor" || this.role === "therapist";
      },
    },
    hospital: {
      type: String,
      required: function (this: IUser) {
        return this.role === "doctor";
      },
    },
    // User specific fields
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
    },
    diagnosis: {
      type: String,
    },
    // Communication fields
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    // Auth fields
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLogin: Date,
    refreshToken: String, // Added refresh token field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
