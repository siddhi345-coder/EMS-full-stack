import { useAuth } from "../../context/AuthContext";
import HRDashboard from "./HRDashboard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role.toLowerCase()) {
    case "hr":
    case "admin":
      return <HRDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    default:
      return <div>No Dashboard Available</div>;
  }
};

export default Dashboard;