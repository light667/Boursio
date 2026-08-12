import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimateSection } from "./animate-section";
import { FAQ_ITEMS } from "./data";

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <AnimateSection className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Questions <span className="gradient-text">fréquentes</span>
          </h2>
        </AnimateSection>

        <AnimateSection delay={80}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
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
