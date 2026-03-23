import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import "./auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null); // { type, msg }
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) setStatus({ type: "error", msg: "Invalid or missing reset token." });
    else setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return setStatus({ type: "error", msg: "Passwords do not match." });
    if (password.length < 6)
      return setStatus({ type: "error", msg: "Password must be at least 6 characters." });

    setLoading(true);
    setStatus(null);
    try {
      const res = await axiosInstance.post("/users/reset-password", { token, password });
      setStatus({ type: "success", msg: res.data.message });
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Reset failed. The link may have expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Reset Password 🔒</h2>
        <p>Enter your new password below.</p>

        {status && (
          <div className={`auth-alert ${status.type}`}>
            {status.msg}
            {status.type === "success" && (
              <span style={{ display: "block", fontSize: 12, marginTop: 4 }}>
                Redirecting to login...
              </span>
            )}
          </div>
        )}

        {status?.type !== "success" && token && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaLock />
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FaLock />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="switch-text">
          <span onClick={() => navigate("/login")}>← Back to Login</span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
