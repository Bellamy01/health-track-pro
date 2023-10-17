const { v1 } = require('uuid');
const User = require('../models/userModel');
const { verify } = require('../utils/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ReqValidator } = require("../utils/validation");

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
};

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm, role, nationalID } = req.body;
    
   ReqValidator(name, password, passwordConfirm, role, nationalID, email, res);

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
        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            nationalID,
            role: role ? role : "USER",
        }
    

        await User.create(newUser, () => {
            createSendToken(newUser, 201, res);
        });

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
            return res.status(404).json({
                status: "error",
                message: "Incorrect email!"
            });
        } else {            
            bcrypt.compare(password, user.password).then((result) => {
                result ?
                createSendToken(user, 200, res) : 
                res.status(401).json({
                    status: "error",
                    message: "Incorrect password!",
                });
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Login failure!",
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
            message: "You are not logged in! Please log in to get access!",
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

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            status: "error",
            message: "You don't have permission to perform this action"
        });
    }
    next();
};

exports.updateMyPassword = async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!(currentPassword || password || passwordConfirm)) {
        return res.status(400).json({
            status: "error",
            message: "Please provide full credentials!"
        });
    }  
    if (password.length < 6) {
        return res.status(400).json({ 
            status: "error",
            message: "Password shouldn't be less than 6 characters" 
        });
    }  
    if (password !== passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Confirm password must be equal to password"
        });
    }
    //1) Get user from collection
    const user = await User.findByID(req.user.id);
    //2) Check if posted current password is correct and hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    bcrypt.compare(currentPassword, user.password).then((result) => {
        result ?    
        //3) if so , update password
        User.updatePassword(user.id, hashedPassword, () => {
            //4) Log in user , send jwt
            createSendToken(user, 200, res);
        }) : 
        res.status(401).json({
            status: "error",
            message: "Your current password is wrong!",
        });
    });
};
