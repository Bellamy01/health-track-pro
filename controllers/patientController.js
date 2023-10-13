const Patient = require('../models/patientModel');

exports.getAllPatients = (req,res) => {
  Patient.getAll((err, patients) => {
      if (err) {
        return res.status(500).json({ 
          status: "Internal Server Error",
          message: 'Failed to retrieve all patients' 
        });
      }

      res.status(200).json({
        status: "success", 
        results: patients.length, 
        data: { 
          data: patients
        } 
      });
  });
}

exports.createPatient = (req, res) => {
  const patient = req.body;

  Patient.create(patient, (err) => {
    if (err) {
      return res.status(400).json({ 
        status: "error" ,
        message: 'Failed to create patient' 
      });
    }

    res.status(201).json({ 
      status: "success", 
      message: 'Patient added successfully',
      data: { 
        new: patient 
      } 
    });
  });
}

exports.getPatient = (req, res) => {
  const id = req.params.id;

  Patient.getOne(id, (err, patient) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: 'Internal Server Error' 
      });
    }

    if (!patient) {
      return res.status(404).json({ 
        status: "error" , 
        message: 'Patient not found with that ID' 
      });
    }

    res.status(200).json({ 
      status: "success",
      message: 'Patient retrieved successfully', 
      data: { data: patient } 
    });
  });
}

exports.updatePatient = (req, res) => {
  const id = req.params.id;
  const patient = req.body;

  Patient.update(id, patient, (err) => {
    if (err) {
      return res.status(400).json({ 
        status: "error",
        message: 'Internal Server Error' 
      });
    }
    if (!patient) {
      return res.status(404).json({ 
        status: "error" , 
        message: 'Patient not found with that ID'  
      });
    }
    
    res.status(200).json({ 
      status: "success",
      message: 'Patient updated successfully', 
      data: patient
    });
  });
};

exports.deletePatient = (req, res) => {
    const id = req.params.id;

    //check for patient
    Patient.getOne(id, (err, patient) => {
      if (err) {
          return res.status(500).json({
              status: "error",
              message: 'Internal Server Error'
          });
      }

      if (!patient) {
          return res.status(404).json({
              status: "error",
              message: 'Patient not found with that ID'
          });
      }
  
    Patient.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ 
          status: "error",
          message: 'Internal Server Error' 
        });
      }
      if (!id) {
        return res.status(404).json({ 
          status: "error", 
          message: 'Patient not found with that ID' 
        });
      }
      res.status(200).json({ 
        status: "success",
        message: 'Patient deleted successfully', 
        data: null 
      });
    });
  });
};
