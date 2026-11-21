"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import MenuCard from "@/components/home/MenuCard";

export default function BrowseMenu({ initialItems }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("default");

    // Get categories dynamically
    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(initialItems.map((item) => item.category)),
        ];

        return ["All", ...uniqueCategories];
    }, [initialItems]);

    // Search, filter and sort
    const filteredItems = useMemo(() => {
        let items = [...initialItems];

        // Search
        if (search.trim()) {
            const searchTerm = search.toLowerCase();

            items = items.filter((item) => {
                return (
                    (item.name || "").toLowerCase().includes(searchTerm) ||
                    (item.description || "").toLowerCase().includes(searchTerm) ||
                    (item.category || "").toLowerCase().includes(searchTerm)
                );
            });
        }

        // Category filter
        if (category !== "All") {
            items = items.filter(
                (item) => item.category === category
            );
        }

        // Sorting
        if (sort === "price-low") {
            items.sort((a, b) => a.price - b.price);
        }

        if (sort === "price-high") {
            items.sort((a, b) => b.price - a.price);
        }

        if (sort === "name") {
            items.sort((a, b) => a.name.localeCompare(b.name));
        }

        return items;
    }, [initialItems, search, category, sort]);

    return (

        <section className="section-padding">
            <div className="container-custom">
                {/* Search and sorting */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71675e]"
                        />

                        <input
                            type="text"
                            placeholder="Search your favorite pizza..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#eaded1] bg-white py-3 pl-12 pr-4 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                        />
                    </div>

                    <div className="relative">
                        <SlidersHorizontal
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71675e]"
                        />

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#eaded1] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#b83227]"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${category === item
                                    ? "bg-[#b83227] text-white"
                                    : "border border-[#eaded1] bg-white text-[#27231f] hover:border-[#b83227] hover:text-[#b83227]"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Result count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[#71675e]">
                        Showing{" "}
                        <span className="font-semibold text-[#27231f]">
                            {filteredItems.length}
                        </span>{" "}
                        pizzas
                    </p>
                </div>

                {/* Menu grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item) => (
                            <MenuCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#eaded1] bg-white px-6 py-16 text-center">
                        <div className="mb-4 text-5xl">🔍</div>

                        <h3 className="text-xl font-bold">
                            No pizzas found
                        </h3>

                        <p className="mt-2 text-[#71675e]">
                            Try a different search or category.
                        </p>

                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                                setSort("default");
                            }}
                            className="primary-button mt-6"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}