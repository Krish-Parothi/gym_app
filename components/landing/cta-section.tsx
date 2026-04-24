"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section id="contact" className="bg-gradient-to-r from-[#FF0000] to-[#cc0000] py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Ready to Start Your{" "}
            <span className="block mt-2">Revolution?</span>
          </h2>
          <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
            Join thousands of Nagpur residents who have transformed their lives at Revolution Gym.
            Your journey to a fitter, stronger you starts today.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 bg-white text-[#FF0000] hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-bold"
          >
            <Link href="/register">Join Revolution Gym</Link>
          </Button>

          {/* Contact Info */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Revolution Gym, Nagpur, Maharashtra</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>Contact reception</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>info@revolutiongym.in</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
