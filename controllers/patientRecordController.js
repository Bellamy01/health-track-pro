const PatientRecord = require('../models/patientRecordModel');
const { PatReqValidator } = require("../utils/validation");

exports.getAllPatientRecords = async (req, res) => {
  PatientRecord.getAll((err, patientRecords) => {
      if (err) {
        return res.status(500).json({ 
          status: "error",
          message: 'Failed to retrieve all patient records' 
        });
      }

      res.status(200).json({
        status: "success", 
        results: patientRecords.length, 
        data: { 
          data: patientRecords
        } 
      });
  });
}

exports.createPatientRecord = async (req, res) => {
  const { body_temperature, heart_rate, frequent_sickness } = req.body;
  const user_id = req.user.id;

  const patientRecord = PatReqValidator(body_temperature, heart_rate, frequent_sickness, user_id, res);

  PatientRecord.create(patientRecord, (err) => {
    if (err) {
      return res.status(401).json({ 
        status: "error" ,
        message: 'Patient record not created!',
        error: err.message 
      });
    }

    res.status(201).json({ 
      status: "success", 
      message: 'Patient record added successfully',
      data: { 
        new: patientRecord
      } 
    });
});

}

exports.getPatientRecord = async (req, res) => {
  const id = req.params.id;

  PatientRecord.getOne(id, (err, patientRecord) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    if (!patientRecord) {
      return res.status(404).json({ 
        status: "error" , 
        message: 'Patient record not found with that ID' 
      });
    }

    res.status(200).json({ 
      status: "success",
      message: 'Patient record retrieved successfully', 
      data: { data: patientRecord } 
    });
  });
}

exports.getMyPatientRecords = async (req, res) => {
  const id = req.user.id;

  PatientRecord.getUserRecords(id, (err, patientRecords) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    if (!patientRecords) {
      return res.status(404).json({ 
        status: "error" , 
        message: 'Patient does not have any records!' 
      });
    }

    res.status(200).json({ 
      status: "success",
      message: 'Patient records retrieved successfully', 
      data: { data: patientRecords } 
    });
  });
}


exports.updatePatientRecord = async (req, res) => {
    const { body_temperature, heart_rate, frequent_sickness } = req.body;
    const id = req.params.id;
    
    PatReqValidator(body_temperature, heart_rate, frequent_sickness, res);
    const record = await PatientRecord.findByID(id);

    try {
        if (record) {
          const updatedRecord = {
            body_temperature,
            heart_rate,
            frequent_sickness,
          }

          PatientRecord.update(id, updatedRecord, () => {
            res.status(200).json({ 
              status: "success",
              message: 'Patient record updated successfully', 
              data: { update: updatedRecord } 
            });
          });
        } else {
          return res.status(404).json({
            status: "error",
            message: "Patient record does not exist!"
          });
        }
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Patient record not updated",
        error: err.message,
      });   
    }
}

exports.deletePatientRecord = async (req, res) => {
    const id = req.params.id;

    //check for patient
    const record = await PatientRecord.findByID(id);
  
    if (record) {
        PatientRecord.delete(id, (err) => {
            if (err) {
              return res.status(500).json({ 
                status: "error",
                message: 'Internal Server Error' 
              });
            }

            res.status(200).json({ 
              status: "success",
              message: 'Patient record deleted successfully', 
              data: null 
            });
        });
    } else {
        return res.status(404).json({ 
            status: "error", 
            message: 'Patient record not found with that ID' 
        });
    }
};
