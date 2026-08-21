import { AnimateSection } from "./animate-section";
import { useLang } from "@/hooks/use-lang";

export function HowItWorks() {
  const { lang, t } = useLang();
  const th = t.how[lang];

  return (
    <section id="how" className="px-4 py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimateSection className="text-center mb-16">
          <p className="text-sm text-accent font-medium mb-3 uppercase tracking-wider">
            {th.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            {th.title}{" "}
            <span className="gradient-text">{th.titleAccent}</span>
          </h2>
        </AnimateSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-border" />
          {th.steps.map((step, i) => (
            <AnimateSection key={step.n} delay={i * 100}>
              <div className="relative glass rounded-2xl p-6 h-full">
                <div className="font-display text-4xl font-bold gradient-text mb-4">{step.n}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </AnimateSection>
          ))}
        </div>
      </div>
    </section>
  );
}
