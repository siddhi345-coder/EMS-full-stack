from sqlalchemy import text
from app.database import engine

def leave_status_summary():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT status, COUNT(*) as total
            FROM leave_requests
            GROUP BY status
        """))
        return [dict(row._mapping) for row in result]