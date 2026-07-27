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

export interface ClientPayment {
  id: string;
  concept: string;
  period: string;
  amount: number;
  date: string;
  method: string;
  paid: boolean;
  notes?: string;
}

export interface ClientRecord {
  id: string;
  clientName: string;
  projectName: string;
  phone: string;
  startDate: string;
  hostingDomainFee: number;
  hostingDomainPaid: boolean;
  monthlyFee: number;
  billingDay: number;
  notes: string;
  payments: ClientPayment[];
}
