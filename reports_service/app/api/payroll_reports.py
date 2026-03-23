from fastapi import APIRouter, Query
from app.services import payroll_report_service as service

router = APIRouter(prefix="/reports/payroll", tags=["Payroll Reports"])

@router.get("/monthly-summary")
def monthly_summary(month: int = Query(...), year: int = Query(...)):
    return service.monthly_payroll_summary(month, year)