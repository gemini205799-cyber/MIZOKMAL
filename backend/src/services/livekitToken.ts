/**
 * MIZO Dynamic LiveKit Token Provisioner
 * Grants real-time WebRTC audio publish / subscribe grants,
 * with role-based permission escalation (Listener -> On-Mic Speaker -> Anchor).
 */

export interface TokenGrantConfig {
  roomName: string;
  identity: string;
  name: string;
  role: 'host' | 'speaker' | 'listener' | 'boss';
  avatar?: string;
  metadata?: Record<string, any>;
}

export class LiveKitTokenService {
  private apiKey: string;
  private apiSecret: string;
  private sfuUrl: string;

  constructor() {
    this.apiKey = process.env.LIVEKIT_API_KEY || 'devkey_mizo_prod';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || 'secret_mizo_super_secure_992831';
    this.sfuUrl = process.env.LIVEKIT_URL || 'wss://livekit.mizo.live';
  }

  public generateToken(config: TokenGrantConfig): {
    token: string;
    serverUrl: string;
    expiresAt: number;
    permissions: {
      canPublish: boolean;
      canSubscribe: boolean;
      roomAdmin: boolean;
    };
  } {
    const isPublisher = config.role === 'host' || config.role === 'speaker' || config.role === 'boss';
    const isAdmin = config.role === 'host';

    const permissions = {
      canPublish: isPublisher,
      canSubscribe: true,
      roomAdmin: isAdmin,
    };

    const now = Math.floor(Date.now() / 1000);
    const ttl = 3600 * 6; // 6 hours
    const exp = now + ttl;

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: config.identity,
      iss: this.apiKey,
      nbf: now - 5,
      exp: exp,
      name: config.name,
      metadata: JSON.stringify({
        avatar: config.avatar || '',
        role: config.role,
        ...config.metadata,
      }),
      video: {
        room: config.roomName,
        roomJoin: true,
        canPublish: permissions.canPublish,
        canSubscribe: permissions.canSubscribe,
        canPublishData: true,
        roomAdmin: permissions.roomAdmin,
      },
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const simulatedSignature = Buffer.from(`${encodedHeader}.${encodedPayload}.${this.apiSecret}`)
      .toString('base64url')
      .slice(0, 43);
    const token = `${encodedHeader}.${encodedPayload}.${simulatedSignature}`;

    return {
      token,
      serverUrl: this.sfuUrl,
      expiresAt: exp,
      permissions,
    };
  }
}

export const livekitToken = new LiveKitTokenService();
