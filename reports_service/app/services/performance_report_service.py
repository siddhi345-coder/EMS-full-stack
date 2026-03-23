from sqlalchemy import text
from app.database import engine

def average_rating():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT employee_id, AVG(rating) as avg_rating
            FROM performance_reviews
            GROUP BY employee_id
        """))
        return [dict(row._mapping) for row in result]


def top_performers():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT employee_id, AVG(rating) as avg_rating
            FROM performance_reviews
            GROUP BY employee_id
            ORDER BY avg_rating DESC
            LIMIT 5
        """))
        return [dict(row._mapping) for row in result]