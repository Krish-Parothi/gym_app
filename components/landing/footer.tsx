"use client";

import Link from "next/link";
// import { Instagram, Facebook, Youtube } from "lucide-react";
import { Instagram, Twitter, Play } from "lucide-react";

const navLinks = [
  { href: "#programs", label: "Programs" },
  { href: "#why-us", label: "Why Us" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

// const socialLinks = [
//   { icon: Instagram, href: "#", label: "Instagram" },
//   { icon: Facebook, href: "#", label: "Facebook" },
//   { icon: Youtube, href: "#", label: "YouTube" },
// ];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Facebook" },
  { icon: Play, href: "#", label: "YouTube" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0a0a0a] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-white">REVOLUTION</span>
            <span className="text-2xl font-extrabold text-[#FF0000]">GYM</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-500">
            <span className="text-[#FF0000] font-bold">Get Fit. Get Furious.</span>
            {" "}© 2025 Revolution Gym Nagpur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
