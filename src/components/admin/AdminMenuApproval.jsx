"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  RefreshCw,
  Clock,
  Pizza,
  Search,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminMenuItems,
  reviewMenuItem,
  deleteAdminMenuItem,
  setAdminMenuItemAvailability,
} from "@/services/admin.service";

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminMenuApproval() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [search, setSearch] = useState("");

  async function fetchItems(selectedStatus = status) {
    try {
      setLoading(true);

      const result = await getAdminMenuItems(selectedStatus);

      setItems(result.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load menu items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => fetchItems(status));
  }, [status]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const term = search.toLowerCase();

    return items.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(term) ||
        (item.category || "").toLowerCase().includes(term) ||
        (item.vendorName || "").toLowerCase().includes(term)
    );
  }, [items, search]);

  async function handleReview(id, action) {
    try {
      setReviewingId(id);
      await reviewMenuItem(id, action);
      toast.success(
        action === "approved"
          ? "Pizza approved successfully!"
          : "Pizza rejected successfully!"
      );
      await fetchItems(status);
    } catch (error) {
      toast.error(error.message || "Review action failed");
    } finally {
      setReviewingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await deleteAdminMenuItem(id);
      toast.success("Menu item deleted");
      await fetchItems(status);
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  }

  async function handleAvailability(id, isAvailable) {
    try {
      await setAdminMenuItemAvailability(id, isAvailable);
      toast.success(
        isAvailable ? "Item activated" : "Item deactivated"
      );
      await fetchItems(status);
    } catch (error) {
      toast.error(error.message || "Status update failed");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#27231f]">
            Manage Menu Items
          </h1>

          <p className="mt-2 text-[#766b60]">
            Review vendor submissions and manage published items.
          </p>
        </div>

        <button
          onClick={() => fetchItems(status)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#eaded1] bg-white px-4 py-3 text-sm font-medium hover:bg-[#f2e8dc] disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#766b60]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category or vendor..."
            className="w-full rounded-xl border border-[#eaded1] bg-white py-3 pl-10 pr-4 outline-none focus:border-[#b83227]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                status === tab.value
                  ? "bg-[#b83227] text-white"
                  : "border border-[#eaded1] bg-white text-[#51473e] hover:bg-[#f2e8dc]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center">
          <RefreshCw className="animate-spin text-[#b83227]" size={30} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-[#eaded1] bg-white py-16 text-center">
          <Pizza size={42} className="mx-auto text-[#b83227]" />

          <h3 className="mt-4 text-xl font-semibold text-[#27231f]">
            No {status} menu items
          </h3>

          <p className="mt-2 text-[#766b60]">
            There are currently no items in this section.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-[#eaded1] bg-white shadow-sm"
            >
              {/* Image */}
              <div className="h-56 bg-[#f2e8dc]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Pizza size={60} className="text-[#b83227]" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#27231f]">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#766b60]">
                      {item.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#fff1d8] px-3 py-1 text-xs font-semibold text-[#a15c13]">
                    {item.approvalStatus || status}
                  </span>
                </div>

                <p className="text-sm leading-6 text-[#766b60]">
                  {item.description}
                </p>

                <p className="text-2xl font-bold text-[#b83227]">
                  ৳{Number(item.price).toLocaleString("en-BD")}
                </p>

                {item.ingredients?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#27231f]">
                      Ingredients
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, index) => (
                        <span
                          key={`${ingredient}-${index}`}
                          className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs text-[#51473e]"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-[#766b60]">
                  <Clock size={14} />
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Date unavailable"}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 border-t border-[#eaded1] pt-4">
                  {status === "pending" && (
                    <>
                      <button
                        onClick={() => handleReview(item._id, "approved")}
                        disabled={reviewingId === item._id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check size={17} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReview(item._id, "rejected")}
                        disabled={reviewingId === item._id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <X size={17} />
                        Reject
                      </button>
                    </>
                  )}

                  {(status === "approved" || status === "all") && (
                    <button
                      onClick={() =>
                        handleAvailability(item._id, !item.isAvailable)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#eaded1] px-3 py-2.5 text-xs font-medium hover:bg-[#f2e8dc]"
                    >
                      {item.isAvailable ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                      {item.isAvailable ? "Deactivate" : "Activate"}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}