const db = require('./config/db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL,
    location TEXT,
    budget REAL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    gender TEXT,
    department_id INTEGER,
    role_id INTEGER,
    hire_date TEXT,
    salary REAL,
    manager_id INTEGER,
    leave_balance REAL DEFAULT 0,
    FOREIGN KEY (department_id) REFERENCES departments (department_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    date TEXT NOT NULL,
    check_in TEXT,
    check_out TEXT,
    status TEXT,
    working_hours REAL,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  );

  CREATE TABLE IF NOT EXISTS leave_requests (
    leave_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    reason TEXT,
    status TEXT DEFAULT 'Pending',
    applied_date TEXT,
    manager_remark TEXT,
    manager_action_date TEXT,
    approved_by INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    due_date TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id),
    FOREIGN KEY (manager_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS manager_actions (
    action_id INTEGER PRIMARY KEY AUTOINCREMENT,
    manager_id INTEGER NOT NULL,
    employee_id INTEGER,
    entity_type TEXT,
    entity_id INTEGER,
    action_type TEXT,
    remark TEXT,
    created_at TEXT,
    FOREIGN KEY (manager_id) REFERENCES users (user_id),
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  );

  -- Insert default roles
  INSERT OR IGNORE INTO roles (role_name, description) VALUES
    ('HR', 'Human Resources'),
    ('Manager', 'Department Manager'),
    ('Employee', 'Regular Employee');

  -- Insert default department
  INSERT OR IGNORE INTO departments (department_name, location, budget, description) VALUES
    ('IT', 'Building A', 50000.00, 'Information Technology');
`);

console.log('Database initialized.');
