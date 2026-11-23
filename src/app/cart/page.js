"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { createOrder } from "@/services/order.service";

const CART_KEY = "pizzahub-cart";

const money = (value) =>
  `৳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)}`;

export default function CartPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const [placing, setPlacing] = useState(false);

  const user = session?.user;
  const isCustomer = !user || !user.role || user.role === "customer";

  // Load the cart from localStorage once the page is mounted on the client.
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = JSON.parse(
          localStorage.getItem(CART_KEY) || "[]"
        );
        setCart(Array.isArray(stored) ? stored : []);
      } catch {
        setCart([]);
      } finally {
        setLoaded(true);
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeliveryDate(tomorrow.toISOString().slice(0, 10));
    });
  }, []);

  function persistCart(nextCart) {
    setCart(nextCart);

    try {
      localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      // Storage may be unavailable (private mode); state still works.
    }
  }

  function changeQuantity(id, delta) {
    persistCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                20,
                Math.max(1, Number(item.quantity || 1) + delta)
              ),
            }
          : item
      )
    );
  }

  function removeItem(id) {
    persistCart(cart.filter((item) => item.id !== id));
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  async function handlePlaceOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please sign in to place an order");
      router.push("/sign-in");
      return;
    }

    if (!isCustomer) {
      toast.error(
        "Only customer accounts can place orders. Please sign in as a customer."
      );
      return;
    }

    if (!deliveryAddress.trim() || !phone.trim()) {
      toast.error("Please enter your delivery address and phone number");
      return;
    }

    try {
      setPlacing(true);

      await createOrder({
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: Number(item.quantity) || 1,
        })),
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        deliveryDate,
        message: message.trim(),
      });

      persistCart([]);

      toast.success("Order placed successfully!");

      router.push("/dashboard/orders");
      router.refresh();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8ef] py-10 sm:py-14">
      <div className="container-custom">
        <Link
          href="/browse"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#71675e] transition hover:text-[#b83227]"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-extrabold text-[#27231f] sm:text-4xl">
          Your Cart
        </h1>

        {!loaded ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-[#b83227]"
            />
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#eaded1] bg-white p-12 text-center">
            <ShoppingBag
              size={56}
              className="mx-auto text-[#b83227]"
            />

            <h2 className="mt-5 text-2xl font-bold text-[#27231f]">
              Your cart is empty
            </h2>

            <p className="mt-2 text-[#71675e]">
              Add some delicious pizzas to get started.
            </p>

            <Link
              href="/browse"
              className="primary-button mt-6 inline-flex items-center gap-2"
            >
              Browse Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Cart items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#eaded1] bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f2e8dc]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">
                        🍕
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-bold text-[#27231f]">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#71675e]">
                      {money(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[#eaded1]">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="p-2.5 text-[#27231f] transition hover:text-[#b83227] disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-8 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        disabled={item.quantity >= 20}
                        aria-label="Increase quantity"
                        className="p-2.5 text-[#27231f] transition hover:text-[#b83227] disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="min-w-24 text-right font-bold text-[#b83227]">
                      {money(
                        Number(item.price || 0) *
                          Number(item.quantity || 0)
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="rounded-lg p-2 text-[#b83227] transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary / checkout */}
            <form
              onSubmit={handlePlaceOrder}
              className="h-fit space-y-5 rounded-2xl border border-[#eaded1] bg-white p-6"
            >
              <h2 className="text-xl font-bold text-[#27231f]">
                Delivery Details
              </h2>

              {!isPending && !user && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                  Please{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold underline"
                  >
                    sign in
                  </Link>{" "}
                  to place your order.
                </div>
              )}

              {!isPending && user && !isCustomer && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Only customer accounts can place orders. You are signed
                  in as a {user.role}.
                </div>
              )}

              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#51483f]"
                >
                  <MapPin size={16} />
                  Delivery Address
                </label>

                <textarea
                  id="deliveryAddress"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(event.target.value)
                  }
                  placeholder="House, road, area, city"
                  required
                  className="w-full resize-none rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#51483f]"
                >
                  <Phone size={16} />
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="deliveryDate"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#51483f]"
                >
                  Delivery Date
                </label>

                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(event) =>
                    setDeliveryDate(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-[#51483f]"
                >
                  Special Instructions
                </label>

                <textarea
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Any special requests?"
                  className="w-full resize-none rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
                />
              </div>
              <div className="space-y-2 border-t border-[#eaded1] pt-4 text-sm">
                <div className="flex justify-between text-[#71675e]">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="flex justify-between text-[#71675e]">
                  <span>Delivery</span>
                  <span className="font-medium text-green-700">
                    Free
                  </span>
                </div>

                <div className="flex justify-between pt-2 text-lg font-bold text-[#27231f]">
                  <span>Total</span>
                  <span className="text-[#b83227]">
                    {money(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing || isPending || !isCustomer}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83227] py-3.5 font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#71675e]">
                Payment method: Cash on Delivery
              </p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
