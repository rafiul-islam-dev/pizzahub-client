import Link from "next/link";
import {
  Pizza,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#eaded1] bg-[#27231f] text-white">

      <div className="container-custom py-14">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b83227]">
                <Pizza size={24} />
              </div>

              <span className="text-xl font-extrabold">
                Pizza<span className="text-[#e77a3c]">Hub</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#c5bbb1]">
              Bringing fresh, delicious pizza from your favorite
              local restaurants straight to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-bold">Quick Links</h3>

            <div className="flex flex-col gap-3 text-sm text-[#c5bbb1]">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/browse" className="transition hover:text-white">
                Browse Menu
              </Link>

              <Link href="/sign-in" className="transition hover:text-white">
                Sign In
              </Link>

              <Link href="/sign-up" className="transition hover:text-white">
                Become a Vendor
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-bold">Contact Us</h3>

            <div className="flex flex-col gap-4 text-sm text-[#c5bbb1]">

              <p className="flex items-center gap-3">
                <MapPin size={17} className="text-[#e77a3c]" />
                Bangladesh
              </p>

              <p className="flex items-center gap-3">
                <Phone size={17} className="text-[#e77a3c]" />
                Contact information coming soon
              </p>

              <p className="flex items-center gap-3">
                <Mail size={17} className="text-[#e77a3c]" />
                hello@pizzahub.com
              </p>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 font-bold">Follow Us</h3>

            <p className="mb-4 text-sm leading-7 text-[#c5bbb1]">
              Follow us for delicious updates, special offers,
              and pizza news.
            </p>

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#b83227]"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#b83227]"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#b83227]"
              >
                <span className="text-sm font-bold">𝕏</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-[#a99e93]">
            © {new Date().getFullYear()} PizzaHub. All rights reserved.
            Made with love for pizza lovers.
          </p>
        </div>

      </div>
    </footer>
  );
}