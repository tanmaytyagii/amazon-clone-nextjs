"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { heroSlides } from "@/lib/data";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  function move(direction: number) {
    setActive((value) => (value + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="relative h-[220px] overflow-hidden bg-slate-950 text-white sm:h-[320px] lg:h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amazon-page to-transparent dark:from-slate-950" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-center px-5 pb-10 sm:px-8">
        <motion.div
          key={`${slide.title}-content`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-amazon-gold sm:text-sm">{slide.eyebrow}</p>
          <h1 className="mt-1 text-xl font-bold leading-tight sm:text-3xl lg:text-4xl">{slide.title}</h1>
          <p className="mt-2 hidden max-w-md text-sm leading-6 text-slate-200 sm:block">{slide.description}</p>
          <Link
            href="/search"
            className="mt-4 inline-flex h-9 items-center rounded-[4px] bg-amazon-gold px-4 text-sm font-bold text-slate-950 shadow-sm hover:bg-[#f5c078]"
          >
            {slide.cta}
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-5">
        <button
          type="button"
          onClick={() => move(-1)}
          className="rounded-full bg-white/90 p-1.5 text-slate-950 shadow-md hover:bg-white sm:p-2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className="rounded-full bg-white/90 p-1.5 text-slate-950 shadow-md hover:bg-white sm:p-2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:left-5 sm:translate-x-0">
        {heroSlides.map((s, index) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-5 bg-amazon-gold" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
