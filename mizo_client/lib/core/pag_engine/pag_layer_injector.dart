/// MIZO Tencent libpag Dynamic Layer Injector
/// Implements layer replacement matching https://github.com/tencent/libpag/wiki
///
/// Injects:
/// 1. Sender avatar into designated PAG image layer
/// 2. Receiver avatar into designated PAG image layer
/// 3. Nickname and combo texts into dynamic typography vector layers
library;

class PagDynamicLayerSlot {
  final String slotKey;
  final String targetUrl;
  final bool isImage;
  final String? textContent;

  const PagDynamicLayerSlot({
    required this.slotKey,
    this.targetUrl = '',
    this.isImage = true,
    this.textContent,
  });
}

class PagLayerInjector {
  /// Resolves the specific dynamic layer slots from Gift metadata
  static List<PagDynamicLayerSlot> resolveSlots({
    required String? specialAvatarKey,
    required String senderAvatar,
    required String senderNickname,
    required String receiverAvatar,
    required String receiverNickname,
    required int comboCount,
  }) {
    final slots = <PagDynamicLayerSlot>[
      // Standard Sender Avatar Slot
      PagDynamicLayerSlot(
        slotKey: 'avatar_sender',
        targetUrl: senderAvatar,
        isImage: true,
      ),

      // Standard Receiver Avatar Slot
      PagDynamicLayerSlot(
        slotKey: 'avatar_receiver',
        targetUrl: receiverAvatar,
        isImage: true,
      ),

      // Text: Sender Nickname
      PagDynamicLayerSlot(
        slotKey: 'text_sender_name',
        isImage: false,
        textContent: senderNickname,
      ),

      // Text: Receiver Nickname
      PagDynamicLayerSlot(
        slotKey: 'text_receiver_name',
        isImage: false,
        textContent: receiverNickname,
      ),

      // Text: Combo Multiplier
      PagDynamicLayerSlot(
        slotKey: 'text_combo_count',
        isImage: false,
        textContent: 'x$comboCount',
      ),
    ];

    // Special Slot (e.g. driver seat, astronaut helmet, lucky wheel champion)
    if (specialAvatarKey != null && specialAvatarKey.isNotEmpty) {
      slots.add(
        PagDynamicLayerSlot(
          slotKey: specialAvatarKey,
          targetUrl: senderAvatar,
          isImage: true,
        ),
      );
    }

    return slots;
  }
}
