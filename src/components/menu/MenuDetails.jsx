
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";

export default function MenuDetails({ item }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const ingredients = Array.isArray(item.ingredients)
    ? item.ingredients
    : [];

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
    setAdded(false);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
    setAdded(false);
  };

  const totalPrice = item.price * quantity;

  const addToCart = () => {
    if (!item.isAvailable) return;

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("pizzahub-cart") || "[]"
      );

      const itemId = item._id || item.id;

      const existingItem = existingCart.find(
        (cartItem) => cartItem.id === itemId
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = existingCart.map((cartItem) =>
          cartItem.id === itemId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
              }
            : cartItem
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            id: itemId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity,
            vendorId: item.vendorId,
          },
        ];
      }

      localStorage.setItem(
        "pizzahub-cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      setAdded(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <section className="container-custom">
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#71675e] transition hover:text-[#b83227]"
      >
        <ArrowLeft size={18} />
        Back to Menu
      </Link>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Pizza Image */}
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-[#f2e8dc] sm:min-h-[480px]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="text-[160px] sm:text-[200px]">
              🍕
            </span>
          )}

          <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#b83227]">
            {item.category}
          </span>
        </div>

        {/* Pizza Information */}
        <div>
          <div
            className={`mb-4 flex items-center gap-2 text-sm font-semibold ${
              item.isAvailable
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            <CheckCircle2 size={18} />

            {item.isAvailable
              ? "Available Now"
              : "Currently Unavailable"}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#27231f] sm:text-5xl">
            {item.name}
          </h1>

          <p className="mt-5 leading-8 text-[#71675e]">
            {item.description}
          </p>

          {/* Price */}
          <div className="mt-7">
            <span className="text-sm font-medium text-[#71675e]">
              Price
            </span>

            <p className="mt-1 text-3xl font-extrabold text-[#b83227]">
              ৳{item.price}
            </p>
          </div>

          {/* Ingredients */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-[#27231f]">
              Ingredients
            </h2>

            {ingredients.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={`${ingredient}-${index}`}
                    className="rounded-full border border-[#eaded1] bg-white px-4 py-2 text-sm text-[#71675e]"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#71675e]">
                Ingredient information is not available.
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold">
              Quantity
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-[#eaded1] bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="p-3 text-[#27231f] transition hover:text-[#b83227] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-10 text-center font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="p-3 text-[#27231f] transition hover:text-[#b83227]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <p className="text-sm text-[#71675e]">
                Total:{" "}
                <strong className="text-lg text-[#b83227]">
                  ৳{totalPrice}
                </strong>
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <button
              type="button"
              onClick={addToCart}
              disabled={!item.isAvailable}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white transition sm:w-auto ${
                item.isAvailable
                  ? "bg-[#b83227] hover:bg-[#96271e]"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              <ShoppingBag size={20} />

              {!item.isAvailable
                ? "Currently Unavailable"
                : added
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
            </button>

            {added && (
              <p className="mt-3 text-sm font-medium text-green-700">
                Added {quantity} item(s) to your cart successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
