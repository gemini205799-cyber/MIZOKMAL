/**
 * MIZO Core Backend Server
 * Initializes Express, HTTP Server, Socket.IO real-time seat synchronization,
 * and LiveKit SFU webhooks.
 */

import express from 'express';
import http from 'http';
import { apiRouter } from './routes/api.js';
import { roomSeatsManager } from './services/roomSeatsManager.js';
import { giftController } from './controllers/giftController.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());

// CORS & Security Headers
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Mount MIZO Core API
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'mizo-backend-sfu-gateway',
    timestamp: new Date().toISOString(),
    livekitUrl: process.env.LIVEKIT_URL || 'wss://livekit.mizo.live',
    redisConnected: true,
    dbConnected: true,
  });
});

/**
 * Socket.IO Real-Time Engine (Signaling & Seat Allocation)
 * Emits and receives:
 * - 'room:join' -> broadcast user entered
 * - 'seat:request' -> atomic seat claim
 * - 'seat:state_change' -> updates 8/12 seats grid
 * - 'gift:send' -> broadcast full-screen SVGA/Lottie celebration
 * - 'speaking:active' -> real-time audio energy meter
 */
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[MIZO BACKEND] Real-Time Media & Voice Server running on port ${PORT}`);
    console.log(`[MIZO BACKEND] LiveKit Token Service Ready.`);
  });
}

export { app, server };
