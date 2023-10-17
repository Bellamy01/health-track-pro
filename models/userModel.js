const db = require('../db');

exports.getAll = (call) => {
    db.all('SELECT * FROM users', call);
}

exports.create = (user, callback) => {
    db.run('INSERT INTO users (id, name, email, password, nationalID, role) VALUES (?, ?, ?, ?, ?, ?)',
    [user.id, user.name, user.email, user.password, user.nationalID, user.role], callback);    
}

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
};

exports.findByNationalID = (nationalID) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE nationalID = ?', [nationalID], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
};

exports.getOne = (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
}

exports.findByID = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
  
exports.update = (id, user, callback) => {
  db.run('UPDATE users SET name = ?, role = ?, email = ?, nationalID = ? WHERE id = ?',
  [user.name, user.role, user.email, user.nationalID, id], callback);
}

exports.updateOne = (id, user, callback) => {
  db.run('UPDATE users SET name = ?, email = ?, password = ?, role = ?, nationalID = ? WHERE id = ?',
  [user.name, user.email, user.password, user.role, user.nationalID, id], callback);
}

exports.updatePassword = (id, password, callback) => {
  db.run('UPDATE users SET password = ? WHERE id = ?',
  [password, id], callback);
}

exports.delete = (id, callback) => {
  db.run('DELETE FROM users WHERE id = ?', [id], callback);
}
