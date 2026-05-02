import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNotifications } from "../api/notifications";
import NotificationCard from "../components/NotificationCard";
import Log from "../utils/logger";
import "./AllNotifications.css";

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem("viewed_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const token = localStorage.getItem("auth_token");

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      Log("frontend", "info", "page", `Loading notifications - page ${page}, filter: ${filter || "all"}`);
      const params = { page, limit: 10 };
      if (filter) params.notification_type = filter;

      const data = await fetchNotifications(token, params);
      setNotifications(data.notifications || []);

      // mark all current as viewed
      const ids = (data.notifications || []).map((n) => n.ID);
      const updated = [...new Set([...viewedIds, ...ids])];
      setViewedIds(updated);
      localStorage.setItem("viewed_ids", JSON.stringify(updated));
      Log("frontend", "info", "component", `Loaded ${ids.length} notifications successfully`);
    } catch (err) {
      Log("frontend", "error", "page", "Failed to load notifications: " + err.message);
      setError(err.message || "Could not load notifications. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [page, filter]);

  function handleLogout() {
    Log("frontend", "info", "auth", "User logged out");
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Campus Notifications</h1>
        <div className="header-actions">
          <Link to="/priority" className="priority-link">
            Priority Inbox
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="controls">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
            Log("frontend", "debug", "component", `Filter changed to: ${e.target.value || "all"}`);
          }}
        >
          <option value="">All Types</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {loading && <p className="status-msg">Loading...</p>}
      {error && <p className="status-msg error">{error}</p>}

      <div className="notif-list">
        {!loading &&
          notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isNew={!viewedIds.includes(n.ID)}
            />
          ))}
        {!loading && notifications.length === 0 && (
          <p className="status-msg">No notifications found.</p>
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default AllNotifications;
