"use strict";

const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    devotee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Devotees",
    },
    attendance_date: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
attendanceSchema.set("toJSON", {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
