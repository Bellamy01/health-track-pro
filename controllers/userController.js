const User = require('../models/userModel');
const { roleValue } = require("../utils/userRoles");
const evalidator = require("email-validator");
const { ReqValidator } = require("../utils/validation");

exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) {
          return res.status(500).json({ 
            status: "Internal Server Error",
            message: 'Failed to retrieve all users' ,
            error: err.message
          });
        }
  
        res.status(200).json({
          status: "success", 
          results: users.length, 
          data: { 
            data: users
          } 
        });
    });
};

exports.getUser = async(req, res) => {
    const id = req.params.id;
  
    try {
        await User.getOne(id, (err, user) => {
            if (err) {
                return res.status(500).json({
                status: "error",
                message: 'Internal Server Error' 
                });
            }
        
            if (!user) {
                return res.status(404).json({ 
                status: "error" , 
                message: 'User not found with that ID' 
                });
            }
        
            res.status(200).json({ 
                status: "success",
                message: 'User retrieved successfully', 
                data: { data: user } 
            });
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "User not found",
            error: err.message,
        });
    }
    
}

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'The route is not defined. Please use /register instead!',
    });
};

exports.updateUser = async (req, res) => {
    
    const { name, role, email, password, passwordConfirm, nationalID } = req.body;
    const id = req.params.id;
    
    ReqValidator(name, password, passwordConfirm, role, nationalID, email, res);

    try {
        const user = await User.findByID(id);
        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            const updatedUser = {
                name,
                email,
                password: hashedPassword,
                role,
                nationalID,
            }

            User.updateOne(id, updatedUser, () => {
                res.status(200).json({ 
                    status: "success",
                    message: 'User updated successfully', 
                    data: { update: updatedUser } 
                });
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "User does not exist!"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "User not updated",
            error: err.message,
        })    
    }
}

exports.deleteUser= async (req, res) => {
    const id = req.params.id;
    
    if (id) {
        const user = await User.findByID(id);
        
        if (user) {
            User.delete(id, (err) => {
                if (err) {
                    return res.status(500).json({ 
                    status: "error",
                    message: 'Internal Server Error' 
                    });
                }
    
                res.status(200).json({ 
                    status: "success",
                    message: 'User deleted successfully', 
                    data: null 
                });
            });
        } else {
            res.status(404).json({ 
                status: "error", 
                message: 'User not found with that ID' 
            });
        }
    } else {
        return res.status(404).json({ 
            status: "error", 
            message: 'Please provide an ID for retrieval!' 
        });
    }
};

exports.getMe = async(req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.deleteMe = async (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = async (req, res) => {

    if (req.body.password || req.body.passwordConfirm) {
        return res.status(404).json({
            status: "error",
            message: "This route is not for password updates. Please use /updateMyPassword!"
        });
    }

    let { name, role, email, nationalID } = req.body;
    const id = req.user.id;

    try {
        const user = await User.findByID(id);

        if (user) {
            if (!name) name = user.name
            if (!email) email = user.email
            if (!nationalID) nationalID = user.nationalID

            if (name && email && nationalID) {
                if (name.length > 200) {
                        return res.status(401).json({
                            status: "error",
                            message: "A user name must be less or equal to 200 characters"
                        });
                    }
    
                    if (roleValue(role) == false ) {
                        return res.status(401).json({
                            status: "error",
                            message: "Please provide a valid role(ADMIN,PATIENT)"
                        });
                    }
    
                    if (nationalID.length > 100) {
                        return res.status(401).json({ 
                            status: "error",
                            message: "National ID should be less than 150 characters" 
                        });
                    }
                    
                    if (evalidator.validate(email) == false) {
                        return res.status(401).json({
                            status: "error",
                            message: "Please provide a valid email!"
                        });
                    }
                    const updatedUser = {
                        name,
                        email,
                        nationalID,
                        role: role ? role : "USER"
                    }
        
                    User.update(id, updatedUser, () => {
                        res.status(200).json({ 
                            status: "success",
                            message: 'User updated successfully', 
                            data: { update: updatedUser } 
                        });
                    });
            } else {
                res.status(401).json({
                    status: "error",
                    message: "User missing attributes!",
                });   
            }
        } else {
            return res.status(404).json({
                status: "error",
                message: "User does not exist!"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "User not updated",
            error: err.message,
        });    
    }
}