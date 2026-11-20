export type ServerRegion = 'seoul' | 'frankfurt' | 'virginia' | 'singapore' | 'tokyo' | 'london';

export interface GridCarbonData {
  region: ServerRegion;
  regionName: string;
  carbonIntensity: number; // in gCO2eq/kWh
  renewablePercentage: number; // in %
  fossilPercentage: number; // in %
  status: 'clean' | 'moderate' | 'dirty';
  forecastNext12Hours: { hour: string; intensity: number; isOptimal: boolean }[];
}

export interface ServerInstance {
  id: string;
  name: string;
  provider: 'RunCloud' | 'AWS' | 'DigitalOcean' | 'Hetzner';
  region: ServerRegion;
  ip: string;
  status: 'active' | 'eco-throttled' | 'idle' | 'stopped';
  cpuCores: number;
  cpuUsage: number; // 0 - 100%
  ramUsage: number; // 0 - 100%
  baseTdpWatts: number; // Thermal Design Power in Watts
  pue: number; // Power Usage Effectiveness (typically 1.15 to 1.5)
  hourlyCarbonGrams: number; // gCO2 / hour
  monthlyCostUsd: number;
  scheduledCronJobs: CronJob[];
}

export interface CronJob {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  carbonIntensityReq: 'clean-only' | 'flexible' | 'urgent';
  status: 'scheduled' | 'running' | 'shifted' | 'completed';
  originalRunTime: string;
  optimizedRunTime: string;
  carbonSavedGrams: number;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  type: 'cron-shift' | 'eco-throttle' | 'region-migrate' | 'zombie-idle';
  severity: 'high' | 'medium' | 'low';
  impactDescription: string;
  potentialCo2ReductionGrams: number;
  potentialCostSavingsUsd: number;
  applied: boolean;
  actionPayload?: Record<string, unknown>;
}

export interface ESGCertificateData {
  companyName: string;
  reportingPeriod: string;
  auditDate: string;
  totalKWhConsumed: number;
  totalKgCo2Emitted: number;
  carbonAvoidedKg: number;
  complianceRating: 'AAA' | 'AA' | 'A' | 'B';
  ghgScope2Category: string;
  auditorVerificationId: string;
}
