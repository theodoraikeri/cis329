const Doctor = require('../models/Doctor')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res)=>{

    try{
        const {name, email,password, specialization} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doctor = new Doctor({name, email, password:hashedPassword, specialization})
        await doctor.save()

        res.status(201).json({message:"Doctor registered successfully"})

    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.login = async (req,res)=>{
    try{

        const doctor = await Doctor.findOne({email: req.body.email})
        if(!doctor){
            return res.status(400).json({
                message:"Invalid Email or password"
            })
        }
        const validPass = await bcrypt.compare(req.body.password, doctor.password)
        if(!validPass){
            return res.status(400).json({
                message:"Invalid Email or password"
            })
        }

        const token = jwt.sign(
            {_id:doctor._id}, 
            process.env.JWT_SECRET,
            {expiresIn:'2h'})
        res.json({
            token, doctorId: doctor._id
        })
    }catch(err){
        res.status(500).json({error: err.message})
    }
}