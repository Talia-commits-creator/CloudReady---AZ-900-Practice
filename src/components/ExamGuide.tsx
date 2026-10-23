import React from 'react';
import {
  FileText,
  Shield,
  Layers,
  HardDrive,
  Lock,
  ExternalLink,
  Target,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { DOMAIN_LIST } from '../data/domains';

export const ExamGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Blueprint Header */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#0C4FD7] font-bold">
            Official Exam Blueprint
          </span>
          <span className="text-[#8B94A0]">•</span>
          <span className="text-xs font-mono text-[#58616E]">Microsoft AZ-900</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
          Microsoft Azure Fundamentals Reference Guide
        </h1>
        <p className="text-sm text-[#58616E] mt-2 max-w-2xl leading-relaxed">
          The AZ-900 exam evaluates foundational cloud concepts, core architectural services, and management and governance guardrails. Review the high-yield reference tables below.
        </p>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F3F1EC]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Passing Score</span>
            <span className="font-display text-xl font-bold text-[#12151A]">700 / 1000</span>
            <span className="text-[11px] text-[#58616E] block">Scaled scoring</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Exam Duration</span>
            <span className="font-display text-xl font-bold text-[#12151A]">45–65 mins</span>
            <span className="text-[11px] text-[#58616E] block">~35–45 questions</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Question Types</span>
            <span className="font-display text-xl font-bold text-[#12151A]">Multiple Choice</span>
            <span className="text-[11px] text-[#58616E] block">Scenario single select</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Negative Marking</span>
            <span className="font-display text-xl font-bold text-[#1A7B54]">None</span>
            <span className="text-[11px] text-[#58616E] block">Answer every question</span>
          </div>
        </div>
      </div>

      {/* Domain Weights Breakdown */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-[#12151A]">
          Official Domain Distribution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOMAIN_LIST.map((domain) => (
            <div
              key={domain.id}
              className="p-5 rounded-2xl border border-[#E8E5DC] bg-[#FAF9F6] space-y-2 flex flex-col justify-between"
            >
              <div>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: domain.accentBg, color: domain.color }}
                >
                  {domain.weightRange}
                </span>
                <h3 className="font-display text-base font-bold text-[#12151A] mt-2">
                  {domain.name}
                </h3>
                <p className="text-xs text-[#58616E] mt-1 leading-relaxed">
                  {domain.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E5DC] text-[11px] text-[#8B94A0] font-mono">
                Official syllabus scope
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Responsibility Table */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0C4FD7] font-bold">
              Must-Know Concept
            </span>
            <h2 className="font-display text-xl font-bold text-[#12151A]">
              Shared Responsibility Matrix
            </h2>
          </div>
          <a
            href="https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0C4FD7] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Learn Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs text-[#58616E] leading-relaxed">
          Guaranteed to appear in 2–3 questions on the real exam. Always remember who manages what across service models.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#E8E5DC] rounded-2xl overflow-hidden">
            <thead className="bg-[#FAF9F6] text-[#12151A] font-mono uppercase text-[11px] border-b border-[#E8E5DC]">
              <tr>
                <th className="p-3.5">Responsibility Layer</th>
                <th className="p-3.5">On-Premises</th>
                <th className="p-3.5">IaaS (e.g. VMs)</th>
                <th className="p-3.5">PaaS (e.g. App Service)</th>
                <th className="p-3.5">SaaS (e.g. M365)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F1EC]">
              <tr>
                <td className="p-3.5 font-bold text-[#12151A]">Data & Access (Identities)</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#12151A]">Application Code</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#12151A]">Operating System (OS Patching)</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#12151A]">Network Controls</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#58616E]">Shared</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#12151A]">Physical Datacenter & Host Hardware</td>
                <td className="p-3.5 text-[#C04328] font-bold">Customer</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
                <td className="p-3.5 text-[#1A7B54] font-bold">Microsoft</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Redundancy Comparison */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-[#12151A]">
          Storage Redundancy Comparison
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-[#E8E5DC] bg-[#FAF9F6] space-y-2">
            <span className="font-bold text-[#12151A] font-mono block">LRS (Locally Redundant)</span>
            <p className="text-[#58616E] leading-relaxed">
              3 copies of data inside a single physical datacenter in the primary region. Lowest cost, but vulnerable to datacenter-wide fires/floods.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#CCE9DB] bg-[#EAF6F0] space-y-2">
            <span className="font-bold text-[#1A7B54] font-mono block">ZRS (Zone Redundant)</span>
            <p className="text-[#1A7B54] leading-relaxed">
              3 copies synchronously copied across 3 separate physical Availability Zones in the primary region. Protects against single datacenter outages.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#D0E0FD] bg-[#EFF4FF] space-y-2">
            <span className="font-bold text-[#0C4FD7] font-mono block">GRS (Geo-Redundant)</span>
            <p className="text-[#0C4FD7] leading-relaxed">
              3 copies in primary region (LRS), plus asynchronous replication of 3 copies to a paired secondary region &gt;300 miles away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
