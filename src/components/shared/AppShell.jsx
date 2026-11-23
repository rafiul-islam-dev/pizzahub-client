"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default function AppShell({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="min-h-screen bg-[#fff8ef] dark:bg-[#14110e]">{children}</main>

      <Footer />
    </>
  );
}