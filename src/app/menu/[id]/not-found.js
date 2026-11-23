import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-7xl">🍕</span>

      <h1 className="mt-6 text-3xl font-extrabold">
        Pizza Not Found!
      </h1>

      <p className="mt-3 text-[#71675e]">
        Sorry, we couldn&apos;t find the pizza you&apos;re looking for.
      </p>

      <Link href="/browse" className="primary-button mt-6">
        Explore Menu
      </Link>
    </div>
  );
}