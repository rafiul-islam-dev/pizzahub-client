import Link from "next/link";
import { ArrowRight, Pizza, Clock, Flame } from "lucide-react";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import HomeExtraSections from "@/components/home/HomeExtraSections";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden bg-[#fff8ef]">
        <div className="container-custom grid min-h-[580px] items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">

          {/* Left Content */}
          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0d6c1] bg-white px-4 py-2 text-sm font-medium text-[#b83227]">
              <Flame size={16} />
              Freshly baked, always delicious
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-[#27231f] sm:text-6xl lg:text-7xl">
              Your Favorite
              <span className="block text-[#b83227]">
                Pizza, Delivered.
              </span>
            </h1>

            <p className="section-description mt-6 max-w-lg">
              Discover amazing pizzas from local restaurants.
              Fresh ingredients, delicious flavors, and your
              favorite food delivered right to your door.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/browse" className="primary-button">
                Explore Pizza Menu
                <ArrowRight size={18} />
              </Link>

              <Link href="/sign-up" className="secondary-button">
                Become a Vendor
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e3d3] text-[#b83227]">
                  <Pizza size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold">Fresh Pizza</p>
                  <p className="text-xs text-[#84776b]">
                    Made with love
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e3d3] text-[#b83227]">
                  <Clock size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold">Easy Ordering</p>
                  <p className="text-xs text-[#84776b]">
                    Simple & convenient
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual */}
          <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[450px]">

            <div className="absolute h-[300px] w-[300px] rounded-full bg-[#f4d5b8] sm:h-[400px] sm:w-[400px]" />

            <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full border-[12px] border-[#e77a3c] bg-[#f5bd73] shadow-2xl sm:h-[380px] sm:w-[380px]">
              <span className="select-none text-[190px] drop-shadow-xl sm:text-[260px]">
                🍕
              </span>
            </div>

            <div className="absolute bottom-6 left-2 rounded-2xl border border-[#eaded1] bg-white p-4 shadow-lg sm:bottom-12 sm:left-8">
              <p className="text-sm font-bold text-[#27231f]">
                Made fresh
              </p>

              <p className="mt-1 text-xs text-[#84776b]">
                Every single order ❤️
              </p>
            </div>

            <div className="absolute right-2 top-6 rounded-2xl bg-[#b83227] px-5 py-4 text-white shadow-lg sm:right-8">
              <p className="text-sm font-bold">
                Deliciousness
              </p>

              <p className="mt-1 text-xs text-white/80">
                In every slice!
              </p>
            </div>

          </div>

        </div>
      </section>
      <FeaturedMenu />
      <HomeExtraSections />
      {/* Temporary section placeholder */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">

          <span className="text-sm font-bold uppercase tracking-[3px] text-[#b83227]">
            Discover
          </span>

          <h2 className="section-title mt-3">
            Something Delicious Is Coming
          </h2>

          <p className="section-description mx-auto mt-4 max-w-xl">
            Explore our upcoming collection of delicious pizzas,
            sides, and drinks from your favorite local restaurants.
          </p>

          <Link href="/browse" className="primary-button mt-7">
            Browse Menu
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>
    </>
  );
}