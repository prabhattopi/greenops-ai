'use client';

import React, { useState } from 'react';
import { 
  Server, 
  Leaf, 
  Zap, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  MessageSquareCode, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  Globe2,
  TrendingDown
} from 'lucide-react';
import { INITIAL_SERVERS, INITIAL_RECOMMENDATIONS } from '@/lib/mock-data';
import { calculateHourlyCarbonGrams, calculateServerPowerWatts, REGIONAL_GRID_REGISTRY } from '@/lib/carbon-engine';
import { ServerInstance, ActionRecommendation, ServerRegion } from '@/types';

export default function DashboardPage() {
  const [servers, setServers] = useState<ServerInstance[]>(INITIAL_SERVERS);
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedRegion, setSelectedRegion] = useState<ServerRegion>('seoul');
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'grid' | 'actions'>('overview');

  // Dynamic calculations
  const totalHourlyCarbonGrams = servers.reduce((acc, s) => acc + calculateHourlyCarbonGrams(s), 0);
  const totalPowerWatts = servers.reduce((acc, s) => acc + calculateServerPowerWatts(s), 0);
  const totalPotentialCarbonSavings = recommendations
    .filter(r => !r.applied)
    .reduce((acc, r) => acc + r.potentialCo2ReductionGrams, 0);

  const handleApplyAction = (recId: string) => {
    setRecommendations(prev => 
      prev.map(r => r.id === recId ? { ...r, applied: true } : r)
    );

    // Apply simulation effect on servers
    if (recId === 'rec-01') {
      // Shifted Seoul jobs
      setServers(prev => prev.map(s => {
        if (s.region === 'seoul') {
          return {
            ...s,
            cpuUsage: Math.max(20, s.cpuUsage - 22),
            scheduledCronJobs: s.scheduledCronJobs.map(c => ({
              ...c,
              status: 'shifted' as const
            }))
          };
        }
        return s;
      }));
    } else if (recId === 'rec-02') {
      // Eco throttle Virginia crawler
      setServers(prev => prev.map(s => {
        if (s.id === 'srv-runcloud-us-03') {
          return {
            ...s,
            status: 'eco-throttled' as const,
            cpuUsage: Math.max(20, s.cpuUsage - 25)
          };
        }
        return s;
      }));
    }
  };

  const handleSimulateSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
    }, 1200);
  };

  const currentGrid = REGIONAL_GRID_REGISTRY[selectedRegion];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">GreenOps AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  RunCloud Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Cloud Carbon & ESG Action Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulateSync}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isSimulatingSync ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSimulatingSync ? 'Syncing Telemetry...' : 'Sync RunCloud API'}</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Grid ESG Monitor: <strong>Active</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner with Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>REAL-TIME CO2 RATE</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {totalHourlyCarbonGrams.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">gCO₂eq / hr</span>
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              -18.4% vs un-optimized baseline
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>ACTIVE POWER DRAW</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {totalPowerWatts.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400 font-medium">Watts (PUE factored)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Across 4 live managed cloud nodes
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>ACTIONABLE SAVINGS</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                {(totalPotentialCarbonSavings / 1000).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">kg CO₂ ready to shave</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {recommendations.filter(r => !r.applied).length} pending green automation actions
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>ESG AUDIT RATING</span>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                AAA
              </span>
              <span className="text-xs text-emerald-400 font-medium">Scope 2 Compliant</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              GHG Protocol Digital Standard
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${activeTab === 'overview' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Overview & Action Engine
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`pb-3 border-b-2 transition ${activeTab === 'servers' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            RunCloud Servers ({servers.length})
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`pb-3 border-b-2 transition ${activeTab === 'grid' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Regional Grid Carbon Map
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Action Engine (The Core Hackathon Requirement!) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-emerald-400" />
                      <span>Autonomous Green Shifter (Data to Action)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Automated workload shifting based on real-time grid renewable percentages.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {recommendations.filter(r => !r.applied).length} Actions Available
                  </span>
                </div>

                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      className={`p-4 rounded-xl border transition ${
                        rec.applied 
                          ? 'bg-slate-950/60 border-emerald-900/40 text-slate-400' 
                          : 'bg-slate-800/40 border-slate-700/70 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-white">{rec.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              rec.severity === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {rec.severity.toUpperCase()} IMPACT
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{rec.impactDescription}</p>
                          <div className="flex items-center space-x-4 pt-1 text-xs text-emerald-400 font-medium">
                            <span>🌱 Shaves {rec.potentialCo2ReductionGrams}g CO₂</span>
                            {rec.potentialCostSavingsUsd > 0 && (
                              <span className="text-slate-400">💰 Saves ${rec.potentialCostSavingsUsd}/mo</span>
                            )}
                          </div>
                        </div>

                        <div>
                          {rec.applied ? (
                            <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Applied</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplyAction(rec.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center space-x-1"
                            >
                              <span>Apply Action</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Cloud Nodes Quickview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>RunCloud Active Node Health & Emissions</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('servers')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    View All Details →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servers.map((srv) => (
                    <div key={srv.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">{srv.name}</p>
                          <p className="text-[11px] text-slate-400">{srv.ip} • {srv.region.toUpperCase()}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {srv.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>CPU Load</span>
                          <span className="text-white font-medium">{srv.cpuUsage}% ({srv.cpuCores} Cores)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${srv.cpuUsage > 75 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                            style={{ width: `${srv.cpuUsage}%` }} 
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/40 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Hourly Footprint:</span>
                        <span className="text-emerald-300 font-bold">{calculateHourlyCarbonGrams(srv)} gCO₂/hr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Regional Grid Status & Clean Forecast */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    <span>Real-time Grid Carbon</span>
                  </h3>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as ServerRegion)}
                    className="bg-slate-800 border border-slate-700 rounded-lg text-xs px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="seoul">Seoul, Korea</option>
                    <option value="frankfurt">Frankfurt, Germany</option>
                    <option value="virginia">N. Virginia, USA</option>
                    <option value="london">London, UK</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Carbon Intensity:</span>
                    <span className={`text-sm font-extrabold ${
                      currentGrid.status === 'clean' ? 'text-emerald-400' : currentGrid.status === 'moderate' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {currentGrid.carbonIntensity} gCO₂/kWh
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Renewable Mix:</span>
                    <span className="text-emerald-400 font-medium">{currentGrid.renewablePercentage}% Clean</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-400" style={{ width: `${currentGrid.renewablePercentage}%` }} />
                    <div className="h-full bg-slate-600" style={{ width: `${currentGrid.fossilPercentage}%` }} />
                  </div>
                </div>

                {/* 12-Hour Forecast Window */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-300">Clean Window Forecast (Next 12h)</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {currentGrid.forecastNext12Hours.slice(0, 8).map((slot, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded-lg text-xs border ${
                          slot.isOptimal 
                            ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300' 
                            : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                        }`}
                      >
                        <p className="font-mono text-[10px]">{slot.hour}</p>
                        <p className="font-bold text-xs mt-0.5">{slot.intensity}</p>
                        <p className="text-[9px] mt-0.5">{slot.isOptimal ? '🌿 Clean' : 'Peak'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick AI & Audit CTA Card */}
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">ESG Reporting & Copilot</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Compliant with GHG Protocol Corporate Standard & EU CSRD Digital Emission regulations.
                </p>
                <div className="space-y-2">
                  <button className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center space-x-2 border border-slate-700 transition cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download ESG Audit Certificate (PDF)</span>
                  </button>
                  <button className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-2 border border-emerald-500/30 transition cursor-pointer">
                    <MessageSquareCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ask Gemini ESG Copilot</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Servers Full Table */}
        {activeTab === 'servers' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">RunCloud Connected Servers & Cron Jobs</h2>
                <p className="text-xs text-slate-400 mt-1">Detailed power parameters, PUE ratings, and scheduled background tasks.</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono">RunCloud Agent v2.4 Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Server Name & IP</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">TDP & PUE</th>
                    <th className="p-3">Current Load</th>
                    <th className="p-3">Hourly CO₂</th>
                    <th className="p-3">Active Cron Jobs</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {servers.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3">
                        <p className="font-semibold text-white">{srv.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{srv.ip}</p>
                      </td>
                      <td className="p-3 uppercase font-medium">{srv.region}</td>
                      <td className="p-3">
                        <p>{srv.baseTdpWatts}W TDP</p>
                        <p className="text-[11px] text-slate-500">PUE {srv.pue}</p>
                      </td>
                      <td className="p-3">
                        <p>CPU: {srv.cpuUsage}%</p>
                        <p className="text-[11px] text-slate-500">RAM: {srv.ramUsage}%</p>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        {calculateHourlyCarbonGrams(srv)} g/hr
                      </td>
                      <td className="p-3">
                        {srv.scheduledCronJobs.length > 0 ? (
                          <div className="space-y-1">
                            {srv.scheduledCronJobs.map(job => (
                              <span 
                                key={job.id} 
                                className={`inline-block text-[10px] px-2 py-0.5 rounded mr-1 ${
                                  job.status === 'shifted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {job.title.substring(0, 20)}...
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None scheduled</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {srv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Grid Map & Renewable Analysis */}
        {activeTab === 'grid' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Global Regional Grid Renewable Intensity</h2>
              <p className="text-xs text-slate-400 mt-1">Comparing carbon intensity across server locations to optimize multi-cloud placement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(REGIONAL_GRID_REGISTRY).map((g) => (
                <div key={g.region} className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{g.regionName}</h4>
                      <p className="text-xs text-slate-400 font-mono uppercase">{g.region}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      g.status === 'clean' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : g.status === 'moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {g.status} Grid
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-white">{g.carbonIntensity}</span>
                    <span className="text-xs text-slate-400">gCO₂eq / kWh</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Renewable Clean Energy</span>
                      <span className="text-emerald-400 font-bold">{g.renewablePercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-400" style={{ width: `${g.renewablePercentage}%` }} />
                      <div className="h-full bg-slate-600" style={{ width: `${g.fossilPercentage}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-400">
                    <p className="font-medium text-slate-300">Clean Window Recommendation:</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      {g.forecastNext12Hours.find(f => f.isOptimal)?.hour || '02:00'} - Off-peak renewable window
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
