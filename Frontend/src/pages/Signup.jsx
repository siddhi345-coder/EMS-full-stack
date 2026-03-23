import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserTag } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

const Signup = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "Employee" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/users/signup", form);
      alert("Signup successful!");
      if (res.data.token) {
        login(res.data);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account ✨</h2>
        <p>Register to access EMS</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser />
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaLock />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaUserTag />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
