"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import VendorHeader from "@/components/vendor/VendorHeader";
import {
  getMyMenuItems,
  deleteMenuItem,
} from "@/services/vendor.service";

const money = (value) =>
  `$${Number(value || 0).toFixed(2)}`;

export default function VendorMenuManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyMenuItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load menu");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchItems());
  }, [fetchItems]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      setDeletingId(id);
      await deleteMenuItem(id);
      toast.success("Menu item deleted");
      await fetchItems();
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <VendorHeader title="My Menu Items" />

      <section className="rounded-lg border border-[#ece2d6] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#332c27]">
              Your menu
            </h2>

            <p className="mt-1 text-[11px] text-[#9a8f84]">
              Approved items appear in Browse Menu.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/menu/add"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#b83227] px-3.5 py-2 text-[11px] font-semibold text-white transition hover:bg-[#98291f]"
          >
            <Plus size={14} />
            Add item
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[#efe7dd]">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#e9ddcd] border-t-[#b83227]" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#9a8f84]">
                Your menu is empty.
              </p>

              <Link
                href="/dashboard/vendor/menu/add"
                className="primary-button mt-4 inline-flex text-xs"
              >
                Add your first item
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const approved = Boolean(item.isApproved);

              return (
                <div
                  key={item._id}
                  className="flex items-center gap-3 py-2.5"
                >
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=70"
                    }
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[#332c27]">
                      {item.name}{" "}
                      <span className="font-normal text-[#9a8f84]">
                        {money(item.price)}
                      </span>
                    </p>

                    <p className="truncate text-[10px] text-[#9a8f84]">
                      {item.category} · {item.location || "—"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                      approved
                        ? "bg-[#e7f3e9] text-[#417a4d]"
                        : "bg-[#fbf0dc] text-[#9a6b1f]"
                    }`}
                  >
                    {approved ? "Approved" : "Pending"}
                  </span>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="shrink-0 rounded-md border border-[#e3d7c8] px-2.5 py-1.5 text-[10px] font-medium text-[#6c6359] transition hover:border-[#b83227] hover:text-[#b83227] disabled:opacity-50"
                  >
                    {deletingId === item._id ? "..." : "Delete"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-[10px] text-[#b4a89c]">
        <Trash2 size={11} className="mr-1 inline" />
        Menu items are reviewed by an admin before going live.
      </p>
    </div>
  );
}