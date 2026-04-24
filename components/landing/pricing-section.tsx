"use client";

import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef } from "react";

const plans = [
  {
    name: "Starter",
    tagline: "Perfect for beginners",
    price: 999,
    features: [
      "Access to gym floor",
      "Basic equipment usage",
      "Locker room access",
      "1 fitness assessment/month",
    ],
    popular: false,
  },
  {
    name: "Pro",
    tagline: "Most popular choice",
    price: 1799,
    features: [
      "Everything in Starter",
      "All group classes",
      "Personal trainer sessions 2/mo",
      "Nutrition consultation",
      "24/7 access",
    ],
    popular: true,
  },
  {
    name: "Elite",
    tagline: "Ultimate experience",
    price: 2999,
    features: [
      "Everything in Pro",
      "Unlimited PT sessions",
      "Premium locker",
      "Spa and sauna access",
      "Guest passes 4/mo",
      "Priority booking",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="bg-[#111111] py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Choose Your </span>
            <span className="text-[#FF0000]">Plan</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Select the membership that fits your fitness goals and lifestyle.
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative bg-[#1a1a1a] rounded-2xl p-8 ${
                plan.popular ? 'border-2 border-[#FF0000] md:scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#FF0000] text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mt-2">{plan.name}</h3>
              <p className="text-gray-400 mt-1">{plan.tagline}</p>

              {/* Price */}
              <div className="mt-6">
                <span className="text-gray-400 text-lg">₹</span>
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">/mo</span>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#FF0000] flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                className={`w-full mt-8 py-6 text-lg rounded-full ${
                  plan.popular
                    ? 'bg-[#FF0000] hover:bg-[#cc0000] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
