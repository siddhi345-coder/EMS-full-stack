const db = require('./config/db');

console.log('\n=== USERS ===');
const users = db.prepare('SELECT user_id, username, role, employee_id FROM users').all();
console.table(users);

console.log('\n=== EMPLOYEES ===');
const employees = db.prepare('SELECT employee_id, first_name, last_name, email FROM employees').all();
console.table(employees);

console.log('\n=== UNLINKED USERS (employee_id is NULL) ===');
const unlinked = users.filter(u => !u.employee_id);
console.table(unlinked);

// Auto-link: if username matches employee email
let linked = 0;
for (const u of unlinked) {
  const emp = db.prepare('SELECT employee_id FROM employees WHERE email = ?').get(u.username);
  if (emp) {
    db.prepare('UPDATE users SET employee_id = ? WHERE user_id = ?').run(emp.employee_id, u.user_id);
    console.log(`Linked user "${u.username}" (user_id=${u.user_id}) to employee_id=${emp.employee_id}`);
    linked++;
  }
}

if (linked === 0) {
  console.log('\nNo auto-links found by email match.');
  console.log('To manually link a user, run:');
  console.log('  UPDATE users SET employee_id = <employee_id> WHERE user_id = <user_id>;');
  console.log('\nExample: link user_id=1 to employee_id=2:');
  console.log('  node -e "const db=require(\'./config/db\'); db.prepare(\'UPDATE users SET employee_id=? WHERE user_id=?\').run(2,1); console.log(\'done\')"');
} else {
  console.log(`\nSuccessfully linked ${linked} user(s).`);
}
