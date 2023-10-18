const db = require('../db');

exports.getAll = (call) => {
    db.all('SELECT * FROM patient_recordings', call);
}
exports.getUserRecords = (id, callback) => {
    db.all('SELECT * FROM patient_recordings WHERE user_id = ?', [id], callback);
}
exports.create = (patientRecording, callback) => {
    db.run('INSERT INTO patient_recordings (id, body_temperature, heart_rate, frequent_sickness, user_id, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [patientRecording.id, patientRecording.body_temperature, patientRecording.heart_rate, patientRecording.frequent_sickness, patientRecording.user_id, patientRecording.createdAt], callback);
}
exports.findByID = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM patient_recordings WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
exports.getOne = (id, callback) => {
  db.get('SELECT * FROM patient_recordings WHERE id = ?', [id], callback);
}
exports.update = (id, patientRecording, callback) => {
  db.run('UPDATE patient_recordings SET heart_rate = ?, body_temperature = ?, frequent_sickness = ? WHERE id = ?',
  [patientRecording.heart_rate, patientRecording.body_temperature, patientRecording.frequent_sickness, id], callback);
}
exports.delete = (id, callback) => {
  db.run('DELETE FROM patient_recordings WHERE id = ?', [id], callback);
}
