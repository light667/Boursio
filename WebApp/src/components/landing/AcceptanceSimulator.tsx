import React, { useState } from "react";
import { ArrowRight, CheckCircle2, TrendingUp, Award, ShieldAlert, Zap } from "lucide-react";
import { useLang } from "@/hooks/use-lang";

interface AcceptanceSimulatorProps {
  onLaunchApp?: () => void;
}

export const AcceptanceSimulator: React.FC<AcceptanceSimulatorProps> = ({ onLaunchApp }) => {
  const { lang, t } = useLang();
  const ts = t.simulator[lang];

  const [nationality, setNationality] = useState("Togo");
  const [level, setLevel] = useState("lic3");
  const [field, setField] = useState("cs");
  const [gpa, setGpa] = useState<number>(15);
  const [destination, setDestination] = useState("fr");

  // Dynamic simulation calculations
  const baseRate = Math.min(Math.round((gpa / 20) * 55 + 15), 65);
  const optimizedRate = Math.min(Math.round(baseRate + (gpa >= 14 ? 38 : 34)), 98);
  const matchedScholarshipsCount = gpa >= 14 ? 18 : 12;

  const destinationName =
    destination === "fr"
      ? "France"
      : destination === "ca"
      ? "Canada"
      : destination === "uk"
      ? "UK"
      : destination === "us"
      ? "USA"
      : destination === "de"
      ? "Germany"
      : destination === "jp"
      ? "Japan"
      : "Switzerland";

  const highlights = [
    ts.highlight1
      .replace("{count}", String(matchedScholarshipsCount))
      .replace("{dest}", destinationName),
    ts.highlight2,
    ts.highlight3,
    ts.highlight4,
  ];

  return (
    <section id="simulator" className="relative py-20 sm:py-28 overflow-hidden bg-secondary/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {ts.title}
            <span className="gradient-text">{ts.titleAccent}</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {ts.sub}
          </p>
        </div>

        {/* Interactive Simulator Card Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Controls Form (Left Column) */}
          <div className="lg:col-span-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-5">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> {ts.formTitle}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Nationalité */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {ts.nationalityLabel}
                </label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Togo">Togo 🇹🇬</option>
                  <option value="Bénin">Bénin 🇧🇯</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                  <option value="Sénégal">Sénégal 🇸🇳</option>
                  <option value="Cameroun">Cameroun 🇨🇲</option>
                  <option value="Guinée">Guinée 🇬🇳</option>
                  <option value="RDC">RD Congo 🇨🇩</option>
                  <option value="Autre">{ts.otherCountry}</option>
                </select>
              </div>

              {/* Niveau actuel */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {ts.levelLabel}
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="bac">{ts.levels.bac}</option>
                  <option value="lic12">{ts.levels.lic12}</option>
                  <option value="lic3">{ts.levels.lic3}</option>
                  <option value="master">{ts.levels.master}</option>
                  <option value="phd">{ts.levels.phd}</option>
                </select>
              </div>

              {/* Filière */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {ts.fieldLabel}
                </label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="cs">{ts.fields.cs}</option>
                  <option value="eng">{ts.fields.eng}</option>
                  <option value="econ">{ts.fields.econ}</option>
                  <option value="health">{ts.fields.health}</option>
                  <option value="law">{ts.fields.law}</option>
                  <option value="agro">{ts.fields.agro}</option>
                </select>
              </div>

              {/* Pays de destination */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {ts.destinationLabel}
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="fr">{ts.destinations.fr}</option>
                  <option value="ca">{ts.destinations.ca}</option>
                  <option value="uk">{ts.destinations.uk}</option>
                  <option value="us">{ts.destinations.us}</option>
                  <option value="de">{ts.destinations.de}</option>
                  <option value="jp">{ts.destinations.jp}</option>
                  <option value="ch">{ts.destinations.ch}</option>
                </select>
              </div>
            </div>

            {/* GPA Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>{ts.gpaLabel}</span>
                <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-sm font-bold text-primary">
                  {gpa} / 20
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="19"
                step="0.5"
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{ts.gpaPassable}</span>
                <span>{ts.gpaGood}</span>
                <span>{ts.gpaExcellent}</span>
              </div>
            </div>
          </div>

          {/* Probability & Transformation Output (Right Column) */}
          <div className="lg:col-span-6 rounded-3xl border border-primary/40 bg-gradient-to-b from-card via-card to-primary/10 p-6 sm:p-8 shadow-glow space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {ts.resultTitle}
              </span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +{optimizedRate - baseRate}% {ts.gainLabel}
              </span>
            </div>

            {/* Comparison Bars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Without Boursio */}
              <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-center space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> {ts.withoutBoursio}
                </span>
                <div className="text-3xl font-extrabold text-muted-foreground">{baseRate}%</div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/50 transition-all duration-500"
                    style={{ width: `${baseRate}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{ts.withoutBoursioSub}</p>
              </div>

              {/* With Boursio 98% */}
              <div className="rounded-2xl border border-primary/50 bg-primary/15 p-4 text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-12 w-12 bg-primary/20 rounded-full blur-lg" />
                <span className="text-[11px] font-extrabold text-primary flex items-center justify-center gap-1">
                  <Award className="h-3.5 w-3.5 text-primary" /> {ts.withBoursio}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-foreground gradient-text">
                  {optimizedRate}%
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${optimizedRate}%` }}
                  />
                </div>
                <p className="text-[10px] font-semibold text-primary">{ts.withBoursioSub}</p>
              </div>
            </div>

            {/* Key action points */}
            <div className="space-y-2.5 rounded-2xl border border-border/80 bg-secondary/30 p-4">
              <div className="text-xs font-bold text-foreground mb-1">
                {ts.whyBoostTitle} {optimizedRate}% :
              </div>
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onLaunchApp}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-teal-600 py-4 text-sm font-bold text-white shadow-glow hover:shadow-glow-strong hover:scale-[1.01] transition-all"
            >
              <span>
                {ts.ctaButton.replace("{count}", String(matchedScholarshipsCount))}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
