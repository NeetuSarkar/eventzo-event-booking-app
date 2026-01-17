// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  CreditCard,
  Settings,
  ClipboardList,
} from "lucide-react";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200 hover:text-black"
    }`;

  return (
    <aside className="w-64 sticky  bg-white border-r min-h-screen p-4">
      <div className="text-2xl font-bold text-blue-600 mb-6">Admin Panel</div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={linkClass}>
          <Home size={18} /> Dashboard
        </NavLink>
        <NavLink to="/admin/events" className={linkClass}>
          <Calendar size={18} /> Events
        </NavLink>
        <NavLink to="/admin/bookings" className={linkClass}>
          <ClipboardList size={18} /> Bookings
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/admin/payments" className={linkClass}>
          <CreditCard size={18} /> Payments
        </NavLink>
        <NavLink to="/admin/settings" className={linkClass}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
