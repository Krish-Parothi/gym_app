"use client";

import { motion, useInView } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    name: "Rahul Sharma",
    quote: "Revolution Gym completely transformed my fitness journey. Lost 25kg in 6 months with their expert guidance. The trainers here actually care about your progress!",
  },
  {
    name: "Priya Patel",
    quote: "Best gym in Nagpur, hands down! The 24/7 access is perfect for my busy schedule. Equipment is world-class and always well-maintained.",
  },
  {
    name: "Amit Deshmukh",
    quote: "I&apos;ve tried many gyms in the city but Revolution is on another level. The CrossFit program pushed me beyond my limits. Highly recommend!",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="results" className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Real People. </span>
            <span className="text-[#FF0000]">Real Results.</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Hear from our members who have transformed their lives at Revolution Gym.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,0,0,0.2)] transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#FF0000] text-[#FF0000]" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-300 italic text-lg mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              
              {/* Author */}
              <div>
                <p className="text-white font-bold text-lg">{testimonial.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 text-[#FF0000]" />
                  <span className="text-[#FF0000] text-sm">Nagpur Member</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
