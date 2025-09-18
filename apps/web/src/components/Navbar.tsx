'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assets", label: "Assets" },
  { href: "/liquidity-pools", label: "Liquidity Pools" },
  { href: "/simulator", label: "Simulador LP" }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-bg/60 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold tracking-wide text-accent">
          DeFi Control
        </Link>
        <div className="flex items-center gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm px-3 py-1 rounded-lg hover:bg-white/5 ${pathname===l.href? 'text-accent':'text-white/80'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
