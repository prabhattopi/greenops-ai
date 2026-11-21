'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Check, Terminal, ExternalLink, X, ShieldAlert, Zap, Loader2 } from 'lucide-react';

export interface ActionExecutionResult {
  status: string;
  actionId: string;
  title: string;
  targetServer: {
    id: string;
    name: string;
    ip: string;
    region: string;
  };
  runCloudWebhook: {
    endpoint: string;
    method: string;
    dispatchedAt: string;
    httpStatus: number;
    response: Record<string, unknown>;
  };
  generatedScript: string;
  carbonAvoidedGrams: number;
  costSavingsUsd: number;
  auditLogId: string;
}

interface ActionExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ActionExecutionResult | null;
  isLoading: boolean;
}

export default function ActionExecutionModal({
  isOpen,
  onClose,
  result,
  isLoading,
}: ActionExecutionModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (isOpen && isLoading) {
      setActiveStep(1);
      const t1 = setTimeout(() => setActiveStep(2), 700);
      const t2 = setTimeout(() => setActiveStep(3), 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (!isLoading && result) {
      setActiveStep(3);
    }
  }, [isOpen, isLoading, result]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (result?.generatedScript) {
      navigator.clipboard.writeText(result.generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Autonomous Green-Shift Execution</h3>
              <p className="text-[11px] text-slate-400">RunCloud Webhook Dispatcher & Server Reconfiguration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Pipeline Progress Stages */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2.5 rounded-xl border text-center transition ${
              activeStep >= 1 ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {activeStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span className="font-bold text-[11px]">1. Grid Check</span>
              </div>
              <p className="text-[10px] text-slate-400">Detected Dirty Peak</p>
            </div>

            <div className={`p-2.5 rounded-xl border text-center transition ${
              activeStep >= 2 ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {activeStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : activeStep === 2 ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <div className="w-3.5 h-3.5" />}
                <span className="font-bold text-[11px]">2. Webhook API</span>
              </div>
              <p className="text-[10px] text-slate-400">RunCloud Dispatched</p>
            </div>

            <div className={`p-2.5 rounded-xl border text-center transition ${
              activeStep >= 3 ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {activeStep >= 3 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5" />}
                <span className="font-bold text-[11px]">3. Reconfigured</span>
              </div>
              <p className="text-[10px] text-slate-400">ESG Audit Logged</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-slate-300 font-medium">Communicating with RunCloud server agent...</p>
              <p className="text-[11px] text-slate-500 font-mono">POST /api/v2/servers/cron/reschedule</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Impact Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Action Successful</span>
                  <p className="font-semibold text-white text-xs mt-0.5">{result.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target Node: <strong className="text-slate-200">{result.targetServer.name}</strong> ({result.targetServer.ip})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold text-sm">-{result.carbonAvoidedGrams}g CO₂</span>
                  <p className="text-[10px] text-slate-400">Avoided Emissions</p>
                </div>
              </div>

              {/* RunCloud Webhook Dispatcher Log */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-[11px] text-slate-200 flex items-center">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                    RunCloud Webhook Payload (HTTP 200 OK)
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{result.auditLogId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto space-y-1">
                  <p className="text-emerald-400 font-bold">{result.runCloudWebhook.method} {result.runCloudWebhook.endpoint}</p>
                  <p className="text-slate-500">Status: {result.runCloudWebhook.httpStatus} OK • Dispatched: {new Date(result.runCloudWebhook.dispatchedAt).toLocaleTimeString()}</p>
                  <p className="text-slate-400">{JSON.stringify(result.runCloudWebhook.response)}</p>
                </div>
              </div>

              {/* Linux Server Script Generated */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] text-slate-200 flex items-center">
                    <Terminal className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                    Linux Crontab / Systemd Reconfiguration Script
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Script' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[10px] leading-relaxed border border-slate-800 overflow-x-auto selection:bg-emerald-500 selection:text-white">
                  {result.generatedScript}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-red-400">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2" />
              <p>Action execution encountered an error.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Audit Verified by <strong className="text-emerald-400">GHG Scope 2 Digital Engine</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
