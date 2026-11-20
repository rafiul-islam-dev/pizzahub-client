"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Pizza,
  ShoppingBag,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Menu", href: "/browse" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eaded1] bg-[#fff8ef]/95 backdrop-blur-md">
      <nav className="container-custom flex h-[76px] items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b83227] text-white">
            <Pizza size={25} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#27231f]">
              Pizza<span className="text-[#b83227]">Hub</span>
            </h1>

            <p className="text-[10px] font-medium tracking-[2px] text-[#84776b]">
              FRESH & DELICIOUS
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#51473f] transition hover:text-[#b83227]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#27231f] transition hover:bg-[#f2e8dc]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="primary-button text-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#eaded1] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-[#eaded1] bg-white md:hidden">
          <div className="container-custom flex flex-col gap-1 py-4">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#fff8ef] hover:text-[#b83227]"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[#eaded1] pt-4">
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="secondary-button"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="primary-button"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}