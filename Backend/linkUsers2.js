const db = require('./config/db');

async function run() {
  const [users] = await db.execute(
    'SELECT user_id, username, role FROM users WHERE employee_id IS NULL AND username != ""'
  );
  console.log('Unlinked users:', users.length);

  for (const u of users) {
    try {
      const fakeEmail = u.username.replace(/[^a-zA-Z0-9]/g, '_') + '_' + u.user_id + '@ems.local';
      const [emp] = await db.execute(
        'INSERT INTO employees (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [u.username, '', fakeEmail, '']
      );
      await db.execute('UPDATE users SET employee_id = ? WHERE user_id = ?', [emp.insertId, u.user_id]);
      console.log('Linked:', u.username, '-> employee_id', emp.insertId);
    } catch (e) {
      console.log('SKIP:', u.username, '-', e.message);
    }
  }

  console.log('All done.');
  process.exit(0);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
