import React, { useState } from 'react';
import { AgencyData } from '../../types';
import { 
  Building2, 
  Users, 
  Clock, 
  Target, 
  Percent, 
  TrendingUp, 
  Plus, 
  Award, 
  DollarSign 
} from 'lucide-react';

interface AgencyPortalProps {
  agencies: AgencyData[];
  onAddAgency?: (agency: AgencyData) => void;
}

export const AgencyPortal: React.FC<AgencyPortalProps> = ({ agencies }) => {
  const [selectedAgency, setSelectedAgency] = useState<AgencyData>(agencies[0]);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>REGISTERED AGENCIES</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{agencies.length}</div>
          <div className="text-xs text-purple-400 mt-1">Tier-1 & Tier-2 Guilds</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>TOTAL MANAGED HOSTS</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {agencies.reduce((acc, a) => acc + a.activeHostsCount, 0)}
          </div>
          <div className="text-xs text-blue-400 mt-1">Contracted Live Creators</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>MONTHLY VOICE HOURS</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {agencies.reduce((acc, a) => acc + a.monthlyLiveHours, 0).toLocaleString()} hrs
          </div>
          <div className="text-xs text-emerald-400 mt-1">Target fulfillment: 88.4%</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>PENDING COMMISSION</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${agencies.reduce((acc, a) => acc + a.pendingCommissionUsd, 0).toLocaleString()}
          </div>
          <div className="text-xs text-amber-400 mt-1">Settlement Cycle: Monthly</div>
        </div>
      </div>

      {/* Main Split: Agency Directory & Detailed Guild Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Agency Guilds</h3>
            <span className="text-xs text-slate-400">Recruitment & Performance</span>
          </div>

          <div className="mt-4 space-y-3">
            {agencies.map((agency) => {
              const isSelected = selectedAgency.id === agency.id;
              const progressPct = Math.min(
                100,
                Math.round((agency.currentDiamonds / agency.totalDiamondsTarget) * 100)
              );

              return (
                <div
                  key={agency.id}
                  onClick={() => setSelectedAgency(agency)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{agency.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                          {agency.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Lead Manager: <span className="text-slate-300">{agency.leadManager}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {(agency.commissionRate * 100).toFixed(0)}% Rate
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {agency.activeHostsCount} active hosts
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Monthly Diamonds Target</span>
                      <span className="font-mono text-cyan-400">
                        {agency.currentDiamonds.toLocaleString()} / {agency.totalDiamondsTarget.toLocaleString()} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Agency Deep Dive */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="pb-4 border-b border-slate-800 flex items-start justify-between">
            <div>
              <h4 className="text-base font-bold text-white">{selectedAgency.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Recruitment Code: <span className="font-mono text-purple-300 font-bold">{selectedAgency.code}</span></p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
              Contract Verified
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[10px]">TOTAL LIVE HOURS</span>
                <span className="text-white font-bold text-base">{selectedAgency.monthlyLiveHours} hrs</span>
                <span className="text-slate-400 block text-[10px] mt-1">Average 38 hrs/host</span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 block text-[10px]">ESTIMATED PAYOUT</span>
                <span className="text-emerald-400 font-bold text-base">
                  ${selectedAgency.pendingCommissionUsd.toLocaleString()}
                </span>
                <span className="text-slate-400 block text-[10px] mt-1">USDT-TRC20 Auto-Transfer</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Recruitment & Host Onboarding Rules
              </h5>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>New hosts must complete 30 hours of monthly streaming to qualify.</li>
                <li>LiveKit room background audio quality must meet Opus DTX standards.</li>
                <li>Diamond target bonus tier unlocks at 10,000,000 diamonds (+2.5% rate).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
