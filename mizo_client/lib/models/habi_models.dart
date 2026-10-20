/// MIZO Dart Models mapped directly from decompiled Habi Core Models:
/// - MicJson.java
/// - RoomMic.java
/// - BossSeatInfoJson.java
/// - GiftJson.java
/// - GiftMsgJson.java

class MemberJson {
  final String id;
  final String? displayId;
  final String nickname;
  final String avatar;
  final int gender;
  final int level;

  const MemberJson({
    required this.id,
    this.displayId,
    required this.nickname,
    required this.avatar,
    this.gender = 1,
    this.level = 1,
  });

  factory MemberJson.fromJson(Map<String, dynamic> json) {
    return MemberJson(
      id: json['id']?.toString() ?? '',
      displayId: json['display_id']?.toString(),
      nickname: json['nickname'] ?? json['name'] ?? 'User',
      avatar: json['avatar'] ?? '',
      gender: json['gender'] ?? 1,
      level: json['level'] ?? 1,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'display_id': displayId,
    'nickname': nickname,
    'avatar': avatar,
    'gender': gender,
    'level': level,
  };
}

class MicJson {
  final int pos; // 1-12, or 1000: anchor_mic, 1001: boss_mic
  final int closeStatus; // 0: open, 1: locked, 2: muted
  final String? closeSource;
  final MemberJson? member;
  final double? contribution;
  final bool? isBlocked;
  final bool? isOffline;
  final int? pkScore;

  const MicJson({
    required this.pos,
    this.closeStatus = 0,
    this.closeSource,
    this.member,
    this.contribution,
    this.isBlocked,
    this.isOffline,
    this.pkScore,
  });

  bool get isLocked => closeStatus == 1;
  bool get isMuted => closeStatus == 2;
  bool get isOccupied => member != null;

  MicJson copyWith({
    int? pos,
    int? closeStatus,
    String? closeSource,
    MemberJson? member,
    double? contribution,
    bool? isBlocked,
    bool? isOffline,
    int? pkScore,
  }) {
    return MicJson(
      pos: pos ?? this.pos,
      closeStatus: closeStatus ?? this.closeStatus,
      closeSource: closeSource ?? this.closeSource,
      member: member ?? this.member,
      contribution: contribution ?? this.contribution,
      isBlocked: isBlocked ?? this.isBlocked,
      isOffline: isOffline ?? this.isOffline,
      pkScore: pkScore ?? this.pkScore,
    );
  }

  factory MicJson.fromJson(Map<String, dynamic> json) {
    return MicJson(
      pos: json['pos'] ?? 1,
      closeStatus: json['close_status'] ?? 0,
      closeSource: json['close_source'],
      member: json['member'] != null ? MemberJson.fromJson(json['member']) : null,
      contribution: (json['contribution'] as num?)?.toDouble(),
      isBlocked: json['is_blocked'],
      isOffline: json['is_offline'],
      pkScore: json['pk_score'],
    );
  }

  Map<String, dynamic> toJson() => {
    'pos': pos,
    'close_status': closeStatus,
    'close_source': closeSource,
    'member': member?.toJson(),
    'contribution': contribution,
    'is_blocked': isBlocked,
    'is_offline': isOffline,
    'pk_score': pkScore,
  };
}

class RoomMic {
  final List<MicJson> micList;
  final MicJson anchorMic;
  final MicJson? bossMic;
  final int micApplyCnt;
  final int maxMicCnt;
  final int? scoreboard;

  const RoomMic({
    required this.micList,
    required this.anchorMic,
    this.bossMic,
    this.micApplyCnt = 0,
    this.maxMicCnt = 12,
    this.scoreboard,
  });

  factory RoomMic.fromJson(Map<String, dynamic> json) {
    return RoomMic(
      micList: (json['mic_list'] as List?)?.map((s) => MicJson.fromJson(s)).toList() ?? [],
      anchorMic: MicJson.fromJson(json['anchor_mic'] ?? {'pos': 1000}),
      bossMic: json['boss_mic'] != null ? MicJson.fromJson(json['boss_mic']) : null,
      micApplyCnt: json['mic_apply_cnt'] ?? 0,
      maxMicCnt: json['max_mic_cnt'] ?? 12,
      scoreboard: json['scoreboard'],
    );
  }
}

class LuckyScore {
  final double luckyRate;
  final int jackpotPool;

  const LuckyScore({
    required this.luckyRate,
    required this.jackpotPool,
  });

  factory LuckyScore.fromJson(Map<String, dynamic> json) {
    return LuckyScore(
      luckyRate: (json['lucky_rate'] as num?)?.toDouble() ?? 0.1,
      jackpotPool: json['jackpot_pool'] ?? 100000,
    );
  }

  Map<String, dynamic> toJson() => {
    'lucky_rate': luckyRate,
    'jackpot_pool': jackpotPool,
  };
}

class GiftJson {
  final String id;
  final String name;
  final int cost;
  final int giftType;
  final String? sound;
  final String? svgaAvatarKey;
  final String? pagUrl;
  final String? thumbUrl;
  final bool? isCombo;
  final bool? world;
  final double? time;
  final LuckyScore? luckyScore;
  final Map<String, String>? nameMap;

  const GiftJson({
    required this.id,
    required this.name,
    required this.cost,
    this.giftType = 1,
    this.sound,
    this.svgaAvatarKey,
    this.pagUrl,
    this.thumbUrl,
    this.isCombo,
    this.world,
    this.time,
    this.luckyScore,
    this.nameMap,
  });

  factory GiftJson.fromJson(Map<String, dynamic> json) {
    return GiftJson(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      cost: json['cost'] ?? 100,
      giftType: json['gift_type'] ?? 1,
      sound: json['sound'],
      svgaAvatarKey: json['svga_avatar_key'],
      pagUrl: json['pag_url'],
      thumbUrl: json['thumb_url'],
      isCombo: json['is_combo'],
      world: json['world'],
      time: (json['time'] as num?)?.toDouble(),
      luckyScore: json['lucky_score'] != null ? LuckyScore.fromJson(json['lucky_score']) : null,
      nameMap: (json['name_map'] as Map?)?.cast<String, String>(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'cost': cost,
    'gift_type': giftType,
    'sound': sound,
    'svga_avatar_key': svgaAvatarKey,
    'pag_url': pagUrl,
    'thumb_url': thumbUrl,
    'is_combo': isCombo,
    'world': world,
    'time': time,
    'lucky_score': luckyScore?.toJson(),
    'name_map': nameMap,
  };
}

class GiftMsgJson {
  final String id;
  final MemberJson member;
  final List<MemberJson> toMembers;
  final String giftId;
  final String name;
  final int cnt;
  final int cost;
  final int anchorIncome;
  final String? sound;
  final String? svgaAvatarKey;
  final String? pagUrl;
  final String? thumbUrl;
  final int type;
  final bool isAll;
  final int toMembersNum;
  final String? roomId;
  final bool lucky;
  final List<Map<String, dynamic>>? cashBackList;
  final int? totalCashBack;
  final bool? isBlindCriticalHit;

  const GiftMsgJson({
    required this.id,
    required this.member,
    required this.toMembers,
    required this.giftId,
    required this.name,
    required this.cnt,
    required this.cost,
    required this.anchorIncome,
    this.sound,
    this.svgaAvatarKey,
    this.pagUrl,
    this.thumbUrl,
    this.type = 1,
    this.isAll = false,
    this.toMembersNum = 1,
    this.roomId,
    this.lucky = false,
    this.cashBackList,
    this.totalCashBack,
    this.isBlindCriticalHit,
  });

  factory GiftMsgJson.fromJson(Map<String, dynamic> json) {
    return GiftMsgJson(
      id: json['id']?.toString() ?? '',
      member: MemberJson.fromJson(json['member'] ?? {}),
      toMembers: (json['to_members'] as List?)?.map((m) => MemberJson.fromJson(m)).toList() ?? [],
      giftId: json['gift_id']?.toString() ?? '',
      name: json['name'] ?? '',
      cnt: json['cnt'] ?? 1,
      cost: json['cost'] ?? 0,
      anchorIncome: json['anchor_income'] ?? 0,
      sound: json['sound'],
      svgaAvatarKey: json['svga_avatar_key'],
      pagUrl: json['pag_url'],
      thumbUrl: json['thumb_url'],
      type: json['type'] ?? 1,
      isAll: json['is_all'] ?? false,
      toMembersNum: json['to_members_num'] ?? 1,
      roomId: json['room_id']?.toString(),
      lucky: json['lucky'] ?? false,
      cashBackList: (json['cash_back_list'] as List?)?.cast<Map<String, dynamic>>(),
      totalCashBack: json['total_cash_back'],
      isBlindCriticalHit: json['is_blind_critical_hit'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'member': member.toJson(),
    'to_members': toMembers.map((m) => m.toJson()).toList(),
    'gift_id': giftId,
    'name': name,
    'cnt': cnt,
    'cost': cost,
    'anchor_income': anchorIncome,
    'sound': sound,
    'svga_avatar_key': svgaAvatarKey,
    'pag_url': pagUrl,
    'thumb_url': thumbUrl,
    'type': type,
    'is_all': isAll,
    'to_members_num': toMembersNum,
    'room_id': roomId,
    'lucky': lucky,
    'cash_back_list': cashBackList,
    'total_cash_back': totalCashBack,
    'is_blind_critical_hit': isBlindCriticalHit,
  };
}

class VoiceRoomSession {
  final String roomId;
  final String title;
  final String hostName;
  final String hostAvatar;
  final int seatCapacity;
  final String category;
  final int listenerCount;
  final String? country;
  final String? countryFlag;
  final String? tag;
  final List<String> occupiedMicAvatars;
  final bool isLiveSpeaking;
  final bool isHost;

  VoiceRoomSession({
    required this.roomId,
    required this.title,
    required this.hostName,
    required this.hostAvatar,
    required this.seatCapacity,
    required this.category,
    this.listenerCount = 1,
    this.country,
    this.countryFlag,
    this.tag,
    this.occupiedMicAvatars = const [],
    this.isLiveSpeaking = false,
    this.isHost = false,
  });
}

class ProfileWalletBalanceJson {
  final int coins;
  final int diamonds;
  final int level;
  final int svipTier;
  final double weeklyIncomeUsd;

  const ProfileWalletBalanceJson({
    required this.coins,
    required this.diamonds,
    this.level = 1,
    this.svipTier = 0,
    this.weeklyIncomeUsd = 0.0,
  });
}
