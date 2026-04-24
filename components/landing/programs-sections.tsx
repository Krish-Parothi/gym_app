"use client";

import { motion, useInView } from "framer-motion";
import { Dumbbell, Zap, Sparkles, Swords, Activity, Music } from "lucide-react";
import { useRef } from "react";

const programs = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    description: "Build muscle and increase power with world-class equipment.",
  },
  {
    icon: Zap,
    title: "HIIT",
    description: "High-intensity interval training to maximize calorie burn.",
  },
  {
    icon: Sparkles,
    title: "Yoga",
    description: "Find balance and flexibility with expert-led sessions.",
  },
  {
    icon: Swords,
    title: "Boxing",
    description: "Full-body workout with self-defense skills.",
  },
  {
    icon: Activity,
    title: "CrossFit",
    description: "Varied functional movements that push your limits.",
  },
  {
    icon: Music,
    title: "Zumba",
    description: "Dance your way to fitness with energetic sessions.",
  },
];

export function ProgramsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="programs" className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Our </span>
            <span className="text-[#FF0000]">Programs</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Transform your body with our expert-designed fitness programs tailored for all levels.
          </p>
        </div>

        {/* Programs Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[#1a1a1a] rounded-2xl p-8 border-t-[3px] border-t-[#FF0000] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,0,0,0.3)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#FF0000]/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-[#FF0000]" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{program.title}</h3>
                <p className="text-gray-400">{program.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
