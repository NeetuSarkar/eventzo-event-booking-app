import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const EventView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, bookingRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/events/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get(`http://localhost:5000/api/admin/bookings/event/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);
        setEvent(eventRes.data);
        setBookings(bookingRes.data);
      } catch (err) {
        console.error("Error loading event or bookings:", err);
      }
    };

    fetchData();
  }, [id, user?.token]);

  if (!event) return <p>Loading event...</p>;

  const bookedSeats = event.bookingCount;
  const availableSeats = event.availableSeats;
  const totalSeats = event.totalSeats;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600 italic">{event.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Image and Basic Info */}
        <div className="space-y-3">
          <img
            src={event.image}
            alt={event.title}
            className="rounded shadow-lg w-full max-h-[300px] object-cover"
          />
          <div className="text-sm text-gray-500">
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p>
              <strong>Language:</strong> {event.language}
            </p>
            <p>
              <strong>Age Limit:</strong> {event.ageLimit}+
            </p>
            <p>
              <strong>Duration:</strong> {event.duration}
            </p>
            <p>
              <strong>Status:</strong> {event.status}
            </p>
            <p>
              <strong>Featured:</strong> {event.isFeatured ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Details Summary */}
        <div className="space-y-3">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toLocaleDateString("en-IN")}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p>
            <strong>Coordinates:</strong> {event.coordinates?.lat},{" "}
            {event.coordinates?.lng}
          </p>

          <p>
            <strong>Ticket Price:</strong> ₹{event.ticketPrice}
          </p>

          <div className="space-y-1">
            <p>
              <strong>Total Seats:</strong> {totalSeats}
            </p>
            <p>
              <strong>Booked Seats:</strong> {bookedSeats}
            </p>
            <p>
              <strong>Available Seats:</strong> {availableSeats}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${(bookedSeats / totalSeats) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <strong>Artists:</strong>
            <ul className="list-disc list-inside">
              {event.artists?.map((artist, index) => (
                <li key={index}>{artist}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Bookings ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Booked At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-2">{booking.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">{booking.user?.email || "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-4 py-2 text-center capitalize">
                    {booking.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(booking.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventView;
