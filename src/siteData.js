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
  kicker: "Leaf Village Tech Corps",
  title: "Shinobi Software Engineer",
  intro:
    "Nakshatra-kun is an Associate Software Engineer building practical systems across Python, Flutter, SAP, and modern developer tooling.",
  paragraphs: [
    "Since joining Yamaha Motor Solutions India Pvt. Ltd. in January 2025 after graduating from J.C. Bose University of Science and Technology, YMCA, I have been working on enterprise software while balancing cloud-native thinking, API-first design, and real-world product building across SAP BTP, ABAP RAP, SAP HANA, and OData.",
    "My strongest working zone blends Python, Flutter, and SAP, while still extending comfortably into Go, FastAPI, JavaScript, and C++. I like rapid prototyping, iterative building, and using AI as a force multiplier without losing touch with the underlying architecture, constraints, and system behavior.",
  ],
  ctas: [
    ["View Missions", 3],
    ["Ninja Profile", 1],
    ["Contact", 4],
  ],
};

export const ABOUT_STATS = [
  ["Name", "Nakshatra-kun"],
  ["Alliance", "Yamaha Motor Solutions India Pvt. Ltd."],
  ["Village", "Faridabad"],
  ["Rank", "Associate Software Engineer"],
  ["Specialty", "Python, Flutter, SAP"],
  ["Status", "1+ year at Yamaha"],
  ["Current Arc", "Enterprise software and developer-centric tools"],
];

export const ABOUT_BLURB =
  "Nakshatra-kun focuses on practical, system-driven work rather than surface-level apps. His interests sit at the intersection of enterprise software, automation, AI-assisted development, and developer productivity, with emphasis on building systems that solve real, observable problems.";

export const SKILL_GROUPS = [
  {
    title: "SAP and Enterprise",
    skills: [
      { label: "SAP ABAP", value: 85, color: "#d85a1a" },
      { label: "SAP BTP", value: 82, color: "#efc56c" },
      { label: "ABAP RAP", value: 80, color: "#f3ddaf" },
      { label: "SAP HANA", value: 74, color: "#3e5b2b" },
      { label: "OData Services", value: 76, color: "#9d2c12" },
    ],
  },
  {
    title: "Main Battle Stack",
    skills: [
      { label: "Python / FastAPI", value: 84, color: "#4b8bbe" },
      { label: "Flutter", value: 80, color: "#4cc2ff" },
      { label: "Go", value: 72, color: "#5dc9e2" },
      { label: "JavaScript", value: 78, color: "#e9b949" },
      { label: "C++", value: 70, color: "#6b8cff" },
      { label: "Git", value: 84, color: "#f05032" },
    ],
  },
];

export const PROJECTS = [
  {
    rank: "S",
    title: "UNLOOP",
    desc: "A behavioral tracking and control system designed to reduce short-form content consumption across platforms like YouTube Shorts and Instagram Reels, handling real-time event detection, navigation tracking, scroll lag, multi-event batching, and inconsistent transitions in dynamic web flows.",
    tags: ["Behavior Tracking", "Realtime Events", "Automation"],
  },
  {
    rank: "A",
    title: "CLISKY",
    desc: "An AI-powered CLI assistant that adapts to the user environment, including Linux distribution detection, and generates contextual command recommendations through a modular design with separate model and environment configuration layers.",
    tags: ["AI CLI", "Python", "Environment Aware"],
  },
  {
    rank: "A",
    title: "Gitroaster",
    desc: "A fully developed and hosted tool that pulls GitHub profile data, analyzes repository activity and metadata, and generates context-aware, data-driven roasts by combining API integration, data processing, and generative AI output.",
    tags: ["GitHub API", "Data Processing", "Generative AI"],
  },
];

export const CONTACT_CONTENT = {
  kicker: "Send A Mission Brief",
  title: "Hokage's Office",
  placeholders: {
    name: "Nakshatra Chandna",
    email: "your@email.com",
    brief: "Tell me about the project, role, or system you want to build.",
  },
};
