import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";
import ProtectedRoute from "./middleware/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AllNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/priority"
          element={
            <ProtectedRoute>
              <PriorityInbox />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
