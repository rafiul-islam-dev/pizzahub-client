"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MenuCard from "@/components/home/MenuCard";
import { getMenuItems } from "@/services/menu.service";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const allItems = await getMenuItems();
        const stored = JSON.parse(
          localStorage.getItem("pizzahub-favorites") || "[]"
        );

        const favorites = Array.isArray(stored) ? stored : [];

        if (!cancelled) {
          setItems(
            allItems.filter((item) =>
              favorites.includes(item._id || item.id)
            )
          );
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 sm:py-16">
      <div className="container-custom">
        <h1 className="text-3xl font-extrabold text-[#27231f]">
          Your Favorites
        </h1>

        <p className="mt-2 text-[#71675e]">
          Pizzas you saved for later.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#eaded1] bg-white p-12 text-center">
            <p className="text-[#71675e]">
              You haven&apos;t saved any favorites yet.
            </p>

            <Link href="/browse" className="primary-button mt-6 inline-flex">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}