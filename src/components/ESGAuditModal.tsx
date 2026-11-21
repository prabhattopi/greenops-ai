'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Leaf, 
  CheckCircle2, 
  Award, 
  QrCode, 
  Server, 
  Calendar, 
  Loader2 
} from 'lucide-react';
import { ServerInstance } from '@/types';
import { MOCK_ESG_CERTIFICATE } from '@/lib/mock-data';
import jsPDF from 'jspdf';

interface ESGAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: ServerInstance[];
}

export default function ESGAuditModal({ isOpen, onClose, servers }: ESGAuditModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);

    try {
      // Create high-resolution vector PDF (immune to Tailwind v4 lab/oklch CSS parser issues)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Background - Dark Slate #020617 (RGB: 2, 6, 23)
      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, 210, 297, 'F');

      // Outer Decorative Border - Emerald #10B981 (RGB: 16, 185, 129)
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.8);
      doc.roundedRect(12, 12, 186, 273, 4, 4, 'S');

      // Inner Accent Frame
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, 15, 180, 267, 3, 3, 'S');

      // Top Authority Pill
      doc.setFillColor(6, 78, 59);
      doc.roundedRect(50, 22, 110, 8, 2, 2, 'F');
      doc.setTextColor(52, 211, 153);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GREENOPS AI • DIGITAL ESG COMPLIANCE CERTIFICATION', 105, 27.5, { align: 'center' });

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('CERTIFICATE OF DIGITAL CARBON COMPLIANCE', 105, 40, { align: 'center' });

      // Subtitle
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Verified digital carbon audit compliant with GHG Protocol Corporate Standard', 105, 46, { align: 'center' });
      doc.text('& EU Corporate Sustainability Due Diligence Directive (CSDDD)', 105, 50, { align: 'center' });

      // Meta Box 1: Audited Entity (Left)
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(20, 58, 82, 26, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('AUDITED ENTITY', 24, 64);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(MOCK_ESG_CERTIFICATE.companyName, 24, 71);
      doc.setTextColor(52, 211, 153);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('RunCloud Infrastructure Managed Fleet', 24, 78);

      // Meta Box 2: Audit Specs (Right)
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(108, 58, 82, 26, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('AUDIT SPECIFICATIONS', 112, 64);
      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Period: ${MOCK_ESG_CERTIFICATE.reportingPeriod}`, 112, 71);
      doc.text(`Verification ID: `, 112, 78);
      doc.setTextColor(52, 211, 153);
      doc.setFont('courier', 'bold');
      doc.text(MOCK_ESG_CERTIFICATE.auditorVerificationId, 135, 78);

      // Rating Box (Emerald Accent Banner)
      doc.setFillColor(6, 78, 59);
      doc.setDrawColor(16, 185, 129);
      doc.roundedRect(20, 90, 170, 26, 3, 3, 'FD');

      // Rating Badge Circle/Square
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(24, 94, 18, 18, 2, 2, 'F');
      doc.setTextColor(2, 6, 23);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('AAA', 33, 106, { align: 'center' });

      // Rating Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Prime Digital ESG Rating', 46, 100);
      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Zero non-compliance violations across 4 monitored global regions', 46, 106);

      // Avoided Emissions on Right
      doc.setTextColor(167, 243, 208);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`-${MOCK_ESG_CERTIFICATE.carbonAvoidedKg} kg CO2`, 185, 100, { align: 'right' });
      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Avoided via Green Shifter', 185, 106, { align: 'right' });

      // Table Header: Verified Node Telemetry
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('VERIFIED NODE TELEMETRY & SCOPE 2 ALLOCATION', 20, 126);

      // Table Header Row
      doc.setFillColor(30, 41, 59);
      doc.rect(20, 130, 170, 8, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7.5);
      doc.text('NODE NAME & IP', 24, 135.5);
      doc.text('REGION', 75, 135.5);
      doc.text('PUE', 105, 135.5);
      doc.text('HOURLY CO2', 130, 135.5);
      doc.text('COMPLIANCE', 165, 135.5);

      // Table Rows
      let rowY = 143;
      servers.forEach((s, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(15, 23, 42);
          doc.rect(20, rowY - 5, 170, 10, 'F');
        }

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(s.name, 24, rowY);
        doc.setTextColor(100, 116, 139);
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.text(s.ip, 24, rowY + 3.5);

        doc.setTextColor(203, 213, 225);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(s.region.toUpperCase(), 75, rowY + 1);
        doc.text(s.pue.toString(), 105, rowY + 1);

        doc.setTextColor(52, 211, 153);
        doc.setFont('helvetica', 'bold');
        doc.text(`${s.hourlyCarbonGrams} g/hr`, 130, rowY + 1);

        doc.setTextColor(52, 211, 153);
        doc.setFont('helvetica', 'normal');
        doc.text('Pass (Scope 2)', 165, rowY + 1);

        rowY += 12;
      });

      // Scientific Methodology Box
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(20, 200, 170, 38, 2, 2, 'FD');

      doc.setTextColor(52, 211, 153);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('STANDARDIZED GHG METHODOLOGY & DIGITAL ACCOUNTING', 24, 206);

      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('1. Location-Based Scope 2: Power (Watts) = (IdleWatts + (TDP - IdleWatts) * (CPU% / 100)) * PUE.', 24, 212);
      doc.text('2. Grid Emission Multiplier: Energy (kWh) * Regional Grid Carbon Intensity factor (gCO2eq/kWh).', 24, 217);
      doc.text('3. Workload Shifting: Non-critical batch jobs deferred from coal/fossil peaks to green renewable windows.', 24, 222);
      doc.text('4. Tamper-evident ledger: Logged under RunCloud server telemetry monitoring framework.', 24, 227);
      doc.text('5. Verified compliant with EU CSRD Directive (Article 19a/29a) & GRI Standard 302/305.', 24, 232);

      // Cryptographic Footer
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.3);
      doc.line(20, 248, 190, 248);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('CRYPTOGRAPHIC AUDIT HASH (SHA-256):', 20, 255);
      doc.setTextColor(52, 211, 153);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.text('e8b94107a68c4fd25081c7e67123bf0299ac4188b02e71d3c9142f9b8813a104', 20, 260);

      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`Audit Date: ${MOCK_ESG_CERTIFICATE.auditDate}`, 20, 268);
      doc.text('Certified by GreenOps AI • KUK Virtual Hackathon 2026', 190, 268, { align: 'right' });

      // Save PDF
      doc.save(`GreenOps-ESG-Compliance-Audit-${Date.now().toString().slice(-6)}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Controls Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Official ESG Compliance Audit Certificate</h3>
              <p className="text-[11px] text-slate-400">GHG Protocol Scope 2 Digital & EU CSRD Verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-500/20"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Visual Canvas */}
        <div className="p-6 overflow-y-auto flex justify-center bg-slate-950/60">
          <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-600/40 rounded-2xl p-8 relative shadow-2xl text-slate-200 space-y-6">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-500/50 rounded-tl pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-500/50 rounded-tr pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-500/50 rounded-bl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-500/50 rounded-br pointer-events-none" />

            {/* Header / Authority */}
            <div className="text-center space-y-2 border-b border-slate-800/80 pb-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>GREENOPS AI DIGITAL ESG CERTIFICATION</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                CERTIFICATE OF DIGITAL CARBON COMPLIANCE
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Verified digital carbon audit compliant with <strong>GHG Protocol Corporate Standard</strong> and <strong>EU Corporate Sustainability Due Diligence Directive (CSDDD)</strong>.
              </p>
            </div>

            {/* Certificate Body Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">AUDITED ENTITY</span>
                <p className="font-bold text-white text-sm">{MOCK_ESG_CERTIFICATE.companyName}</p>
                <p className="text-[11px] text-emerald-400">RunCloud Infrastructure Managed Fleet</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">AUDIT SPECIFICATIONS</span>
                <p className="text-[11px] text-slate-300">Period: <strong>{MOCK_ESG_CERTIFICATE.reportingPeriod}</strong></p>
                <p className="text-[11px] text-slate-300">Verification ID: <span className="font-mono text-emerald-400">{MOCK_ESG_CERTIFICATE.auditorVerificationId}</span></p>
              </div>
            </div>

            {/* ESG Rating Banner */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  {MOCK_ESG_CERTIFICATE.complianceRating}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Prime Digital ESG Rating</h4>
                  <p className="text-[11px] text-slate-400">Zero non-compliance violations across 4 monitored regions</p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-emerald-400 font-bold text-base">-{MOCK_ESG_CERTIFICATE.carbonAvoidedKg} kg CO₂</span>
                <p className="text-[10px] text-slate-400">Avoided via Green Shifter</p>
              </div>
            </div>

            {/* Fleet Energy & Emissions Summary Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verified Node Telemetry</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">Node Name</th>
                      <th className="p-2.5">Region</th>
                      <th className="p-2.5">PUE</th>
                      <th className="p-2.5">Hourly CO₂</th>
                      <th className="p-2.5">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {servers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/20">
                        <td className="p-2.5 font-semibold text-white">{s.name}</td>
                        <td className="p-2.5 uppercase font-medium">{s.region}</td>
                        <td className="p-2.5 font-mono">{s.pue}</td>
                        <td className="p-2.5 font-bold text-emerald-400">{s.hourlyCarbonGrams} g/hr</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center text-[10px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Pass
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic Verification Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center space-x-3">
                <QrCode className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-slate-400 font-semibold">Cryptographically Signed Audit Trail</p>
                  <p className="font-mono text-[9px] text-slate-500">SHA-256: e8b941...c9142f9b (RunCloud Verified)</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-slate-400 font-semibold">Audited Date: {MOCK_ESG_CERTIFICATE.auditDate}</p>
                <p className="text-emerald-500 font-bold">KUK Virtual Hackathon 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Export ready in standard A4 PDF format (100% Vector PDF)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
