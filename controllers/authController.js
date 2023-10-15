const uuid = require('uuid');
const User = require('../models/userModel');
const evalidator = require("email-validator");
const { roleValue } = require("../utils/userRoles");

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm, role, nationalID } = req.body
    
    if (name.length > 200) {
        return res.status(400).json({
            status: "error",
            message: "A user name must be less or equal to 200 characters"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            status: "error",
            message: "Password shouldn't be less than 6 characters" 
        });
    }

    if (roleValue(role) == false ) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid role(ADMIN,PATIENT)"
        })
    }

    if (nationalID.length > 100) {
        return res.status(400).json({ 
            status: "error",
            message: "National ID should be less than 150 characters" 
        });
    }
    
    if (password !== passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Confirm password must be equal to password"
        });
    }

    if (evalidator.validate(email) == true) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid email!"
        })
    }

    const newUser = {
        id: uuid(),
        name,
        email,
        nationalID,
        role: role ? role : "USER",
    }

    try {
        await User.create(newUser, () => {
            console.log(`User ${name} successfully created`);
        }).then(user => 
            res.status(200).json({
                status: "success",
                message: "User successfully created!",
                data: user
            })
        )
    } catch (err) {
        res.status(401).json({
            status: "error",
            message: "User not created",
            error: err.message,
        })
    }
} 