import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("dateAsc");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/events", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/events/${eventToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtering + Searching + Sorting logic
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search by title
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (event) => event.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      if (sortOption === "dateAsc") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === "dateDesc") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === "priceAsc") {
        return a.ticketPrice - b.ticketPrice;
      } else if (sortOption === "priceDesc") {
        return b.ticketPrice - a.ticketPrice;
      }
      return 0;
    });

    return filtered;
  }, [events, searchTerm, statusFilter, sortOption]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
        <button
          onClick={() => navigate("/admin/events/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Create Event
        </button>
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-grow min-w-[200px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="dateAsc">Date: Earliest First</option>
          <option value="dateDesc">Date: Latest First</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-md rounded-xl overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-4">Event Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{event.title}</td>
                  <td className="p-4">
                    {new Date(event.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4 capitalize">{event.status}</td>
                  <td className="p-4">₹{event.ticketPrice}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/events/${event._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/events/edit/${event._id}`)
                      }
                      className="text-green-600 hover:underline"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setEventToDelete(event)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{eventToDelete.title}</strong>?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
