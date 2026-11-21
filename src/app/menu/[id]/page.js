import { notFound } from "next/navigation";
import { getMenuItemById } from "@/services/menu.service";
import MenuDetails from "@/components/menu/MenuDetails";
import { requireSession } from "@/lib/auth-guard";

export async function generateMetadata({ params }) {
  await requireSession();
  const { id } = await params;
  const item = await getMenuItemById(id);

  return {
    title: item
      ? `${item.name} | PizzaHub`
      : "Pizza Not Found | PizzaHub",
    description: item?.description || "Explore delicious pizzas at PizzaHub.",
  };
}

export default async function MenuDetailsPage({ params }) {
  const { id } = await params;
  const item = await getMenuItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 sm:py-16">
      <MenuDetails item={item} />
    </main>
  );
}