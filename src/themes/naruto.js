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
      title: "Software Engineer",
      intro:
        "Associate Software Engineer building practical systems across Python, Flutter, SAP, and developer tooling.",
      paragraphs: [
        "Currently at Yamaha Motor Solutions India, focused on enterprise systems, API-first design, and reliable execution with a practical engineering mindset.",
        "Primary stack includes Python, Flutter, and SAP, with hands-on exploration in Go, FastAPI, JavaScript, and C++.",
      ],
      ctas: [
        ["View Missions", 3],
        ["Ninja Profile", 1],
        ["Summon Shinobi", 4],
      ],
    },
    about: {
      stats: [
        ["Name", "Nakshatra-kun"],
        ["Alliance", "Yamaha Motor Solutions India Pvt. Ltd."],
        ["Village", "Faridabad"],
        ["Rank", "Associate Software Engineer"],
        ["Primary Techniques", "Python, Flutter, SAP"],
        ["Experience", "1+ year at Yamaha"],
        ["Current Arc", "Enterprise systems and developer tools"],
        ["Side Quests", "Sketching, Learning Guitar, Badminton, TT"],
      ],
      blurb:
        "Nakshatra-kun focuses on building practical, system-driven solutions rather than surface-level applications. His interests lie at the intersection of enterprise engineering and developer productivity, with a focus on solving real, observable problems through structured and scalable systems.",
    },
    skills: [
      {
        title: "Forbidden Enterprise Techniques",
        skills: [
          { label: "SAP ABAP", value: 85, color: "#d85a1a" },
          { label: "SAP BTP", value: 82, color: "#efc56c" },
          { label: "RAP", value: 80, color: "#f3ddaf" },
          { label: "OData Services", value: 76, color: "#9d2c12" },
        ],
      },
      {
        title: "Primary Jutsu Arsenal",
        skills: [
          { label: "Python / FastAPI", value: 84, color: "#4b8bbe" },
          { label: "Flutter", value: 80, color: "#4cc2ff" },
          { label: "Go", value: 50, color: "#5dc9e2" },
          { label: "JavaScript", value: 78, color: "#e9b949" },
          { label: "C++", value: 70, color: "#6b8cff" },
        ],
      },
    ],
    projects: [
      {
        rank: "S",
        title: "UNLOOP",
        desc: "An S-rank mission focused on controlling short-form content consumption across platforms like YouTube Shorts and Instagram Reels. Handles real-time event detection, navigation tracking, scroll inconsistencies, and dynamic web flow behavior.",
        tags: ["Behavior Tracking", "Realtime Systems", "Automation"],
      },
      {
        rank: "A",
        title: "CLISKY",
        desc: "An AI-powered command-line assistant that adapts to the shinobi's environment, including Linux distribution detection, and generates contextual commands using a modular architecture with separated model and configuration layers.",
        tags: ["AI CLI", "Python", "System Aware"],
      },
      {
        rank: "A",
        title: "Gitroaster",
        desc: "A deployed tool that analyzes GitHub profiles by extracting repository data and activity patterns, generating structured, context-aware roasts using API integration and AI-driven processing.",
        tags: ["GitHub API", "Data Processing", "Generative AI"],
      },
    ],
    contact: {
      kicker: "Issue a Mission Scroll",
      title: "Summon the Shinobi",
      placeholders: {
        name: "Nakshatra Chandna",
        email: "your@email.com",
        brief:
          "Describe the system, product, or mission you want to collaborate on.",
      },
    },
  },
};
