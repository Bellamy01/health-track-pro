const evalidator = require("email-validator");
const { roleValue } = require("../utils/userRoles");
const { v1 } = require("uuid");

exports.ReqValidator = (name, password, passwordConfirm, role, nationalID, email, res) => {
    if (name) {
        if (name.length > 200) {
            return res.status(400).json({
                status: "error",
                message: "A user name must be less or equal to 200 characters"
            });
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ 
                    status: "error",
                    message: "Password shouldn't be less than 6 characters" 
                });
            }
            if (passwordConfirm ) {
                if (password !== passwordConfirm) {
                    return res.status(400).json({
                        status: "error",
                        message: "Confirm password must be equal to password"
                    });
                }
            
                if (role) {
                    if (roleValue(role) == false ) {
                        return res.status(400).json({
                            status: "error",
                            message: "Please provide a valid role(ADMIN,PATIENT)"
                        });
                    }
                
                    if (nationalID) {
                        if (nationalID.length > 100) {
                            return res.status(400).json({ 
                                status: "error",
                                message: "National ID should be less than 150 characters" 
                            });
                        }
                        
                        if (email) {
                            if (evalidator.validate(email) == false) {
                                return res.status(400).json({
                                    status: "error",
                                    message: "Please provide a valid email!"
                                });
                            }
                        
                        } else {
                            return res.status(400).json({
                                status: "error",
                                message: `Please provide an email for the new user!`
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: "error",
                            message: `Please provide a national ID for the new user!`
                        });
                    }
                } 
            } else {
                return res.status(400).json({
                    status: "error",
                    message: `Please confirm the password for the new user!`
                });
            }
        } else {
            return res.status(400).json({
                status: "error",
                message: `Please provide a password for the new user!`
            });
        }
    } else {
        return res.status(400).json({
            status: "error",
            message: `Please provide a name for the new user!`
        });
    }
}

exports.PatReqValidator = (body_temperature, heart_rate, frequent_sickness, user_id, res) => {
    if (body_temperature && heart_rate && frequent_sickness) {
        if (30 < body_temperature < 40) {
            if (60 < heart_rate < 200) {
                if (3 < frequent_sickness.length < 80) {
                    return {
                        id: v1(),
                        body_temperature,
                        heart_rate,
                        frequent_sickness,
                        user_id,
                        createAt: new Date().toISOString()
                    }
                } else {
                    return res.status(401).json({ 
                        status: "error", 
                        message: 'Please provide accurate heart rate (40 - 200)*C !',
                    });
                }
            } else {
                return res.status(401).json({ 
                    status: "error", 
                    message: 'Please provide accurate heart rate (40 - 200)*C !',
                });
            }
        } else {
            return res.status(401).json({ 
                status: "error", 
                message: 'Please provide accurate body temperature (30 - 40)*C !',
            }); 
        }
      } else {
        return res.status(401).json({ 
            status: "error", 
            message: 'Please provide missing attributes!',
        });
      }
}