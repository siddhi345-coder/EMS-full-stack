const db = require('./config/db');

// Clean up test record
db.prepare("DELETE FROM employees WHERE first_name = 'test' AND last_name IS NULL AND email IS NULL").run();

const employeeUsers = db.prepare(
  "SELECT user_id, username FROM users WHERE role = 'Employee' AND employee_id IS NULL"
).all();

process.stdout.write('Unlinked employee users: ' + employeeUsers.length + '\n');

for (const u of employeeUsers) {
  const r = db.prepare('INSERT INTO employees (first_name, leave_balance) VALUES (?, 12)').run(u.username);
  db.prepare('UPDATE users SET employee_id = ? WHERE user_id = ?').run(r.lastInsertRowid, u.user_id);
  process.stdout.write('Linked: ' + u.username + ' -> employee_id: ' + r.lastInsertRowid + '\n');
}

process.stdout.write('\nFinal state:\n');
const rows = db.prepare('SELECT user_id, username, role, employee_id FROM users').all();
rows.forEach(r => process.stdout.write(JSON.stringify(r) + '\n'));
