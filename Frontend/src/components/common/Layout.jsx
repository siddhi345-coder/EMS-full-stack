import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <div className="main">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
