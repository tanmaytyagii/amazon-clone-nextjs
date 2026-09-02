"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-2 lg:grid-cols-[64px_1fr]">
      <div className="order-2 flex gap-2 overflow-auto lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setActive(image)}
            className={cn(
              "relative h-14 w-14 shrink-0 overflow-hidden rounded border bg-white",
              active === image ? "border-amazon-orange ring-1 ring-amazon-orange" : "border-slate-200 hover:border-slate-400"
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill sizes="56px" className="object-contain p-0.5" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-square overflow-hidden rounded bg-white lg:order-2">
        <Image src={active} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-contain" />
      </div>
    </div>
  );
}
