import React, { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("dateAsc");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((booking) =>
        booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (sortOption === "dateAsc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "dateDesc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "amountAsc") {
        return a.totalAmount - b.totalAmount;
      } else if (sortOption === "amountDesc") {
        return b.totalAmount - a.totalAmount;
      }
      return 0;
    });

    return filtered;
  }, [bookings, searchTerm, statusFilter, sortOption]);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>

      {/* Search, Filter & Sort */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-grow min-w-[220px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="dateAsc">Date: Earliest First</option>
          <option value="dateDesc">Date: Latest First</option>
          <option value="amountAsc">Amount: Low to High</option>
          <option value="amountDesc">Amount: High to Low</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Booking Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                >
                  <td className="p-4">{booking._id}</td>
                  <td className="p-4">{booking.user?.name || "Unknown"}</td>
                  <td className="p-4">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4 capitalize">{booking.status}</td>
                  <td className="p-4">₹{booking.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
