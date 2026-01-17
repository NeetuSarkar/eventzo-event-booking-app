import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppProvider } from "../context/AppContext";

// Components & Pages
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventsPage from "./pages/EventsPage";
import EventDetails from "./pages/EventDetails";
import BookingForm from "./pages/BookingForm";
import MyBookings from "./pages/MyBookings";
import PaymentPage from "./pages/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import TicketPage from "./pages/TicketPage";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import EventView from "./pages/admin/EventView";
import EditEvent from "./pages/admin/EditEvent";
import CreateEvent from "./pages/admin/CreateEvent";
import BookingDetails from "./pages/admin/BookingDetails";

// Protected Route for logged-in users
const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Admin Route for admin users only
const AdminRoute = () => {
  const { user } = useContext(AuthContext);
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

// App with Navbar and Routes
function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { user } = useContext(AuthContext);

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/payment" element={<PaymentPage />} />
        <Route
          path="/bookings/:id/confirmation"
          element={<BookingConfirmation />}
        />
        <Route path="/bookings/:id/ticket" element={<TicketPage />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/book/:id" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="events/:id" element={<EventView />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

// Wrap everything inside Router and Context
function App() {
  return (
    <AppProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AppProvider>
  );
}

export default App;
