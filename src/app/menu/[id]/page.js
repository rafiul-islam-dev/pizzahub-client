import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth-guard";
import { getMenuItemById } from "@/services/menu.service";
import MenuDetails from "@/components/menu/MenuDetails";

export async function generateMetadata({ params }) {
  await requireSession().catch(() => null);

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
  await requireSession();

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