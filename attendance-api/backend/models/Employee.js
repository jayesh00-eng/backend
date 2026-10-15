const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    department: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    joiningDate: { type: String, default: "" },
  },
  { timestamps: true }
);

employeeSchema.index({ faculty: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Employee", employeeSchema);