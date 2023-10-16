const { v1 } = require('uuid');
const User = require('../models/userModel');
const evalidator = require("email-validator");
const { roleValue } = require("../utils/userRoles");
const { verify } = require('../utils/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm, role, nationalID } = req.body;
    
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

    //verify if user exists
    const existingUser = await User.findByEmail(email);
    const naExistingUser = await User.findByNationalID(nationalID);

    if (existingUser || naExistingUser) {
        if (existingUser && naExistingUser) {
            return res.status(400).json({
                status: "error",
                message: `User with the same email and national ID already exists`
            });
        } else if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: `User with the same email already exists`
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: `User with the same national ID already exists`
            });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = v1();
        const token = signToken(id)
        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            nationalID,
            role: role ? role : "USER",
        }
    

        await User.create(newUser, () => {
            res.status(201).json({
                status: "success",
                message: "User successfully created!",
                token,
                data: {
                    new: newUser
                }
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
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found!"
            });
        } else {
            const token = signToken(user.id)
            
            bcrypt.compare(password, user.password).then((result) => {
                result ?
                res.status(200).json({
                    status: "success",
                    message: "Login successful!",
                    token,
                }) : 
                res.status(400).json({
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

exports.protect = async (req, res, next) => {
    //1) Get the token and check its existence
    try {
        let token;
        if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
        ) {
        token = req.headers.authorization.split(' ')[1];
        }
    
        if (!token) {
        return res.status(401).json({
            status: "error",
            message: "You are not logged in! Please log in to get access.!",
        });
        }
        //2) Verification token
        const decoded = await verify(token, process.env.JWT_SECRET);
    
        //3) Check if user existence
        const currentUser = await User.findByID(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: "error",
                message: "The user with this token no longer exists."
            });
        }
        //Grant access to the protected route
        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        }); 
    }
};