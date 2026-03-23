from sqlalchemy import text
from app.database import engine

def monthly_payroll_summary(month, year):
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT 
                SUM(basic_salary) as total_basic,
                SUM(bonuses) as total_bonus,
                SUM(deductions) as total_deductions,
                SUM(net_salary) as total_paid
            FROM payroll
            WHERE MONTH(payment_date) = :month
            AND YEAR(payment_date) = :year
        """), {"month": month, "year": year})

        return dict(result.fetchone()._mapping)