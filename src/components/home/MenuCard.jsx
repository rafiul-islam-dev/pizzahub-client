"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import OrderFlowModal from "@/components/order/OrderFlowModal";

const FAVORITES_KEY = "pizzahub-favorites";

export default function MenuCard({ item }) {
  const itemId = item._id || item.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = JSON.parse(
          localStorage.getItem(FAVORITES_KEY) || "[]"
        );

        setIsFavorite(
          Array.isArray(stored) && stored.includes(itemId)
        );
      } catch {
        setIsFavorite(false);
      }
    });
  }, [itemId]);

  function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const stored = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]"
      );

      const favorites = Array.isArray(stored) ? stored : [];
      const next = favorites.includes(itemId)
        ? favorites.filter((id) => id !== itemId)
        : [...favorites, itemId];

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(next)
      );

      setIsFavorite(next.includes(itemId));
      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch {
      // ignore
    }
  }

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#ece2d6] bg-white transition hover:shadow-md">
        {/* Image */}
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[#f2e8dc]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-7xl transition duration-500 group-hover:scale-110">
              🍕
            </span>
          )}

          {item.vendorPremium && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#f3d9c2] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#8f3826]">
              <Star size={10} />
              Premium
            </span>
          )}

          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#b83227] shadow transition hover:scale-110"
          >
            <Heart
              size={15}
              className={isFavorite ? "fill-[#b83227]" : ""}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[14px] font-semibold text-[#332c27]">
              {item.name}
            </h3>

            <span className="shrink-0 text-[13px] font-semibold text-[#b83227]">
              ${Number(item.price || 0).toFixed(2)}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#9a8f84]">
            {item.description}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[9px] text-[#9a8f84]">
            <Star size={10} className="text-[#d98a2b]" />
            4.9 · 130+ local vibe notes
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] text-[#9a8f84]">
            <span className="rounded-full bg-[#f7e7db] px-2 py-0.5 text-[#a85435]">
              {item.category}
            </span>

            {item.location && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin size={9} />
                {item.location}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#8a8076]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f3d9c2] text-[8px] font-bold text-[#a85435]">
              {(item.vendorName || "P").charAt(0)}
            </span>
            {item.vendorName || "PizzaHub Vendor"}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#b83227] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#98291f]"
            >
              <Clock size={12} />
              View details
              <ArrowUpRight size={12} />
            </button>

            <Link
              href={`/menu/${itemId}`}
              className="rounded-md border border-[#e3d7c8] px-2.5 py-2 text-[10px] font-medium text-[#6c6359] transition hover:border-[#b83227] hover:text-[#b83227]"
            >
              Info
            </Link>
          </div>
        </div>
      </article>

      {orderOpen && (
        <OrderFlowModal
          item={item}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </>
  );
}