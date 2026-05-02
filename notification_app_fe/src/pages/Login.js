import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../api/notifications";
import Log from "../utils/logger";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    name: "",
    rollNo: "",
    accessCode: "",
    clientID: "",
    clientSecret: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      Log("frontend", "info", "page", "User attempting login");
      
      const trimmedForm = {
        email: form.email.trim(),
        name: form.name.trim(),
        rollNo: form.rollNo.trim(),
        accessCode: form.accessCode.trim(),
        clientID: form.clientID.trim(),
        clientSecret: form.clientSecret.trim(),
      };

      const data = await getAuthToken(trimmedForm);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("token_expiry", data.expires_in);
      Log("frontend", "info", "auth", "Login successful, token stored");
      navigate("/");
    } catch (err) {
      Log("frontend", "error", "auth", "Login failed: " + err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Campus Notifications</h2>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
            required
          />
          <input
            name="accessCode"
            type="password"
            placeholder="Access Code"
            value={form.accessCode}
            onChange={handleChange}
            required
          />
          <input
            name="clientID"
            placeholder="Client ID"
            value={form.clientID}
            onChange={handleChange}
            required
          />
          <input
            name="clientSecret"
            type="password"
            placeholder="Client Secret"
            value={form.clientSecret}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
