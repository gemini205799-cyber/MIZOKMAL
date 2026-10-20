export type Language = 'en' | 'bn' | 'ar';

export interface Translations {
  appName: string;
  sfuEcosystem: string;
  dualView: string;
  mizoConsole: string;
  mizoClient: string;
  architectureCode: string;
  livekitOnline: string;
  dailyBonus: string;
  
  // Console Tabs
  tabRooms: string;
  tabSeatsConfig: string;
  tabUsers: string;
  tabEconomy: string;
  tabAgency: string;
  tabLiveKit: string;

  // Live Operations
  activeRooms: string;
  totalCcu: string;
  sfuLoad: string;
  webrtcQuality: string;
  emergencyKill: string;
  killSwitchDescription: string;
  roomTerminated: string;
  livePartyRooms: string;
  listeners: string;
  audioSeatsMatrix: string;
  hostThrone: string;
  bossSeat: string;
  vacant: string;
  locked: string;
  speaking: string;
  idle: string;
  mute: string;
  unmute: string;
  lock: string;
  unlock: string;
  kick: string;

  // Special Seats Configuration (Admin Operational Control)
  specialSeatsTitle: string;
  specialSeatsSubtitle: string;
  enableBossSeat: string;
  bossSeatPrice: string;
  roomTemplates: string;
  chatRoom: string;
  datingRoom: string;
  pkSongRoom: string;
  gamingRoom: string;
  saveConfig: string;

  // Economy & CMS
  giftMatrixTitle: string;
  addNewGift: string;
  testAnimation: string;
  withdrawalQueue: string;
  approve: string;
  reject: string;
  doubleEntryLedger: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'MIZO',
    sfuEcosystem: 'LiveKit SFU Ecosystem',
    dualView: 'Dual Live View',
    mizoConsole: 'MIZO Console',
    mizoClient: 'MIZO Mobile Client',
    architectureCode: 'Architecture & Code',
    livekitOnline: 'LiveKit Node: ONLINE',
    dailyBonus: 'Daily Bonus',

    tabRooms: 'Live Operations',
    tabSeatsConfig: 'Seats & Templates Config',
    tabUsers: 'User Trust & Safety',
    tabEconomy: 'Gift CMS & Ledger',
    tabAgency: 'Agency Portal',
    tabLiveKit: 'SFU Telemetry',

    activeRooms: 'ACTIVE LIVE ROOMS',
    totalCcu: 'TOTAL CONNECTED USERS (CCU)',
    sfuLoad: 'SFU NODE LOAD',
    webrtcQuality: 'AUDIO WEBRTC QUALITY',
    emergencyKill: 'EMERGENCY KILL SWITCH',
    killSwitchDescription: 'Immediately force closes the room and disconnects all SFU peer connections',
    roomTerminated: 'ROOM TERMINATED BY ADMIN',
    livePartyRooms: 'Live Voice Party Rooms',
    listeners: 'listeners',
    audioSeatsMatrix: 'Room Audio Seats Matrix',
    hostThrone: 'Host Throne',
    bossSeat: 'Boss Seat (VIP)',
    vacant: 'Vacant',
    locked: 'Locked',
    speaking: 'Speaking 🟢',
    idle: 'Idle ⚪',
    mute: 'Mute',
    unmute: 'Unmute',
    lock: 'Lock',
    unlock: 'Unlock',
    kick: 'Force Kick',

    specialSeatsTitle: 'Special Seats & Room Templates Configuration',
    specialSeatsSubtitle: 'Configure Boss Mic auction rules, seat layouts, and active room categories platform-wide',
    enableBossSeat: 'Enable Boss Mic (Pos 1001) in Voice Rooms',
    bossSeatPrice: 'Minimum Base Coins for Boss Seat Bid',
    roomTemplates: 'Active Room Templates & Categories',
    chatRoom: 'Social Voice Chat (12 Seats)',
    datingRoom: 'CP Dating & Blind Box (8 Seats)',
    pkSongRoom: 'PK Battle & Karaoke (8 Seats)',
    gamingRoom: 'Ludo & Gaming Room (4 Seats)',
    saveConfig: 'Deploy Configuration to SFU Cluster',

    giftMatrixTitle: 'Gift Matrix CMS & Asset Registry',
    addNewGift: 'Add New Gift',
    testAnimation: 'Test Animation',
    withdrawalQueue: 'Diamond-to-Cash Withdrawal Queue',
    approve: 'Approve',
    reject: 'Reject',
    doubleEntryLedger: 'Double-Entry Virtual Economy Ledger',
  },

  bn: {
    appName: 'মিজো',
    sfuEcosystem: 'লাইভকিট এসএফইউ ইকোসিস্টেম',
    dualView: 'ডুয়াল লাইভ ভিউ',
    mizoConsole: 'মিজো কনসোল',
    mizoClient: 'মিজো মোবাইল ক্লায়েন্ট',
    architectureCode: 'আর্কিটেকচার এবং কোড',
    livekitOnline: 'লাইভকিট নোড: সক্রিয়',
    dailyBonus: 'দৈনিক বোনাস',

    tabRooms: 'লাইভ অপারেশন',
    tabSeatsConfig: 'সিট ও টেমপ্লেট কনফিগ',
    tabUsers: 'ব্যবহারকারী নিরাপত্তা',
    tabEconomy: 'উপহার সিএমএস ও লেজার',
    tabAgency: 'এজেন্সি পোর্টাল',
    tabLiveKit: 'টেলিমেট্রি',

    activeRooms: 'সক্রিয় লাইভ রুম',
    totalCcu: 'মোট সংযুক্ত ব্যবহারকারী (CCU)',
    sfuLoad: 'এসএফইউ নোড লোড',
    webrtcQuality: 'ওয়েবআরটিসি অডিও গুণমান',
    emergencyKill: 'জরুরী কিল সুইচ',
    killSwitchDescription: 'তাৎক্ষণিকভাবে রুমটি বন্ধ করে এবং সমস্ত সংযোগ বিচ্ছিন্ন করে',
    roomTerminated: 'এডমিন কর্তৃক রুমটি বন্ধ করা হয়েছে',
    livePartyRooms: 'লাইভ ভয়েস পার্টি রুম',
    listeners: 'শ্রোতা',
    audioSeatsMatrix: 'রুমের অডিও সিট ম্যাট্রিক্স',
    hostThrone: 'হোস্ট আসন',
    bossSeat: 'বস আসন (ভিআইপি)',
    vacant: 'খালি',
    locked: 'লক করা',
    speaking: 'কথা বলছে 🟢',
    idle: 'নিষ্ক্রিয় ⚪',
    mute: 'মিউট',
    unmute: 'আনমিউট',
    lock: 'লক',
    unlock: 'আনলক',
    kick: 'কিক করুন',

    specialSeatsTitle: 'স্পেশাল সিট ও রুম টেমপ্লেট কনফিগারেশন',
    specialSeatsSubtitle: 'বস মাইক নিলামের নিয়ম, সিট লেআউট এবং সক্রিয় ক্যাটাগরি কনফিগার করুন',
    enableBossSeat: 'ভয়েস রুমে বস মাইক (Pos 1001) সক্রিয় করুন',
    bossSeatPrice: 'বস সিটের ন্যূনতম বেস কয়েন মূল্য',
    roomTemplates: 'সক্রিয় রুম টেমপ্লেট ও ক্যাটাগরি',
    chatRoom: 'ভয়েস আড্ডা (১২ সিট)',
    datingRoom: 'সিপি ডেটিং ও রোমান্টিক (৮ সিট)',
    pkSongRoom: 'পিকে ব্যাটল ও গান (৮ সিট)',
    gamingRoom: 'লুডো ও গেমিং (৪ সিট)',
    saveConfig: 'ক্লাস্টারে কনফিগারেশন সংরক্ষণ করুন',

    giftMatrixTitle: 'উপহার ম্যাট্রিক্স সিএমএস ও অ্যাসেট রেজিস্ট্রি',
    addNewGift: 'নতুন উপহার যোগ করুন',
    testAnimation: 'অ্যানিমেশন টেস্ট করুন',
    withdrawalQueue: 'ডায়মন্ড থেকে ক্যাশ তোলার সারি',
    approve: 'অনুমোদন',
    reject: 'প্রত্যাখ্যান',
    doubleEntryLedger: 'ভার্চুয়াল ইকোনমি ডাবল-এন্ট্রি লেজার',
  },

  ar: {
    appName: 'ميزو',
    sfuEcosystem: 'منظومة لايف كيت SFU',
    dualView: 'عرض ثنائي مباشر',
    mizoConsole: 'لوحة تحكم ميزو',
    mizoClient: 'تطبيق ميزو للجوال',
    architectureCode: 'البنية البرمجية والكود',
    livekitOnline: 'خادم LiveKit: متصل',
    dailyBonus: 'المكافأة اليومية',

    tabRooms: 'إدارة الغرف المباشرة',
    tabSeatsConfig: 'إعدادات المقاعد والقوالب',
    tabUsers: 'الأمان وإدارة المستخدمين',
    tabEconomy: 'الهدايا والسجل المالي',
    tabAgency: 'بوابة الوكالات',
    tabLiveKit: 'بيانات SFU والشبكة',

    activeRooms: 'الغرف المباشرة النشطة',
    totalCcu: 'إجمالي المتصلين (CCU)',
    sfuLoad: 'حمولة عقدة SFU',
    webrtcQuality: 'جودة صوت WebRTC',
    emergencyKill: 'زر الإيقاف الطارئ (Kill Switch)',
    killSwitchDescription: 'إغلاق الغرفة فوراً وفصل جميع اتصالات WebRTC لجميع المستخدمين',
    roomTerminated: 'تم إنهاء الغرفة بواسطة المشرف العام',
    livePartyRooms: 'غرف الحفلات الصوتية المباشرة',
    listeners: 'مستمع',
    audioSeatsMatrix: 'مصفوفة مقاعد الصوت في الغرفة',
    hostThrone: 'عرش المضيف (Anchor)',
    bossSeat: 'مقعد الداعم الأكبر (Boss Mic)',
    vacant: 'شاغر',
    locked: 'مقفل',
    speaking: 'يتحدث 🟢',
    idle: 'صامت ⚪',
    mute: 'كتم',
    unmute: 'إلغاء الكتم',
    lock: 'قفل',
    unlock: 'فتح',
    kick: 'طرد إجباري',

    specialSeatsTitle: 'إعدادات المقاعد الخاصة وقوالب الغرف',
    specialSeatsSubtitle: 'التحكم في مقعد Boss Mic وقواعد المزايدة وأنماط الغرف على مستوى المنصة',
    enableBossSeat: 'تفعيل مقعد الداعم الأكبر (Boss Mic - Pos 1001)',
    bossSeatPrice: 'الحد الأدنى للعملات للمزايدة على مقعد Boss',
    roomTemplates: 'قوالب وأنماط الغرف المتاحة',
    chatRoom: 'غرفة دردشة اجتماعية (12 مقعد)',
    datingRoom: 'غرفة تعارف ورومانسية (8 مقاعد)',
    pkSongRoom: 'تحديات غنائية PK باتل (8 مقاعد)',
    gamingRoom: 'غرفة ألعاب ولودو (4 مقاعد)',
    saveConfig: 'نشر الإعدادات على خوادم SFU',

    giftMatrixTitle: 'نظام إدارة الهدايا والرسوم المتحركة (CMS)',
    addNewGift: 'إضافة هدية جديدة',
    testAnimation: 'اختبار الرسوم المتحركة',
    withdrawalQueue: 'طلبات سحب الألماس إلى نقد',
    approve: 'موافقة',
    reject: 'رفض',
    doubleEntryLedger: 'سجل القيود المزدوجة للاقتصاد الافتراضي',
  },
};
