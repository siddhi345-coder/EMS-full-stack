from fastapi import APIRouter
from app.services import performance_report_service as service

router = APIRouter(prefix="/reports/performance", tags=["Performance Reports"])

@router.get("/average-rating")
def average():
    return service.average_rating()

@router.get("/top-performers")
def top():
    return service.top_performers()