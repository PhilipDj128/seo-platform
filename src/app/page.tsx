"use client";
import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Projektöversikt",
    description:
      "Se alla domäner, branscher och städer i en enda vy. Spåra hälsa, ranking och indexering i realtid.",
  },
  {
    title: "AI-drivna insikter",
    description:
      "Automatiska rekommendationer och rapporter. Generera snabbare innehålls- och tekniska TODOs.",
  },
  {
    title: "Team & roller",
    description:
      "Rollbaserad åtkomst, single sign-on och audit logs för regelefterlevnad och säkerhet.",
  },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="badge">Byggd för SEO-team</p>
            <h2 className="mt-3 text-white">Allt du behöver i ett modernt UI</h2>
            <p className="mt-2 max-w-3xl text-slate-300">
              Vi kombinerar datapipelines, rapportering och projektstyrning i ett
              responsivt gränssnitt. Fokus på hastighet, tydlighet och automation.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
