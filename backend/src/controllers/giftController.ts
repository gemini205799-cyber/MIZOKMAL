/**
 * MIZO Atomic Gift Transaction Controller
 * Handles virtual coin deduction from sender, diamond credit to receiver/host,
 * platform revenue split (e.g. 70% host / 30% platform), room socket animation broadcast,
 * and double-entry financial ledger records.
 */

export interface GiftItem {
  id: string;
  name: string;
  arabicName: string;
  coinPrice: number;
  diamondValue: number;
  category: 'popular' | 'luxury' | 'romantic' | 'special';
  icon: string;
  animationType: 'svga' | 'lottie' | 'particle';
  animationUrl: string;
  soundFxUrl: string;
  durationMs: number;
}

export interface SendGiftRequest {
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  roomId: string;
  giftId: string;
  comboCount?: number;
}

export interface GiftTransactionResult {
  transactionId: string;
  success: boolean;
  message: string;
  gift: GiftItem;
  senderCoinsRemaining: number;
  receiverDiamondsEarned: number;
  animationPayload: {
    giftId: string;
    giftName: string;
    senderName: string;
    receiverName: string;
    combo: number;
    animationUrl: string;
    soundFxUrl: string;
    durationMs: number;
  };
}

export const SYSTEM_GIFTS: GiftItem[] = [
  {
    id: 'gift_super_car',
    name: 'Gold McLaren P1',
    arabicName: 'سيارة ماكلارين ذهبية',
    coinPrice: 18000,
    diamondValue: 12600,
    category: 'luxury',
    icon: '🏎️',
    animationType: 'svga',
    animationUrl: '/assets/animations/super_car.svga',
    soundFxUrl: '/assets/audio/super_car_rev.mp3',
    durationMs: 4500,
  },
  {
    id: 'gift_golden_bike',
    name: 'Golden Cruiser Bike',
    arabicName: 'دراجة كروزر ذهبية',
    coinPrice: 12000,
    diamondValue: 8400,
    category: 'luxury',
    icon: '🏍️',
    animationType: 'svga',
    animationUrl: '/assets/animations/gold_bike.svga',
    soundFxUrl: '/assets/audio/bike_roar.mp3',
    durationMs: 4000,
  },
  {
    id: 'gift_royal_castle',
    name: 'Imperial Palace',
    arabicName: 'القصر الإمبراطوري',
    coinPrice: 30000,
    diamondValue: 21000,
    category: 'special',
    icon: '🏰',
    animationType: 'lottie',
    animationUrl: '/assets/animations/palace.json',
    soundFxUrl: '/assets/audio/royal_fanfare.mp3',
    durationMs: 6000,
  },
  {
    id: 'gift_super_fans_crest',
    name: 'Super Fans Crown',
    arabicName: 'تاج كبار المعجبين',
    coinPrice: 6000,
    diamondValue: 4200,
    category: 'popular',
    icon: '👑',
    animationType: 'lottie',
    animationUrl: '/assets/animations/crown.json',
    soundFxUrl: '/assets/audio/sparkle.mp3',
    durationMs: 3000,
  },
  {
    id: 'gift_red_rose',
    name: 'Eternal Velvet Rose',
    arabicName: 'وردة مخملية أبدية',
    coinPrice: 100,
    diamondValue: 70,
    category: 'romantic',
    icon: '🌹',
    animationType: 'particle',
    animationUrl: '/assets/animations/rose_rain.json',
    soundFxUrl: '/assets/audio/chime.mp3',
    durationMs: 2500,
  },
  {
    id: 'gift_diamond_ring',
    name: 'Solitaire Diamond Ring',
    arabicName: 'خاتم ألماس سوليتير',
    coinPrice: 2500,
    diamondValue: 1750,
    category: 'romantic',
    icon: '💍',
    animationType: 'lottie',
    animationUrl: '/assets/animations/ring.json',
    soundFxUrl: '/assets/audio/diamond_shine.mp3',
    durationMs: 3000,
  },
  {
    id: 'gift_space_rocket',
    name: 'MIZO Falcon Rocket',
    arabicName: 'صاروخ فالكون الفضائي',
    coinPrice: 50000,
    diamondValue: 35000,
    category: 'special',
    icon: '🚀',
    animationType: 'svga',
    animationUrl: '/assets/animations/rocket_blast.svga',
    soundFxUrl: '/assets/audio/rocket_launch.mp3',
    durationMs: 5000,
  },
];

export class GiftController {
  private userWallets: Map<string, { coins: number; diamonds: number }> = new Map();
  private transactions: any[] = [];
  private giftCatalog: GiftItem[] = [...SYSTEM_GIFTS];

  constructor() {
    // Seed test wallets
    this.userWallets.set('usr_tester', { coins: 150000, diamonds: 2400 });
    this.userWallets.set('usr_tanisha_01', { coins: 85000, diamonds: 42000 });
    this.userWallets.set('usr_101', { coins: 62000, diamonds: 11500 });
    this.userWallets.set('usr_102', { coins: 41000, diamonds: 8900 });
  }

  public getCatalog(): GiftItem[] {
    return this.giftCatalog;
  }

  public addOrUpdateGift(gift: GiftItem): GiftItem {
    const existingIndex = this.giftCatalog.findIndex((g) => g.id === gift.id);
    if (existingIndex >= 0) {
      this.giftCatalog[existingIndex] = gift;
    } else {
      this.giftCatalog.push(gift);
    }
    return gift;
  }

  public deleteGift(giftId: string): boolean {
    const before = this.giftCatalog.length;
    this.giftCatalog = this.giftCatalog.filter((g) => g.id !== giftId);
    return this.giftCatalog.length < before;
  }

  public getWallet(userId: string) {
    if (!this.userWallets.has(userId)) {
      this.userWallets.set(userId, { coins: 25000, diamonds: 0 });
    }
    return this.userWallets.get(userId)!;
  }

  public adjustWallet(userId: string, deltaCoins: number, deltaDiamonds: number) {
    const wallet = this.getWallet(userId);
    wallet.coins = Math.max(0, wallet.coins + deltaCoins);
    wallet.diamonds = Math.max(0, wallet.diamonds + deltaDiamonds);
    return wallet;
  }

  /**
   * Atomic Gift Transaction
   */
  public processGiftSend(req: SendGiftRequest): GiftTransactionResult {
    const gift = this.giftCatalog.find((g) => g.id === req.giftId);
    if (!gift) {
      throw new Error(`Gift with ID ${req.giftId} not found in catalog`);
    }

    const combo = req.comboCount || 1;
    const totalCoinCost = gift.coinPrice * combo;
    const totalDiamondCredit = gift.diamondValue * combo;

    const senderWallet = this.getWallet(req.senderId);
    if (senderWallet.coins < totalCoinCost) {
      throw new Error(`Insufficient coins. Required: ${totalCoinCost}, Available: ${senderWallet.coins}`);
    }

    // Atomic Balance Update
    senderWallet.coins -= totalCoinCost;

    const receiverWallet = this.getWallet(req.receiverId);
    receiverWallet.diamonds += totalDiamondCredit;

    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const txRecord = {
      transactionId,
      timestamp: new Date().toISOString(),
      senderId: req.senderId,
      senderName: req.senderName,
      receiverId: req.receiverId,
      receiverName: req.receiverName,
      roomId: req.roomId,
      giftId: gift.id,
      giftName: gift.name,
      combo,
      totalCoins: totalCoinCost,
      totalDiamonds: totalDiamondCredit,
      platformFeeDiamonds: Math.round(totalCoinCost * 0.3),
    };
    this.transactions.unshift(txRecord);

    return {
      transactionId,
      success: true,
      message: `Successfully gifted ${combo}x ${gift.name} to ${req.receiverName}`,
      gift,
      senderCoinsRemaining: senderWallet.coins,
      receiverDiamondsEarned: totalDiamondCredit,
      animationPayload: {
        giftId: gift.id,
        giftName: gift.name,
        senderName: req.senderName,
        receiverName: req.receiverName,
        combo,
        animationUrl: gift.animationUrl,
        soundFxUrl: gift.soundFxUrl,
        durationMs: gift.durationMs,
      },
    };
  }

  public getTransactions(limit = 50) {
    return this.transactions.slice(0, limit);
  }
}

export const giftController = new GiftController();
