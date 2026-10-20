import React, { useState } from 'react';
import { livekitTokenService, GeneratedTokenResponse } from '../../../backend/src/services/livekitTokenService';
import { 
  Cpu, 
  Wifi, 
  Key, 
  Copy, 
  Check, 
  Shield, 
  Activity, 
  Radio, 
  Terminal,
  Server
} from 'lucide-react';

export const LiveKitTelemetry: React.FC = () => {
  // Token Generator form state
  const [roomName, setRoomName] = useState('16701257');
  const [identity, setIdentity] = useState('usr_engineer_99');
  const [name, setName] = useState('Senior Architect');
  const [role, setRole] = useState<'host' | 'speaker' | 'listener' | 'admin'>('speaker');
  const [tokenResult, setTokenResult] = useState<GeneratedTokenResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    const result = livekitTokenService.generateToken({
      roomName,
      identity,
      name,
      role,
    });
    setTokenResult(result);
  };

  const copyToken = () => {
    if (tokenResult?.token) {
      navigator.clipboard.writeText(tokenResult.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cluster Node Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>LIVEKIT SFU NODE</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">sfu-us-east-01</div>
          <div className="text-xs text-emerald-400 mt-1">Status: Healthy (Uptime: 99.99%)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>ICE / WEBRTC CHANNELS</span>
            <Wifi className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">TCP 7881 / UDP 7882</div>
          <div className="text-xs text-blue-400 mt-1">STUN/TURN Direct Binding</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>AUDIO CODEC & BITRATE</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">Opus 48kHz (DTX)</div>
          <div className="text-xs text-amber-400 mt-1">Dynamic Bitrate Adaptation (64 kbps)</div>
        </div>
      </div>

      {/* Main Split: LiveKit Token Generator Tool & WebRTC Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Generator */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">LiveKit JWT Token Provisioner</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">@livekit/server-sdk</span>
          </div>

          <form onSubmit={handleGenerateToken} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Name / ID</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Grant</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                >
                  <option value="host">Host (canPublish & Admin)</option>
                  <option value="speaker">Speaker (canPublish)</option>
                  <option value="listener">Listener (canSubscribe only)</option>
                  <option value="admin">Super Admin (full control)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User Identity (UUID)</label>
                <input
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Sign & Generate Access Token
            </button>
          </form>

          {tokenResult && (
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">Signed LiveKit JWT</span>
                <button
                  onClick={copyToken}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300 break-all select-all max-h-24 overflow-y-auto">
                {tokenResult.token}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>canPublish: {tokenResult.permissions.canPublish ? 'TRUE' : 'FALSE'}</span>
                <span>canSubscribe: TRUE</span>
                <span>admin: {tokenResult.permissions.roomAdmin ? 'TRUE' : 'FALSE'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live SFU Architecture Specs */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">LiveKit SFU Pipeline Topology</h3>
            <span className="text-xs font-mono text-purple-400">Zero-Boilerplate</span>
          </div>

          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-white block mb-1">1. Audio Selective Forwarding Unit (SFU)</span>
              <p className="text-slate-400 leading-relaxed">
                LiveKit receives raw Opus audio streams from mic-occupied seats, performs server-authoritative vad (Voice Activity Detection), and forwards streams to up to 10,000 concurrent listeners per room with sub-100ms latency.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-white block mb-1">2. Discontinuous Transmission (DTX) & Dynacast</span>
              <p className="text-slate-400 leading-relaxed">
                When a speaker pauses or is silent, LiveKit's DTX mode stops transmission packets, cutting server and mobile client data consumption by over 65%.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-white block mb-1">3. Dynamic Role Escalation</span>
              <p className="text-slate-400 leading-relaxed">
                When a user transitions from listener to speaker by taking a seat, MIZO backend issues an atomic grant update to LiveKit via <code className="text-amber-400 font-mono">RoomServiceClient.updateParticipant</code> without dropping the WebRTC peer connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
