const express = require('express');
const router = express.Router();
const { createPatient, updatePatient, getAllPatients, getPatient, deletePatient } = require('../controllers/patientController');

router.get('/patients', getAllPatients);
router.post('/patients', createPatient);
router.get('/patients/:id', getPatient);
router.patch('/patients/:id', updatePatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

module.exports = router;
