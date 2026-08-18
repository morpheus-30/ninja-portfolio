import * as defaultData from "../data/portfolio";
import { bayerDither, phosphorGrid } from "./textures";

/**
 * Build the Gameverse (pop) theme using the provided portfolio data.
 *
 * All portfolio content (profile, bio, skills, projects) comes from the shared
 * data layer. This theme only controls presentation: labels, kickers, styling,
 * and visual configuration.
 */
export function buildPopTheme(data = defaultData) {
  const { profile, bio, skills, projects } = data;

  return {
    id: "pop",
    label: "Gameverse",
    description:
      "A high-energy gamer world with arcade, shooter, and action UI vibes.",
    selectorImage: "/assets/themes/pop/backgrounds/thumbnail.jpg",
    design: {
      colors: {
        ink: "#04050a",
        ember: "#ff2e88",
        vermilion: "#ff2e88",
        sunset: "#ff6b35",
        gold: "#ffc857",
        cyan: "#6ff7ff",
        sand: "#eef3f8",
        washi: "#d9c9a8",
        leaf: "#123a4d",
        pine: "#080d14",
        smoke: "rgba(4, 6, 11, 0.88)",
        panel: "rgba(8, 13, 22, 0.86)",
        line: "rgba(111, 247, 255, 0.24)",
        text: "#f2f7fd",
        muted: "#93a8c0",
      },
      fonts: {
        body: "'Rajdhani', 'Oxanium', sans-serif",
        display: "'PixelGame', 'VT323', monospace",
      },
      motion: {
        swapDelayMs: 380,
        runDurationMs: 720,
        scrollLockMs: 900,
        sectionEnterMs: 620,
        staggerStepMs: 48,
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
      character: {
        frame: { w: 400, h: 240, mw: 150, mh: 118 },
        // See naruto.js for what each key does.
        default: { h: 200, mh: 108, bottom: 20, mBottom: -2 },
        idle: { blend: "multiply" },
        run: { h: 110, mh: 92 },
        crouchWalk: { h: 110, mh: 92 },
        jump: { h: 240, mh: 114 },
        attack1: { h: 140, mh: 108 },
        attack2: { h: 170, mh: 108 },
        attack3: { h: 170, mh: 108 },
      },
      scene: {
        particleCount: 220,
        particleSize: 0.28,
        particleRise: 0.011,
        sweepColor: "#1b1016",
      },
      /**
       * World: a CRT arcade cabinet. The bezel is cabinet chrome — near-black,
       * phosphor accents, aperture-grille stripe — and everything inside it is
       * the game on screen, which is where the stone and treasure sprites live.
       * That split is what lets warm dungeon art sit inside cold hardware.
       */
      world: {
        grain: bayerDither,
        fibre: phosphorGrid,
        grainOpacity: 0.5,
        grainBlend: "overlay",
        railLabelColor: "#6ff7ff",
        // Chamfered cabinet bezel — cut corners, not rounded ones.
        panelClip:
          "polygon(var(--gv-cut) 0, calc(100% - var(--gv-cut)) 0, 100% var(--gv-cut), 100% calc(100% - var(--gv-cut)), calc(100% - var(--gv-cut)) 100%, var(--gv-cut) 100%, 0 calc(100% - var(--gv-cut)), 0 var(--gv-cut))",
        // Barrel vignette: the glass is curved, so the corners fall off.
        inkBleed:
          "radial-gradient(130% 120% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.72) 100%)",
        scanline:
          "repeating-linear-gradient(180deg, rgba(0,0,0,0.34) 0px, rgba(0,0,0,0.34) 1px, rgba(255,255,255,0.015) 1px, rgba(255,255,255,0.015) 3px)",
        backdropDrift: "driftCabinet 42s ease-in-out infinite alternate",
        selectionBackground: "rgba(111, 247, 255, 0.32)",
        scrollThumb: "rgba(111, 247, 255, 0.4)",
        scrollTrack: "rgba(4, 6, 11, 0.6)",
      },
      chrome: {
        appBackground:
          "radial-gradient(circle at 50% -6%, rgba(111,247,255,0.1) 0%, rgba(111,247,255,0) 34%), linear-gradient(180deg, #0a0f18 0%, #06090f 46%, #030407 100%)",
        backgroundImageOverlay:
          "radial-gradient(circle at 50% -6%, rgba(111,247,255,0.1) 0%, rgba(111,247,255,0.02) 20%, rgba(0,0,0,0) 40%), linear-gradient(180deg, rgba(4,6,11,0.42) 0%, rgba(4,6,11,0.58) 40%, rgba(2,3,6,0.8) 100%)",
        backgroundFilter: "brightness(0.62) saturate(1.12) contrast(1.14)",
        topAtmosphere:
          "radial-gradient(circle at 50% 10%, rgba(111,247,255,0.2) 0%, rgba(111,247,255,0.05) 14%, rgba(0,0,0,0) 32%), radial-gradient(circle at 16% 22%, rgba(255,46,136,0.14) 0%, rgba(0,0,0,0) 30%), radial-gradient(circle at 84% 20%, rgba(255,200,87,0.12) 0%, rgba(0,0,0,0) 28%)",
        gridOverlay:
          "linear-gradient(rgba(111,247,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(111,247,255,0.05) 1px, transparent 1px)",
        bottomAtmosphere:
          "radial-gradient(ellipse at 50% 112%, rgba(111,247,255,0.16) 0%, rgba(111,247,255,0.04) 30%, rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(4,6,11,0) 0%, rgba(4,6,11,0.5) 24%, rgba(2,3,7,0.86) 62%, rgba(1,2,4,0.99) 100%)",
        sectionBorder: "1px solid rgba(111, 247, 255, 0.2)",
        sectionBackground:
          "linear-gradient(180deg, rgba(11,17,28,0.9) 0%, rgba(7,11,19,0.94) 52%, rgba(4,7,12,0.96) 100%)",
        sectionShadow:
          "0 36px 72px -14px rgba(0,0,0,0.86), 0 10px 24px -8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(111,247,255,0.14), inset 0 0 40px rgba(111,247,255,0.04)",
        sectionTopBar:
          "linear-gradient(90deg, rgba(0,0,0,0), rgba(111,247,255,0.34), rgba(255,46,136,0.46), rgba(255,200,87,0.3), rgba(0,0,0,0))",
        sectionGrid:
          "linear-gradient(rgba(111,247,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(111,247,255,0.04) 1px, transparent 1px)",
        statCardBorder: "1px solid rgba(111, 247, 255, 0.14)",
        statCardBackground: "transparent",
        missionCardBorder: "1px solid rgba(111, 247, 255, 0.2)",
        missionCardBackground:
          "linear-gradient(180deg, rgba(13,20,33,0.88) 0%, rgba(6,10,17,0.94) 100%)",
        pillBackground: "rgba(111,247,255,0.1)",
        navBackground: "rgba(4,6,11,0.9)",
        themeButtonBackground: "rgba(255,46,136,0.14)",
        inputBackground: "rgba(111,247,255,0.04)",
        mediaFrameBackground: "rgba(111,247,255,0.04)",
        contactPendingBackground:
          "linear-gradient(180deg, rgba(11,18,30,0.92) 0%, rgba(5,8,14,0.98) 100%)",
        contactSuccessBackground:
          "linear-gradient(180deg, rgba(14,44,38,0.9) 0%, rgba(5,14,13,0.96) 100%)",
        contactErrorBackground:
          "linear-gradient(180deg, rgba(74,12,38,0.9) 0%, rgba(24,5,14,0.96) 100%)",
        helpTooltipBackground:
          "linear-gradient(180deg, rgba(11,18,30,0.98) 0%, rgba(5,8,14,0.98) 100%)",
        groundGlow:
          "linear-gradient(90deg, rgba(0,0,0,0), rgba(111,247,255,0.3), rgba(255,46,136,0.56), rgba(255,200,87,0.24), rgba(0,0,0,0))",
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
        // Theme-specific labels
        kicker: "Insert Coin",
        title: bio.headline,
        // Shared portfolio content
        intro: bio.intro,
        paragraphs: bio.paragraphs,
        // Theme-specific CTAs
        ctas: [
          ["Start Missions", 3],
          ["View CHARACTER SELECT", 1],
          ["Open Lobby", 4],
        ],
      },
      about: {
        // Theme-specific labels
        title: "CHARACTER SELECT",
        kicker: "Player Stats",
        // Shared portfolio content (with themed stat labels)
        stats: [
          ["Player Tag", profile.name],
          ["Guild", profile.company],
          ["Spawn Point", profile.location],
          ["Class", profile.title],
          ["Core Loadout", profile.primarySkills],
          ["Play Time", profile.experience],
          ["Current Campaign", profile.focus],
          ["Side Quests", profile.hobbies],
        ],
        // Shared portfolio content
        blurb: bio.blurb,
      },
      skills: {
        // Theme-specific labels
        title: "Moves List",
        kicker: "Power Meter",
        // Shared portfolio content (with themed group titles)
        groups: skills.map((group, index) => ({
          title: index === 0 ? "Enterprise Tech Tree" : "Programming Arsenal",
          skills: group.items,
        })),
      },
      projects: {
        // Theme-specific labels
        title: "Mission Queue",
        kicker: "Recent Runs",
        // Shared portfolio content — derived from the canonical projects data
        openLabel: "View Run Data",
        detailLabels: {
          rank: "Difficulty",
          stack: "Loadout",
          visit: "Launch Game",
        },
        items: projects.map((p) => ({
          rank: p.title === "UNLOOP" ? "S" : "A",
          title: p.title,
          desc: p.description,
          tags: p.tags,
          link: p.link,
        })),
      },
      contact: {
        // Theme-specific labels and presentation
        kicker: "Multiplayer Lobby",
        title: "Press Start to Connect",
        placeholders: {
          name: "PLAYER TAG",
          email: "EMAIL ID",
          brief: "PRODUCT, SYSTEM, OR COLLABORATION IDEA",
        },
        submitLabel: "Send Invite",
        loadingLabel: "Joining Lobby...",
        subject: "New Gameverse message for " + profile.name,
        status: {
          pendingDetail: "Opening a channel to the host...",
          successDetail: "Invite accepted. A reply lands in your inbox.",
          errorDetail: "Connection dropped. Retry when ready.",
          pending: "Matchmaking",
          success: "Party Joined",
          error: "Connection Lost",
        },
      },
      controls: {
        switchTheme: "World Select",
        helpTitle: "`WASD` Move • `E` Interact",
        helpText: "Hold `S` to crouch like a platformer pro",
        loadingText: "Loading Developer Profile",
      },
    },
  };
}

// Default export for the public portfolio
export const popTheme = buildPopTheme();
