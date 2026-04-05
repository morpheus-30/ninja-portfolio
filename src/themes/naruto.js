import { sharedPortfolioContent } from "./content";

export const narutoTheme = {
  id: "naruto",
  label: "Naruto",
  description: "Enter the Hidden Leaf themed portfolio experience.",
  selectorImage:
    "https://i.pinimg.com/736x/2c/ec/ea/2ceceaaa071d480e6be1db25bb79d89f.jpg",
  design: {
    colors: {
      ink: "#140b07",
      ember: "#9d2c12",
      sunset: "#d85a1a",
      gold: "#efc56c",
      sand: "#f3ddaf",
      leaf: "#3e5b2b",
      pine: "#182311",
      smoke: "rgba(12, 8, 6, 0.78)",
      panel: "rgba(26, 14, 10, 0.7)",
      line: "rgba(239, 197, 108, 0.18)",
      text: "#f6ecd4",
      muted: "#cfbf9b",
    },
    fonts: {
      body: "'Oxanium', sans-serif",
      display: "'NinjaNaruto', 'Teko', sans-serif",
    },
    motion: {
      swapDelayMs: 380,
      runDurationMs: 720,
      scrollLockMs: 900,
      actionDurations: {
        jump: 780,
        attack1: 420,
        attack2: 420,
        attack3: 420,
        crouchAttack1: 420,
        crouchAttack2: 420,
        crouchAttack3: 420,
      },
    },
    chrome: {
      appBackground:
        "radial-gradient(circle at top, rgba(216,90,26,0.22) 0%, rgba(216,90,26,0) 36%), linear-gradient(180deg, #34150d 0%, #160b08 38%, #090606 100%)",
      backgroundImageOverlay:
        "linear-gradient(180deg, rgba(12,8,6,0.22), rgba(8,6,5,0.48))",
      backgroundFilter: "brightness(0.88) saturate(0.95)",
      topAtmosphere:
        "radial-gradient(circle at 50% 18%, rgba(239,197,108,0.22) 0, rgba(239,197,108,0.08) 10%, rgba(239,197,108,0) 21%), linear-gradient(180deg, rgba(219,108,43,0.08) 0%, rgba(36,17,11,0.03) 30%, rgba(6,5,5,0.08) 100%)",
      gridOverlay:
        "linear-gradient(rgba(239,197,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(239,197,108,0.05) 1px, transparent 1px)",
      bottomAtmosphere:
        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(24,35,17,0.78) 20%, rgba(15,21,10,0.98) 100%)",
      sectionBorder: "2px solid rgba(125, 75, 28, 0.72)",
      sectionBackground:
        "linear-gradient(180deg, rgba(66,34,18,0.88) 0%, rgba(34,18,10,0.94) 100%)",
      sectionShadow:
        "0 28px 80px rgba(0, 0, 0, 0.28), inset 0 0 0 2px rgba(239,197,108,0.08), inset 0 18px 30px rgba(255,182,85,0.05)",
      sectionTopBar:
        "linear-gradient(90deg, rgba(0,0,0,0), rgba(239,197,108,0.28), rgba(216,90,26,0.45), rgba(239,197,108,0.28), rgba(0,0,0,0))",
      sectionGrid:
        "linear-gradient(rgba(239,197,108,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(239,197,108,0.12) 1px, transparent 1px)",
      statCardBorder: "1px solid rgba(125, 75, 28, 0.8)",
      statCardBackground:
        "linear-gradient(180deg, rgba(73,37,19,0.75) 0%, rgba(42,22,12,0.88) 100%)",
      missionCardBorder: "1px solid rgba(125, 75, 28, 0.8)",
      missionCardBackground:
        "linear-gradient(180deg, rgba(70,35,18,0.7) 0%, rgba(40,20,12,0.85) 100%)",
      pillBackground: "rgba(239,197,108,0.09)",
      navBackground: "rgba(12, 8, 6, 0.78)",
      themeButtonBackground: "rgba(239,197,108,0.08)",
      inputBackground: "rgba(255,255,255,0.04)",
      mediaFrameBackground: "rgba(255,255,255,0.04)",
      contactPendingBackground:
        "linear-gradient(180deg, rgba(73,37,19,0.75) 0%, rgba(42,22,12,0.88) 100%)",
      contactSuccessBackground:
        "linear-gradient(180deg, rgba(76,58,20,0.75) 0%, rgba(48,31,12,0.9) 100%)",
      contactErrorBackground:
        "linear-gradient(180deg, rgba(89,26,16,0.75) 0%, rgba(52,18,12,0.9) 100%)",
      helpTooltipBackground:
        "linear-gradient(180deg, rgba(62,31,18,0.95) 0%, rgba(28,15,10,0.96) 100%)",
      groundGlow:
        "linear-gradient(90deg, rgba(0,0,0,0), rgba(239,197,108,0.4), rgba(216,90,26,0.52), rgba(239,197,108,0.4), rgba(0,0,0,0))",
    },
  },
  sections: ["home", "about", "skills", "projects", "contact"],
  assets: {
    ui: {
      cursor: "/assets/themes/naruto/ui/kunai-cursor.png",
      focusCursor: "/assets/themes/naruto/ui/kunai-focus-cursor.png",
      emblem: "/assets/themes/naruto/ui/kunai.png",
      focusEmblem: "/assets/themes/naruto/ui/kunai-focus.png",
      loader: "/assets/themes/naruto/ui/loader.gif",
    },
    character: {
      idle: "/assets/themes/naruto/character/idle.gif",
      jump: "/assets/themes/naruto/character/jump.gif",
      crouch: "/assets/themes/naruto/character/crouch.gif",
      attack1: "/assets/themes/naruto/character/attack1.gif",
      attack2: "/assets/themes/naruto/character/attack2.gif",
      attack3: "/assets/themes/naruto/character/attack3.gif",
      crouchAttack1: "/assets/themes/naruto/character/crouchattack1.gif",
      crouchAttack2: "/assets/themes/naruto/character/crouchattack2.gif",
      crouchAttack3: "/assets/themes/naruto/character/crouchattack3.gif",
      crouchWalk: "/assets/themes/naruto/character/crouchwalk.gif",
      run: "/assets/themes/naruto/character/run.gif",
    },
    heroProfile:
      "https://i.pinimg.com/736x/65/40/ec/6540eccd704245ae4d8a01874186887f.jpg",
    sectionBackgrounds: [
      "/assets/themes/naruto/backgrounds/home-konoha.jpg",
      "/assets/themes/naruto/backgrounds/about-naruto.jpg",
      "/assets/themes/naruto/backgrounds/skills-jutsu.jpg",
      "/assets/themes/naruto/backgrounds/missions-cast.jpg",
      "/assets/themes/naruto/backgrounds/contact-funny.jpg",
    ],
  },
  content: {
    home: {
      kicker: "Leaf Village Tech Division",
      title: sharedPortfolioContent.home.title,
      intro: sharedPortfolioContent.home.intro,
      paragraphs: sharedPortfolioContent.home.paragraphs,
      ctas: [
        ["View Missions", 3],
        ["Ninja Profile", 1],
        ["Summon Shinobi", 4],
      ],
    },
    about: {
      title: "Ninja Profile",
      kicker: "Character Sheet",
      stats: [
        ["Name", sharedPortfolioContent.profile.name],
        ["Alliance", sharedPortfolioContent.profile.alliance],
        ["Village", sharedPortfolioContent.profile.village],
        ["Rank", sharedPortfolioContent.profile.rank],
        ["Primary Techniques", sharedPortfolioContent.profile.techniques],
        ["Experience", sharedPortfolioContent.profile.experience],
        ["Current Arc", sharedPortfolioContent.profile.currentArc],
        ["Side Quests", sharedPortfolioContent.profile.sideQuests],
      ],
      blurb: sharedPortfolioContent.aboutBlurb,
    },
    skills: {
      title: "Jutsu Arsenal",
      kicker: "Power Levels",
      groups: sharedPortfolioContent.skills,
    },
    projects: {
      title: "Mission Board",
      kicker: "Recent Arcs",
      items: sharedPortfolioContent.projects,
    },
    contact: {
      kicker: "Issue a Mission Scroll",
      title: "Summon the Shinobi",
      placeholders: sharedPortfolioContent.contactPlaceholders,
      submitLabel: "Summon Contact",
      loadingLabel: "Summoning...",
      subject: "New portfolio message for Nakshatra-kun",
      status: {
        pending: "Shadow Clone Jutsu",
        success: "Mission Complete",
        error: "Transmission Failed",
      },
    },
    controls: {
      switchTheme: "Themes",
      helpTitle: "`WASD` Move • `E` Attack",
      helpText: "Hold `S` to crouch or crouch-walk",
      loadingText: "Entering Naruto",
    },
  },
};
