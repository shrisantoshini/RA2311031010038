import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNotifications } from "../api/notifications";
import NotificationCard from "../components/NotificationCard";
import Log from "../utils/logger";
import "./AllNotifications.css";
import "./PriorityInbox.css";

// weights based on spec: placement > result > event
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriorityScore(notification) {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  // combine weight and recency (normalize timestamp to small number)
  return weight * 1e12 + timestamp;
}

function PriorityInbox() {
  const [topN, setTopN] = useState(10);
  const [allNotifs, setAllNotifs] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem("viewed_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const token = localStorage.getItem("auth_token");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      Log("frontend", "info", "page", "Loading notifications for priority inbox");
      // fetch a larger batch to compute priority across all
      const data = await fetchNotifications(token, { limit: 50 });
      const notifs = data.notifications || [];
      setAllNotifs(notifs);
      Log("frontend", "info", "component", `Fetched ${notifs.length} total notifications for priority sort`);
    } catch (err) {
      Log("frontend", "error", "page", "Priority inbox fetch failed: " + err.message);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (allNotifs.length === 0) return;

    // sort by priority score descending, take top n
    const sorted = [...allNotifs].sort(
      (a, b) => getPriorityScore(b) - getPriorityScore(a)
    );
    const top = sorted.slice(0, topN);
    setPriorityList(top);

    // mark as viewed
    const ids = top.map((n) => n.ID);
    const updated = [...new Set([...viewedIds, ...ids])];
    setViewedIds(updated);
    localStorage.setItem("viewed_ids", JSON.stringify(updated));
    Log("frontend", "debug", "component", `Priority list updated: showing top ${topN} notifications`);
  }, [allNotifs, topN]);

  return (
    <div className="page">
      <header className="header">
        <h1>Priority Inbox</h1>
        <div className="header-actions">
          <Link to="/" className="priority-link" style={{ backgroundColor: "#718096" }}>
            All Notifications
          </Link>
        </div>
      </header>

      <div className="priority-controls">
        <label>
          Show top
          <input
            type="number"
            value={topN}
            min={1}
            max={50}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 10;
              setTopN(val);
              Log("frontend", "debug", "component", `Top N changed to ${val}`);
            }}
          />
          notifications
        </label>
        <p className="priority-note">
          Sorted by: Placement &gt; Result &gt; Event, then by recency
        </p>
      </div>

      {loading && <p className="status-msg">Loading...</p>}
      {error && <p className="status-msg error">{error}</p>}

      <div className="notif-list">
        {!loading &&
          priorityList.map((n, i) => (
            <div key={n.ID} className="priority-item">
              <span className="priority-rank">#{i + 1}</span>
              <NotificationCard
                notification={n}
                isNew={!viewedIds.includes(n.ID)}
              />
            </div>
          ))}
        {!loading && priorityList.length === 0 && (
          <p className="status-msg">No notifications to show.</p>
        )}
      </div>
    </div>
  );
}

export default PriorityInbox;
