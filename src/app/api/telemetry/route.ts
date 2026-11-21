import { NextResponse } from 'next/server';
import { INITIAL_SERVERS } from '@/lib/mock-data';
import { REGIONAL_GRID_REGISTRY, calculateHourlyCarbonGrams, calculateServerPowerWatts } from '@/lib/carbon-engine';

export async function GET() {
  // Simulate live telemetry drift (+- 2% jitter on CPU to reflect live server monitoring)
  const dynamicServers = INITIAL_SERVERS.map((server) => {
    const jitter = Math.floor(Math.random() * 5) - 2;
    const cpuUsage = Math.min(100, Math.max(10, server.cpuUsage + jitter));
    const powerWatts = calculateServerPowerWatts({
      baseTdpWatts: server.baseTdpWatts,
      cpuUsage,
      pue: server.pue,
    });

    const hourlyCarbonGrams = calculateHourlyCarbonGrams({
      baseTdpWatts: server.baseTdpWatts,
      cpuUsage,
      pue: server.pue,
      region: server.region,
    });

    return {
      ...server,
      cpuUsage,
      powerWatts,
      hourlyCarbonGrams,
    };
  });

  const totalHourlyCarbonGrams = dynamicServers.reduce((sum, s) => sum + s.hourlyCarbonGrams, 0);
  const totalPowerWatts = dynamicServers.reduce((sum, s) => sum + s.powerWatts, 0);

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    provider: 'RunCloud Agent Telemetry v2.4',
    totalHourlyCarbonGrams: Number(totalHourlyCarbonGrams.toFixed(2)),
    totalPowerWatts: Math.round(totalPowerWatts),
    servers: dynamicServers,
    regionalGrids: REGIONAL_GRID_REGISTRY,
  });
}
