const db = require('./config/db');
const bcrypt = require('bcrypt');

async function testLogin(username, password) {
  console.log('Testing login for:', username);
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('User found:', rows.length > 0);
    if (!rows.length) { console.log('No user found'); process.exit(0); }

    const user = rows[0];
    console.log('role:', user.role, 'employee_id:', user.employee_id);
    console.log('password_hash length:', user.password_hash?.length, 'prefix:', user.password_hash?.substring(0,4));

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('password match:', isMatch);

    if (isMatch && !user.employee_id && user.role !== 'Admin') {
      console.log('Attempting auto-create employee...');
      const [empResult] = await db.execute(
        'INSERT INTO employees (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [user.username, '', '', '']
      );
      console.log('Employee created:', empResult.insertId);
    }

    console.log('Login would succeed');
  } catch (e) {
    console.error('ERROR:', e.message);
    console.error('Stack:', e.stack);
  }
  process.exit(0);
}

// Test with first HR user
testLogin('anjali', 'Pass@123');
