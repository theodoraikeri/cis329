const Appointment = require('../models/Appointment')

exports.getAppointments = async (requestAnimationFrame, res)=>{
    const appointments = await Appointment.find().populate('patient')
    res.json(appointments)
}

exports.createAppointment = async(req, res)=>{
    const appointment = new Appointment(req.body)
    await appointment.save()
    res.status(201).json(appointment)
}

//TODO: Add getTodayAppointments 