import axios from "axios";
import { Bell, UserCircle } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../api/axios";

const AdminTopbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.token) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data.data || []);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(
        `/api/admin/notifications/${id}/mark-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await API.patch(
        "/api/admin/notifications/mark-all-as-read",
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  return (
    <div className="topbar">
      <div className="icons">
        <Bell onClick={() => setShowDropdown(!showDropdown)} />
        {showDropdown && (
          <div className="dropdown" ref={dropdownRef}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((note) => (
                <div key={note._id} onClick={() => markAsRead(note._id)}>
                  <p className={note.read ? "read" : "unread"}>
                    {note.message}
                  </p>
                </div>
              ))
            )}
            <button onClick={markAllAsRead}>Mark all as read</button>
          </div>
        )}
        <UserCircle />
      </div>
    </div>
  );
};

export default AdminTopbar;
