const db = require('../db');

exports.getAll = (call) => {
    db.all('SELECT * FROM users', call);
}

exports.create = (user, callback) => {
    db.run('INSERT INTO users (id, name, email, password, nationalID, role) VALUES (?, ?, ?, ?, ?)',
    [user.id, user.name, user.email, user.password, user.nationalID, user.role], callback);    
}


exports.getOne = (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
}

exports.update = (id, user, callback) => {
    db.run('UPDATE users SET name = ?, email = ?, password = ?, nationalID = ? WHERE id = ?',
    [user.name, user.email, user.password, user.nationalID, id], callback);
}

exports.updateRole = (id, user, callback) => {
    db.run(`UPDATE users SET role = ? WHERE id = ?`,
    [user.role, id], callback);
}

exports.delete = (id, callback) => {
    db.run('DELETE FROM users WHERE id = ?', [id], callback);
}
