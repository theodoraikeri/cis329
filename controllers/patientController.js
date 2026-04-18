const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, medicalHistory } = req.body;

    if (!name || !age || !gender || !email || !phone || !medicalHistory) {
      return res.status(400).json({ message: 'All patient fields are required' });
    }

    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists with this email' });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      email: email.toLowerCase(),
      phone,
      medicalHistory,
      assignedDoctor: req.doctor._id
    });

    await patient.save();

    await Doctor.findByIdAndUpdate(req.doctor._id, {
      $push: { patients: patient._id }
    });

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.doctor._id });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      assignedDoctor: req.doctor._id
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: req.params.id, assignedDoctor: req.doctor._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found or unauthorized' });
    }

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      assignedDoctor: req.doctor._id
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or unauthorized' });
    }

    await Doctor.findByIdAndUpdate(req.doctor._id, {
      $pull: { patients: patient._id }
    });

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};