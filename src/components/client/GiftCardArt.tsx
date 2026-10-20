import React from 'react';

interface GiftArtProps {
  giftId: string;
  className?: string;
  size?: number;
}

/**
 * 3D Ultra-Luxury Gift Artwork Renderer
 * Replaces outdated flat emojis with high-end 3D illustrated vectors,
 * metallic gradients, lighting glows, and pedestal reflections matching Habi & Yari.
 */
export const GiftCardArt: React.FC<GiftArtProps> = ({ giftId, size = 64 }) => {
  switch (giftId) {
    case 'gift_super_car':
      // 3D Gold McLaren Hypercar on Cyberpunk Podium
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_12px_rgba(255,215,0,0.45)]">
          <defs>
            <linearGradient id="goldCar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="80%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id="neonGlow" cx="50%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F5A0" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="windshield" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Cyberpunk Ground Halo */}
          <ellipse cx="50" cy="78" rx="42" ry="10" fill="url(#neonGlow)" />
          {/* Car Shadow */}
          <ellipse cx="50" cy="76" rx="38" ry="6" fill="#000" opacity="0.6" />
          {/* Wheels */}
          <circle cx="28" cy="70" r="9" fill="#1E293B" stroke="#FFD700" strokeWidth="2" />
          <circle cx="28" cy="70" r="4" fill="#FFD700" />
          <circle cx="72" cy="70" r="9" fill="#1E293B" stroke="#FFD700" strokeWidth="2" />
          <circle cx="72" cy="70" r="4" fill="#FFD700" />
          {/* Car Body Chassis */}
          <path
            d="M14 62 C16 54, 25 50, 34 50 L42 42 C48 36, 62 36, 70 42 L80 50 C88 52, 92 58, 90 64 L86 68 C82 70, 78 70, 76 68 L24 68 C20 70, 16 68, 14 62 Z"
            fill="url(#goldCar)"
          />
          {/* Cabin Windshield */}
          <path d="M42 43 C46 38, 58 38, 66 43 L74 50 L36 50 Z" fill="url(#windshield)" stroke="#FFD700" strokeWidth="0.8" />
          {/* Headlights Neon Beams */}
          <polygon points="14,60 6,56 6,66 14,64" fill="#00E5FF" opacity="0.85" />
          <polygon points="90,62 96,60 96,65 90,64" fill="#FF2E93" opacity="0.9" />
          {/* Metallic Highlights & Spoiler */}
          <path d="M78 44 L88 40 L88 44 Z" fill="#FFD700" />
          <circle cx="48" cy="46" r="2" fill="#FFF" opacity="0.8" />
        </svg>
      );

    case 'gift_space_rocket':
      // 3D Galactic Warp Rocket with Nebula Flame
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_16px_rgba(0,229,255,0.5)]">
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
          {/* Cosmic Flame Jet */}
          <path d="M42 74 C40 88, 50 98, 50 98 C50 98, 60 88, 58 74 Z" fill="url(#flameGrad)" />
          <path d="M46 74 C44 84, 50 90, 50 90 C50 90, 56 84, 54 74 Z" fill="#FFF" />
          {/* Rocket Wings / Fins */}
          <path d="M34 58 L20 72 L36 72 Z" fill="url(#rocketFins)" stroke="#FFD700" strokeWidth="1" />
          <path d="M66 58 L80 72 L64 72 Z" fill="url(#rocketFins)" stroke="#FFD700" strokeWidth="1" />
          {/* Rocket Fuselage */}
          <path d="M50 12 C40 28, 36 50, 36 74 L64 74 C64 50, 60 28, 50 12 Z" fill="url(#rocketBody)" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Nose Cone */}
          <path d="M50 12 C46 20, 44 26, 44 32 L56 32 C56 26, 54 20, 50 12 Z" fill="url(#rocketFins)" />
          {/* Porthole Window */}
          <circle cx="50" cy="42" r="7" fill="#0284C7" stroke="#FFD700" strokeWidth="2" />
          <circle cx="48" cy="40" r="2.5" fill="#FFF" opacity="0.9" />
          {/* Gold Star Sparkles */}
          <circle cx="22" cy="24" r="1.5" fill="#FFD700" />
          <circle cx="78" cy="30" r="2" fill="#00E5FF" />
        </svg>
      );

    case 'gift_lucky_wheel':
      // 3D Sultan Gold Casino Wheel with Neon Gems
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,46,147,0.5)]">
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
          {/* Outer Wheel Rim */}
          <circle cx="50" cy="50" r="42" fill="#1E1238" stroke="url(#wheelRim)" strokeWidth="4.5" />
          {/* Inner Wheel Segments */}
          <path d="M50 50 L50 12 A38 38 0 0 1 83 31 Z" fill="#DC2626" />
          <path d="M50 50 L83 31 A38 38 0 0 1 83 69 Z" fill="#7C3AED" />
          <path d="M50 50 L83 69 A38 38 0 0 1 50 88 Z" fill="#059669" />
          <path d="M50 50 L50 88 A38 38 0 0 1 17 69 Z" fill="#D97706" />
          <path d="M50 50 L17 69 A38 38 0 0 1 17 31 Z" fill="#2563EB" />
          <path d="M50 50 L17 31 A38 38 0 0 1 50 12 Z" fill="#BE123C" />
          {/* Segment Divider Pins */}
          <circle cx="50" cy="12" r="2.5" fill="#FFD700" />
          <circle cx="83" cy="31" r="2.5" fill="#FFD700" />
          <circle cx="83" cy="69" r="2.5" fill="#FFD700" />
          <circle cx="50" cy="88" r="2.5" fill="#FFD700" />
          <circle cx="17" cy="69" r="2.5" fill="#FFD700" />
          <circle cx="17" cy="31" r="2.5" fill="#FFD700" />
          {/* Center Hub */}
          <circle cx="50" cy="50" r="14" fill="url(#centerGem)" stroke="#FFD700" strokeWidth="2.5" />
          <polygon points="50,28 54,38 46,38" fill="#FFD700" stroke="#000" strokeWidth="0.8" />
          <circle cx="47" cy="47" r="3" fill="#FFF" opacity="0.85" />
        </svg>
      );

    case 'gift_lucky_chest':
      // 3D Pharaoh Gold Treasure Chest with Overflowing Jewels
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.5)]">
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
          {/* Open Lid Back */}
          <path d="M22 42 C22 28, 78 28, 78 42 L74 46 L26 46 Z" fill="url(#chestGold)" stroke="#D97706" strokeWidth="1.5" />
          {/* Chest Interior Glow & Gems */}
          <ellipse cx="50" cy="46" rx="26" ry="7" fill="#FEF08A" />
          <circle cx="44" cy="44" r="4" fill="#00F5A0" />
          <circle cx="56" cy="44" r="4.5" fill="#FF2E93" />
          <circle cx="50" cy="42" r="3" fill="#38BDF8" />
          <circle cx="38" cy="45" r="2.5" fill="#FFD700" />
          <circle cx="62" cy="45" r="3" fill="#FFD700" />
          {/* Main Chest Base */}
          <rect x="22" y="46" width="56" height="34" rx="6" fill="url(#chestWood)" stroke="url(#chestGold)" strokeWidth="3" />
          {/* Gold Straps */}
          <rect x="34" y="46" width="6" height="34" fill="url(#chestGold)" />
          <rect x="60" y="46" width="6" height="34" fill="url(#chestGold)" />
          {/* Keyhole Lock */}
          <circle cx="50" cy="62" r="6" fill="url(#chestGold)" stroke="#78350F" strokeWidth="1" />
          <polygon points="50,60 52,65 48,65" fill="#0D0B18" />
        </svg>
      );

    case 'gift_super_fans_crest':
      // 3D Imperial Gold Diamond Crown
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.6)]">
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
          {/* Base Rim */}
          <ellipse cx="50" cy="74" rx="34" ry="7" fill="url(#crownGold)" stroke="#78350F" strokeWidth="1" />
          {/* Crown Spires */}
          <path
            d="M18 72 L22 36 L36 54 L50 24 L64 54 L78 36 L82 72 Z"
            fill="url(#crownGold)"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          {/* Jewels on Spires */}
          <circle cx="22" cy="36" r="4.5" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
          <circle cx="50" cy="24" r="6" fill="url(#rubyGem)" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="78" cy="36" r="4.5" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
          {/* Center Crown Jewels */}
          <circle cx="50" cy="62" r="5" fill="#00F5A0" stroke="#FFD700" strokeWidth="1" />
          <circle cx="36" cy="64" r="3.5" fill="url(#rubyGem)" />
          <circle cx="64" cy="64" r="3.5" fill="url(#rubyGem)" />
          {/* Sparkle Glint */}
          <polygon points="50,14 52,19 57,20 52,21 50,26 48,21 43,20 48,19" fill="#FFF" />
        </svg>
      );

    case 'gift_red_rose':
      // 3D Eternal Velvet Rose with Gold Stem
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(244,63,94,0.5)]">
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
          {/* Green Stem */}
          <path d="M50 56 Q52 74 46 90" stroke="url(#goldStem)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M48 68 Q34 66 36 58 Q46 60 48 68" fill="url(#goldStem)" />
          <path d="M49 76 Q62 76 60 68 Q52 70 49 76" fill="url(#goldStem)" />
          {/* Outer Petals */}
          <circle cx="50" cy="38" r="22" fill="url(#rosePetal)" />
          <path d="M34 32 C30 46, 42 54, 50 54 C58 54, 70 46, 66 32 Z" fill="#9F1239" opacity="0.9" />
          {/* Inner Swirl */}
          <path d="M42 34 C42 26, 58 26, 58 34 C58 42, 44 42, 46 32 C48 28, 54 28, 54 32" fill="none" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
          {/* Dewdrop Diamond */}
          <circle cx="42" cy="40" r="1.5" fill="#FFF" opacity="0.9" />
        </svg>
      );

    case 'gift_royal_castle':
      // 3D Imperial Palace
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_14px_rgba(255,215,0,0.5)]">
          <defs>
            <linearGradient id="palaceGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Ground Podium */}
          <rect x="18" y="72" width="64" height="8" rx="2" fill="#312E81" stroke="#FFD700" strokeWidth="1" />
          {/* Main Castle Walls */}
          <rect x="26" y="44" width="48" height="28" fill="#1E1B4B" stroke="url(#palaceGold)" strokeWidth="1.5" />
          {/* Towers Left & Right */}
          <rect x="18" y="34" width="14" height="38" fill="#312E81" stroke="url(#palaceGold)" strokeWidth="1.5" />
          <polygon points="16,34 25,18 34,34" fill="url(#palaceGold)" />
          <rect x="68" y="34" width="14" height="38" fill="#312E81" stroke="url(#palaceGold)" strokeWidth="1.5" />
          <polygon points="66,34 75,18 84,34" fill="url(#palaceGold)" />
          {/* Center Grand Dome */}
          <path d="M40 44 C40 28, 60 28, 60 44 Z" fill="url(#palaceGold)" stroke="#FFE082" strokeWidth="1" />
          <circle cx="50" cy="24" r="2.5" fill="#FF2E93" />
          {/* Arched Gate */}
          <path d="M44 72 L44 56 C44 52, 56 52, 56 56 L56 72 Z" fill="#FFD700" />
        </svg>
      );

    default:
      // Golden VIP Star Gemstone
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_4px_12px_rgba(255,215,0,0.4)]">
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
