"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "1,499",
    period: "month",
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Access to gym facilities",
      "Basic equipment usage",
      "Locker room access",
      "Weight tracking dashboard",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "2,999",
    period: "month",
    description: "For dedicated fitness enthusiasts",
    features: [
      "Everything in Starter",
      "Personal training sessions (2/month)",
      "Customized workout plans",
      "Nutrition guidance",
      "Progress analytics",
      "Priority booking",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "4,999",
    period: "month",
    description: "Ultimate fitness experience",
    features: [
      "Everything in Pro",
      "Unlimited personal training",
      "Advanced meal planning",
      "Body composition analysis",
      "Recovery zone access",
      "Guest passes (2/month)",
      "Premium support",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible membership options designed to fit your lifestyle and fitness goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "relative bg-card rounded-xl p-8 shadow-sm border",
                plan.popular 
                  ? "border-primary shadow-lg scale-105" 
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-muted-foreground">₹</span>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href="/register">
                  Get Started
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
