# Notification_System_Design

## Stage 1

### Problem

Users were missing important notifications because of high volume. The product manager wanted a Priority Inbox that shows the top 'n' most important unread notifications.

### My Approach

I fetch all available notifications from the API (up to 50 at a time) and sort them client-side using a priority score.

**Priority Score Formula:**

```
score = type_weight * 1e12 + timestamp_in_ms
```

**Type Weights:**
- Placement = 3 (highest)
- Result = 2
- Event = 1 (lowest)

So a Placement notification always ranks above a Result, and a Result above an Event. Among the same type, the most recent one wins because its timestamp is larger.

### Example

Given these notifications:
- Event at 17:51:00
- Placement at 17:50:00
- Result at 17:51:30

Scores:
- Placement: 3 * 1e12 + timestamp → highest
- Result: 2 * 1e12 + timestamp → second
- Event: 1 * 1e12 + timestamp → lowest

Top 2 would be: Placement, then Result.

### How I Maintain Top N Efficiently

The API provides paginated results. I fetch a reasonable batch (currently 50) and sort client-side. If the API supports it, passing `limit=n&notification_type=Placement` can also be used to pre-filter on the server side.

For new notifications coming in, I refresh the fetch on page load so the list is always current. Since I don't store notifications in a DB (as per the spec), the sort always runs on the latest fetched data.

### Distinguishing New vs Viewed Notifications

I store viewed notification IDs in `localStorage`. Any notification whose ID is not in the viewed list is considered new and highlighted with a distinct left border. After a notification appears on screen, its ID is added to the viewed set.

### Code Location

- `src/pages/PriorityInbox.js` - Priority Inbox page
- `src/pages/AllNotifications.js` - All notifications page
- `src/utils/logger.js` - Logging middleware
- `src/middleware/ProtectedRoute.js` - Auth guard

## Stage 2

React frontend with two views:

1. **All Notifications page** (`/`) - Shows paginated notifications with type filter
2. **Priority Inbox page** (`/priority`) - Shows top N notifications sorted by type + recency

Both pages use the logging middleware and distinguish new vs viewed notifications using localStorage.

The app runs on `http://localhost:3000`.
