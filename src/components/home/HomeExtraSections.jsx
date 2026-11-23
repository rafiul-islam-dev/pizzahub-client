"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Pizza,
  Truck,
  ShieldCheck,
  Clock,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    name: "Classic Pizzas",
    description: "Timeless favorites, baked fresh every time.",
    emoji: "🍕",
  },
  {
    name: "Vegetarian Pizzas",
    description: "Garden-fresh toppings on a crispy crust.",
    emoji: "🥗",
  },
  {
    name: "Meat Lovers",
    description: "Loaded with premium meats and cheese.",
    emoji: "🥩",
  },
  {
    name: "Specialty / Gourmet",
    description: "Chef-crafted recipes for food lovers.",
    emoji: "👨‍🍳",
  },
  {
    name: "Sides & Appetizers",
    description: "Garlic bread, wings and more.",
    emoji: "🍟",
  },
  {
    name: "Beverages & Desserts",
    description: "Cool drinks and sweet treats.",
    emoji: "🥤",
  },
];

const benefits = [
  {
    icon: Pizza,
    title: "Fresh Ingredients",
    description:
      "Every pizza is made with carefully selected, fresh ingredients.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Hot pizza delivered straight to your door, on time.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Vendors",
    description:
      "All restaurants are reviewed and approved by our team.",
  },
  {
    icon: Clock,
    title: "Easy Ordering",
    description:
      "Browse, order and track everything in a few clicks.",
  },
];

const steps = [
  {
    number: "01",
    title: "Browse the Menu",
    description: "Explore pizzas from local restaurants by category.",
  },
  {
    number: "02",
    title: "Place Your Order",
    description: "Add to cart, set delivery details and confirm.",
  },
  {
    number: "03",
    title: "Track & Enjoy",
    description: "Follow your order status and enjoy fresh pizza.",
  },
];

export default function HomeExtraSections() {
  return (
    <>
      {/* Pizza Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-[#b83227]">
              Categories
            </span>

            <h2 className="section-title mt-3">
              Explore by Category
            </h2>

            <p className="section-description mx-auto mt-4 max-w-2xl">
              From classic margheritas to gourmet specialties, find
              something for every craving.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl border border-[#eaded1] bg-[#fff8ef] p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{category.emoji}</div>

                <h3 className="text-lg font-bold text-[#27231f]">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-[#71675e]">
                  {category.description}
                </p>

                <Link
                  href="/browse"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#b83227]"
                >
                  Explore
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose PizzaHub */}
      <section className="section-padding bg-[#fff8ef]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-[#b83227]">
              Why PizzaHub
            </span>

            <h2 className="section-title mt-3">
              Why Choose PizzaHub?
            </h2>

            <p className="section-description mx-auto mt-4 max-w-2xl">
              We bring together the best local pizza restaurants so you
              can order with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-2xl border border-[#eaded1] bg-white p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4e3d3] text-[#b83227]">
                    <Icon size={24} />
                  </div>

                  <h3 className="font-bold text-[#27231f]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#71675e]">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How PizzaHub Works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-[#b83227]">
              How It Works
            </span>

            <h2 className="section-title mt-3">
              Pizza in 3 Easy Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-2xl border border-[#eaded1] bg-[#fff8ef] p-6"
              >
                <span className="text-4xl font-extrabold text-[#b83227]/20">
                  {step.number}
                </span>

                <h3 className="mt-2 text-lg font-bold text-[#27231f]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-[#71675e]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}