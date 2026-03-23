const db = require('./config/db');

async function run() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      task_id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT,
      manager_id INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
      due_date DATE,
      created_at DATETIME,
      updated_at DATETIME,
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
    )
  `);
  console.log('tasks table created');
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
