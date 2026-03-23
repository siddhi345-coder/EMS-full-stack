import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import "./auth.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await axiosInstance.post("/users/forgot-password", { username });
      setStatus({ type: "success", msg: res.data.message, resetUrl: res.data.resetUrl || null });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Forgot Password 🔑</h2>
        <p>Enter your username to get a password reset link.</p>

        {status && (
          <div className={`auth-alert ${status.type}`}>
            <p style={{ margin: 0 }}>{status.msg}</p>
            {status.resetUrl && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <button
                  className="auth-btn"
                  style={{ fontSize: 14 }}
                  onClick={() => navigate(`/reset-password?token=${new URL(status.resetUrl).searchParams.get("token")}`)}
                >
                  Click here to Reset Password
                </button>
              </div>
            )}
          </div>
        )}

        {!status && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser />
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Please wait..." : "Get Reset Link"}
            </button>
          </form>
        )}

        <p className="switch-text" style={{ marginTop: 16 }}>
          <span onClick={() => navigate("/login")}>← Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
