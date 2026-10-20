import React, { useState } from 'react';
import { Translations } from '../../i18n/translations';
import { 
  Crown, 
  Sparkles, 
  Sliders, 
  Check, 
  Coins, 
  Layers, 
  Radio, 
  ShieldAlert,
  Save
} from 'lucide-react';

interface SeatsTemplateConfigProps {
  t: Translations;
  bossMicEnabled: boolean;
  bossMicBasePrice: number;
  onUpdateBossMic: (enabled: boolean, basePrice: number) => void;
}

export const SeatsTemplateConfig: React.FC<SeatsTemplateConfigProps> = ({
  t,
  bossMicEnabled,
  bossMicBasePrice,
  onUpdateBossMic,
}) => {
  const [enabled, setEnabled] = useState(bossMicEnabled);
  const [price, setPrice] = useState(bossMicBasePrice);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Template toggles
  const [templates, setTemplates] = useState({
    chat12: true,
    dating8: true,
    pkSong8: true,
    gaming4: true,
  });

  const handleSave = () => {
    onUpdateBossMic(enabled, price);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white">{t.specialSeatsTitle}</h2>
        <p className="text-xs text-slate-400">{t.specialSeatsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Boss Mic (Pos 1001) Auction Engine Configuration */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Boss Seat Engine (`boss_mic` - Pos 1001)</h3>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-white block">{t.enableBossSeat}</span>
              <span className="text-[11px] text-slate-400">
                Allows VIP supporters to bid coins for the premier Boss throne seat
              </span>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.bossSeatPrice}
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-mono">
                COINS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum bid threshold before seat can be taken from current boss
            </p>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-lg text-xs space-y-1 text-slate-300">
            <span className="font-bold text-purple-300 block">Seat Position Mapping Architecture:</span>
            <div className="font-mono text-[11px] text-slate-400 space-y-0.5">
              <div>Pos 1000: <span className="text-amber-400">anchor_mic</span> (Room Host Permanent Throne)</div>
              <div>Pos 1001: <span className="text-purple-400">boss_mic</span> (VIP Supporter Dynamic Auction)</div>
              <div>Pos 1..12: <span className="text-emerald-400">mic_list</span> (Standard Voice Seats Matrix)</div>
            </div>
          </div>
        </div>

        {/* Section 2: Room Templates & Active Layout Modes */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">{t.roomTemplates}</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-white block">{t.chatRoom}</span>
                <span className="text-[11px] text-slate-400">Standard 3x4 circular emerald seats matrix</span>
              </div>
              <input
                type="checkbox"
                checked={templates.chat12}
                onChange={(e) => setTemplates({ ...templates, chat12: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-white block">{t.datingRoom}</span>
                <span className="text-[11px] text-slate-400">2x4 seats pairing mode with heart connectors</span>
              </div>
              <input
                type="checkbox"
                checked={templates.dating8}
                onChange={(e) => setTemplates({ ...templates, dating8: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-white block">{t.pkSongRoom}</span>
                <span className="text-[11px] text-slate-400">Split team Red vs Blue PK score progress bar</span>
              </div>
              <input
                type="checkbox"
                checked={templates.pkSong8}
                onChange={(e) => setTemplates({ ...templates, pkSong8: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-white block">{t.gamingRoom}</span>
                <span className="text-[11px] text-slate-400">4 corner seats with central Ludo / webview frame</span>
              </div>
              <input
                type="checkbox"
                checked={templates.gaming4}
                onChange={(e) => setTemplates({ ...templates, gaming4: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Configuration Deployed!' : t.saveConfig}</span>
        </button>
      </div>
    </div>
  );
};
