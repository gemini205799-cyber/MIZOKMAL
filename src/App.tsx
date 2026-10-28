import React, { useState } from 'react';
import { 
  INITIAL_ROOMS, 
  INITIAL_USERS, 
  INITIAL_GIFTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_AGENCIES 
} from './mock/initialData';
import { VoiceRoom, UserAccount, GiftItem, TransactionRecord, WithdrawalRequest, AgencyData } from './types';
import { SuperAdminLayout } from './components/console/SuperAdminLayout';

export default function App() {
  // Global Ecosystem State
  const [rooms, setRooms] = useState<VoiceRoom[]>(INITIAL_ROOMS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [agencies] = useState<AgencyData[]>(INITIAL_AGENCIES);

  // Client Simulation State
  const [userCoins, setUserCoins] = useState<number>(148000);
  const [selectedMobileRoom, setSelectedMobileRoom] = useState<VoiceRoom>(rooms[0]);

  // Platform-wide Boss Mic Configuration (Admin Control)
  const [bossMicEnabled, setBossMicEnabled] = useState<boolean>(true);
  const [bossMicBasePrice, setBossMicBasePrice] = useState<number>(50000);

  // Console Action Handlers
  const handleTerminateRoom = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.roomId === roomId
          ? {
              ...r,
              isTerminated: true,
              seats: r.seats.map((s) => ({ ...s, status: 'empty', participant: null })),
            }
          : r
      )
    );
  };

  const handleToggleSeatMute = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target && target.participant) {
          target.isMutedByHost = !target.isMutedByHost;
          target.participant.isMuted = target.isMutedByHost;
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  const handleKickParticipant = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target) {
          target.status = 'empty';
          target.participant = null;
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  const handleToggleSeatLock = (roomId: string, seatIndex: number) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);
        if (target) {
          target.isLocked = !target.isLocked;
          target.status = target.isLocked ? 'locked' : target.participant ? 'occupied' : 'empty';
        }
        return { ...r, seats: newSeats };
      })
    );
  };

  // Gift Transaction Simulation
  const handleSendGift = (gift: GiftItem, combo: number = 1) => {
    const totalCost = gift.coinPrice * combo;
    if (userCoins < totalCost) {
      alert(`Insufficient Coins! Need ${totalCost} coins.`);
      return;
    }

    setUserCoins((prev) => prev - totalCost);

    const totalDiamonds = Math.round(gift.diamondValue * combo * 0.7);

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== selectedMobileRoom.roomId) return r;
        return {
          ...r,
          crystalBallCoins: r.crystalBallCoins + totalCost,
        };
      })
    );

    const newTx: TransactionRecord = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: 'Just now',
      senderName: 'Eyad Trader (Me)',
      receiverName: selectedMobileRoom.hostName,
      giftName: gift.name,
      giftIcon: gift.icon,
      combo,
      totalCoins: totalCost,
      totalDiamonds: totalDiamonds,
      platformShareCoins: Math.round(totalCost * 0.3),
      roomId: selectedMobileRoom.roomId,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Client Seat Action Handler
  const handleClientSeatAction = (
    seatIndex: number,
    action: 'take' | 'lock' | 'lock_all' | 'mute' | 'leave'
  ) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomId !== selectedMobileRoom.roomId) return r;
        const newSeats = [...r.seats];
        const target = newSeats.find((s) => s.index === seatIndex);

        if (!target) return r;

        if (action === 'take') {
          target.status = 'occupied';
          target.participant = {
            userId: 'usr_me',
            name: 'Me (Kit Kat)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            role: 'speaker',
            level: 77,
            isMuted: false,
            isSpeaking: true,
            audioLevel: 0.9,
          };
        } else if (action === 'lock') {
          target.isLocked = !target.isLocked;
          target.status = target.isLocked ? 'locked' : 'empty';
        } else if (action === 'lock_all') {
          newSeats.forEach((s) => {
            s.isLocked = true;
            if (s.status === 'empty') s.status = 'locked';
          });
        } else if (action === 'mute') {
          target.isMutedByHost = !target.isMutedByHost;
          if (target.participant) target.participant.isMuted = target.isMutedByHost;
        }

        return { ...r, seats: newSeats };
      })
    );
  };

  return (
    <SuperAdminLayout
      rooms={rooms}
      users={users}
      gifts={gifts}
      transactions={transactions}
      withdrawals={withdrawals}
      agencies={agencies}
      onTerminateRoom={handleTerminateRoom}
      onToggleSeatMute={handleToggleSeatMute}
      onKickParticipant={handleKickParticipant}
      onToggleSeatLock={handleToggleSeatLock}
      onUpdateUserStatus={(userId, newStatus) =>
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        )
      }
      onAdjustUserWallet={(userId, deltaCoins, deltaDiamonds) =>
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  coins: Math.max(0, u.coins + deltaCoins),
                  diamonds: Math.max(0, u.diamonds + deltaDiamonds),
                }
              : u
          )
        )
      }
      onToggleKycVerification={(userId) =>
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isKycVerified: !u.isKycVerified } : u))
        )
      }
      onAddGift={(newGift) => setGifts((prev) => [newGift, ...prev])}
      onDeleteGift={(giftId) => setGifts((prev) => prev.filter((g) => g.id !== giftId))}
      onReviewWithdrawal={(id, approved) =>
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.id === id ? { ...w, status: approved ? 'approved' : 'rejected' } : w
          )
        )
      }
      bossMicEnabled={bossMicEnabled}
      bossMicBasePrice={bossMicBasePrice}
      onUpdateBossMic={(enabled: boolean, basePrice: number) => {
        setBossMicEnabled(enabled);
        setBossMicBasePrice(basePrice);
      }}
      userCoins={userCoins}
      onSendGift={handleSendGift}
      onSeatAction={handleClientSeatAction}
    />
  );
}
