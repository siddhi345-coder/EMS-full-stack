from sqlalchemy import text
from app.database import engine

def monthly_attendance(month, year):
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT employee_id,
                   COUNT(CASE WHEN status='Present' THEN 1 END) as present_days,
                   COUNT(CASE WHEN status='Absent' THEN 1 END) as absent_days,
                   COUNT(*) as total_days
            FROM attendance
            WHERE MONTH(date) = :month AND YEAR(date) = :year
            GROUP BY employee_id
        """), {"month": month, "year": year})

        return [dict(row._mapping) for row in result]