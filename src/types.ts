export type SubregionId =
  | "valle_de_aburra"
  | "oriente"
  | "suroeste"
  | "occidente"
  | "uraba"
  | "norte"
  | "bajo_cauca"
  | "nordeste"
  | "magdalena_medio";

export interface Subregion {
  id: SubregionId;
  name: string;
  description: string;
  capital: string;
  color: string; // Tailwind color class for map highlight
  municipalitiesCount: number;
  highlightedSectors: string[];
}

export interface Municipality {
  name: string;
  subregion: SubregionId;
  capitalDistanceKm?: number;
  primaryEconomy: string;
  adTip: string;
}

export interface Business {
  id: string;
  name: string;
  niche: string;
  municipality: string;
  subregion: SubregionId;
  phone: string;
  website: string;
  usesAI: boolean;
  servicesCompleted: string[];
}
