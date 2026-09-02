import { Globe, MapPin } from "lucide-react";
import Link from "next/link";

const groups = [
  {
    title: "Get to Know Us",
    links: ["About Amazon", "Careers", "Press Releases", "Amazon Science"]
  },
  {
    title: "Connect with Us",
    links: ["Facebook", "Twitter", "Instagram"]
  },
  {
    title: "Make Money with Us",
    links: ["Sell on Amazon", "Sell under Amazon Accelerator", "Fulfilment by Amazon", "Advertise Your Products", "Amazon Pay on Merchants"]
  },
  {
    title: "Let Us Help You",
    links: ["Your Account", "Returns Centre", "100% Purchase Protection", "Amazon App Download", "Help"]
  }
];

const lowerInformationalLinks = [
  { title: "AbeBooks", desc: "Books, art & collectibles" },
  { title: "ACX", desc: "Audiobook Publishing Made Easy" },
  { title: "Audible", desc: "Download Audio Books" },
  { title: "IMDb", desc: "Movies, TV & Celebrities" },
  { title: "Shopbop", desc: "Designer Fashion Brands" },
  { title: "Amazon Business", desc: "Everything For Your Business" },
  { title: "Amazon Web Services", desc: "Scalable Cloud Computing Services" },
  { title: "Audible", desc: "Download Audio Books" }
];

export function Footer() {
  return (
    <footer className="mt-10 bg-[#232f3e] text-white">
      <Link
        href="#"
        className="block bg-[#37475a] py-3 text-center text-sm font-medium hover:bg-[#485769]"
      >
        Back to top
      </Link>

      <div className="mx-auto max-w-[1000px] px-6 py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-bold text-white">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[13px] text-slate-300 hover:underline">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-white/10">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-center sm:gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            amazon<span className="text-amazon-gold">.in</span>
          </Link>
          <button type="button" className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white">
            <Globe className="h-4 w-4" />
            English
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white">
            <span className="font-bold">₹</span>
            INR &ndash; Indian Rupee
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white">
            <MapPin className="h-4 w-4" />
            India
          </button>
        </div>
      </div>

      <div className="bg-[#131a22]">
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-x-8 gap-y-6 px-6 py-10 text-center sm:grid-cols-4">
          {lowerInformationalLinks.map((item, index) => (
            <Link key={`${item.title}-${index}`} href="#" className="block text-[12px] leading-relaxed text-slate-400 hover:text-slate-200">
              <span className="block font-bold text-slate-200">{item.title}</span>
              {item.desc}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#131a22] pb-8 pt-4 text-center text-[12px] text-slate-400">
        <div className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2 px-4">
          <Link href="#" className="hover:underline">Conditions of Use &amp; Sale</Link>
          <Link href="#" className="hover:underline">Privacy Notice</Link>
          <Link href="#" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Amazon India Clone — an independent educational project.</p>
        <p className="mt-1 text-slate-500">
          Not affiliated with, endorsed by, or sponsored by Amazon.com, Inc. Styled after Amazon.in for demonstration purposes only.
        </p>
      </div>
    </footer>
  );
}
