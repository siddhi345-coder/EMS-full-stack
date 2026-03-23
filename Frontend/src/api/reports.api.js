import axios from "axios";

const reportsApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const downloadEmployeeSummary = () => {
  window.open(`${reportsApi.defaults.baseURL}/reports/employees/summary/download`, "_blank");
};

export const downloadDepartmentWise = () => {
  window.open(`${reportsApi.defaults.baseURL}/reports/employees/department-wise/download`, "_blank");
};

export const downloadMonthlyAttendance = (month, year) => {
  window.open(
    `${reportsApi.defaults.baseURL}/reports/attendance/monthly/download?month=${month}&year=${year}`,
    "_blank"
  );
};
