import React, { useContext, useState } from "react";

import { AuthContext } from "../../../context/AuthContext";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    category: "",
    language: "",
    isFeatured: false,
    date: "",
    time: "",
    duration: "",
    artists: "",
    ticketPrice: "",
    totalSeats: "",
    availableSeats: "",
    ageLimit: 0,
    status: "upcoming",
    tags: "",
  });

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        coordinates: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        },
        artists: formData.artists.split(",").map((a) => a.trim()),
        tags: formData.tags.split(",").map((t) => t.trim()),
        ticketPrice: parseFloat(formData.ticketPrice),
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: parseInt(formData.availableSeats),
        ageLimit: parseInt(formData.ageLimit),
      };

      const res = await fetch("http://localhost:5000/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Event created successfully! 🎉");
        setFormData({
          ...formData,
          title: "",
          description: "",
          image: "",
          location: "",
          lat: "",
          lng: "",
          category: "",
          language: "",
          date: "",
          time: "",
          duration: "",
          artists: "",
          ticketPrice: "",
          totalSeats: "",
          availableSeats: "",
          ageLimit: 0,
          status: "upcoming",
          tags: "",
          isFeatured: false,
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleChange}
          className="input"
        />
        <input
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleChange}
          className="input"
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="language"
          placeholder="Language"
          value={formData.language}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 2h)"
          value={formData.duration}
          onChange={handleChange}
          className="input"
        />
        <input
          name="artists"
          placeholder="Artists (comma-separated)"
          value={formData.artists}
          onChange={handleChange}
          className="input"
        />
        <input
          name="ticketPrice"
          type="number"
          placeholder="Ticket Price"
          value={formData.ticketPrice}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="totalSeats"
          type="number"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="availableSeats"
          type="number"
          placeholder="Available Seats"
          value={formData.availableSeats}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="ageLimit"
          type="number"
          placeholder="Age Limit (optional)"
          value={formData.ageLimit}
          onChange={handleChange}
          className="input"
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
          className="input"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
        >
          <option value="upcoming">Upcoming</option>
          <option value="cancelled">Cancelled</option>
          <option value="sold-out">Sold Out</option>
          <option value="completed">Completed</option>
        </select>
        <label className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Feature this event
        </label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="input col-span-2"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
