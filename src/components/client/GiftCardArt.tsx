import React from 'react';

interface GiftArtProps {
  giftId: string;
  className?: string;
  size?: number;
}

/**
 * 3D Ultra-Luxury Gift Artwork Renderer (Tencent libpag & SVGA Standard)
 * Replaces outdated flat emojis with high-end 3D illustrated vectors,
 * metallic gradients, lighting glows, and pedestal reflections matching Habi & Yari.
 * Strictly 100% English naming and styling.
 */
export const GiftCardArt: React.FC<GiftArtProps> = ({ giftId, size = 64 }) => {
  switch (giftId) {
    case 'gift_super_car':
      // 3D Gold McLaren Hypercar on Cyberpunk Podium
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.5)]">
          <defs>
            <linearGradient id="goldCar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="80%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id="neonGlowCar" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F5A0" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="windshieldCar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="78" rx="42" ry="10" fill="url(#neonGlowCar)" />
          <ellipse cx="50" cy="76" rx="38" ry="6" fill="#000" opacity="0.6" />
          <circle cx="28" cy="70" r="9" fill="#1E293B" stroke="#FFD700" strokeWidth="2" />
          <circle cx="28" cy="70" r="4" fill="#FFD700" />
          <circle cx="72" cy="70" r="9" fill="#1E293B" stroke="#FFD700" strokeWidth="2" />
          <circle cx="72" cy="70" r="4" fill="#FFD700" />
          <path
            d="M14 62 C16 54, 25 50, 34 50 L42 42 C48 36, 62 36, 70 42 L80 50 C88 52, 92 58, 90 64 L86 68 C82 70, 78 70, 76 68 L24 68 C20 70, 16 68, 14 62 Z"
            fill="url(#goldCar)"
          />
          <path d="M42 43 C46 38, 58 38, 66 43 L74 50 L36 50 Z" fill="url(#windshieldCar)" stroke="#FFD700" strokeWidth="0.8" />
          <polygon points="14,60 6,56 6,66 14,64" fill="#00E5FF" opacity="0.85" />
          <polygon points="90,62 96,60 96,65 90,64" fill="#FF2E93" opacity="0.9" />
          <path d="M78 44 L88 40 L88 44 Z" fill="#FFD700" />
          <circle cx="48" cy="46" r="2" fill="#FFF" opacity="0.8" />
        </svg>
      );

    case 'gift_bugatti':
      // 3D Bugatti Chiron Obsidian Edition with Cyan Energy Aura
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(0,245,160,0.5)]">
          <defs>
            <linearGradient id="bugattiBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="45%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="cyanStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F5A0" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <radialGradient id="cyanHalo" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="78" rx="44" ry="10" fill="url(#cyanHalo)" />
          <circle cx="26" cy="69" r="9.5" fill="#0F172A" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="26" cy="69" r="4" fill="#00F5A0" />
          <circle cx="74" cy="69" r="9.5" fill="#0F172A" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="74" cy="69" r="4" fill="#00F5A0" />
          <path
            d="M12 60 C15 50, 24 46, 35 46 L45 38 C52 32, 64 32, 72 38 L82 46 C90 48, 94 54, 92 62 L88 67 L16 67 Z"
            fill="url(#bugattiBody)"
            stroke="#00E5FF"
            strokeWidth="1.2"
          />
          {/* Bugatti Signature Horseshoe C-line */}
          <path d="M68 40 C78 44, 82 56, 76 66 L64 66 C72 58, 68 46, 62 42 Z" fill="url(#cyanStripe)" />
          <path d="M44 40 C48 35, 60 35, 66 40 L72 47 L36 47 Z" fill="#38BDF8" opacity="0.8" />
          <polygon points="12,58 4,54 4,62 12,61" fill="#00F5A0" />
          <polygon points="92,60 98,58 98,63 92,62" fill="#00E5FF" />
        </svg>
      );

    case 'gift_golden_bike':
      // 3D Cruiser Golden Chopper Superbike
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.55)]">
          <defs>
            <linearGradient id="goldBikeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FFD700" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id="bikeHalo" cx="50%" cy="82%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="80" rx="38" ry="8" fill="url(#bikeHalo)" />
          {/* Wheels */}
          <circle cx="22" cy="65" r="14" fill="#0F172A" stroke="url(#goldBikeGrad)" strokeWidth="3" />
          <circle cx="22" cy="65" r="5" fill="#FFD700" />
          <circle cx="78" cy="65" r="14" fill="#0F172A" stroke="url(#goldBikeGrad)" strokeWidth="3" />
          <circle cx="78" cy="65" r="5" fill="#FFD700" />
          {/* Chrome Spokes */}
          <line x1="22" y1="51" x2="22" y2="79" stroke="#FFD700" strokeWidth="1" />
          <line x1="8" y1="65" x2="36" y2="65" stroke="#FFD700" strokeWidth="1" />
          <line x1="78" y1="51" x2="78" y2="79" stroke="#FFD700" strokeWidth="1" />
          <line x1="64" y1="65" x2="92" y2="65" stroke="#FFD700" strokeWidth="1" />
          {/* Engine & Frame */}
          <rect x="36" y="52" width="22" height="16" rx="4" fill="#334155" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M22 65 L44 54 L62 44 L78 65" stroke="url(#goldBikeGrad)" strokeWidth="4" strokeLinecap="round" />
          {/* High Handlebars */}
          <path d="M62 44 L68 28 L62 25" stroke="url(#goldBikeGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Teardrop Fuel Tank */}
          <path d="M46 44 C52 38, 62 40, 62 46 C58 50, 48 50, 46 44 Z" fill="url(#goldBikeGrad)" />
          {/* Exhaust Pipe Flame */}
          <path d="M44 64 L26 70" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="24,70 14,71 18,74" fill="#FF2E93" />
        </svg>
      );

    case 'gift_space_rocket':
      // 3D Falcon Galactic Starship with Plasma Exhaust
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_18px_rgba(0,229,255,0.6)]">
          <defs>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FF2E93" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rocketFins" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF2E93" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          <path d="M42 74 C40 88, 50 98, 50 98 C50 98, 60 88, 58 74 Z" fill="url(#flameGrad)" />
          <path d="M46 74 C44 84, 50 90, 50 90 C50 90, 56 84, 54 74 Z" fill="#FFF" />
          <path d="M34 58 L20 72 L36 72 Z" fill="url(#rocketFins)" stroke="#FFD700" strokeWidth="1" />
          <path d="M66 58 L80 72 L64 72 Z" fill="url(#rocketFins)" stroke="#FFD700" strokeWidth="1" />
          <path d="M50 12 C40 28, 36 50, 36 74 L64 74 C64 50, 60 28, 50 12 Z" fill="url(#rocketBody)" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M50 12 C46 20, 44 26, 44 32 L56 32 C56 26, 54 20, 50 12 Z" fill="url(#rocketFins)" />
          <circle cx="50" cy="42" r="7" fill="#0284C7" stroke="#FFD700" strokeWidth="2" />
          <circle cx="48" cy="40" r="2.5" fill="#FFF" opacity="0.9" />
          <circle cx="22" cy="24" r="1.5" fill="#FFD700" />
          <circle cx="78" cy="30" r="2" fill="#00E5FF" />
        </svg>
      );

    case 'gift_cyber_dragon':
      // 3D Imperial Emerald Cyber Dragon
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_18px_rgba(0,245,160,0.6)]">
          <defs>
            <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="30%" stopColor="#10B981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="goldHorns" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Coiled Serpent Body */}
          <path
            d="M20 75 C15 55, 30 40, 50 45 C70 50, 85 35, 75 20 C65 10, 45 15, 45 25 C45 35, 60 40, 55 58 C50 72, 35 85, 20 75 Z"
            fill="url(#dragonGrad)"
            stroke="#00F5A0"
            strokeWidth="2.5"
          />
          {/* Dragon Head */}
          <path d="M72 18 L88 12 L84 26 L76 30 Z" fill="url(#dragonGrad)" stroke="#FFD700" strokeWidth="1.5" />
          {/* Golden Horns */}
          <path d="M74 16 L80 4 L76 12 Z" fill="url(#goldHorns)" />
          <path d="M70 18 L72 6 L68 14 Z" fill="url(#goldHorns)" />
          {/* Glowing Eye */}
          <circle cx="80" cy="18" r="2.5" fill="#FFD700" />
          <circle cx="80" cy="18" r="1.2" fill="#BE123C" />
          {/* Lightning Fire Breath */}
          <path d="M88 16 Q96 14 98 22 Q92 24 86 22 Z" fill="#FF2E93" />
          <polygon points="90,16 98,12 94,18 100,16 92,24" fill="#FFD700" />
          {/* Back Spines */}
          <polygon points="36,44 40,38 42,46" fill="#FFD700" />
          <polygon points="52,48 56,42 58,50" fill="#FFD700" />
          <polygon points="68,36 72,30 74,38" fill="#FFD700" />
        </svg>
      );

    case 'gift_phoenix':
      // 3D Celestial Phoenix Rising
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_18px_rgba(255,46,147,0.6)]">
          <defs>
            <linearGradient id="phoenixFire" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <radialGradient id="phoenixHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF2E93" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="38" fill="url(#phoenixHalo)" />
          {/* Sweeping Left Wing */}
          <path d="M50 55 C35 45, 12 40, 10 20 C18 32, 30 38, 44 46 Z" fill="url(#phoenixFire)" />
          <path d="M50 55 C38 50, 18 52, 14 36 C24 44, 36 48, 46 52 Z" fill="#FBBF24" />
          {/* Sweeping Right Wing */}
          <path d="M50 55 C65 45, 88 40, 90 20 C82 32, 70 38, 56 46 Z" fill="url(#phoenixFire)" />
          <path d="M50 55 C62 50, 82 52, 86 36 C76 44, 64 48, 54 52 Z" fill="#FBBF24" />
          {/* Majestic Phoenix Head & Crown */}
          <path d="M48 34 L50 20 L54 26 L56 34 Z" fill="#FFF2A3" stroke="#D97706" strokeWidth="1" />
          <circle cx="51" cy="24" r="1.5" fill="#BE123C" />
          <polygon points="50,14 52,18 48,18" fill="#FFD700" />
          {/* Long Fire Tail Feathers */}
          <path d="M50 60 Q42 78 40 94 Q48 84 50 68" fill="url(#phoenixFire)" />
          <path d="M50 60 Q58 78 60 94 Q52 84 50 68" fill="url(#phoenixFire)" />
          <path d="M50 64 Q50 82 50 98 Q50 86 50 70" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'gift_private_jet':
      // 3D Gulfstream Celestial Jet
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,215,0,0.5)]">
          <defs>
            <linearGradient id="jetBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="jetGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
          </defs>
          {/* Cloud Vapors */}
          <ellipse cx="50" cy="74" rx="36" ry="6" fill="#38BDF8" opacity="0.3" />
          {/* Jet Swept Wings */}
          <path d="M48 48 L10 68 L24 68 L54 54 Z" fill="url(#jetGold)" stroke="#D97706" strokeWidth="1" />
          <path d="M52 48 L90 68 L76 68 L46 54 Z" fill="url(#jetGold)" stroke="#D97706" strokeWidth="1" />
          {/* Fuselage */}
          <path d="M50 14 C44 26, 42 56, 44 80 L56 80 C58 56, 56 26, 50 14 Z" fill="url(#jetBody)" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Cockpit Window */}
          <path d="M46 26 C48 22, 52 22, 54 26 L55 30 L45 30 Z" fill="#0284C7" stroke="#FFD700" strokeWidth="0.8" />
          {/* Gold Cabin Windows */}
          <circle cx="48" cy="38" r="1.5" fill="#FFD700" />
          <circle cx="48" cy="44" r="1.5" fill="#FFD700" />
          <circle cx="48" cy="50" r="1.5" fill="#FFD700" />
          <circle cx="52" cy="38" r="1.5" fill="#FFD700" />
          <circle cx="52" cy="44" r="1.5" fill="#FFD700" />
          <circle cx="52" cy="50" r="1.5" fill="#FFD700" />
          {/* T-Tail */}
          <path d="M48 76 L34 82 L38 85 L50 82 L62 85 L66 82 L52 76 Z" fill="url(#jetGold)" />
        </svg>
      );

    case 'gift_luxury_yacht':
      // 3D Sovereign Golden Superyacht
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id="yachtHull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="yachtGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Ocean Waves */}
          <path d="M6 76 Q26 72 50 76 Q74 80 94 76" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 82 Q36 78 54 82 Q78 86 86 82" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* Hull */}
          <path d="M12 66 L22 76 L78 76 L90 56 L68 56 L12 66 Z" fill="url(#yachtHull)" stroke="#FFD700" strokeWidth="1.5" />
          {/* Deck Tier 1 */}
          <rect x="28" y="46" width="46" height="12" rx="3" fill="#FFFFFF" stroke="url(#yachtGold)" strokeWidth="1.2" />
          {/* Deck Tier 2 Flybridge */}
          <rect x="36" y="36" width="30" height="11" rx="2" fill="url(#yachtGold)" />
          {/* Tinted Windows */}
          <rect x="32" y="49" width="36" height="5" rx="1" fill="#0F172A" />
          <rect x="40" y="38" width="22" height="4" rx="1" fill="#38BDF8" />
          {/* Radar Mast */}
          <line x1="52" y1="36" x2="52" y2="26" stroke="#FFD700" strokeWidth="1.5" />
          <ellipse cx="52" cy="26" rx="6" ry="2" fill="#FFD700" />
        </svg>
      );

    case 'gift_lucky_wheel':
      // 3D Sultan Gold Casino Roulette Wheel 500x
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,46,147,0.55)]">
          <defs>
            <linearGradient id="wheelRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <radialGradient id="centerGem" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FF80BF" />
              <stop offset="60%" stopColor="#FF2E93" />
              <stop offset="100%" stopColor="#701A75" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="#1E1238" stroke="url(#wheelRim)" strokeWidth="4.5" />
          <path d="M50 50 L50 12 A38 38 0 0 1 83 31 Z" fill="#DC2626" />
          <path d="M50 50 L83 31 A38 38 0 0 1 83 69 Z" fill="#7C3AED" />
          <path d="M50 50 L83 69 A38 38 0 0 1 50 88 Z" fill="#059669" />
          <path d="M50 50 L50 88 A38 38 0 0 1 17 69 Z" fill="#D97706" />
          <path d="M50 50 L17 69 A38 38 0 0 1 17 31 Z" fill="#2563EB" />
          <path d="M50 50 L17 31 A38 38 0 0 1 50 12 Z" fill="#BE123C" />
          <circle cx="50" cy="12" r="2.5" fill="#FFD700" />
          <circle cx="83" cy="31" r="2.5" fill="#FFD700" />
          <circle cx="83" cy="69" r="2.5" fill="#FFD700" />
          <circle cx="50" cy="88" r="2.5" fill="#FFD700" />
          <circle cx="17" cy="69" r="2.5" fill="#FFD700" />
          <circle cx="17" cy="31" r="2.5" fill="#FFD700" />
          <circle cx="50" cy="50" r="14" fill="url(#centerGem)" stroke="#FFD700" strokeWidth="2.5" />
          <polygon points="50,28 54,38 46,38" fill="#FFD700" stroke="#000" strokeWidth="0.8" />
          <circle cx="47" cy="47" r="3" fill="#FFF" opacity="0.85" />
        </svg>
      );

    case 'gift_lucky_chest':
      // 3D Pharaoh Gold Treasure Vault 100x
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,215,0,0.6)]">
          <defs>
            <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#581C87" />
              <stop offset="100%" stopColor="#2E1065" />
            </linearGradient>
          </defs>
          <path d="M22 42 C22 28, 78 28, 78 42 L74 46 L26 46 Z" fill="url(#chestGold)" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx="50" cy="46" rx="26" ry="7" fill="#FEF08A" />
          <circle cx="44" cy="44" r="4" fill="#00F5A0" />
          <circle cx="56" cy="44" r="4.5" fill="#FF2E93" />
          <circle cx="50" cy="42" r="3" fill="#38BDF8" />
          <circle cx="38" cy="45" r="2.5" fill="#FFD700" />
          <circle cx="62" cy="45" r="3" fill="#FFD700" />
          <rect x="22" y="46" width="56" height="34" rx="6" fill="url(#chestWood)" stroke="url(#chestGold)" strokeWidth="3" />
          <rect x="34" y="46" width="6" height="34" fill="url(#chestGold)" />
          <rect x="60" y="46" width="6" height="34" fill="url(#chestGold)" />
          <circle cx="50" cy="62" r="6" fill="url(#chestGold)" stroke="#78350F" strokeWidth="1" />
          <polygon points="50,60 52,65 48,65" fill="#0D0B18" />
        </svg>
      );

    case 'gift_super_fans_crest':
      // 3D Imperial Gold Diamond Crown
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,215,0,0.65)]">
          <defs>
            <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id="rubyGem" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="74" rx="34" ry="7" fill="url(#crownGold)" stroke="#78350F" strokeWidth="1" />
          <path
            d="M18 72 L22 36 L36 54 L50 24 L64 54 L78 36 L82 72 Z"
            fill="url(#crownGold)"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="36" r="4.5" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
          <circle cx="50" cy="24" r="6" fill="url(#rubyGem)" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="78" cy="36" r="4.5" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
          <circle cx="50" cy="62" r="5" fill="#00F5A0" stroke="#FFD700" strokeWidth="1" />
          <circle cx="36" cy="64" r="3.5" fill="url(#rubyGem)" />
          <circle cx="64" cy="64" r="3.5" fill="url(#rubyGem)" />
          <polygon points="50,14 52,19 57,20 52,21 50,26 48,21 43,20 48,19" fill="#FFF" />
        </svg>
      );

    case 'gift_diamond_ring':
      // 3D Solitaire Platinum Diamond Ring
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(56,189,248,0.6)]">
          <defs>
            <linearGradient id="ringBand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Ring Band */}
          <ellipse cx="50" cy="62" rx="28" ry="24" fill="none" stroke="url(#ringBand)" strokeWidth="6" />
          {/* Diamond Setting Crown */}
          <polygon points="42,40 58,40 54,46 46,46" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
          {/* Brilliant Cut Diamond Gem */}
          <polygon points="34,26 66,26 74,38 50,52 26,38" fill="url(#diamondGrad)" stroke="#E0F2FE" strokeWidth="1.5" />
          {/* Facet Lines */}
          <line x1="34" y1="26" x2="50" y2="52" stroke="#FFF" strokeWidth="0.8" opacity="0.8" />
          <line x1="66" y1="26" x2="50" y2="52" stroke="#FFF" strokeWidth="0.8" opacity="0.8" />
          <line x1="26" y1="38" x2="74" y2="38" stroke="#FFF" strokeWidth="0.8" opacity="0.8" />
          {/* Sparkle Glint */}
          <polygon points="40,20 42,24 46,25 42,26 40,30 38,26 34,25 38,24" fill="#FFF" />
        </svg>
      );

    case 'gift_love_carriage':
      // 3D Crystal Royal Cinderella Carriage
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,46,147,0.55)]">
          <defs>
            <radialGradient id="carriageBody" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="50%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#E11D48" />
            </radialGradient>
            <linearGradient id="carriageGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Wheels */}
          <circle cx="26" cy="72" r="12" fill="none" stroke="url(#carriageGold)" strokeWidth="2.5" />
          <circle cx="26" cy="72" r="4" fill="#FFD700" />
          <circle cx="74" cy="72" r="12" fill="none" stroke="url(#carriageGold)" strokeWidth="2.5" />
          <circle cx="74" cy="72" r="4" fill="#FFD700" />
          {/* Connecting Axle */}
          <path d="M26 72 Q50 68 74 72" stroke="url(#carriageGold)" strokeWidth="2" />
          {/* Main Pumpkin Body */}
          <circle cx="50" cy="46" r="22" fill="url(#carriageBody)" stroke="url(#carriageGold)" strokeWidth="2" />
          {/* Arched Window */}
          <circle cx="50" cy="46" r="10" fill="#38BDF8" opacity="0.85" stroke="#FFD700" strokeWidth="1.2" />
          <path d="M50 36 L50 56 M40 46 L60 46" stroke="#FFD700" strokeWidth="1" />
          {/* Golden Crown on Top */}
          <polygon points="44,24 50,16 56,24 52,24 50,22 48,24" fill="#FFD700" />
        </svg>
      );

    case 'gift_money_gun':
      // 3D Golden Cash Blaster Gun
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,215,0,0.6)]">
          <defs>
            <linearGradient id="gunGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Flying Cash Bills */}
          <rect x="58" y="16" width="16" height="8" rx="1" fill="#10B981" stroke="#FFD700" strokeWidth="0.8" transform="rotate(-15 58 16)" />
          <rect x="74" y="24" width="16" height="8" rx="1" fill="#10B981" stroke="#FFD700" strokeWidth="0.8" transform="rotate(25 74 24)" />
          {/* Gun Body Chassis */}
          <rect x="22" y="34" width="52" height="26" rx="4" fill="url(#gunGold)" stroke="#78350F" strokeWidth="1.5" />
          {/* Gun Handle */}
          <path d="M28 60 L24 84 L40 84 L42 60 Z" fill="url(#gunGold)" stroke="#78350F" strokeWidth="1.5" />
          {/* Trigger */}
          <path d="M42 64 Q46 68 42 72" stroke="#000" strokeWidth="2" fill="none" />
          {/* MIZO VIP Stamp on Gun */}
          <text x="36" y="52" fill="#78350F" fontSize="9" fontWeight="900" fontFamily="sans-serif">
            MIZO
          </text>
          {/* Barrel Ejection Slot */}
          <rect x="70" y="38" width="6" height="18" fill="#1E293B" />
        </svg>
      );

    case 'gift_magic_wand':
      // 3D Starfall Magic Wand
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(168,85,247,0.6)]">
          <defs>
            <linearGradient id="wandShaft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0FE" />
              <stop offset="60%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          {/* Diagonal Wand Shaft */}
          <rect x="47" y="32" width="6" height="58" rx="3" fill="url(#wandShaft)" stroke="#FFD700" strokeWidth="1" transform="rotate(-45 50 61)" />
          {/* Crystal Star Top */}
          <polygon
            points="50,12 55,24 68,26 58,35 61,48 50,41 39,48 42,35 32,26 45,24"
            fill="#FFD700"
            stroke="#FFF"
            strokeWidth="1.5"
            transform="translate(18, -10)"
          />
          <circle cx="68" cy="20" r="5" fill="#FF2E93" />
          {/* Star Glints */}
          <circle cx="36" cy="28" r="2" fill="#00F5A0" />
          <circle cx="82" cy="40" r="2" fill="#00E5FF" />
          <circle cx="56" cy="50" r="1.5" fill="#FFD700" />
        </svg>
      );

    case 'gift_red_rose':
      // 3D Eternal Velvet Rose with Gold Stem
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(244,63,94,0.55)]">
          <defs>
            <radialGradient id="rosePetal" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="35%" stopColor="#F43F5E" />
              <stop offset="70%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#4C0519" />
            </radialGradient>
            <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5A0" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
          </defs>
          <path d="M50 56 Q52 74 46 90" stroke="url(#goldStem)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M48 68 Q34 66 36 58 Q46 60 48 68" fill="url(#goldStem)" />
          <path d="M49 76 Q62 76 60 68 Q52 70 49 76" fill="url(#goldStem)" />
          <circle cx="50" cy="38" r="22" fill="url(#rosePetal)" />
          <path d="M34 32 C30 46, 42 54, 50 54 C58 54, 70 46, 66 32 Z" fill="#9F1239" opacity="0.9" />
          <path d="M42 34 C42 26, 58 26, 58 34 C58 42, 44 42, 46 32 C48 28, 54 28, 54 32" fill="none" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="42" cy="40" r="1.5" fill="#FFF" opacity="0.9" />
        </svg>
      );

    case 'gift_royal_castle':
      // 3D Imperial Palace
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(255,215,0,0.55)]">
          <defs>
            <linearGradient id="palaceGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          <rect x="18" y="72" width="64" height="8" rx="2" fill="#312E81" stroke="#FFD700" strokeWidth="1" />
          <rect x="26" y="44" width="48" height="28" fill="#1E1B4B" stroke="url(#palaceGold)" strokeWidth="1.5" />
          <rect x="18" y="34" width="14" height="38" fill="#312E81" stroke="url(#palaceGold)" strokeWidth="1.5" />
          <polygon points="16,34 25,18 34,34" fill="url(#palaceGold)" />
          <rect x="68" y="34" width="14" height="38" fill="#312E81" stroke="url(#palaceGold)" strokeWidth="1.5" />
          <polygon points="66,34 75,18 84,34" fill="url(#palaceGold)" />
          <path d="M40 44 C40 28, 60 28, 60 44 Z" fill="url(#palaceGold)" stroke="#FFE082" strokeWidth="1" />
          <circle cx="50" cy="24" r="2.5" fill="#FF2E93" />
          <path d="M44 72 L44 56 C44 52, 56 52, 56 56 L56 72 Z" fill="#FFD700" />
        </svg>
      );

    default:
      // Golden VIP Star Gemstone
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.45)]">
          <defs>
            <linearGradient id="vipStar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <polygon
            points="50,14 61,38 88,40 67,58 74,84 50,70 26,84 33,58 12,40 39,38"
            fill="url(#vipStar)"
            stroke="#FEF3C7"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="50" r="10" fill="#FF2E93" stroke="#FFF" strokeWidth="1" />
          <circle cx="48" cy="48" r="3" fill="#FFF" opacity="0.8" />
        </svg>
      );
  }
};
