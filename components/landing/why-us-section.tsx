"use client";

import { motion, useInView } from "framer-motion";
import { Settings, Users, Clock, Apple } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Settings,
    title: "State-of-the-Art Equipment",
    description: "Train with the latest fitness machines and equipment from world-renowned brands. Our gym floor features everything you need for a complete workout.",
  },
  {
    icon: Users,
    title: "Expert Certified Trainers",
    description: "Our team of certified fitness professionals brings years of experience and passion to help you achieve your goals faster and safer.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "With 24/7 access, you can work out whenever it suits your schedule. Early morning or late night - we&apos;re always open for you.",
  },
  {
    icon: Apple,
    title: "Nutrition Guidance",
    description: "Get personalized diet plans and nutrition counseling from our expert nutritionists to complement your training and maximize results.",
  },
];

export function WhyUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Why </span>
            <span className="text-[#FF0000]">Revolution?</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Experience the difference that sets us apart from every other gym in Nagpur.
          </p>
        </div>

        {/* Features */}
        <div ref={ref} className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Text Side */}
                <div className="flex-1 space-y-4">
                  <div className="w-14 h-14 bg-[#FF0000]/20 rounded-xl flex items-center justify-center">
                    <Icon className="h-7 w-7 text-[#FF0000]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-lg">{feature.description}</p>
                </div>
                
                {/* Visual Side */}
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-[#3d0000] to-[#1a0000] rounded-2xl p-16 flex items-center justify-center">
                    <Icon className="h-24 w-24 text-[#FF0000]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
