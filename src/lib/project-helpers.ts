import type { Keyword } from "./types";

// Fake industry detection based on domain/keywords
export function detectIndustry(url: string): string {
  const domain = url.toLowerCase();
  if (domain.includes("städ") || domain.includes("cleaning")) return "Städtjänster";
  if (domain.includes("bygg") || domain.includes("construction")) return "Bygg";
  if (domain.includes("restaurang") || domain.includes("restaurant")) return "Restaurang";
  if (domain.includes("frisör") || domain.includes("salon")) return "Frisör";
  if (domain.includes("träning") || domain.includes("gym")) return "Träning & Hälsa";
  return "Allmänt";
}

// Fake city suggestions
export function suggestCities(industry: string): string[] {
  const cityMap: Record<string, string[]> = {
    "Städtjänster": ["Luleå", "Västra Skellefteå", "Arvidsjaur", "Piteå", "Boden"],
    "Bygg": ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping"],
    "Restaurang": ["Stockholm", "Göteborg", "Malmö", "Uppsala"],
    "Frisör": ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping"],
    "Träning & Hälsa": ["Stockholm", "Göteborg", "Malmö"],
    "Allmänt": ["Stockholm", "Göteborg", "Malmö"],
  };
  return cityMap[industry] || cityMap["Allmänt"];
}

// Fake competitor detection
export function getCompetitors(industry: string, city: string): string[] {
  return [
    `${industry.toLowerCase()}-${city.toLowerCase()}.se`,
    `bästa-${industry.toLowerCase()}-${city.toLowerCase()}.se`,
    `${city.toLowerCase()}-${industry.toLowerCase()}.com`,
  ];
}

// Generate fake keywords
export function generateKeywords(industry: string, city: string): Keyword[] {
  const baseKeywords = [
    { keyword: `${industry.toLowerCase()} ${city}`, volume: 1200, competition: "high" as const, rankingPotential: 65, timeEstimate: 8 },
    { keyword: `bästa ${industry.toLowerCase()} ${city}`, volume: 800, competition: "medium" as const, rankingPotential: 75, timeEstimate: 6 },
    { keyword: `${industry.toLowerCase()} ${city} pris`, volume: 600, competition: "medium" as const, rankingPotential: 70, timeEstimate: 7 },
    { keyword: `${industry.toLowerCase()} nära mig`, volume: 1500, competition: "high" as const, rankingPotential: 60, timeEstimate: 9 },
    { keyword: `professionell ${industry.toLowerCase()} ${city}`, volume: 400, competition: "low" as const, rankingPotential: 85, timeEstimate: 4 },
    { keyword: `${industry.toLowerCase()} ${city} recensioner`, volume: 300, competition: "low" as const, rankingPotential: 80, timeEstimate: 5 },
  ];
  return baseKeywords;
}

// Calculate offer based on package and keywords
export function calculateOffer(
  packageTier: string,
  selectedKeywords: Keyword[]
): { pagesNeeded: number; backlinksNeeded: number; monthsNeeded: number; monthlyPrice: number } {
  const keywordCount = selectedKeywords.length;
  const avgCompetition = selectedKeywords.reduce((sum, k) => {
    const comp = k.competition === "high" ? 3 : k.competition === "medium" ? 2 : 1;
    return sum + comp;
  }, 0) / keywordCount;

  const pagesNeeded = Math.ceil(keywordCount * 1.5);
  const backlinksNeeded = Math.ceil(keywordCount * avgCompetition * 2);
  const monthsNeeded = Math.max(...selectedKeywords.map(k => k.timeEstimate));

  const packagePrices: Record<string, number> = {
    bas: 1995,
    pro: 3995,
    elite: 6995,
    empire: 15000,
  };

  const monthlyPrice = packagePrices[packageTier] || packagePrices.bas;

  return { pagesNeeded, backlinksNeeded, monthsNeeded, monthlyPrice };
}

