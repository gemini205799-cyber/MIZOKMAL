/**
 * MIZO Core Domain Models & DTOs
 * Directly mapped from decompiled Habi / Yari production Java classes:
 * - MicJson.java
 * - RoomMic.java
 * - BossSeatInfoJson.java
 * - GiftJson.java
 * - GiftMsgJson.java
 * - RoomDetailJson.java
 */

export interface MemberDressJson {
  dress_ids?: string[];
  svga_head_wear?: string;
  avatar_frame?: string;
}

export interface LivePrivilegeJson {
  level?: number;
  svip_tier?: number;
  badge_url?: string;
  avatar?: {
    avatar_url: string;
    border_color?: string;
  };
}

export interface MemberJson {
  id: number | string;
  display_id?: string;
  nickname: string;
  avatar: string;
  gender?: number; // 1: male, 2: female
  level?: number;
  country?: string;
  dress_info?: MemberDressJson;
  live_privilege?: LivePrivilegeJson;
}

/**
 * Mapped directly from MicJson.java
 */
export interface MicJson {
  pos: number;                         // e.g. 1-12, or 1000 for anchor_mic, 1001 for boss_mic
  close_status: number;                // 0: open, 1: locked, 2: muted by host
  close_source?: 'anchor' | 'self' | 'admin' | string;
  member?: MemberJson | null;          // Occupant
  on_call?: number;                    // Calling state
  msgText?: string;                    // In-mic bubble text
  contribution?: number | null;        // Gold coins contributed on this mic
  is_blocked?: boolean | null;
  is_offline?: boolean | null;
  scoreboard?: number | null;
  mic_relation?: any | null;
  pk_score?: number | null;            // PK battle score
  empty?: string | null;
  relation_users?: any[] | null;
  is_reception_reserved?: boolean;
}

/**
 * Mapped directly from BossSeatInfoJson.java
 */
export interface BossSeatInfoJson {
  status: number;                      // 0: empty, 1: occupied
  coins: number;                       // Current boss bid / contribution
  base_coins: number;                  // Minimum coins required to grab boss seat
  member?: MemberJson | null;
}

/**
 * Mapped directly from RoomMic.java
 */
export interface RoomMic {
  mic_list: MicJson[];                 // Standard seats (typically 8 or 12)
  special_mic_list?: MicJson[];        // Special VIP seats
  mic_apply_cnt: number;               // Pending hand-raise count
  max_mic_cnt: number;                 // 8 or 12
  new_max_mic_cnt?: number;
  anchor_mic: MicJson;                 // Pos 1000: Host throne
  boss_mic?: MicJson | null;           // Pos 1001: Boss seat
  scoreboard?: number | null;
  is_block_birthday_mic?: boolean | null;
  unsupported_mic_list?: MicJson[];
}

/**
 * Mapped directly from GiftJson.java
 */
export interface GiftJson {
  id: number | string;
  name: string;
  cost: number;                        // Coin cost
  url?: string;
  thumb_url?: string;
  type?: number;
  show_url?: string;
  remain_cnt?: number;
  gift_type: number;                   // 1: normal, 2: luxury, 3: lucky, 4: special
  isSelect?: boolean;
  status?: number;
  cnt?: number;
  sound?: string;                      // Audio FX url
  show_effect_avatar?: boolean;
  svga_avatar_key?: string;            // SVGA animation key
  time?: number;                       // Duration in seconds
  world?: boolean;                     // Global server announcement banner
  lucky_score?: {
    lucky_rate: number;
    jackpot_pool: number;
  } | null;
  pag_url?: string;                    // Tencent PAG animation format
  ext_type?: number;
  is_combo?: boolean;
  name_map?: Record<string, string>;   // Localized gift names { en, bn, ar }
}

/**
 * Mapped directly from GiftMsgJson.java
 */
export interface GiftMsgJson {
  id: string | number;
  member: MemberJson;                  // Sender
  to_members: MemberJson[];            // Recipients (can send to multiple or all on-mic)
  msg?: string;
  gift_id: string | number;
  anchor_income: number;               // Diamonds credited to anchor
  thumbUrl?: string;
  show_url?: string;
  name: string;
  cnt: number;                         // Quantity / Combo (e.g. 1, 10, 88, 520, 1314)
  time: number;
  type: number;
  is_all: boolean;                     // Sent to entire mic list
  to_members_num: number;
  sound?: string;
  svga_avatar_key?: string;
  room_id: string | number;
  cost: number;                        // Total coins deducted
  lucky?: boolean;
  cash_back_list?: Array<{
    user_id: string;
    coins_reward: number;
  }>;
  total_cash_back?: number;
  pag_url?: string;
  is_blind_critical_hit?: boolean;     // Lucky blind box critical combo
}

/**
 * Mapped directly from RoomDetailJson.java
 */
export interface RoomDetailJson {
  room_id: string | number;
  title: string;
  announcements?: string[];
  self_member?: MemberJson;
  role: number;                        // 1: Owner, 2: Admin, 3: Speaker, 4: Listener
  mic_room_info: RoomMic;
  online_members_count: number;
  on_mic: boolean;
  share_url?: string;
  theme_key?: string;
  country?: string;
  down_mic_emoji?: number;
  mode_id?: number;
}
