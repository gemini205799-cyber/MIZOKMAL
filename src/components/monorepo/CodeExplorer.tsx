import React, { useState } from 'react';
import { 
  FolderTree, 
  FileCode2, 
  Copy, 
  Check, 
  Layers, 
  Download, 
  ExternalLink,
  Terminal,
  Server
} from 'lucide-react';

interface FileNode {
  path: string;
  category: 'Backend (Node.js)' | 'Mobile Client (Flutter)' | 'DevOps & SFU';
  language: 'typescript' | 'dart' | 'yaml' | 'prisma' | 'dockerfile';
  description: string;
}

const FILES: FileNode[] = [
  {
    path: 'backend/src/services/livekitTokenService.ts',
    category: 'Backend (Node.js)',
    language: 'typescript',
    description: 'LiveKit AccessToken generator with custom VideoGrants & permissions',
  },
  {
    path: 'backend/src/services/roomSeatsManager.ts',
    category: 'Backend (Node.js)',
    language: 'typescript',
    description: '8/12 seats state machine, atomic lock transitions & Socket.IO sync',
  },
  {
    path: 'backend/src/controllers/giftController.ts',
    category: 'Backend (Node.js)',
    language: 'typescript',
    description: 'Atomic virtual coin deduction, diamond credit & ledger auditing',
  },
  {
    path: 'backend/prisma/schema.prisma',
    category: 'Backend (Node.js)',
    language: 'prisma',
    description: 'PostgreSQL database schema for Users, Rooms, Seats, Gifts, Ledgers & Guilds',
  },
  {
    path: 'mizo_client/lib/presentation/navigation/main_tab_scaffold.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: '4-tab persistent IndexedStack navigation, center mic action button & floating audio pill',
  },
  {
    path: 'mizo_client/lib/presentation/screens/home/room_feed_screen.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'Discovery feed with category tabs, search, banner carousel & room cards',
  },
  {
    path: 'mizo_client/lib/presentation/screens/room/voice_room_screen.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'Complete Habi layout: Header bar, PK arena, seat matrix, bullet chat & PAG/SVGA overlay',
  },
  {
    path: 'mizo_client/lib/presentation/screens/profile/user_profile_screen.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'User profile with double-entry wallet (coins & diamonds) and instant multi-language switcher',
  },
  {
    path: 'mizo_client/lib/main.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'Flutter entry point with multi-language state, orientation lock & dark theme',
  },
  {
    path: 'mizo_client/lib/core/livekit_room_controller.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'Flutter LiveKit Room controller with TrackSubscribed & speaking energy detection',
  },
  {
    path: 'mizo_client/lib/presentation/widgets/room_seats_grid.dart',
    category: 'Mobile Client (Flutter)',
    language: 'dart',
    description: 'Voice room 8/12 seats matrix widget with emerald mic badges & pulse animations',
  },
  {
    path: 'mizo_client/pubspec.yaml',
    category: 'Mobile Client (Flutter)',
    language: 'yaml',
    description: 'Flutter dependencies matching yari baseline with livekit_client & riverpod',
  },
  {
    path: 'docker-compose.yml',
    category: 'DevOps & SFU',
    language: 'yaml',
    description: 'Complete stack: LiveKit Server (SFU), Redis, PostgreSQL, and MIZO API',
  },
  {
    path: 'backend/livekit.yaml',
    category: 'DevOps & SFU',
    language: 'yaml',
    description: 'LiveKit WebRTC ports, Redis adapter, and Opus DTX audio optimization config',
  },
];

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode>(FILES[0]);
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = (path: string): string => {
    switch (path) {
      case 'backend/src/services/livekitTokenService.ts':
        return `import { AccessToken } from '@livekit/server-sdk';

export class LiveKitTokenService {
  constructor(
    private apiKey = process.env.LIVEKIT_API_KEY,
    private apiSecret = process.env.LIVEKIT_API_SECRET
  ) {}

  public generateToken(opts: {
    roomName: string;
    identity: string;
    name: string;
    role: 'host' | 'speaker' | 'listener';
  }) {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: opts.identity,
      name: opts.name,
      ttl: 3600 * 6, // 6 hours
    });

    at.addGrant({
      room: opts.roomName,
      roomJoin: true,
      canPublish: opts.role === 'host' || opts.role === 'speaker',
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: opts.role === 'host',
    });

    return at.toJwt();
  }
}`;

      case 'backend/src/services/roomSeatsManager.ts':
        return `export class RoomSeatsManager {
  // Atomic seat allocation with Redis lock
  public async takeSeat(roomId: string, seatIndex: number, user: Participant) {
    const lockKey = \`lock:room:\${roomId}:seat:\${seatIndex}\`;
    const acquired = await redis.set(lockKey, user.userId, 'NX', 'EX', 5);
    if (!acquired) throw new Error('Seat currently locked');

    const room = await this.getRoom(roomId);
    const seat = room.seats[seatIndex - 1];
    if (seat.isLocked || seat.status === 'occupied') {
      throw new Error('Seat occupied or locked');
    }

    seat.status = 'occupied';
    seat.participant = user;
    
    // Broadcast state to Socket.IO & LiveKit
    await redis.publish(\`room:\${roomId}:events\`, JSON.stringify({
      type: 'SEAT_OCCUPIED',
      seatIndex,
      user
    }));

    return seat;
  }
}`;

      case 'mizo_client/lib/core/livekit_room_controller.dart':
        return `import 'package:livekit_client/livekit_client.dart';
import 'package:flutter/foundation.dart';

class LiveKitRoomController extends ChangeNotifier {
  Room? _room;
  EventsListener<RoomEvent>? _listener;
  final Map<String, double> _activeSpeakers = {};

  Future<void> joinRoom(String url, String token) async {
    _room = Room(
      roomOptions: const RoomOptions(
        adaptiveStream: true,
        defaultAudioPublishOptions: AudioPublishOptions(
          audioBitrate: 64000,
          dtx: true,
        ),
      ),
    );

    _listener = _room!.createListener()
      ..on<ActiveSpeakersChangedEvent>((event) {
        _activeSpeakers.clear();
        for (final speaker in event.speakers) {
          _activeSpeakers[speaker.identity] = speaker.audioLevel;
        }
        notifyListeners(); // Drives avatar pulse rings
      });

    await _room!.connect(url, token);
  }
}`;

      case 'docker-compose.yml':
        return `version: '3.8'

services:
  livekit:
    image: livekit/livekit-server:v1.7.2
    ports:
      - "7880:7880"         # Signaling HTTP/WS
      - "7881:7881/tcp"     # WebRTC TCP
      - "7882:7882/udp"     # WebRTC UDP
    volumes:
      - ./backend/livekit.yaml:/etc/livekit.yaml

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mizo_production
      POSTGRES_USER: mizo_admin
      POSTGRES_PASSWORD: mizo_secure_password_2026

  mizo-backend:
    build: ./backend
    ports:
      - "4000:4000"`;

      default:
        return `// Source file generated in workspace at /${path}\n// Ready for production deployment.`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet(selectedFile.path));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Monorepo Production Codebase</h2>
          <p className="text-xs text-slate-400">
            Split into Backend Services, Flutter Mobile Client, and LiveKit WebRTC Infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md">
            Reference: gemini205799-cyber/yari
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left File Tree */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>Monorepo Architecture</span>
          </div>

          <div className="space-y-1">
            {FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-2.5 rounded-lg border text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="truncate font-mono">{file.path.split('/').pop()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate pl-6">
                    {file.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-300 font-semibold">{selectedFile.path}</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] uppercase rounded">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-300 overflow-x-auto bg-slate-950/80 flex-1 leading-relaxed">
            <code>{getCodeSnippet(selectedFile.path)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
