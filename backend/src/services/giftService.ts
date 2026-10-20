/**
 * MIZO Atomic Gifting & Economy Service
 * Implements Habi parity with:
 * - Coin deduction & diamond credit atomic transactions
 * - Probabilistic Lucky Gift Cash-Back Engine (1x - 500x multipliers)
 * - Multi-recipient gifting (single on-mic, all on-mic, or anchor)
 * - Socket.IO room broadcast with GiftMsgJson payload
 */

import { GiftJson, GiftMsgJson, MemberJson } from '../types/models.js';

export interface SendGiftPayload {
  roomId: string;
  sender: MemberJson;
  targetMemberIds: string[];         // Single user, or all on-mic user IDs
  giftId: string | number;
  count: number;                     // 1, 10, 88, 520, 1314
  isAllMic?: boolean;
}

export interface LuckyCashBackOutcome {
  userId: string;
  coinsWon: number;
  multiplier: number;
  isJackpot: boolean;
}

export class GiftService {
  private userWallets: Map<string, { coins: number; diamonds: number }> = new Map();
  private giftsCatalog: Map<string, GiftJson> = new Map();

  constructor() {
    this.seedCatalog();
    this.seedTestWallets();
  }

  private seedTestWallets() {
    this.userWallets.set('usr_me', { coins: 150000, diamonds: 4500 });
    this.userWallets.set('usr_tanisha_01', { coins: 85000, diamonds: 240000 });
    this.userWallets.set('usr_101', { coins: 45000, diamonds: 12000 });
    this.userWallets.set('usr_102', { coins: 32000, diamonds: 9500 });
  }

  private seedCatalog() {
    const initialGifts: GiftJson[] = [
      {
        id: 'gift_super_car',
        name: 'Gold McLaren P1',
        cost: 18000,
        gift_type: 2, // Luxury
        sound: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
        svga_avatar_key: 'avatar_driver_seat',
        pag_url: 'https://mizo-assets.live/pag/mclaren_p1.pag',
        time: 5.0,
        is_combo: false,
        name_map: { en: 'Gold McLaren P1', bn: 'গোল্ড ম্যাকলারেন পি১', ar: 'ماكلارين ذهبية' },
      },
      {
        id: 'gift_lucky_wheel',
        name: 'Sultan Lucky Wheel',
        cost: 1000,
        gift_type: 3, // Lucky
        sound: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
        svga_avatar_key: 'avatar_lucky_winner',
        pag_url: 'https://mizo-assets.live/pag/lucky_wheel.pag',
        time: 3.5,
        is_combo: true,
        lucky_score: { lucky_rate: 0.15, jackpot_pool: 250000 },
        name_map: { en: 'Sultan Lucky Wheel', bn: 'সুলতান লাকি হুইল', ar: 'عجلة الحظ السلطانية' },
      },
      {
        id: 'gift_falcon_rocket',
        name: 'Falcon Galactic Rocket',
        cost: 50000,
        gift_type: 4, // Special / World
        sound: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
        svga_avatar_key: 'avatar_astronaut',
        pag_url: 'https://mizo-assets.live/pag/falcon_rocket.pag',
        time: 6.0,
        world: true,
        is_combo: false,
        name_map: { en: 'Falcon Galactic Rocket', bn: 'ফ্যালকন রকেট', ar: 'صاروخ فالكون المجري' },
      },
      {
        id: 'gift_red_rose',
        name: 'Eternal Velvet Rose',
        cost: 100,
        gift_type: 1, // Popular / Batter combo
        sound: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
        time: 2.0,
        is_combo: true,
        name_map: { en: 'Eternal Velvet Rose', bn: 'লাল গোলাপ', ar: 'وردة حمراء أبدية' },
      },
    ];

    initialGifts.forEach((g) => this.giftsCatalog.set(String(g.id), g));
  }

  public getGiftById(giftId: string | number): GiftJson | undefined {
    return this.giftsCatalog.get(String(giftId));
  }

  public getAllGifts(): GiftJson[] {
    return Array.from(this.giftsCatalog.values());
  }

  public upsertGift(gift: GiftJson): GiftJson {
    this.giftsCatalog.set(String(gift.id), gift);
    return gift;
  }

  public getWallet(userId: string) {
    if (!this.userWallets.has(userId)) {
      this.userWallets.set(userId, { coins: 20000, diamonds: 0 });
    }
    return this.userWallets.get(userId)!;
  }

  /**
   * Probabilistic Lucky Cash-Back Algorithm
   * Models Habi's luck_gift calculation engine
   */
  private calculateLuckyCashBack(gift: GiftJson, count: number, userId: string): LuckyCashBackOutcome | null {
    if (gift.gift_type !== 3 || !gift.lucky_score) return null;

    const roll = Math.random();
    let multiplier = 0;

    if (roll < 0.005) {
      multiplier = 500; // 0.5% chance: 500x JACKPOT!
    } else if (roll < 0.03) {
      multiplier = 50;  // 2.5% chance: 50x Mega Win
    } else if (roll < 0.12) {
      multiplier = 10;  // 9% chance: 10x Big Win
    } else if (roll < 0.35) {
      multiplier = 2;   // 23% chance: 2x Double Win
    }

    if (multiplier === 0) return null;

    const coinsWon = gift.cost * count * multiplier;
    const wallet = this.getWallet(userId);
    wallet.coins += coinsWon;

    return {
      userId,
      coinsWon,
      multiplier,
      isJackpot: multiplier >= 50,
    };
  }

  /**
   * Atomic Gifting Processing Pipeline
   */
  public async processGiftSend(payload: SendGiftPayload): Promise<{
    success: boolean;
    giftMsg: GiftMsgJson;
    senderCoinsRemaining: number;
    luckyOutcome: LuckyCashBackOutcome | null;
  }> {
    const gift = this.getGiftById(payload.giftId);
    if (!gift) throw new Error(`Gift ${payload.giftId} not found in catalog`);

    const recipientCount = Math.max(1, payload.targetMemberIds.length);
    const totalCoinCost = gift.cost * payload.count * recipientCount;
    const senderWallet = this.getWallet(String(payload.sender.id));

    if (senderWallet.coins < totalCoinCost) {
      throw new Error(`Insufficient coin balance. Required: ${totalCoinCost}, Available: ${senderWallet.coins}`);
    }

    // 1. Atomic Coin Deduction
    senderWallet.coins -= totalCoinCost;

    // 2. Credit Diamonds to Receivers (70% income rate)
    const diamondPerRecipient = Math.floor((gift.cost * payload.count) * 0.7);
    payload.targetMemberIds.forEach((targetId) => {
      const recWallet = this.getWallet(targetId);
      recWallet.diamonds += diamondPerRecipient;
    });

    // 3. Lucky Cash Back Calculation
    const luckyOutcome = this.calculateLuckyCashBack(gift, payload.count, String(payload.sender.id));

    // 4. Construct GiftMsgJson payload matching Habi DTO
    const giftMsg: GiftMsgJson = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      member: payload.sender,
      to_members: payload.targetMemberIds.map((id) => ({
        id,
        nickname: id === 'usr_tanisha_01' ? 'Tanisha (Host)' : 'Room Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        gender: 1,
        level: 20,
      })),
      gift_id: gift.id,
      name: gift.name,
      cnt: payload.count,
      cost: totalCoinCost,
      anchor_income: diamondPerRecipient * recipientCount,
      time: Math.floor(Date.now() / 1000),
      type: gift.gift_type,
      is_all: payload.isAllMic ?? false,
      to_members_num: recipientCount,
      sound: gift.sound,
      svga_avatar_key: gift.svga_avatar_key,
      pag_url: gift.pag_url,
      room_id: payload.roomId,
      lucky: luckyOutcome !== null,
      cash_back_list: luckyOutcome
        ? [{ user_id: luckyOutcome.userId, coins_reward: luckyOutcome.coinsWon }]
        : undefined,
      total_cash_back: luckyOutcome?.coinsWon,
      is_blind_critical_hit: luckyOutcome?.isJackpot,
    };

    // 5. Emit Socket.IO room broadcast event
    this.emitRoomGiftBroadcast(payload.roomId, giftMsg);

    return {
      success: true,
      giftMsg,
      senderCoinsRemaining: senderWallet.coins,
      luckyOutcome,
    };
  }

  /**
   * Redis Atomic Balance Lock Lua Script
   * Ensures high concurrency safety without race conditions
   */
  public static readonly REDIS_LUA_GIFT_TX = `
    local senderKey = KEYS[1]
    local cost = tonumber(ARGV[1])
    local diamondCredit = tonumber(ARGV[2])
    local currentCoins = tonumber(redis.call('HGET', senderKey, 'coins') or '0')

    if currentCoins < cost then
      return {0, currentCoins} -- Insufficient funds
    end

    redis.call('HINCRBY', senderKey, 'coins', -cost)
    for i = 2, #KEYS do
      redis.call('HINCRBY', KEYS[i], 'diamonds', diamondCredit)
    end

    local remaining = tonumber(redis.call('HGET', senderKey, 'coins'))
    return {1, remaining}
  `;

  /**
   * Socket.IO signaling event emission: emits `room:gift_broadcast`
   * with GiftMsgJson payload
   */
  private emitRoomGiftBroadcast(roomId: string, giftMsg: GiftMsgJson) {
    if (typeof global !== 'undefined' && (global as any).io) {
      const io = (global as any).io;
      io.to(`room:${roomId}`).emit('room:gift_broadcast', giftMsg);
      if (giftMsg.is_blind_critical_hit) {
        io.emit('global:jackpot_announcement', {
          winner: giftMsg.member.nickname,
          coinsWon: giftMsg.total_cash_back,
          giftName: giftMsg.name,
          roomId: giftMsg.room_id,
        });
      }
    }
  }
}

export const giftService = new GiftService();

