import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "advisor"],
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profile: {
      picture: String,
      bio: String,
      specialties: [String],
      hourlyRate: Number,
      rating: {
        type: Number,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      monday: [String], // Ejemplo: ["09:00", "10:00", "11:00"]
      tuesday: [String],
      wednesday: [String],
      thursday: [String],
      friday: [String],
      saturday: [String],
      sunday: [String],
    },
    googleId: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model("User", userSchema);
