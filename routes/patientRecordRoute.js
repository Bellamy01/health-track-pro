const express = require('express');
const { 
    createPatientRecord, 
    getAllPatientRecords, 
    getPatientRecord, 
    updatePatientRecord, 
    deletePatientRecord, 
    getMyPatientRecords 
} = require("../controllers/patientRecordController");
const { restrictTo, protect } = require("../controllers/authController");
const router = express.Router();

router.use(protect);

router.route('/').post(restrictTo('PATIENT'), createPatientRecord);
router.route('/all').get(restrictTo('PATIENT'), getMyPatientRecords);

router.use(restrictTo('ADMIN'));

router.route('/').get(getAllPatientRecords);
router.route('/:id').get(getPatientRecord).put(updatePatientRecord).delete(deletePatientRecord);

module.exports = router;
