from fastapi import APIRouter
from app.services import leave_report_service as service

router = APIRouter(prefix="/reports/leaves", tags=["Leave Reports"])

@router.get("/status-summary")
def status_summary():
    return service.leave_status_summary()