/// MIZO Gift Queue & Combo Batter Manager
/// Implements priority sequencing for full-screen SVGA/PAG animations
/// and side floating badges for high-frequency combo batter gifts.
///
/// References:
/// - view_live_bullet_item_room_gift.xml
/// - layout_room_gift_double_hit_circle.xml

import 'dart:async';
import 'dart:collection';
import 'package:flutter/foundation.dart';
import '../models/habi_models.dart';

class ComboBadgeItem {
  final String comboKey; // senderId_giftId
  final String senderName;
  final String senderAvatar;
  final String receiverName;
  final String giftName;
  final String giftThumb;
  int currentCombo;
  Timer? expiryTimer;

  ComboBadgeItem({
    required this.comboKey,
    required this.senderName,
    required this.senderAvatar,
    required this.receiverName,
    required this.giftName,
    required this.giftThumb,
    required this.currentCombo,
  });
}

class GiftQueueManager extends ChangeNotifier {
  final Queue<GiftMsgJson> _fullScreenQueue = Queue();
  final Map<String, ComboBadgeItem> _activeCombos = {};
  
  GiftMsgJson? _currentlyPlayingGift;
  bool _isPlaying = false;

  GiftMsgJson? get currentlyPlayingGift => _currentlyPlayingGift;
  bool get isPlaying => _isPlaying;
  List<ComboBadgeItem> get activeCombos => _activeCombos.values.toList();

  /// Enqueue incoming gift packet from Socket.IO
  void handleIncomingGift(GiftMsgJson giftMsg) {
    // 1. If it's a combo/batter item (small gift, type == 1 or marked combo), update side badge
    if (giftMsg.cnt > 1 || (giftMsg.type == 1 && (giftMsg.svgaAvatarKey == null && giftMsg.pagUrl == null))) {
      _processComboBadge(giftMsg);
    }

    // 2. If it contains a large animation (SVGA or PAG), enqueue for full-screen sequence
    if (giftMsg.svgaAvatarKey != null || giftMsg.pagUrl != null || giftMsg.type >= 2) {
      _fullScreenQueue.add(giftMsg);
      _processNextInQueue();
    }
  }

  void _processComboBadge(GiftMsgJson giftMsg) {
    final key = '${giftMsg.member.id}_${giftMsg.giftId}';

    if (_activeCombos.containsKey(key)) {
      final existing = _activeCombos[key]!;
      existing.currentCombo += giftMsg.cnt;
      existing.expiryTimer?.cancel();
      existing.expiryTimer = Timer(const Duration(seconds: 3), () {
        _activeCombos.remove(key);
        notifyListeners();
      });
    } else {
      final badge = ComboBadgeItem(
        comboKey: key,
        senderName: giftMsg.member.nickname,
        senderAvatar: giftMsg.member.avatar,
        receiverName: giftMsg.toMembers.firstOrNull?.nickname ?? 'Room',
        giftName: giftMsg.name,
        giftThumb: giftMsg.thumbUrl ?? '',
        currentCombo: giftMsg.cnt,
      );

      badge.expiryTimer = Timer(const Duration(seconds: 3), () {
        _activeCombos.remove(key);
        notifyListeners();
      });

      _activeCombos[key] = badge;
    }

    notifyListeners();
  }

  void _processNextInQueue() {
    if (_isPlaying || _fullScreenQueue.isEmpty) return;

    _isPlaying = true;
    _currentlyPlayingGift = _fullScreenQueue.removeFirst();
    notifyListeners();

    // Full screen animation plays for duration (defaults to 4.5 seconds)
    final durationSeconds = 4.5;
    Timer(Duration(milliseconds: (durationSeconds * 1000).toInt()), () {
      _currentlyPlayingGift = null;
      _isPlaying = false;
      notifyListeners();

      // Process next queued animation if any
      if (_fullScreenQueue.isNotEmpty) {
        _processNextInQueue();
      }
    });
  }

  @override
  void dispose() {
    for (final b in _activeCombos.values) {
      b.expiryTimer?.cancel();
    }
    _activeCombos.clear();
    _fullScreenQueue.clear();
    super.dispose();
  }
}
