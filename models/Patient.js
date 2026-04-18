const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    medicalHistory: { type: String, required: true },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);