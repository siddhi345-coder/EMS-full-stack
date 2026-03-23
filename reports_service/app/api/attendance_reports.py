from fastapi import APIRouter, Query
from app.services import attendance_report_service as service
from app.services.export_service import export_csv

router = APIRouter(prefix="/reports/attendance", tags=["Attendance Reports"])

@router.get("/monthly")
def monthly(month: int = Query(...), year: int = Query(...)):
    return service.monthly_attendance(month, year)

@router.get("/monthly/download")
def monthly_download(month: int = Query(...), year: int = Query(...)):
    return export_csv(service.monthly_attendance(month, year), f"attendance_{month}_{year}.csv")