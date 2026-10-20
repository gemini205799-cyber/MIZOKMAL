/**
 * MIZO Backend Express Router
 * Exposes core REST APIs for LiveKit token provisioning, room administration,
 * user trust & safety, gift matrix CMS, and agency metrics.
 */

import { Router, Request, Response } from 'express';
import { livekitTokenService } from '../services/livekitTokenService.js';
import { roomSeatsManager } from '../services/roomSeatsManager.js';
import { giftController } from '../controllers/giftController.js';

export const apiRouter = Router();

/**
 * LiveKit Token Provisioning Endpoint
 */
apiRouter.post('/livekit/token', (req: Request, res: Response) => {
  try {
    const { roomName, identity, name, role, avatar, metadata } = req.body;
    if (!roomName || !identity || !name) {
      return res.status(400).json({ error: 'roomName, identity, and name are required' });
    }

    const tokenResponse = livekitTokenService.generateToken({
      roomName,
      identity,
      name,
      role: role || 'listener',
      avatar,
      metadata,
    });

    return res.json(tokenResponse);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Voice Rooms Monitoring & Management
 */
apiRouter.get('/rooms', (_req: Request, res: Response) => {
  const rooms = roomSeatsManager.getAllRooms();
  return res.json({
    totalRooms: rooms.length,
    activeCCU: rooms.reduce((acc, r) => acc + r.listenerCount + r.seats.filter(s => s.status === 'occupied').length, 0),
    rooms,
  });
});

apiRouter.get('/rooms/:id', (req: Request, res: Response) => {
  const room = roomSeatsManager.getRoom(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  return res.json(room);
});

apiRouter.post('/rooms/:id/terminate', (req: Request, res: Response) => {
  const result = roomSeatsManager.terminateRoom(req.params.id);
  return res.json(result);
});

apiRouter.post('/rooms/:id/seats/:index/action', (req: Request, res: Response) => {
  const { action, participant, lock } = req.body;
  const index = parseInt(req.params.index, 10);
  const roomId = req.params.id;

  if (action === 'take') {
    const result = roomSeatsManager.takeSeat(roomId, index, participant);
    return res.json(result);
  } else if (action === 'leave') {
    const result = roomSeatsManager.leaveSeat(roomId, index, participant?.userId || req.body.userId);
    return res.json(result);
  } else if (action === 'lock') {
    const result = roomSeatsManager.toggleSeatLock(roomId, index);
    return res.json(result);
  } else if (action === 'lock_all') {
    const result = roomSeatsManager.lockAllSeats(roomId, lock ?? true);
    return res.json(result);
  } else if (action === 'mute') {
    const result = roomSeatsManager.toggleMuteSeat(roomId, index);
    return res.json(result);
  }

  return res.status(400).json({ error: 'Unknown seat action' });
});

/**
 * Gift Matrix CMS & Transaction Endpoints
 */
apiRouter.get('/gifts', (_req: Request, res: Response) => {
  return res.json(giftController.getCatalog());
});

apiRouter.post('/gifts', (req: Request, res: Response) => {
  const gift = giftController.addOrUpdateGift(req.body);
  return res.status(201).json(gift);
});

apiRouter.delete('/gifts/:id', (req: Request, res: Response) => {
  const deleted = giftController.deleteGift(req.params.id);
  return res.json({ success: deleted });
});

apiRouter.post('/gifts/send', (req: Request, res: Response) => {
  try {
    const tx = giftController.processGiftSend(req.body);
    return res.json(tx);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

apiRouter.get('/ledger/transactions', (_req: Request, res: Response) => {
  return res.json(giftController.getTransactions());
});

/**
 * User Identity & Trust/Safety APIs
 */
apiRouter.get('/users/wallet/:userId', (req: Request, res: Response) => {
  const wallet = giftController.getWallet(req.params.userId);
  return res.json(wallet);
});

apiRouter.post('/users/wallet/:userId/adjust', (req: Request, res: Response) => {
  const { deltaCoins, deltaDiamonds } = req.body;
  const updated = giftController.adjustWallet(req.params.userId, deltaCoins || 0, deltaDiamonds || 0);
  return res.json(updated);
});
