import { sharedPortfolioContent } from "./content";

export const popTheme = {
  id: "pop",
  label: "Gameverse",
  description:
    "A high-energy gamer world with arcade, shooter, and action UI vibes.",
  selectorImage: "/assets/themes/pop/backgrounds/thumbnail.jpg",
  design: {
    colors: {
      ink: "#05070c",
      ember: "#ff4655",
      sunset: "#ff7a45",
      gold: "#ffd166",
      sand: "#f3ece4",
      leaf: "#1f3b4d",
      pine: "#0d1820",
      smoke: "rgba(7, 11, 18, 0.84)",
      panel: "rgba(10, 15, 24, 0.84)",
      line: "rgba(255, 70, 85, 0.22)",
      text: "#f5f7fb",
      muted: "#b8c0cf",
    },
    fonts: {
      body: "'Rajdhani', 'Oxanium', sans-serif",
      display: "'PixelGame', 'Cinzel', 'Teko', serif",
    },
    motion: {
      swapDelayMs: 380,
      runDurationMs: 720,
      scrollLockMs: 900,
      actionDurations: {
        jump: 1100,
        attack1: 520,
        attack2: 2500,
        attack3: 2500,
        crouchAttack1: 520,
        crouchAttack2: 520,
        crouchAttack3: 520,
      },
    },
    chrome: {
      appBackground:
        "radial-gradient(circle at top, rgba(216,181,122,0.16) 0%, rgba(216,181,122,0) 28%), linear-gradient(180deg, #120f0b 0%, #17120d 44%, #080604 100%)",
      backgroundImageOverlay:
        "radial-gradient(circle at 50% -6%, rgba(223,191,133,0.16) 0%, rgba(223,191,133,0.05) 18%, rgba(0,0,0,0) 38%), linear-gradient(180deg, rgba(18,14,10,0.06) 0%, rgba(18,15,11,0.2) 38%, rgba(8,6,4,0.56) 100%)",
      backgroundFilter: "brightness(0.8) saturate(0.92) contrast(1.03)",
      topAtmosphere:
        "radial-gradient(circle at 50% 12%, rgba(229,200,145,0.34) 0%, rgba(229,200,145,0.14) 11%, rgba(229,200,145,0.03) 23%, rgba(0,0,0,0) 34%), radial-gradient(circle at 22% 18%, rgba(168,131,83,0.16) 0%, rgba(168,131,83,0.05) 14%, rgba(0,0,0,0) 34%), radial-gradient(circle at 78% 20%, rgba(142,108,66,0.14) 0%, rgba(142,108,66,0.05) 12%, rgba(0,0,0,0) 30%), linear-gradient(180deg, rgba(34,25,16,0.16) 0%, rgba(20,16,11,0.1) 28%, rgba(0,0,0,0) 56%)",
      gridOverlay:
        "linear-gradient(rgba(212,178,126,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,178,126,0.04) 1px, transparent 1px)",
      bottomAtmosphere:
        "radial-gradient(ellipse at 50% 110%, rgba(179,141,91,0.24) 0%, rgba(179,141,91,0.12) 22%, rgba(179,141,91,0.03) 40%, rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(24,19,12,0) 0%, rgba(18,15,11,0.38) 18%, rgba(10,8,6,0.76) 58%, rgba(4,3,2,0.98) 100%)",
      sectionBorder: "4px solid rgba(96, 82, 62, 0.9)",
      sectionBackground:
        "linear-gradient(180deg, rgba(113,82,50,0.48) 0%, rgba(88,60,35,0.54) 48%, rgba(64,42,23,0.6) 100%)",
      sectionShadow:
        "0 24px 80px rgba(0,0,0,0.42), inset 0 0 0 2px rgba(193,168,129,0.18), inset 0 1px 0 rgba(255,236,203,0.12), inset 0 -18px 28px rgba(44,24,10,0.3)",
      sectionTopBar:
        "linear-gradient(90deg, rgba(0,0,0,0), rgba(204,168,113,0.36), rgba(118,86,52,0.86), rgba(204,168,113,0.3), rgba(0,0,0,0))",
      sectionGrid:
        "linear-gradient(rgba(255,222,173,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(83,54,29,0.08) 1px, transparent 1px)",
      statCardBorder: "1px solid rgba(255, 70, 85, 0.34)",
      statCardBackground:
        "linear-gradient(180deg, rgba(14,21,33,0.88) 0%, rgba(8,10,17,0.96) 100%)",
      missionCardBorder: "1px solid rgba(255, 70, 85, 0.28)",
      missionCardBackground:
        "linear-gradient(180deg, rgba(13,20,31,0.84) 0%, rgba(7,9,14,0.94) 100%)",
      pillBackground: "rgba(255,70,85,0.1)",
      navBackground: "rgba(7,11,18,0.88)",
      themeButtonBackground: "rgba(255,70,85,0.12)",
      inputBackground: "rgba(255,255,255,0.03)",
      mediaFrameBackground: "rgba(255,255,255,0.03)",
      contactPendingBackground:
        "linear-gradient(180deg, rgba(14,20,31,0.9) 0%, rgba(8,10,17,0.98) 100%)",
      contactSuccessBackground:
        "linear-gradient(180deg, rgba(63,52,18,0.82) 0%, rgba(19,18,10,0.94) 100%)",
      contactErrorBackground:
        "linear-gradient(180deg, rgba(89,24,28,0.84) 0%, rgba(28,10,12,0.94) 100%)",
      helpTooltipBackground:
        "linear-gradient(180deg, rgba(13,19,29,0.98) 0%, rgba(7,9,14,0.98) 100%)",
      groundGlow:
        "linear-gradient(90deg, rgba(0,0,0,0), rgba(255,70,85,0.24), rgba(255,70,85,0.54), rgba(255,209,102,0.18), rgba(0,0,0,0))",
    },
  },
  sections: ["home", "about", "skills", "projects", "contact"],
  assets: {
    ui: {
      cursor: "/assets/themes/pop/ui/cursor-48.png?v=3",
      focusCursor: "/assets/themes/pop/ui/hover-48.png?v=3",
      emblem: "/assets/themes/pop/ui/cursor-48.png?v=3",
      focusEmblem: "/assets/themes/pop/ui/hover-48.png?v=3",
      loader: "/assets/themes/pop/ui/loader.gif",
      heartFull: "/assets/themes/pop/ui/full.png",
      heartHalf: "/assets/themes/pop/ui/half.png",
      heartEmpty: "/assets/themes/pop/ui/empty.png",
      particleSprite: "/assets/themes/pop/ui/star.png",
      stoneTile: "/assets/themes/pop/ui/stonebg.jpg",
      stoneSprite: "/assets/themes/pop/ui/stone.png",
      logSprite: "/assets/themes/pop/ui/log.png",
      scrollSprite: "/assets/themes/pop/ui/scroll.png",
      treasureSprite: "/assets/themes/pop/ui/treasure.png",
    },
    character: {
      idle: "/assets/themes/pop/character/idle.gif",
      jump: "/assets/themes/pop/character/jump.gif",
      crouch: "/assets/themes/pop/character/crouch.gif",
      attack1: "/assets/themes/pop/character/attack1.gif",
      attack2: "/assets/themes/pop/character/attack2.gif",
      attack3: "/assets/themes/pop/character/attack2.gif",
      crouchAttack1: "/assets/themes/pop/character/crouch.gif",
      crouchAttack2: "/assets/themes/pop/character/crouch.gif",
      crouchAttack3: "/assets/themes/pop/character/crouch.gif",
      crouchWalk: "/assets/themes/pop/character/run.gif",
      run: "/assets/themes/pop/character/run.gif",
    },
    heroProfile: "/assets/themes/pop/backgrounds/pfp.jpeg",
    sectionBackgrounds: [
      "/assets/themes/pop/backgrounds/home.jpg",
      "/assets/themes/pop/backgrounds/about.jpg",
      "/assets/themes/pop/backgrounds/skills.jpg",
      "/assets/themes/pop/backgrounds/projects.jpg",
      "/assets/themes/pop/backgrounds/contact.jpg",
    ],
  },
  content: {
    home: {
      kicker: "Insert Coin",
      title: "Player One Engineer",
      intro:
        "Software engineer building reliable systems like a long-form campaign: steady mechanics, clean logic, and builds that hold up after launch.",
      paragraphs: [
        "Currently grinding at Yamaha Motor Solutions India, shipping enterprise-focused systems with an API-first mindset, practical architecture, and a strong bias toward smooth execution.",
        "Main loadout includes Python, Flutter, SAP, FastAPI, JavaScript, Go, and C++, with a focus on creating tools and workflows that feel responsive, scalable, and fun to use.",
      ],
      ctas: [
        ["Start Missions", 3],
        ["View CHARACTER SELECT", 1],
        ["Open Lobby", 4],
      ],
    },
    about: {
      title: "CHARACTER SELECT",
      kicker: "Player Stats",
      stats: [
        ["Player Tag", sharedPortfolioContent.profile.name],
        ["Guild", sharedPortfolioContent.profile.alliance],
        ["Spawn Point", sharedPortfolioContent.profile.village],
        ["Class", sharedPortfolioContent.profile.rank],
        ["Core Loadout", sharedPortfolioContent.profile.techniques],
        ["Play Time", sharedPortfolioContent.profile.experience],
        ["Current Campaign", sharedPortfolioContent.profile.currentArc],
        ["Side Quests", sharedPortfolioContent.profile.sideQuests],
      ],
      blurb:
        "Nakshatra builds like a systems player, not a button masher. The focus is on practical engineering, strong mechanics, and dependable loops: enterprise workflows, developer tooling, and scalable products that keep performing long after the first release.",
    },
    skills: {
      title: "Moves List",
      kicker: "Power Meter",
      groups: sharedPortfolioContent.skills.map((group, index) => ({
        ...group,
        title: index === 0 ? "Backend Inventory" : "Main Skill Tree",
      })),
    },
    projects: {
      title: "Mission Queue",
      kicker: "Recent Runs",
      items: [
        {
          rank: "S",
          title: "UNLOOP",
          desc: "A focus-control run built to counter endless short-form scroll loops across platforms like YouTube Shorts and Instagram Reels. Handles live event detection, navigation tracking, unstable page flows, and real-time behavior control like a system tuned for boss fights.",
          tags: ["Scroll Control", "Realtime Logic", "Automation"],
        },
        {
          rank: "A",
          title: "CLISKY",
          desc: "A command-line sidekick that reads the environment, adapts to the current machine, and generates context-aware commands with a modular architecture. Designed like a utility belt item for faster terminal gameplay.",
          tags: ["AI CLI", "Python", "System Aware"],
        },
        {
          rank: "A",
          title: "Gitroaster",
          desc: "A live web build that scans GitHub profiles, reads repo activity, and turns the data into structured, context-aware roasts. Equal parts analytics engine, API pipeline, and chaotic bonus level.",
          tags: ["GitHub API", "Data Parsing", "Generative AI"],
        },
      ],
    },
    contact: {
      kicker: "Multiplayer Lobby",
      title: "Press Start to Connect",
      placeholders: {
        name: "PLAYER TAG",
        email: "EMAIL ID",
        brief:
          "QUEST, BUILD, OR CO-OP IDEA",
      },
      submitLabel: "Send Invite",
      loadingLabel: "Joining Lobby...",
      subject: "New Gameverse message for Nakshatra",
      status: {
        pending: "Matchmaking",
        success: "Party Joined",
        error: "Connection Lost",
      },
    },
    controls: {
      switchTheme: "World Select",
      helpTitle: "`WASD` Move • `E` Interact",
      helpText: "Hold `S` to crouch like a platformer pro",
      loadingText: "Loading Gameverse",
    },
  },
};
