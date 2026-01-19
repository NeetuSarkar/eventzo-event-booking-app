import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  Plus,
  Eye,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = user?.token;
      if (!token) return;

      const response = await API.get(
        "/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboardData(response.data);
      console.log("Dashboard data:", response.data);
    } catch (error) {
      console.error("Failed to fetch admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="p-6 text-red-600">No dashboard data found</div>;
  }

  const stats = [
    {
      label: "Total Events",
      value: dashboardData.totalEvents ?? 0,
      icon: <Calendar className="text-blue-600" size={24} />,
    },
    {
      label: "Total Bookings",
      value: dashboardData.totalBookings ?? 0,
      icon: <ClipboardList className="text-green-600" size={24} />,
    },
    {
      label: "Upcoming Events",
      value: dashboardData.upcomingEventsCount ?? 0,
      icon: <Clock className="text-yellow-600" size={24} />,
    },
    {
      label: "Earnings",
      value: `₹${(dashboardData.totalEarnings ?? 0).toLocaleString()}`,
      icon: <DollarSign className="text-purple-600" size={24} />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/events/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Create Event
          </button>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-900 transition"
          >
            <Eye size={18} /> View All Bookings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-5 flex items-center gap-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            <div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
              <div className="text-xl font-semibold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Events</h2>
          <ul className="space-y-3">
            {dashboardData.recentUpcomingEvents?.length > 0 ? (
              dashboardData.recentUpcomingEvents.map((event) => (
                <li
                  key={event._id}
                  className="flex justify-between text-gray-700 border-b pb-2"
                >
                  <span>{event.title}</span>
                  <span className="text-sm text-gray-500">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No upcoming events</li>
            )}
          </ul>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <ul className="space-y-3">
            {dashboardData.recentBookings?.length > 0 ? (
              dashboardData.recentBookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex justify-between text-gray-700 border-b pb-2"
                >
                  <div>
                    <div className="font-medium">
                      {booking.user?.name ?? "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.activity?.title ?? "Unknown Event"} •{" "}
                      {booking._id}
                    </div>
                  </div>
                  <div className="text-right font-medium">
                    ₹{booking.totalAmount ?? 0}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No recent bookings</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
