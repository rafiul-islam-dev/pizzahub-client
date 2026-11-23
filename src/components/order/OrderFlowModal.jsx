"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, MapPin, Store, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createOrder } from "@/services/order.service";

const inputClass =
  "w-full rounded-md border border-[#e3d7c8] bg-white px-3 py-2 text-[12px] text-[#332c27] outline-none transition placeholder:text-[#c2b7ab] focus:border-[#b83227]";

const labelClass =
  "mb-1 block text-[10px] font-semibold text-[#6c6359]";

function tomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function OrderFlowModal({ item, onClose, onOrdered }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [step, setStep] = useState("details"); // details | checkout | complete
  const [deliveryDate, setDeliveryDate] = useState(tomorrowDate());
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const price = Number(item?.price || 0);
  const image =
    item?.image ||
    item?.images?.[0] ||
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80";

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handlePlaceOrder() {
    if (!user) {
      toast.error("Please sign in to place an order");
      onClose();
      window.location.href = "/sign-in";
      return;
    }

    const role = user.role || "customer";

    if (role !== "customer") {
      toast.error("Only customers can place orders");
      return;
    }

    if (String(item.vendorId) === String(user.id)) {
      toast.error("You cannot order your own items");
      return;
    }

    if (!deliveryDate || !address.trim()) {
      setError("Please fill in delivery date and address");
      return;
    }

    setError("");
    setStep("checkout");
  }

  async function handlePay() {
    try {
      setSubmitting(true);
      setError("");

      await createOrder({
        items: [
          { menuItemId: item._id || item.id, quantity: 1 },
        ],
        deliveryDate,
        deliveryAddress: address.trim(),
        phone: user?.phone || "01700000000",
        message: message.trim(),
      });

      setStep("complete");
      toast.success("Payment successful! Your order is confirmed.");

      if (onOrdered) onOrdered();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to place order"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-xl bg-[#fdfaf5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#b83227] text-white">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-4 4-8 4-8Z" />
            </svg>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#8a8076] hover:bg-[#f1e8dd] hover:text-[#332c27]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1 - Details */}
        {step === "details" && (
          <div className="px-6 pb-6">
            <h2 className="mt-2 font-serif text-[26px] font-semibold text-[#332c27]">
              Your next favorite
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-[220px_1fr]">
              <img
                src={image}
                alt={item.name}
                className="h-[230px] w-full rounded-lg object-cover sm:h-full"
              />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b83227]">
                  {item.category}
                </p>

                <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#332c27]">
                  {item.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#9a8f84]">
                  <span className="text-[#d98a2b]">★★★★★</span>
                  <span>4.9 · 130+ local vibe notes</span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-[#6c6359]">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#6c6359]">
                  <MapPin size={12} className="text-[#b83227]" />
                  {item.location || "Manhattan, NY"}
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#6c6359]">
                  <Store size={12} className="text-[#b83227]" />
                  {item.vendorName || "Little Oven Co."}
                </div>

                <div className="mt-3 border-t border-[#ece2d6] pt-3">
                  <p className="font-serif text-[19px] font-semibold text-[#332c27]">
                    ${price.toFixed(2)}
                    <span className="ml-2 font-sans text-[10px] font-normal text-[#9a8f84]">
                      made fresh to order
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className={labelClass}>Delivery date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Delivery address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Apt 4B"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Special instructions</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Anything we should know?"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-md bg-[#fbe9e7] px-3 py-2 text-[11px] text-[#b83227]">
                {error}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#b83227] py-3 text-[12px] font-semibold text-white transition hover:bg-[#98291f]"
            >
              Place order - ${price.toFixed(2)}
              <span aria-hidden>→</span>
            </button>

            <p className="mt-3 text-center text-[9px] text-[#b4a89c]">
              Payment is simulated for the demo. No charge will be made.
            </p>
          </div>
        )}

        {/* Step 2 - Checkout */}
        {step === "checkout" && (
          <div className="px-6 pb-6">
            <h2 className="mt-2 font-serif text-[23px] font-semibold text-[#332c27]">
              Secure demo checkout
            </h2>

            <div className="mt-4 flex items-center justify-between rounded-md border border-[#e3d7c8] bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7f3e9] text-[#417a4d]">
                  <Check size={14} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#332c27]">
                    Demo payment
                  </p>

                  <p className="text-[9px] text-[#9a8f84]">
                    No real card or money is used
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#fbf0dc] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#9a6b1f]">
                Test mode
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-md border border-[#e3d7c8] bg-white p-3">
              <img
                src={image}
                alt=""
                className="h-11 w-11 rounded-md object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-[#332c27]">
                  {item.name}
                </p>

                <p className="truncate text-[9px] text-[#9a8f84]">
                  {item.vendorName || "Little Oven Co."} · Delivery{" "}
                  {deliveryDate}
                </p>
              </div>

              <p className="text-[12px] font-semibold text-[#332c27]">
                ${price.toFixed(2)}
              </p>
            </div>

            {/* Demo card */}
            <div className="mt-3 rounded-lg bg-gradient-to-br from-[#a63a28] to-[#7d2a1b] p-4 text-white shadow-inner">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Demo card
              </p>

              <p className="mt-6 text-[18px] tracking-[0.18em]">
                •••• •••• •••• 4242
              </p>

              <div className="mt-4 flex items-center justify-between text-[10px]">
                <span className="font-semibold italic">VISA</span>
                <span className="text-white/80">12/30</span>
              </div>
            </div>

            <p className="mt-3 text-center text-[9px] leading-4 text-[#b4a89c]">
              Card details are for demonstration only. No payment is
              processed and no card details are collected.
            </p>

            {error && (
              <p className="mt-3 rounded-md bg-[#fbe9e7] px-3 py-2 text-[11px] text-[#b83227]">
                {error}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#b83227] py-3 text-[12px] font-semibold text-white transition hover:bg-[#98291f] disabled:opacity-60"
            >
              {submitting ? "Processing..." : `Pay $${price.toFixed(2)}`}
              {!submitting && <span aria-hidden>→</span>}
            </button>

            <button
              onClick={() => setStep("details")}
              className="mt-3 block w-full text-center text-[11px] font-medium text-[#8a8076] hover:text-[#b83227]"
            >
              Back to order details
            </button>
          </div>
        )}

        {/* Step 3 - Complete */}
        {step === "complete" && (
          <div className="px-6 pb-8 pt-2 text-center">
            <h2 className="font-serif text-[23px] font-semibold text-[#332c27]">
              Payment complete
            </h2>

            <div className="mt-4 flex items-center justify-between rounded-md border border-[#e3d7c8] bg-white px-3 py-2.5 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7f3e9] text-[#417a4d]">
                  <Check size={14} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#332c27]">
                    Demo payment
                  </p>

                  <p className="text-[9px] text-[#9a8f84]">
                    No real card or money is used
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#fbf0dc] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#9a6b1f]">
                Test mode
              </span>
            </div>

            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f3e9] text-[#417a4d]">
              <Check size={26} />
            </div>

            <h3 className="mt-4 font-serif text-[24px] font-semibold text-[#332c27]">
              You&apos;re all set!
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-[11px] leading-5 text-[#9a8f84]">
              Your payment was successful and your order is on its way to
              the pizzeria.
            </p>

            <button
              onClick={onClose}
              className="mt-6 rounded-md border border-[#e3d7c8] bg-white px-6 py-2.5 text-[11px] font-medium text-[#6c6359] hover:border-[#b83227] hover:text-[#b83227]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}