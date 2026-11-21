import Link from "next/link";
import { getMenuItems } from "@/services/menu.service";
import MenuCard from "./MenuCard";

export default async function FeaturedMenu() {
  const menuItems = await getMenuItems();

  const featuredItems = menuItems.slice(0, 6);

  return (
    <section id="featured-menu" className="section-padding">
      <div className="container-custom">
        {/* Section heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-[#b83227]">
              Our Menu
            </span>

            <h2 className="section-title">
              Discover Our Delicious Pizzas
            </h2>

            <p className="section-description mt-3 max-w-2xl">
              Fresh ingredients, amazing flavors, and pizzas
              made to make your day better.
            </p>
          </div>

          <Link href="/browse" className="secondary-button">
            View All Menu
          </Link>
        </div>

        {/* Menu cards */}
        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#eaded1] bg-white p-12 text-center">
            <div className="mb-4 text-5xl">🍕</div>

            <h3 className="text-xl font-bold">
              No pizzas available yet
            </h3>

            <p className="mt-2 text-[#71675e]">
              Our delicious menu will be available soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}