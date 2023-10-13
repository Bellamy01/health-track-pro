const db = require('../db');

exports.getAll = (call) => {
    db.all('SELECT * FROM patients', call);
}
exports.create = (patient, callback) => {
    db.run('INSERT INTO patients (heartbeat, body_temp, patient_name, recent_sickness, national_ID) VALUES (?, ?, ?, ?, ?)',
    [patient.heartbeat, patient.body_temp, patient.patient_name, patient.recent_sickness, patient.national_ID], callback);
}
exports.getOne = (id, callback) => {
    db.get('SELECT * FROM patients WHERE id = ?', [id], callback);
}
exports.update = (id, patient, callback) => {
    db.run('UPDATE patients SET heartbeat = ?, body_temp = ?, patient_name = ?, recent_sickness = ?, national_ID = ? WHERE id = ?',
    [patient.heartbeat, patient.body_temp, patient.patient_name, patient.recent_sickness, patient.national_ID, id], callback);
}
exports.delete = (id, callback) => {
    db.run('DELETE FROM patients WHERE id = ?', [id], callback);
}
