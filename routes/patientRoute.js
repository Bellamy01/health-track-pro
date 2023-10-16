const express = require('express');
const router = express.Router();
const { createPatient, updatePatient, getAllPatients, getPatient, deletePatient } = require('../controllers/patientController');

router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getPatient);
router.patch('/:id', updatePatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
