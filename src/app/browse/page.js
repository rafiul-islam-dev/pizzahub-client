import { getMenuItems } from "@/services/menu.service";
import BrowseMenu from "@/components/menu/BrowseMenu";

export const metadata = {
  title: "Browse Menu | PizzaHub",
  description: "Explore delicious pizzas at PizzaHub.",
};

export default async function BrowsePage() {
  const menuItems = await getMenuItems();

  return (
    <main className="min-h-screen">
      <section className="bg-[#f2e8dc] py-16 dark:bg-[#241f1a]">
        <div className="container-custom">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#b83227]">
            Explore Our Menu
          </span>

          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Find Your Perfect Pizza 🍕
          </h1>

          <p className="section-description mt-4 max-w-2xl">
            Discover your favorite flavors, explore new pizzas,
            and find something delicious for every craving.
          </p>
        </div>
      </section>

      <BrowseMenu initialItems={menuItems} />
    </main>
  );
}