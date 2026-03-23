from fastapi import FastAPI
from app.api import (
    employee_reports,
    attendance_reports,
    payroll_reports,
    leave_reports,
    performance_reports
)

app = FastAPI(title="EMS Reports Microservice")

app.include_router(employee_reports.router)
app.include_router(attendance_reports.router)
app.include_router(payroll_reports.router)
app.include_router(leave_reports.router)
app.include_router(performance_reports.router)