from sqlalchemy import text
from app.database import engine

def get_employee_summary():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT employment_status, COUNT(*) as total
            FROM employees
            GROUP BY employment_status
        """))
        return [dict(row._mapping) for row in result]


def get_department_wise():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT d.department_name, COUNT(e.employee_id) as total_employees
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            GROUP BY d.department_name
        """))
        return [dict(row._mapping) for row in result]