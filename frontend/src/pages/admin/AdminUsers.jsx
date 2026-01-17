import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserCog, Ban, Trash2 } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [search, roleFilter, users]);

  const handlePromote = async (id) => {
    try {
      await axios.patch(`/api/admin/users/${id}/promote`);
      toast.success("User promoted to admin");
      // Optionally update UI to reflect role change
      setUsers(users.map((u) => (u._id === id ? { ...u, role: "admin" } : u)));
    } catch (err) {
      toast.error("Failed to promote user");
    }
  };

  const handleBlock = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to block this user?"
    );
    if (!confirmed) return;

    try {
      await axios.patch(`/api/admin/users/${id}/block`);
      toast.success("User blocked");
      // Optionally update UI here if your user object has a blocked flag
      // Example:
      // setUsers(users.map(u => u._id === id ? { ...u, blocked: true } : u));
    } catch (err) {
      toast.error("Failed to block user");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action is irreversible."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-48"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">{user.phone || "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="inline-flex items-center text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <UserCog className="w-4 h-4 mr-1" /> Promote
                      </button>
                    )}
                    <button
                      onClick={() => handleBlock(user._id)}
                      className="inline-flex items-center text-sm px-3 py-1 bg-red-100 text-red-600 border border-red-300 rounded hover:bg-red-200"
                    >
                      <Ban className="w-4 h-4 mr-1" /> Block
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center text-sm px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-center" colSpan="5">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
