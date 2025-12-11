# SEO Platform - MVP

En modern SEO-automation plattform byggd med Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui och Supabase.

## 🚀 Funktioner

- ✅ **Autentisering** - Email/password signup och login med Supabase
- ✅ **Dashboard** - Översikt med sidebar navigation
- ✅ **Projekt** - Skapa och hantera SEO-projekt
- ✅ **5-stegs projektflöde** - URL → Auto-detektering → Nyckelord → Paket → Offert
- ✅ **Admin Panel** - Hantera inkomna projekt och offerter
- ✅ **Dark Mode** - Fullt stöd för mörkt tema
- ✅ **Responsive Design** - Mobile-first design

## 📋 Krav

- Node.js 18+
- npm eller yarn
- Supabase konto

## 🛠️ Installation

1. **Klona repot och installera dependencies:**
   ```bash
   npm install
   ```

2. **Skapa Supabase projekt:**
   - Gå till [supabase.com/dashboard](https://supabase.com/dashboard)
   - Skapa ett nytt projekt
   - Kopiera `Project URL` och `anon public key`

3. **Skapa `.env.local` i projektroten:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key
   ```

4. **Sätt upp databasen:**
   - Öppna Supabase SQL Editor
   - Kör SQL från `supabase-schema.sql`
   - Detta skapar alla tabeller och RLS policies

5. **Starta utvecklingsservern:**
   ```bash
   npm run dev
   ```

6. **Öppna [http://localhost:3000](http://localhost:3000)**

## 📁 Projektstruktur

```
src/
├── app/
│   ├── dashboard/          # Dashboard routes
│   │   ├── layout.tsx      # Dashboard layout med sidebar
│   │   ├── page.tsx        # Dashboard översikt
│   │   ├── projects/       # Projektlista
│   │   ├── new-project/    # 5-stegs projektflöde
│   │   ├── analytics/      # Analys
│   │   ├── settings/       # Inställningar
│   │   └── support/        # Support
│   ├── admin/              # Admin panel
│   ├── login/              # Login sida
│   └── signup/             # Signup sida
├── components/
│   ├── Auth/               # Auth komponenter
│   ├── ui/                 # Shadcn/ui komponenter
│   └── ...
├── lib/
│   ├── auth.ts             # Auth functions & useAuth hook
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── project-helpers.ts  # Projekt helper functions
└── middleware.ts           # Protected routes middleware
```

## 🗄️ Databas Schema

- **users** - Användarprofiler (extenderar auth.users)
- **projects** - SEO-projekt
- **keyword_analyses** - Nyckelordsanalyser
- **offers** - Offerter

Se `supabase-schema.sql` för fullständig schema.

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Komponentbibliotek
- **Dark Mode** - Automatisk detektering + toggle
- **Responsive** - Mobile-first design

## 🔐 Autentisering

Autentisering hanteras av Supabase Auth med:
- Email/password signup
- Email/password login
- Session persistence
- Protected routes via middleware
- Automatic redirects

## 📝 Nästa Steg

För produktion:
1. Ersätt fake data med riktiga API:er (Wincher, OpenAI, etc.)
2. Implementera e-postutskick för offerter
3. Lägg till riktig nyckelordsanalys
4. Implementera faktisk ranking-övervakning
5. Lägg till betalningsintegration

## 🐛 Felsökning

**Problem: "Missing Supabase environment variables"**
- Kontrollera att `.env.local` finns och innehåller rätt variabler
- Starta om dev-servern efter att ha lagt till env-variabler

**Problem: "Failed to fetch" vid signup/login**
- Kontrollera att Supabase URL och key är korrekta
- Verifiera att Supabase projektet är aktivt

**Problem: Middleware redirect loop**
- Kontrollera att `middleware.ts` matcher är korrekta
- Verifiera att Supabase session fungerar

## 📄 Licens

MIT
