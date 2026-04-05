import { sharedPortfolioContent } from "./content";

export const popTheme = {
  id: "pop",
  label: "Gameverse",
  description:
    "A high-energy gamer world with arcade, shooter, and action UI vibes.",
  selectorImage: "/assets/themes/pop/backgrounds/home.jpg",
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
      display: "'Teko', 'Rajdhani', sans-serif",
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
        "radial-gradient(circle at top, rgba(255,70,85,0.12) 0%, rgba(255,70,85,0) 26%), linear-gradient(180deg, #090c14 0%, #0a1018 46%, #040508 100%)",
      backgroundImageOverlay:
        "linear-gradient(180deg, rgba(4,7,12,0.08), rgba(3,5,8,0.66))",
      backgroundFilter: "brightness(0.72) saturate(0.9) contrast(1.05)",
      topAtmosphere:
        "linear-gradient(135deg, rgba(255,70,85,0.22) 0%, rgba(255,70,85,0.22) 18%, rgba(0,0,0,0) 18%), linear-gradient(315deg, rgba(12,20,32,0.8) 0%, rgba(12,20,32,0.34) 40%, rgba(0,0,0,0) 40%), radial-gradient(circle at 74% 24%, rgba(255,209,102,0.14) 0%, rgba(255,209,102,0.03) 12%, rgba(0,0,0,0) 26%)",
      gridOverlay:
        "linear-gradient(rgba(255,70,85,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,70,85,0.04) 1px, transparent 1px)",
      bottomAtmosphere:
        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,13,20,0.58) 16%, rgba(3,4,7,0.98) 100%)",
      sectionBorder: "2px solid rgba(255, 70, 85, 0.58)",
      sectionBackground:
        "linear-gradient(180deg, rgba(12,15,22,0.96) 0%, rgba(18,22,30,0.94) 42%, rgba(9,11,16,0.98) 100%)",
      sectionShadow:
        "0 0 60px rgba(255,70,85,0.08), 0 30px 90px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,70,85,0.05), inset 0 14px 32px rgba(255,70,85,0.04)",
      sectionTopBar:
        "linear-gradient(90deg, rgba(0,0,0,0), rgba(255,70,85,0.14), rgba(255,70,85,0.62), rgba(255,209,102,0.18), rgba(0,0,0,0))",
      sectionGrid:
        "linear-gradient(rgba(255,70,85,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,70,85,0.07) 1px, transparent 1px)",
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
    heroProfile: "/assets/themes/pop/backgrounds/home.jpg",
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
      kicker: "Player One Interface",
      title: sharedPortfolioContent.home.title,
      intro: sharedPortfolioContent.home.intro,
      paragraphs: sharedPortfolioContent.home.paragraphs,
      ctas: [
        ["Open Missions", 3],
        ["Player Profile", 1],
        ["Queue Contact", 4],
      ],
    },
    about: {
      title: "Player Profile",
      kicker: "Character Sheet",
      stats: [
        ["Name", sharedPortfolioContent.profile.name],
        ["Alliance", sharedPortfolioContent.profile.alliance],
        ["Base", sharedPortfolioContent.profile.village],
        ["Role", sharedPortfolioContent.profile.rank],
        ["Loadout", sharedPortfolioContent.profile.techniques],
        ["Experience", sharedPortfolioContent.profile.experience],
        ["Current Match", sharedPortfolioContent.profile.currentArc],
        ["Side Quests", sharedPortfolioContent.profile.sideQuests],
      ],
      blurb: sharedPortfolioContent.aboutBlurb,
    },
    skills: {
      title: "Loadout Grid",
      kicker: "Power Levels",
      groups: sharedPortfolioContent.skills.map((group, index) => ({
        ...group,
        title: index === 0 ? "System Weaponry" : "Main Skill Tree",
      })),
    },
    projects: {
      title: "Mission Queue",
      kicker: "Recent Runs",
      items: sharedPortfolioContent.projects,
    },
    contact: {
      kicker: "Open Match Request",
      title: "Connect to Lobby",
      placeholders: sharedPortfolioContent.contactPlaceholders,
      submitLabel: "Send Invite",
      loadingLabel: "Connecting...",
      subject: "New portfolio message for Nakshatra-kun",
      status: {
        pending: "Matchmaking",
        success: "Invite Sent",
        error: "Server Timeout",
      },
    },
    controls: {
      switchTheme: "Worlds",
      helpTitle: "`WASD` Move • `E` Action",
      helpText: "Hold `S` for crouch mode",
      loadingText: "Booting Gameverse",
    },
  },
};
