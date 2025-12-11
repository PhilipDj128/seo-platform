export type ProjectStatus = "draft" | "active" | "paused" | "completed";

export type PackageTier = "bas" | "pro" | "elite" | "empire";

export interface Keyword {
  keyword: string;
  volume: number;
  competition: "low" | "medium" | "high";
  rankingPotential: number;
  timeEstimate: number; // months
  selected?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  domainUrl: string;
  industry: string;
  cities: string[];
  keywords: Keyword[];
  package: PackageTier;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  projectId: string;
  pagesNeeded: number;
  backlinksNeeded: number;
  monthsNeeded: number;
  monthlyPrice: number;
  adminNotes?: string;
  sentAt?: string;
}
