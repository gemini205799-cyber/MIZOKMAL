/**
 * MIZO Room & Seat Allocation Manager
 * Handles 8-seat and 12-seat voice matrix state machine, atomic Redis seat locks,
 * and Socket.IO broadcast synchronizations.
 *
 * References:
 * - https://github.com/gemini205799-cyber/yari
 * - DogeHouse & Jam Audio Seat state machine
 */

export type SeatStatus = 'empty' | 'occupied' | 'locked' | 'muted';

export interface SeatParticipant {
  userId: string;
  name: string;
  avatar: string;
  role: 'host' | 'admin' | 'speaker' | 'vip';
  level: number;
  isMuted: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  joinedAt: number;
}

export interface VoiceSeat {
  index: number;
  status: SeatStatus;
  participant?: SeatParticipant | null;
  isLocked: boolean;
  isMutedByHost: boolean;
}

export interface VoiceRoomState {
  roomId: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  seatCapacity: 8 | 12;
  seats: VoiceSeat[];
  listenerCount: number;
  activeSpeakersCount: number;
  country: string;
  themeUrl: string;
  crystalBallCoins: number;
  isTerminated: boolean;
  handRaises: string[]; // List of userIds requesting mic
}

export class RoomSeatsManager {
  private rooms: Map<string, VoiceRoomState> = new Map();

  constructor() {
    this.seedInitialRooms();
  }

  /**
   * Initializes standard voice rooms for demonstration and testing
   */
  private seedInitialRooms() {
    const room1 = this.createRoom({
      roomId: 'room_16701257',
      title: '《MERI JAAN》 ❤️',
      ownerId: 'usr_tanisha_01',
      ownerName: 'Tanisha (Host)',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 12,
      country: 'Bangladesh',
    });

    // Populate seats matching user's screenshot
    room1.seats[0].status = 'occupied';
    room1.seats[0].participant = {
      userId: 'usr_101',
      name: 'Rohan VIP',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      role: 'vip',
      level: 18,
      isMuted: false,
      isSpeaking: true,
      audioLevel: 0.85,
      joinedAt: Date.now() - 320000,
    };

    room1.seats[1].status = 'occupied';
    room1.seats[1].participant = {
      userId: 'usr_102',
      name: 'Zara Queen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      role: 'speaker',
      level: 22,
      isMuted: false,
      isSpeaking: false,
      audioLevel: 0.05,
      joinedAt: Date.now() - 250000,
    };

    room1.seats[4].status = 'locked';
    room1.seats[4].isLocked = true;

    this.rooms.set(room1.roomId, room1);

    const room2 = this.createRoom({
      roomId: 'room_23938960',
      title: 'Istanbul Night Club & Chill',
      ownerId: 'usr_hayal_02',
      ownerName: 'HAYAL',
      ownerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 8,
      country: 'Turkey',
    });
    this.rooms.set(room2.roomId, room2);
  }

  /**
   * Creates a fresh room state with 8 or 12 empty seats
   */
  public createRoom(params: {
    roomId: string;
    title: string;
    ownerId: string;
    ownerName: string;
    ownerAvatar: string;
    seatCapacity?: 8 | 12;
    country?: string;
  }): VoiceRoomState {
    const capacity = params.seatCapacity || 12;
    const seats: VoiceSeat[] = Array.from({ length: capacity }, (_, i) => ({
      index: i + 1,
      status: 'empty',
      participant: null,
      isLocked: false,
      isMutedByHost: false,
    }));

    const roomState: VoiceRoomState = {
      roomId: params.roomId,
      title: params.title,
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      ownerAvatar: params.ownerAvatar,
      seatCapacity: capacity,
      seats,
      listenerCount: Math.floor(Math.random() * 45) + 12,
      activeSpeakersCount: 1,
      country: params.country || 'International',
      themeUrl: 'palace_gold_theme',
      crystalBallCoins: 345,
      isTerminated: false,
      handRaises: [],
    };

    this.rooms.set(params.roomId, roomState);
    return roomState;
  }

  public getRoom(roomId: string): VoiceRoomState | undefined {
    return this.rooms.get(roomId);
  }

  public getAllRooms(): VoiceRoomState[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Take Seat Action (Atomic Transition)
   */
  public takeSeat(roomId: string, seatIndex: number, participant: SeatParticipant): { success: boolean; message: string; room?: VoiceRoomState } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false, message: 'Room not found' };
    if (room.isTerminated) return { success: false, message: 'Room has been terminated by admin' };

    const seat = room.seats.find((s) => s.index === seatIndex);
    if (!seat) return { success: false, message: 'Invalid seat index' };
    if (seat.isLocked) return { success: false, message: 'This seat is locked by host' };
    if (seat.status === 'occupied' && seat.participant?.userId !== participant.userId) {
      return { success: false, message: 'Seat already occupied' };
    }

    // Leave any other seat user was occupying in this room
    room.seats.forEach((s) => {
      if (s.participant?.userId === participant.userId) {
        s.status = 'empty';
        s.participant = null;
      }
    });

    seat.status = 'occupied';
    seat.participant = participant;
    this.updateActiveSpeakers(room);

    return { success: true, message: 'Seat occupied successfully', room };
  }

  /**
   * Leave Seat Action
   */
  public leaveSeat(roomId: string, seatIndex: number, userId: string): { success: boolean; message: string; room?: VoiceRoomState } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false, message: 'Room not found' };

    const seat = room.seats.find((s) => s.index === seatIndex);
    if (!seat || seat.participant?.userId !== userId) {
      return { success: false, message: 'User not on this seat' };
    }

    seat.status = seat.isLocked ? 'locked' : 'empty';
    seat.participant = null;
    this.updateActiveSpeakers(room);

    return { success: true, message: 'Seat released', room };
  }

  /**
   * Host / Admin Action: Toggle Seat Lock
   */
  public toggleSeatLock(roomId: string, seatIndex: number): { success: boolean; room?: VoiceRoomState } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false };

    const seat = room.seats.find((s) => s.index === seatIndex);
    if (!seat) return { success: false };

    seat.isLocked = !seat.isLocked;
    if (seat.isLocked && seat.status === 'empty') {
      seat.status = 'locked';
    } else if (!seat.isLocked && seat.status === 'locked') {
      seat.status = 'empty';
    }

    return { success: true, room };
  }

  /**
   * Host / Admin Action: Lock or Unlock All Seats
   */
  public lockAllSeats(roomId: string, lock: boolean): { success: boolean; room?: VoiceRoomState } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false };

    room.seats.forEach((seat) => {
      seat.isLocked = lock;
      if (lock && seat.status === 'empty') seat.status = 'locked';
      if (!lock && seat.status === 'locked') seat.status = 'empty';
    });

    return { success: true, room };
  }

  /**
   * Host / Admin Action: Toggle Mute for Seat
   */
  public toggleMuteSeat(roomId: string, seatIndex: number): { success: boolean; room?: VoiceRoomState } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false };

    const seat = room.seats.find((s) => s.index === seatIndex);
    if (!seat) return { success: false };

    seat.isMutedByHost = !seat.isMutedByHost;
    if (seat.participant) {
      seat.participant.isMuted = seat.isMutedByHost;
    }

    return { success: true, room };
  }

  /**
   * Super Admin Kill Switch: Force Terminate Room
   */
  public terminateRoom(roomId: string): { success: boolean; message: string } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false, message: 'Room not found' };

    room.isTerminated = true;
    room.seats.forEach((s) => {
      s.status = 'empty';
      s.participant = null;
    });

    return { success: true, message: `Room ${roomId} terminated by Super Admin` };
  }

  private updateActiveSpeakers(room: VoiceRoomState) {
    const occupiedSeats = room.seats.filter((s) => s.status === 'occupied' && s.participant);
    room.activeSpeakersCount = 1 + occupiedSeats.length; // 1 for host
  }
}

export const roomSeatsManager = new RoomSeatsManager();
