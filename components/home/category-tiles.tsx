import {
  ArrowRight,
  Armchair,
  Book,
  Camera,
  Car,
  Cpu,
  Dumbbell,
  Footprints,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  PawPrint,
  PenTool,
  Puzzle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tv,
  WashingMachine,
  Watch
} from "lucide-react";
import Link from "next/link";

const categoryIcons = {
  "Mobiles & Accessories": Smartphone,
  "Laptops & Computers": Laptop,
  Electronics: Cpu,
  "Headphones & Audio": Headphones,
  TVs: Tv,
  Cameras: Camera,
  Watches: Watch,
  "Men's Fashion": Shirt,
  "Women's Fashion": Shirt,
  Shoes: Footprints,
  "Home & Kitchen": Home,
  Furniture: Armchair,
  "Beauty & Personal Care": Sparkles,
  Grocery: ShoppingBasket,
  "Sports & Fitness": Dumbbell,
  Books: Book,
  "Toys & Games": Puzzle,
  Gaming: Gamepad2,
  "Office & Stationery": PenTool,
  Appliances: WashingMachine,
  Automotive: Car,
  "Pet Supplies": PawPrint
};

export function CategoryTiles({ categories }: { categories: string[] }) {
  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] ?? Sparkles;

          return (
            <Link
              key={category}
              href={`/search?category=${encodeURIComponent(category)}`}
              className="group flex flex-col justify-between gap-6 rounded border border-slate-200 bg-white p-4 shadow-card transition hover:shadow-cardHover dark:border-white/10 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold leading-tight text-slate-950 dark:text-white">{category}</h3>
                <Icon className="h-8 w-8 shrink-0 text-amazon-teal" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-amazon-teal group-hover:underline">
                See more
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
