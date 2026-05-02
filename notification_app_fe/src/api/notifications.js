// auth api calls
const BASE_URL = "/evaluation-service";

export async function getAuthToken(credentials) {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchNotifications(token, params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit);
  if (params.page) query.append("page", params.page);
  if (params.notification_type) query.append("notification_type", params.notification_type);

  const res = await fetch(
    `${BASE_URL}/notifications?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}
