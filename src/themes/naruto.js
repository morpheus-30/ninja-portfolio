import * as defaultData from "../data/portfolio";
import { paperGrain, paperFibre, sealStamp } from "./textures";

/**
 * Build the Naruto theme using the provided portfolio data.
 * This allows the same theme to render with different content (e.g. draft preview).
 */
export function buildNarutoTheme(data = defaultData) {
  const { profile, bio, skills, projects } = data;

  return {
    id: "naruto",
    label: "Naruto",
    description: "Enter the Hidden Leaf themed portfolio experience.",
    selectorImage:
      "https://i.pinimg.com/736x/2c/ec/ea/2ceceaaa071d480e6be1db25bb79d89f.jpg",
    design: {
      colors: {
        ink: "#0c0806",
        ember: "#c2410c",
        vermilion: "#b91c1c",
        sunset: "#e06a1f",
        gold: "#e8b563",
        sand: "#f0dfb8",
        washi: "#e6d9bb",
        leaf: "#3f5b2c",
        pine: "#141d0f",
        smoke: "rgba(10, 7, 5, 0.82)",
        panel: "rgba(24, 15, 10, 0.74)",
        line: "rgba(232, 181, 99, 0.22)",
        text: "#f8f1df",
        muted: "#c9b38d",
      },
      fonts: {
        body: "'Oxanium', sans-serif",
        display: "'NinjaNaruto', 'Teko', sans-serif",
      },
      motion: {
        swapDelayMs: 380,
        runDurationMs: 720,
        scrollLockMs: 900,
        sectionEnterMs: 620,
        staggerStepMs: 48,
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
      character: {
        // Render box the sprite is composited into (mw/mh = mobile).
        frame: { w: 400, h: 240, mw: 150, mh: 118 },
        // Per-action calibration, merged over `default`. h/bottom = desktop,
        // mh/mBottom = mobile. Every GIF frames its character differently, so
        // these are tuning knobs — adjust here when swapping a sprite.
        default: { h: 146, mh: 102, bottom: 0 },
        idle: { blend: "multiply" },
        jump: { h: 200, mh: 114 },
        crouchAttack1: { h: 220, mh: 112 },
        crouchAttack2: { h: 220, mh: 112, bottom: -20, mBottom: -6 },
        crouchAttack3: { h: 180, mh: 108 },
      },
      scene: {
        particleCount: 160,
        particleSize: 0.7,
        particleRise: 0.015,
        sweepColor: "#2e140b",
      },
      /**
       * World: an ink-and-ember scroll. Panels are pressed paper held over
       * lamplight, edges bleed like a wet brush, and the section name runs
       * down a margin rail the way an annotation would.
       */
      world: {
        grain: paperGrain,
        fibre: paperFibre,
        seal: sealStamp,
        grainOpacity: 0.11,
        grainBlend: "overlay",
        railLabelColor: "#c9b38d",
        // Torn/brushed panel silhouette instead of a machined rectangle.
        panelClip:
          "polygon(0.6% 2%, 4% 0.4%, 22% 1.6%, 48% 0%, 74% 1.4%, 96% 0.5%, 99.4% 2.4%, 100% 18%, 99.2% 46%, 100% 72%, 99.5% 96%, 96% 99.6%, 72% 98.4%, 46% 100%, 24% 98.6%, 4% 99.5%, 0.5% 97%, 0% 74%, 0.8% 48%, 0% 22%)",
        inkBleed:
          "radial-gradient(120% 60% at 0% 0%, rgba(11,6,4,0.55) 0%, rgba(11,6,4,0) 42%), radial-gradient(110% 55% at 100% 100%, rgba(11,6,4,0.5) 0%, rgba(11,6,4,0) 40%)",
        backdropDrift: "driftScroll 34s ease-in-out infinite alternate",
        selectionBackground: "rgba(194, 65, 12, 0.42)",
        scrollThumb: "rgba(232, 181, 99, 0.34)",
        scrollTrack: "rgba(12, 8, 6, 0.5)",
      },
      chrome: {
        appBackground:
          "radial-gradient(circle at 50% -8%, rgba(224,106,31,0.24) 0%, rgba(224,106,31,0) 38%), linear-gradient(180deg, #2b1209 0%, #170c07 40%, #0a0605 100%)",
        backgroundImageOverlay:
          "linear-gradient(180deg, rgba(12,8,6,0.28), rgba(8,6,5,0.56))",
        backgroundFilter: "brightness(0.82) saturate(0.9) contrast(1.04)",
        topAtmosphere:
          "radial-gradient(circle at 50% 16%, rgba(232,181,99,0.24) 0, rgba(232,181,99,0.07) 12%, rgba(232,181,99,0) 24%), linear-gradient(180deg, rgba(224,106,31,0.09) 0%, rgba(36,17,11,0.03) 32%, rgba(6,5,5,0.1) 100%)",
        gridOverlay:
          "linear-gradient(rgba(232,181,99,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,181,99,0.04) 1px, transparent 1px)",
        bottomAtmosphere:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(20,29,15,0.8) 22%, rgba(11,16,8,0.98) 100%)",
        sectionBorder: "1px solid rgba(232, 181, 99, 0.26)",
        sectionBackground:
          "linear-gradient(172deg, rgba(40,23,14,0.9) 0%, rgba(23,14,9,0.94) 54%, rgba(14,9,6,0.96) 100%)",
        sectionShadow:
          "0 32px 64px -12px rgba(0,0,0,0.74), 0 8px 20px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(246,226,181,0.1)",
        sectionTopBar:
          "linear-gradient(90deg, rgba(0,0,0,0), rgba(232,181,99,0.32), rgba(194,65,12,0.5), rgba(232,181,99,0.32), rgba(0,0,0,0))",
        sectionGrid:
          "linear-gradient(rgba(232,181,99,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(232,181,99,0.1) 1px, transparent 1px)",
        statCardBorder: "1px solid rgba(232, 181, 99, 0.16)",
        statCardBackground: "transparent",
        missionCardBorder: "1px solid rgba(232, 181, 99, 0.2)",
        missionCardBackground:
          "linear-gradient(170deg, rgba(44,25,15,0.72) 0%, rgba(21,13,8,0.86) 100%)",
        pillBackground: "rgba(232,181,99,0.1)",
        navBackground: "rgba(10, 7, 5, 0.82)",
        themeButtonBackground: "rgba(232,181,99,0.09)",
        inputBackground: "rgba(255,255,255,0.04)",
        mediaFrameBackground: "rgba(255,255,255,0.04)",
        contactPendingBackground:
          "linear-gradient(180deg, rgba(58,32,17,0.8) 0%, rgba(30,17,10,0.9) 100%)",
        contactSuccessBackground:
          "linear-gradient(180deg, rgba(63,55,20,0.8) 0%, rgba(34,26,12,0.92) 100%)",
        contactErrorBackground:
          "linear-gradient(180deg, rgba(94,26,16,0.8) 0%, rgba(45,15,10,0.92) 100%)",
        helpTooltipBackground:
          "linear-gradient(180deg, rgba(50,27,16,0.96) 0%, rgba(22,13,9,0.97) 100%)",
        groundGlow:
          "linear-gradient(90deg, rgba(0,0,0,0), rgba(232,181,99,0.42), rgba(194,65,12,0.56), rgba(232,181,99,0.42), rgba(0,0,0,0))",
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
        particleSprite: "/assets/themes/naruto/ui/fire.png",
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
        title: bio.headline,
        intro: bio.intro,
        paragraphs: bio.paragraphs,
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
          ["Name", profile.name],
          ["Alliance", profile.company],
          ["Village", profile.location],
          ["Rank", profile.title],
          ["Primary Techniques", profile.primarySkills],
          ["Experience", profile.experience],
          ["Current Arc", profile.focus],
          ["Side Quests", profile.hobbies],
        ],
        blurb: bio.blurb,
      },
      skills: {
        title: "Jutsu Arsenal",
        kicker: "Power Levels",
        groups: skills.map((group) => ({
          title: group.category,
          skills: group.items,
        })),
      },
      projects: {
        title: "Mission Board",
        kicker: "Recent Arcs",
        openLabel: "Read Mission Log",
        detailLabels: {
          rank: "Mission Rank",
          stack: "Techniques Used",
          visit: "Open Mission",
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
        kicker: "Issue a Mission Scroll",
        title: "Summon the Shinobi",
        placeholders: {
          name: profile.name,
          email: "your@email.com",
          brief:
            "Describe the product, system, opportunity, or project you'd like to discuss.",
        },
        submitLabel: "Summon Contact",
        loadingLabel: "Summoning...",
        subject: "New portfolio message for Nakshatra-kun",
        status: {
          pendingDetail: "Shadow clone dispatched — holding the line.",
          successDetail: "Mission scroll delivered. Expect a reply by email.",
          errorDetail: "Transmission failed. Try again in a moment.",
          pending: "Shadow Clone Jutsu",
          success: "Mission Complete",
          error: "Transmission Failed",
        },
      },
      controls: {
        switchTheme: "Worlds",
        helpTitle: "`WASD` Move • `E` Attack",
        helpText: "Hold `S` to crouch or crouch-walk",
        loadingText: "Entering Naruto",
      },
    },
  };
}

// Default export for the public portfolio (uses published data from src/data/portfolio.js)
export const narutoTheme = buildNarutoTheme();
