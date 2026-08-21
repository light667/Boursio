import { Languages, School, GraduationCap, LineChart, Bell, Wallet, type LucideIcon } from "lucide-react";
import { AnimateSection } from "./animate-section";
import { useLang } from "@/hooks/use-lang";

const ROADMAP_ICONS: LucideIcon[] = [Languages, School, GraduationCap, LineChart, Bell, Wallet];

export function Roadmap() {
  const { lang, t } = useLang();
  const tr = t.roadmap[lang];

  return (
    <section id="roadmap" className="px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <AnimateSection className="text-center mb-16">
          <p className="text-sm text-secondary font-medium mb-3 uppercase tracking-wider">
            {tr.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {tr.title} <span className="gradient-text">{tr.titleAccent}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tr.sub}</p>
        </AnimateSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tr.items.map((item, i) => {
            const Icon = ROADMAP_ICONS[i];
            return (
              <AnimateSection key={item.title} delay={i * 60}>
                <div className="glass rounded-2xl p-6 h-full opacity-90 border border-dashed border-white/10 relative">
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wide font-medium px-2 py-1 rounded-full bg-muted/80 text-muted-foreground">
                    {item.badge}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 pr-16">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimateSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
