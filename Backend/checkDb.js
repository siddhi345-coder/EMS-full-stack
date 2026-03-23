const db = require('./config/db');

const users = db.prepare("SELECT * FROM users").all();
console.log('Users:', users);

const roles = db.prepare("SELECT * FROM roles").all();
console.log('Roles:', roles);