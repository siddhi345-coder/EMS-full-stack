from fastapi import APIRouter
from app.services import employee_report_service as service
from app.services.export_service import export_csv

router = APIRouter(prefix="/reports/employees", tags=["Employee Reports"])

@router.get("/summary")
def summary():
    return service.get_employee_summary()

@router.get("/department-wise")
def department_wise():
    return service.get_department_wise()

@router.get("/department-wise/download")
def department_wise_download():
    return export_csv(service.get_department_wise(), "department_wise_report.csv")

@router.get("/summary/download")
def summary_download():
    return export_csv(service.get_employee_summary(), "employee_summary_report.csv")