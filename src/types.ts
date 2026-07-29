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

export interface Business {
  id: string;
  name: string;
  category?: string;
  niche?: string;
  municipality: string;
  subregion: SubregionId;
  phone: string;
  website?: string;
  usesAI?: boolean;
  description?: string;
  logoUrl?: string;
  imageUrl?: string;
  servicesCompleted?: string[];
}

export interface AlmanaquePrices {
  qty100: number;
  qty300: number;
  qty500: number;
  qty1000: number;
}

export interface AlmanaqueItem {
  id: string;
  title: string;
  description: string;
  details?: string;
  imageUrl: string;
  pdfUrl?: string;
  prices: AlmanaquePrices;
}

export interface AlmanaquePdfPage {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  pdfUrl?: string;
  description?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
  iconName?: string;
  imageUrl?: string;
  badge?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  subregion: SubregionId;
  capitalDistanceKm?: number;
  primaryEconomy: string;
  adTip: string;
  badge?: string;
}

export interface TariffPlan {
  id: string;
  name: string;
  description: string;
  monthlyCostCOP: number;
  annualCostCOP: number;
  totalAnnualCostCOP?: number;
  badge: string;
  color?: string;
  textColor?: string;
  features: string[];
}

export interface AlmanaqueConfig {
  extraColorCost: number;
  generalPdfUrl?: string;
  pdfPages?: AlmanaquePdfPage[];
  products: AlmanaqueItem[];
}

export interface FullSiteConfig {
  logoUrl?: string;
  clients?: ClientRecord[];
  almanaqueConfig?: AlmanaqueConfig;
  customServices?: ServiceItem[];
  customMapLocations?: MapLocation[];
  customBusinesses?: Business[];
  customTariffs?: TariffPlan[];
  customLithoImages?: Record<string, string>;
  municipalDirectoryBanner?: string;
}
