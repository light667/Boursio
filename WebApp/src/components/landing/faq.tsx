import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimateSection } from "./animate-section";
import { useLang } from "@/hooks/use-lang";

export function FAQ() {
  const { lang, t } = useLang();
  const tf = t.faq[lang];

  return (
    <section id="faq" className="px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <AnimateSection className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            {tf.title} <span className="gradient-text">{tf.titleAccent}</span>
          </h2>
        </AnimateSection>

        <AnimateSection delay={80}>
          <Accordion type="single" collapsible className="space-y-3">
            {tf.items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="glass rounded-xl px-5 border-none"
              >
                <AccordionTrigger className="font-display text-left text-base hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateSection>
      </div>
    </section>
  );
}
