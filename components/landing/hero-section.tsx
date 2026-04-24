"use client";

import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef, useMemo, useState, useEffect } from "react";

// Generate particles with random positions
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
  }));
}

export function HeroSection() {
  const particles = useMemo(() => generateParticles(20), []);

  const scrollToPrograms = () => {
    const element = document.querySelector("#programs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, #3d0000, #000000)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 60, 0],
            y: [0, (Math.random() - 0.5) * 60, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Main Heading */}
        <h1
          className="font-black leading-none"
          style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
        >
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="block text-white"
          >
            GET FIT.
          </motion.span>
          <motion.span custom={1} initial="hidden" animate="visible" variants={wordVariants} className="text-white">
            GET{" "}
          </motion.span>
          <motion.span
            custom={2}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="text-[#FF0000]"
          >
            FURIOUS.
          </motion.span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto"
        >
          Nagpur&apos;s Fitness Revolution Has Arrived.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-[#FF0000] hover:bg-[#cc0000] text-white text-lg px-8 py-6 rounded-full"
          >
            <Link href="/register">Start Your Revolution</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToPrograms}
            className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
          >
            See Our Programs
          </Button>
        </motion.div>
      </div>

      {/* Bouncing Chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-10 w-10 text-white/60" />
      </motion.div>
    </section>
  );
}

// Stats Bar Component
export function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: 5000, suffix: "+", label: "Members" },
    { value: 50, suffix: "+", label: "Expert Trainers" },
    { value: 10, suffix: "+", label: "Programs" },
    { value: 24, suffix: "/7", label: "Access" },
  ];

  return (
    <section ref={ref} className="bg-[#FF0000] py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white">
              {isInView && <CountUp end={stat.value} />}
              {stat.suffix}
            </div>
            <div className="text-white/80 mt-2 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Count Up Animation Component
function CountUp({ end }: { end: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}</span>;
}
