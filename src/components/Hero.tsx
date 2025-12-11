"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="badge">AI-stöd • Realtime data • Enterprise ready</span>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            SEO-plattformen som ger dig försprång mot konkurrenterna.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/90">
            Få en kristallklar bild av dina domäner, projekt och lokala marknader.
            Automatisera rapporter, hitta luckor och leverera snabbare resultat.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup" className="inline-block">
              <Button>Kom igång gratis</Button>
            </Link>
            <Link href="/login" className="inline-block">
              <Button variant="secondary">Logga in</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="badge">Single sign-on</span>
            <span className="badge">Rollbaserad åtkomst</span>
            <span className="badge">OpenAI integration</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Teknisk hälsa</p>
                <p className="text-3xl font-semibold text-white">93/100</p>
              </div>
              <span className="badge">+12% v.35</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-11/12 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-slate-300">Rankinglyft</p>
                <p className="text-xl font-semibold text-white">38 nyckelord</p>
                <p className="text-xs text-emerald-300">+14% senaste 7 dagar</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                <p className="text-slate-300">Indexeringshastighet</p>
                <p className="text-xl font-semibold text-white">1.2 dagar</p>
                <p className="text-xs text-emerald-300">-0.4 dagar v/v</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Powered by Supabase + Next.js + Express + OpenAI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

