import { Mail } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site";
import { useLang } from "@/hooks/use-lang";

export function Contact() {
  const { lang, t } = useLang();
  const tc = t.contact[lang];

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[100px] bg-primary pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Direct Support & Email Banner */}
        <div className="glass rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-border/80 text-center sm:text-left">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">
              {tc.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {tc.sub}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="mailto:contact@boursio.app"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 text-sm font-semibold text-foreground transition"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>contact@boursio.app</span>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-glow"
            >
              <span>{tc.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
