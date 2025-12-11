"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { signOut, useAuth } from "@/lib/auth";
import clsx from "clsx";
import { Menu } from "lucide-react";

const links = [
  { href: "/", label: "Hem" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/projects", label: "Projekt" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAuthed, setIsAuthed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Vänta tills loading är klar innan vi sätter isAuthed
    if (!loading) {
      setIsAuthed(Boolean(user));
      setShowButtons(true);
    }
    
    // Fallback: visa knappar efter max 3 sekunder även om loading är true
    const timeout = setTimeout(() => {
      setShowButtons(true);
      if (!loading) {
        setIsAuthed(Boolean(user));
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [pathname, user, loading]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 shadow-glow" />
            <span className="text-lg font-semibold tracking-tight text-white">
              SEO Platform
            </span>
          </Link>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium text-slate-200 hover:text-white",
                pathname === link.href && "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {showButtons && (
            isAuthed ? (
              <Button variant="secondary" onClick={handleLogout}>
                Logga ut
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Logga in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Skapa konto</Button>
                </Link>
              </div>
            )
          )}
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="size-10 rounded-full border border-white/10 bg-white/5 p-2"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium text-slate-200 hover:text-white",
                  pathname === link.href && "text-white"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showButtons && (
              isAuthed ? (
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                  Logga ut
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full">
                    <Button variant="ghost" className="w-full">
                      Logga in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="block w-full">
                    <Button className="w-full">
                      Skapa konto
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}

