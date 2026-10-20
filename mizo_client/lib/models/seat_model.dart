/// MIZO Seat & Participant Data Models
/// Supports 8-seat and 12-seat dynamic matrices.

enum SeatStatus { empty, occupied, locked, muted }

enum UserRole { host, admin, speaker, vip, listener }

class ParticipantModel {
  final String userId;
  final String name;
  final String avatarUrl;
  final UserRole role;
  final int level;
  final bool isMuted;
  final bool isSpeaking;
  final double audioLevel;

  const ParticipantModel({
    required this.userId,
    required this.name,
    required this.avatarUrl,
    this.role = UserRole.speaker,
    this.level = 1,
    this.isMuted = false,
    this.isSpeaking = false,
    this.audioLevel = 0.0,
  });

  ParticipantModel copyWith({
    String? userId,
    String? name,
    String? avatarUrl,
    UserRole? role,
    int? level,
    bool? isMuted,
    bool? isSpeaking,
    double? audioLevel,
  }) {
    return ParticipantModel(
      userId: userId ?? this.userId,
      name: name ?? this.name,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
      level: level ?? this.level,
      isMuted: isMuted ?? this.isMuted,
      isSpeaking: isSpeaking ?? this.isSpeaking,
      audioLevel: audioLevel ?? this.audioLevel,
    );
  }

  factory ParticipantModel.fromJson(Map<String, dynamic> json) {
    return ParticipantModel(
      userId: json['userId'] ?? '',
      name: json['name'] ?? '',
      avatarUrl: json['avatar'] ?? json['avatarUrl'] ?? '',
      role: _parseRole(json['role']),
      level: json['level'] ?? 1,
      isMuted: json['isMuted'] ?? false,
      isSpeaking: json['isSpeaking'] ?? false,
      audioLevel: (json['audioLevel'] as num?)?.toDouble() ?? 0.0,
    );
  }

  static UserRole _parseRole(dynamic role) {
    switch (role) {
      case 'host':
        return UserRole.host;
      case 'admin':
        return UserRole.admin;
      case 'vip':
        return UserRole.vip;
      default:
        return UserRole.speaker;
    }
  }
}

class SeatModel {
  final int index;
  final SeatStatus status;
  final ParticipantModel? participant;
  final bool isLocked;
  final bool isMutedByHost;

  const SeatModel({
    required this.index,
    this.status = SeatStatus.empty,
    this.participant,
    this.isLocked = false,
    this.isMutedByHost = false,
  });

  bool get isOccupied => status == SeatStatus.occupied && participant != null;

  SeatModel copyWith({
    int? index,
    SeatStatus? status,
    ParticipantModel? participant,
    bool? isLocked,
    bool? isMutedByHost,
  }) {
    return SeatModel(
      index: index ?? this.index,
      status: status ?? this.status,
      participant: participant ?? this.participant,
      isLocked: isLocked ?? this.isLocked,
      isMutedByHost: isMutedByHost ?? this.isMutedByHost,
    );
  }

  factory SeatModel.fromJson(Map<String, dynamic> json) {
    return SeatModel(
      index: json['index'] ?? 1,
      status: _parseStatus(json['status']),
      participant: json['participant'] != null
          ? ParticipantModel.fromJson(json['participant'])
          : null,
      isLocked: json['isLocked'] ?? false,
      isMutedByHost: json['isMutedByHost'] ?? false,
    );
  }

  static SeatStatus _parseStatus(dynamic s) {
    switch (s) {
      case 'occupied':
        return SeatStatus.occupied;
      case 'locked':
        return SeatStatus.locked;
      case 'muted':
        return SeatStatus.muted;
      default:
        return SeatStatus.empty;
    }
  }
}
