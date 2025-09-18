'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assets", label: "Assets" },
  { href: "/liquidity-pools", label: "Liquidity Pools" },
  { href: "/simulator", label: "Simulador" }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 flex-col gap-2 rounded-2xl border border-white/10 bg-card/60 p-4 lg:flex">
      {routes.map((route) => {
        const active = pathname?.startsWith(route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/5 ${active ? "text-accent" : "text-white/70"}`}
          >
            {route.label}
          </Link>
        );
      })}
    </aside>
  );
}
