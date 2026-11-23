import "./globals.css";
import { Toaster } from "sonner";
import AppShell from "@/components/shared/AppShell";

export const metadata = {
  title: "PizzaHub | Fresh Pizza Delivered",
  description:
    "Discover delicious pizzas from your favorite local restaurants. Order fresh pizza with PizzaHub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}