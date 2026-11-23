"use client";

import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "@/services/admin.service";

const roleOptions = ["customer", "vendor", "admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchUsers() {
    try {
      setLoading(true);

      const result = await getAdminUsers({
        page,
        limit: 10,
        search,
        role,
      });

      setUsers(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        total: 0,
        totalPages: 1,
      });
    } catch (error) {
      toast.error(error.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => fetchUsers());
  }, [page, search, role]);

  async function handleRoleChange(userId, newRole) {
    try {
      setUpdatingId(userId);

      await updateUserRole(userId, newRole);

      toast.success("User role updated successfully");

      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleStatusChange(userId, isActive) {
    try {
      setUpdatingId(userId);

      await updateUserStatus(userId, isActive);

      toast.success(
        isActive
          ? "User activated successfully"
          : "User suspended successfully"
      );

      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  function getRoleStyle(userRole) {
    switch (userRole) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "vendor":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27231f]">
            Manage Users
          </h1>

          <p className="mt-2 text-[#766b60]">
            Manage accounts, roles and user access.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#eaded1] bg-white px-4 py-3 text-sm font-medium hover:bg-[#f2e8dc] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-[#eaded1] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
            <Users size={22} />
          </div>

          <div>
            <p className="text-sm text-[#766b60]">
              Matching Users
            </p>

            <p className="text-2xl font-bold text-[#27231f]">
              {pagination.total}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#eaded1] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#766b60]"
          />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#eaded1] py-3 pl-10 pr-4 outline-none focus:border-[#b83227]"
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#eaded1] bg-white px-4 py-3 outline-none focus:border-[#b83227]"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users */}
      <div className="overflow-hidden rounded-2xl border border-[#eaded1] bg-white">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <RefreshCw
              size={30}
              className="animate-spin text-[#b83227]"
            />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users
              size={42}
              className="mx-auto text-[#b83227]"
            />

            <h3 className="mt-4 text-xl font-semibold text-[#27231f]">
              No users found
            </h3>

            <p className="mt-2 text-[#766b60]">
              Try a different search or role filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#f2e8dc] text-sm text-[#51473e]">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-[#eaded1]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2e8dc] font-bold text-[#b83227]">
                              {(user.name || user.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#27231f]">
                              {user.name || "Unnamed"}
                            </p>

                            <p className="text-sm text-[#766b60]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#766b60]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive === false
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isActive === false
                            ? "Suspended"
                            : "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <select
                            value={user.role || "customer"}
                            disabled={updatingId === user.id}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-[#eaded1] px-2 py-2 text-sm disabled:opacity-50"
                          >
                            {roleOptions.map((option) => (
                              <option
                                key={option}
                                value={option}
                              >
                                {option}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() =>
                              handleStatusChange(
                                user.id,
                                user.isActive === false
                              )
                            }
                            disabled={updatingId === user.id}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                              user.isActive === false
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {user.isActive === false
                              ? "Activate"
                              : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 p-4 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-[#eaded1] p-4"
                >
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2e8dc] font-bold text-[#b83227]">
                        {(user.name || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#27231f]">
                        {user.name || "Unnamed"}
                      </p>

                      <p className="truncate text-sm text-[#766b60]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                    >
                      {user.role}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive === false
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isActive === false
                        ? "Suspended"
                        : "Active"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#766b60]">
                    Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <select
                      value={user.role || "customer"}
                      disabled={updatingId === user.id}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-[#eaded1] px-2 py-2 text-sm"
                    >
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          user.id,
                          user.isActive === false
                        )
                      }
                      disabled={updatingId === user.id}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${
                        user.isActive === false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive === false
                        ? "Activate"
                        : "Suspend"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#766b60]">
            Page {pagination.page} of {pagination.totalPages}
            {" · "}
            {pagination.total} users
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-xl border border-[#eaded1] bg-white px-4 py-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= pagination.totalPages}
              className="flex items-center gap-1 rounded-xl border border-[#eaded1] bg-white px-4 py-2 disabled:opacity-40"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}