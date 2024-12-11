import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    payment: {
      amount: Number,
      status: {
        type: String,
        enum: ["pending", "completed", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },
    notes: String,
    rating: {
      score: Number,
      review: String,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
