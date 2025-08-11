import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">Acehive</h2>
          <p className="mt-3 text-sm">
            Your one-stop destination for Resources!❤️
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors duration-200"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Privacy & Terms */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Privacy & Terms
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/refund-policy"
                className="hover:text-white transition-colors duration-200"
              >
                Cancellation & Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-policy"
                className="hover:text-white transition-colors duration-200"
              >
                Shipping & Delivery Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">
            For any inquiries, reach us at:
          </p>
          <a
            href="mailto:acehive.in@gmail.com"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
          >
            acehive.in@gmail.com
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Acehive. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
