import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef] px-4 py-12">
      <div className="max-w-md text-center">
        <p className="text-7xl font-extrabold text-[#b83227]">404</p>

        <h1 className="mt-4 text-2xl font-bold text-[#27231f]">
          Page not found
        </h1>

        <p className="mt-2 text-gray-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="primary-button">
            <Home size={18} />
            Go Home
          </Link>

          <Link href="/browse" className="secondary-button">
            <Search size={18} />
            Browse Menu
          </Link>
        </div>
      </div>
    </main>
  );
}