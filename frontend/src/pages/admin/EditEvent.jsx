import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../api/axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(
          `/api/admin/events/${id}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        setEvent(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id, user?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "artists") {
      setForm((prev) => ({ ...prev, artists: value.split(",") }));
    } else if (name === "isFeatured") {
      setForm((prev) => ({ ...prev, isFeatured: e.target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/admin/events/${id}`, form, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert("✅ Event updated successfully!");
      navigate(`/admin/events/${id}`);
    } catch (err) {
      console.error("Error updating event:", err);
      alert("❌ Failed to update event.");
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={form.date?.split("T")[0]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Time</label>
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ticket Price (₹)</label>
          <input
            name="ticketPrice"
            type="number"
            value={form.ticketPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Total Seats</label>
          <input
            name="totalSeats"
            type="number"
            value={form.totalSeats}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Available Seats</label>
          <input
            name="availableSeats"
            type="number"
            value={form.availableSeats}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Duration</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 2h"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Age Limit</label>
          <input
            name="ageLimit"
            type="number"
            value={form.ageLimit}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Artists (comma separated)
          </label>
          <input
            name="artists"
            value={form.artists?.join(",")}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          <label className="font-medium">Featured Event</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
