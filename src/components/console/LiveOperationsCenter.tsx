import React, { useState, useEffect } from 'react';
import { VoiceRoom } from '../../types';
import { 
  Radio, 
  Users, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  ShieldAlert, 
  PowerOff, 
  Activity, 
  Lock, 
  Unlock, 
  UserX,
  Server
} from 'lucide-react';

interface LiveOperationsCenterProps {
  rooms: VoiceRoom[];
  onTerminateRoom: (roomId: string) => void;
  onToggleSeatMute: (roomId: string, seatIndex: number) => void;
  onKickParticipant: (roomId: string, seatIndex: number) => void;
  onToggleSeatLock: (roomId: string, seatIndex: number) => void;
}

export const LiveOperationsCenter: React.FC<LiveOperationsCenterProps> = ({
  rooms,
  onTerminateRoom,
  onToggleSeatMute,
  onKickParticipant,
  onToggleSeatLock,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.roomId || '');
  const [simulatedLoad, setSimulatedLoad] = useState({ cpu: 28, mem: 42, sfuBandwidth: 142.8 });

  // Simulate real-time fluctuating telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLoad({
        cpu: Math.floor(25 + Math.random() * 12),
        mem: Math.floor(40 + Math.random() * 6),
        sfuBandwidth: +(135 + Math.random() * 20).toFixed(1),
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const activeRooms = rooms.filter((r) => !r.isTerminated);
  const totalListeners = activeRooms.reduce((acc, r) => acc + r.listenerCount, 0);
  const totalSpeakers = activeRooms.reduce(
    (acc, r) => acc + r.seats.filter((s) => s.status === 'occupied').length + 1,
    0
  );
  const selectedRoom = rooms.find((r) => r.roomId === selectedRoomId) || rooms[0];

  return (
    <div className="space-y-6">
      {/* 1. Live Infrastructure & Real-Time Ops Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ACTIVE LIVE ROOMS</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {activeRooms.length}
            <span className="text-xs font-normal text-slate-500 ml-2">/ {rooms.length} registered</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">LiveKit SFU Clustering Enabled</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>TOTAL CONNECTED USERS (CCU)</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalListeners + totalSpeakers}
            <span className="text-xs font-normal text-slate-500 ml-2">({totalSpeakers} on mic)</span>
          </div>
          <div className="text-xs text-blue-400 mt-1">{totalListeners} passive listeners</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>SFU NODE LOAD</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {simulatedLoad.cpu}%
            <span className="text-xs font-normal text-slate-500 ml-2">RAM: {simulatedLoad.mem}%</span>
          </div>
          <div className="text-xs text-amber-400 mt-1">Throughput: {simulatedLoad.sfuBandwidth} Mbps</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>AUDIO WEBRTC QUALITY</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            0.02%
            <span className="text-xs font-normal text-slate-500 ml-2">Packet Loss</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">Opus 64kbps DTX Active</div>
        </div>
      </div>

      {/* 2. Main Live Monitoring Console: Rooms Grid + Deep Seat Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Voice Rooms Directory */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Live Voice Party Rooms</h2>
              <p className="text-xs text-slate-400">Select room to monitor audio tracks & moderate</p>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              REAL-TIME
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {rooms.map((room) => {
              const isSelected = room.roomId === selectedRoom?.roomId;
              const occupiedCount = room.seats.filter((s) => s.status === 'occupied').length;

              return (
                <div
                  key={room.roomId}
                  onClick={() => setSelectedRoomId(room.roomId)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    room.isTerminated
                      ? 'bg-rose-950/20 border-rose-900/40 opacity-60'
                      : isSelected
                      ? 'bg-slate-800/90 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={room.hostAvatar}
                          alt={room.hostName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          {room.countryFlag}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate max-w-[160px]">
                            {room.title}
                          </span>
                          {room.isTerminated ? (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-400 rounded">
                              TERMINATED
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Host: {room.hostName}</span>
                          <span>·</span>
                          <span className="font-mono">ID: {room.roomId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {room.listenerCount} listeners
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {occupiedCount + 1}/{room.seatCapacity} seats
                      </div>
                    </div>
                  </div>

                  {/* Audio Volume Bar Simulation */}
                  {!room.isTerminated && (
                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px]">Audio Traffic: {room.bandwidthKbps} kbps</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-3 bg-emerald-500 rounded-sm animate-pulse" />
                        <span className="w-1.5 h-4 bg-emerald-400 rounded-sm animate-pulse delay-75" />
                        <span className="w-1.5 h-2 bg-emerald-500 rounded-sm animate-pulse delay-150" />
                        <span className="w-1.5 h-5 bg-emerald-300 rounded-sm animate-pulse delay-100" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Room Live Moderation Console & Seat Grid */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          {selectedRoom ? (
            <div>
              {/* Header with Emergency Kill Switch */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedRoom.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">
                      ID: {selectedRoom.roomId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Country: {selectedRoom.country} {selectedRoom.countryFlag} · Capacity: {selectedRoom.seatCapacity} Seats · Theme: {selectedRoom.themeUrl}
                  </p>
                </div>

                {!selectedRoom.isTerminated ? (
                  <button
                    onClick={() => onTerminateRoom(selectedRoom.roomId)}
                    className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-rose-900/30 transition cursor-pointer"
                  >
                    <PowerOff className="w-4 h-4" />
                    <span>EMERGENCY KILL SWITCH</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-rose-950 border border-rose-800 text-rose-300 rounded-lg text-xs font-bold">
                    ROOM TERMINATED BY ADMIN
                  </span>
                )}
              </div>

              {/* Host Stage Overview */}
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-950/30 to-purple-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedRoom.hostAvatar}
                      alt={selectedRoom.hostName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
                    />
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-amber-500 text-slate-950 font-bold px-1.5 rounded-full">
                      HOST
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedRoom.hostName}</h4>
                    <div className="text-xs text-amber-300/80 mt-0.5 flex items-center gap-2">
                      <span>Throne Status: Active</span>
                      <span>·</span>
                      <span>Crystal Ball: {selectedRoom.crystalBallCoins} Coins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-mono bg-slate-950/60 border border-slate-800 text-slate-300 rounded-md">
                    Host Audio: 64 kbps Opus
                  </span>
                </div>
              </div>

              {/* Live Audio Seats Matrix (12 or 8 Seats) */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Room Audio Seats Matrix ({selectedRoom.seats.length} Slots)
                  </span>
                  <span className="text-xs text-slate-500">
                    Click seat to Lock, Mute, or Kick participant
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {selectedRoom.seats.map((seat) => {
                    const isOccupied = seat.status === 'occupied' && seat.participant;
                    const isLocked = seat.isLocked;

                    return (
                      <div
                        key={seat.index}
                        className={`p-3 rounded-xl border text-center transition ${
                          isOccupied
                            ? 'bg-slate-950/70 border-emerald-500/40 shadow-sm'
                            : isLocked
                            ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                            : 'bg-slate-950/30 border-slate-800/40'
                        }`}
                      >
                        {/* Avatar / Empty circle */}
                        <div className="relative mx-auto w-12 h-12 flex items-center justify-center mb-2">
                          {isOccupied ? (
                            <>
                              <img
                                src={seat.participant!.avatar}
                                alt={seat.participant!.name}
                                className={`w-12 h-12 rounded-full object-cover ring-2 ${
                                  seat.participant!.isSpeaking ? 'ring-emerald-400 ring-offset-2 ring-offset-slate-900' : 'ring-slate-700'
                                }`}
                              />
                              {seat.participant!.isMuted && (
                                <span className="absolute bottom-0 right-0 p-1 bg-rose-600 rounded-full text-white text-[9px]">
                                  <VolumeX className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </>
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                                isLocked
                                  ? 'bg-slate-900 border-amber-500/40 text-amber-400'
                                  : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400'
                              }`}
                            >
                              {isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                <span className="text-xs font-mono font-bold">No.{seat.index}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Name / Status */}
                        <div className="text-xs font-semibold text-white truncate">
                          {isOccupied ? seat.participant!.name : `Seat ${seat.index}`}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {isOccupied
                            ? seat.participant!.isSpeaking
                              ? 'Speaking 🟢'
                              : 'Idle ⚪'
                            : isLocked
                            ? 'Locked'
                            : 'Vacant'}
                        </div>

                        {/* Moderation Controls for this seat */}
                        <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-slate-800/80">
                          {isOccupied ? (
                            <>
                              <button
                                title={seat.isMutedByHost ? 'Unmute participant' : 'Mute participant'}
                                onClick={() => onToggleSeatMute(selectedRoom.roomId, seat.index)}
                                className={`p-1.5 rounded text-xs transition ${
                                  seat.isMutedByHost
                                    ? 'bg-rose-600/30 text-rose-300 hover:bg-rose-600/50'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {seat.isMutedByHost ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                title="Force Kick participant from seat"
                                onClick={() => onKickParticipant(selectedRoom.roomId, seat.index)}
                                className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 text-xs transition"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              title={isLocked ? 'Unlock Seat' : 'Lock Seat'}
                              onClick={() => onToggleSeatLock(selectedRoom.roomId, seat.index)}
                              className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                            >
                              {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              <span>{isLocked ? 'Unlock' : 'Lock'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No active voice rooms selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
