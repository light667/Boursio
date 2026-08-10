import { useState } from "react";
import { Menu, ArrowRight, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#how", label: "Comment ça marche" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

interface NavProps {
  onLaunchApp?: () => void;
}

export function Nav({ onLaunchApp }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <a href="#top" className="flex items-center gap-3 shrink-0 group">
          <img
            src={logo}
            alt="Boursio Logo"
            className="h-9 w-9 object-contain rounded-xl transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Boursio
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors duration-150 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />

          <button
            type="button"
            onClick={onLaunchApp}
            className="gradient-primary text-primary-foreground text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-strong inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>Lancer la version web</span>
            <ExternalLink className="h-3.5 w-3.5 hidden sm:inline-block" />
          </button>

          {/* Mobile Sheet Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/50 transition"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="font-display text-left flex items-center gap-2">
                  <img src={logo} alt="Boursio" className="h-7 w-7 object-contain" />
                  <span>Boursio</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6 flex items-center justify-between px-1 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Apparence</span>
                <ThemeToggle />
              </div>
              <SheetClose asChild>
                <button
                  type="button"
                  onClick={() => { setOpen(false); onLaunchApp?.(); }}
                  className="mt-6 w-full gradient-primary text-primary-foreground font-semibold px-4 py-3 rounded-xl hover:opacity-90 transition shadow-glow inline-flex items-center justify-center gap-2"
                >
                  Lancer la version web <ArrowRight className="h-4 w-4" />
                </button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}