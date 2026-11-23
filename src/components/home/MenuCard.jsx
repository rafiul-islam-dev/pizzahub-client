"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";

const FAVORITES_KEY = "pizzahub-favorites";

export default function MenuCard({ item }) {
  const itemId = item._id || item.id;
  const [isFavorite, setIsFavorite] = useState(false);

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
    <article className="group overflow-hidden rounded-2xl border border-[#eaded1] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#f2e8dc]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-8xl transition duration-500 group-hover:scale-110">
            🍕
          </span>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#b83227]">
          {item.category}
        </span>

        {item.vendorPremium && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 shadow">
            <Star size={12} />
            Premium
          </span>
        )}

        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#b83227] shadow transition hover:scale-110"
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-[#b83227]" : ""}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-[#27231f]">
            {item.name}
          </h3>

          <span className="shrink-0 font-bold text-[#b83227]">
            ৳{item.price}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#71675e]">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#71675e]">
          {item.vendorName && (
            <span className="truncate font-medium">
              {item.vendorName}
            </span>
          )}

          {item.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} />
              {item.location}
            </span>
          )}
        </div>

        <Link
          href={`/menu/${item._id}`}
          className="mt-5 flex items-center justify-between border-t border-[#eaded1] pt-4 text-sm font-semibold text-[#b83227]"
        >
          View Details
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}