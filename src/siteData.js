export const SECTIONS = ["home", "about", "skills", "projects", "contact"];

export const SITE_ASSETS = {
  character: {
    idle: "/assets/idle.gif",
    jump: "/assets/jump.gif",
    crouch: "/assets/crouch.gif",
    attack: "/assets/eattack.gif",
    run: "/assets/run.gif",
  },
  heroProfile:
    "https://i.pinimg.com/736x/65/40/ec/6540eccd704245ae4d8a01874186887f.jpg",
  sectionBackgrounds: [
    "/assets/backgrounds/home-konoha.jpg",
    "/assets/backgrounds/about-naruto.jpg",
    "/assets/backgrounds/skills-jutsu.jpg",
    "/assets/backgrounds/missions-cast.jpg",
    "/assets/backgrounds/contact-funny.jpg",
  ],
};

export const HOME_CONTENT = {
  kicker: "Leaf Village Tech Division",
  title: "Shinobi Software Engineer",
  intro:
    "Nakshatra-kun is an Associate Software Engineer crafting real-world systems across Python, Flutter, SAP, and modern developer tooling.",
  paragraphs: [
    "Currently deployed at Yamaha Motor Solutions India Pvt. Ltd. since January 2025, after graduating from J.C. Bose University of Science and Technology, YMCA. My work revolves around building enterprise-grade systems while balancing cloud-native thinking, API-first design, and practical system behavior.",
    "My primary arsenal includes Python, Flutter, and SAP, with additional exploration in Go, FastAPI, JavaScript, and C++. I focus on rapid prototyping, iterative development, and using AI as a support tool—while staying grounded in system design, constraints, and real execution.",
  ],
  ctas: [
    ["View Missions", 3],
    ["Ninja Profile", 1],
    ["Summon Shinobi", 4],
  ],
};

export const ABOUT_STATS = [
  ["Name", "Nakshatra-kun"],
  ["Alliance", "Yamaha Motor Solutions India Pvt. Ltd."],
  ["Village", "Faridabad"],
  ["Rank", "Associate Software Engineer"],
  ["Primary Techniques", "Python, Flutter, SAP"],
  ["Experience", "1+ year at Yamaha"],
  ["Current Arc", "Enterprise systems and developer tools"],
  ["Side Quests", "Sketching, Learning Guitar, Badminton, TT"],
];

export const ABOUT_BLURB =
  "Nakshatra-kun focuses on building practical, system-driven solutions rather than surface-level applications. His interests lie at the intersection of enterprise engineering and developer productivity, with a focus on solving real, observable problems through structured and scalable systems.";

export const SKILL_GROUPS = [
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
];

export const PROJECTS = [
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
];

export const CONTACT_CONTENT = {
  kicker: "Issue a Mission Scroll",
  title: "Summon the Shinobi",
  placeholders: {
    name: "Nakshatra Chandna",
    email: "your@email.com",
    brief:
      "Describe the system, product, or mission you want to collaborate on.",
  },
};
