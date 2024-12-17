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
      specialities: [String],
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
  if (!this.isModified("contraseña")) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = bcrypt.hash(this.contraseña, salt);
});

export const User = mongoose.model("User", userSchema);
