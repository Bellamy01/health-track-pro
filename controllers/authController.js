const { v1 } = require('uuid');
const User = require('../models/userModel');
const evalidator = require("email-validator");
const { roleValue } = require("../utils/userRoles");
const bcrypt = require('bcrypt');

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
        });
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

    if (evalidator.validate(email) == false) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid email!"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: v1(),
            name,
            email,
            password: hashedPassword,
            nationalID,
            role: role ? role : "USER",
        }
    

        await User.create(newUser, () => {
            console.log(`User '${name}' successfully created`);

            return res.status(201).json({
                status: "success",
                message: "User successfully created!",
                data: newUser
            });
        })

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "User not created",
            error: err.message,
        })
    }
} 

exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "User name or password missing!"
        });
    }

    try {
        const user = await User.findByEmail(email, () => {
            console.log(`User with ${email} found!`);
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found!"
            });
        } else {
            bcrypt.compare(password, user.password).then(() => {
                return res.status(200).json({
                    status: "success",
                    message: "Login successful!",
                    user
                });
            }).catch(() => {
                return res.status(400).json({
                    status: "error",
                    message: "Login failure!",
                });
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error!",
            error: err.message
        });
    }
}