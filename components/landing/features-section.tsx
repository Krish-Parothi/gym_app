"use client";

import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Users, 
  Clock, 
  Award 
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Personal Training",
    description: "One-on-one sessions with certified trainers who create customized workout plans tailored to your goals.",
  },
  {
    icon: Apple,
    title: "Nutrition Plans",
    description: "Personalized diet recommendations based on your preferences - vegetarian or non-vegetarian options available.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your weight, attendance, and fitness journey with detailed analytics and visual charts.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a motivating community of like-minded individuals who support and inspire each other.",
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    description: "Choose gym timings that fit your schedule - morning, afternoon, or evening sessions available.",
  },
  {
    icon: Award,
    title: "Multiple Plans",
    description: "Select from Starter, Pro, or Elite membership plans to match your fitness commitment level.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive fitness platform combines world-class facilities with 
            cutting-edge technology to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
