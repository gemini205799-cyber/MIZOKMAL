export type SeatStatus = 'empty' | 'occupied' | 'locked' | 'muted';

export interface Participant {
  userId: string;
  name: string;
  avatar: string;
  role: 'host' | 'admin' | 'speaker' | 'vip';
  level: number;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

export interface Seat {
  index: number;
  status: SeatStatus;
  participant?: Participant | null;
  isLocked: boolean;
  isMutedByHost: boolean;
}

export interface VoiceRoom {
  roomId: string;
  title: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  seatCapacity: 8 | 12;
  seats: Seat[];
  listenerCount: number;
  country: string;
  countryFlag: string;
  themeUrl: string;
  crystalBallCoins: number;
  isTerminated: boolean;
  bandwidthKbps: number;
  audioPacketsLost: number;
  uptimeSeconds: number;
}

export interface UserAccount {
  id: string;
  displayId: string;
  username: string;
  displayName: string;
  avatar: string;
  country: string;
  role: 'user' | 'host' | 'admin' | 'super_admin';
  status: 'active' | 'voice_muted' | 'room_banned' | 'global_banned';
  level: number;
  svipTier: number;
  deviceId: string;
  ipAddress: string;
  coins: number;
  diamonds: number;
  isKycVerified: boolean;
  agencyCode?: string;
  createdAt: string;
}

export interface GiftItem {
  id: string;
  name: string;
  arabicName: string;
  bengaliName?: string;
  coinPrice: number;
  diamondValue: number;
  category: 'popular' | 'luxury' | 'romantic' | 'special' | 'lucky' | 'vip';
  icon: string;
  animationType: 'svga' | 'pag' | 'lottie' | 'particle';
  animationUrl: string;
  pagUrl?: string;
  svgaAvatarKey?: string;
  soundFxUrl: string;
  durationMs: number;
  isLucky?: boolean;
  luckyMultiplier?: number;
  luckyJackpotRate?: number;
  isCombo?: boolean;
  comboTimeoutMs?: number;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  senderName: string;
  receiverName: string;
  giftName: string;
  giftIcon: string;
  combo: number;
  totalCoins: number;
  totalDiamonds: number;
  platformShareCoins: number;
  roomId: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  diamondAmount: number;
  cashEquivalentUsd: number;
  method: 'USDT_TRC20' | 'BANK_TRANSFER' | 'STC_PAY';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export interface AgencyData {
  id: string;
  code: string;
  name: string;
  leadManager: string;
  activeHostsCount: number;
  monthlyLiveHours: number;
  totalDiamondsTarget: number;
  currentDiamonds: number;
  commissionRate: number; // e.g. 0.15 (15%)
  pendingCommissionUsd: number;
}
