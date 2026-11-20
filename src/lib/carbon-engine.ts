import { GridCarbonData, ServerInstance, ServerRegion } from '@/types';

// Regional Grid Data based on real-world average emissions & live renewable cycles
export const REGIONAL_GRID_REGISTRY: Record<ServerRegion, GridCarbonData> = {
  seoul: {
    region: 'seoul',
    regionName: 'Seoul, South Korea (KR)',
    carbonIntensity: 418, // gCO2/kWh (coal/gas mixed)
    renewablePercentage: 14,
    fossilPercentage: 86,
    status: 'dirty',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 430, isOptimal: false },
      { hour: '19:00', intensity: 445, isOptimal: false },
      { hour: '20:00', intensity: 450, isOptimal: false },
      { hour: '21:00', intensity: 435, isOptimal: false },
      { hour: '22:00', intensity: 410, isOptimal: false },
      { hour: '23:00', intensity: 380, isOptimal: false },
      { hour: '00:00', intensity: 350, isOptimal: true },
      { hour: '01:00', intensity: 330, isOptimal: true },
      { hour: '02:00', intensity: 320, isOptimal: true },
      { hour: '03:00', intensity: 310, isOptimal: true },
      { hour: '04:00', intensity: 315, isOptimal: true },
      { hour: '05:00', intensity: 340, isOptimal: false },
    ],
  },
  frankfurt: {
    region: 'frankfurt',
    regionName: 'Frankfurt, Germany (EU-Central)',
    carbonIntensity: 295, // gCO2/kWh
    renewablePercentage: 58,
    fossilPercentage: 42,
    status: 'moderate',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 320, isOptimal: false },
      { hour: '19:00', intensity: 340, isOptimal: false },
      { hour: '20:00', intensity: 330, isOptimal: false },
      { hour: '21:00', intensity: 300, isOptimal: false },
      { hour: '22:00', intensity: 270, isOptimal: true },
      { hour: '23:00', intensity: 240, isOptimal: true },
      { hour: '00:00', intensity: 220, isOptimal: true },
      { hour: '01:00', intensity: 210, isOptimal: true },
      { hour: '02:00', intensity: 195, isOptimal: true },
      { hour: '03:00', intensity: 190, isOptimal: true },
      { hour: '04:00', intensity: 210, isOptimal: true },
      { hour: '05:00', intensity: 250, isOptimal: false },
    ],
  },
  virginia: {
    region: 'virginia',
    regionName: 'N. Virginia, USA (us-east-1)',
    carbonIntensity: 365,
    renewablePercentage: 28,
    fossilPercentage: 72,
    status: 'dirty',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 380, isOptimal: false },
      { hour: '19:00', intensity: 395, isOptimal: false },
      { hour: '20:00', intensity: 390, isOptimal: false },
      { hour: '21:00', intensity: 370, isOptimal: false },
      { hour: '22:00', intensity: 340, isOptimal: false },
      { hour: '23:00', intensity: 310, isOptimal: true },
      { hour: '00:00', intensity: 290, isOptimal: true },
      { hour: '01:00', intensity: 280, isOptimal: true },
      { hour: '02:00', intensity: 275, isOptimal: true },
      { hour: '03:00', intensity: 270, isOptimal: true },
      { hour: '04:00', intensity: 285, isOptimal: true },
      { hour: '05:00', intensity: 320, isOptimal: false },
    ],
  },
  singapore: {
    region: 'singapore',
    regionName: 'Singapore (ap-southeast-1)',
    carbonIntensity: 395,
    renewablePercentage: 8,
    fossilPercentage: 92,
    status: 'dirty',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 410, isOptimal: false },
      { hour: '19:00', intensity: 415, isOptimal: false },
      { hour: '20:00', intensity: 405, isOptimal: false },
      { hour: '21:00', intensity: 395, isOptimal: false },
      { hour: '22:00', intensity: 385, isOptimal: false },
      { hour: '23:00', intensity: 380, isOptimal: false },
      { hour: '00:00', intensity: 375, isOptimal: true },
      { hour: '01:00', intensity: 370, isOptimal: true },
      { hour: '02:00', intensity: 365, isOptimal: true },
      { hour: '03:00', intensity: 360, isOptimal: true },
      { hour: '04:00', intensity: 365, isOptimal: true },
      { hour: '05:00', intensity: 380, isOptimal: false },
    ],
  },
  tokyo: {
    region: 'tokyo',
    regionName: 'Tokyo, Japan (ap-northeast-1)',
    carbonIntensity: 435,
    renewablePercentage: 22,
    fossilPercentage: 78,
    status: 'dirty',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 450, isOptimal: false },
      { hour: '19:00', intensity: 460, isOptimal: false },
      { hour: '20:00', intensity: 440, isOptimal: false },
      { hour: '21:00', intensity: 420, isOptimal: false },
      { hour: '22:00', intensity: 390, isOptimal: false },
      { hour: '23:00', intensity: 370, isOptimal: true },
      { hour: '00:00', intensity: 350, isOptimal: true },
      { hour: '01:00', intensity: 340, isOptimal: true },
      { hour: '02:00', intensity: 335, isOptimal: true },
      { hour: '03:00', intensity: 330, isOptimal: true },
      { hour: '04:00', intensity: 345, isOptimal: true },
      { hour: '05:00', intensity: 375, isOptimal: false },
    ],
  },
  london: {
    region: 'london',
    regionName: 'London, UK (eu-west-2)',
    carbonIntensity: 185,
    renewablePercentage: 72,
    fossilPercentage: 28,
    status: 'clean',
    forecastNext12Hours: [
      { hour: '18:00', intensity: 210, isOptimal: false },
      { hour: '19:00', intensity: 220, isOptimal: false },
      { hour: '20:00', intensity: 200, isOptimal: false },
      { hour: '21:00', intensity: 180, isOptimal: true },
      { hour: '22:00', intensity: 160, isOptimal: true },
      { hour: '23:00', intensity: 140, isOptimal: true },
      { hour: '00:00', intensity: 125, isOptimal: true },
      { hour: '01:00', intensity: 115, isOptimal: true },
      { hour: '02:00', intensity: 110, isOptimal: true },
      { hour: '03:00', intensity: 105, isOptimal: true },
      { hour: '04:00', intensity: 120, isOptimal: true },
      { hour: '05:00', intensity: 150, isOptimal: false },
    ],
  },
};

/**
 * Calculates real-time power in Watts using GHG Protocol standard methodology
 * Power = (IdleWatts + (TDP - IdleWatts) * (CPU% / 100)) * PUE
 */
export function calculateServerPowerWatts(server: Pick<ServerInstance, 'baseTdpWatts' | 'cpuUsage' | 'pue'>): number {
  const idlePowerFactor = 0.35; // Standard 35% of TDP when idle
  const idleWatts = server.baseTdpWatts * idlePowerFactor;
  const dynamicWatts = (server.baseTdpWatts - idleWatts) * (server.cpuUsage / 100);
  const totalInternalWatts = idleWatts + dynamicWatts;
  return totalInternalWatts * server.pue;
}

/**
 * Calculates hourly carbon emissions in grams (gCO2eq / hour)
 * Carbon = Energy(kWh) * GridCarbonIntensity(gCO2eq/kWh)
 */
export function calculateHourlyCarbonGrams(server: Pick<ServerInstance, 'baseTdpWatts' | 'cpuUsage' | 'pue' | 'region'>): number {
  const powerWatts = calculateServerPowerWatts(server);
  const energyKwhPerHour = powerWatts / 1000;
  const gridIntensity = REGIONAL_GRID_REGISTRY[server.region]?.carbonIntensity ?? 400;
  return Number((energyKwhPerHour * gridIntensity).toFixed(2));
}

/**
 * Calculates the exact carbon savings if a batch workload is shifted
 * from peak dirty hours to clean hours.
 */
export function calculateWorkloadShiftSavings(
  durationMinutes: number,
  baseWatts: number,
  currentIntensity: number,
  targetCleanIntensity: number
): number {
  const hours = durationMinutes / 60;
  const energyKwh = (baseWatts / 1000) * hours;
  const savingsGrams = energyKwh * (currentIntensity - targetCleanIntensity);
  return Math.max(0, Number(savingsGrams.toFixed(2)));
}
