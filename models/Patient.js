const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name:{type:String, required: true},
    age:{type:Number, required: true},
    geneder:{type:String, enum:['Male', 'Female', 'Other'], required:true},
    email:{type:String, required: true, unique:true, lowercase: true},
    password:{type:String, required: true},
    phone:{type:String, required:true},
    medicalHistory:{type:String, required:true},
    assignedDoctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required:true
    },
    createdAt:{ type: Date,default: Date.now}
})
module.exports = mongoose.model('Patient', patientSchema)