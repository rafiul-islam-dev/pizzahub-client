import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function MenuCard({ item }) {
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