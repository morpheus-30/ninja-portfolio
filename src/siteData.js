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
  title: "Software Engineer",
  intro:
    "Nakshatra-kun is an Associate Software Engineer focused on building practical, system-driven solutions across Python, Flutter, SAP, and modern developer tooling.",
  paragraphs: [
    "Currently working at Yamaha Motor Solutions India Pvt. Ltd. since January 2025, after graduating from J.C. Bose University of Science and Technology, YMCA. His work revolves around enterprise-grade systems, combining cloud-native thinking, API-first design, and scalable backend development across SAP BTP, ABAP RAP, SAP HANA, and OData.",
    "His core strength lies in bridging backend systems with real-world usability. He actively works with Python, Flutter, and SAP while expanding into Go, FastAPI, JavaScript, and C++. He focuses on rapid prototyping, iterative development, and leveraging AI effectively without compromising system fundamentals or architectural clarity.",
  ],
  ctas: [
    ["View Missions", 3],
    ["Ninja Profile", 1],
    ["Contact", 4],
  ],
};

export const ABOUT_STATS = [
  ["Name", "Nakshatra-kun"],
  ["Organization", "Yamaha Motor Solutions India Pvt. Ltd."],
  ["Location", "Faridabad"],
  ["Role", "Associate Software Engineer"],
  ["Core Stack", "Python, Flutter, SAP"],
  ["Experience", "1+ year at Yamaha"],
  ["Focus Area", "Enterprise systems and developer tools"],
  ["Hobbies", "Sketching, Learning Guitar"],
];

export const ABOUT_BLURB =
  "Nakshatra focuses on building meaningful, system-oriented software rather than surface-level applications. His interests lie at the intersection of enterprise engineering and developer productivity, with an emphasis on solving real, observable problems through structured and scalable approaches.";

export const SKILL_GROUPS = [
  {
    title: "SAP and Enterprise",
    skills: [
      { label: "SAP ABAP", value: 85, color: "#d85a1a" },
      { label: "SAP BTP", value: 82, color: "#efc56c" },
      { label: "RAP", value: 80, color: "#f3ddaf" },
      { label: "OData Services", value: 76, color: "#9d2c12" },
    ],
  },
  {
    title: "Core Engineering Stack",
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
    desc: "A behavioral tracking and control system designed to reduce short-form content consumption across platforms like YouTube Shorts and Instagram Reels. It handles real-time event detection, navigation tracking, scroll inconsistencies, and dynamic UI transitions across complex web flows.",
    tags: ["Behavior Tracking", "Realtime Systems", "Automation"],
  },
  {
    rank: "A",
    title: "CLISKY",
    desc: "An AI-powered CLI assistant that adapts to the user’s environment, including Linux distribution detection, and generates contextual command recommendations through a modular architecture with separated model and configuration layers.",
    tags: ["AI CLI", "Python", "System Aware"],
  },
  {
    rank: "A",
    title: "Gitroaster",
    desc: "A hosted tool that analyzes GitHub profiles by extracting repository data, activity patterns, and metadata to generate structured, context-aware roasts using API integration and AI-driven processing.",
    tags: ["GitHub API", "Data Processing", "Generative AI"],
  },
];

export const CONTACT_CONTENT = {
  kicker: "Initiate Collaboration",
  title: "Get in Touch",
  placeholders: {
    name: "Nakshatra-kun",
    email: "your@email.com",
    brief:
      "Describe the system, product, or role you would like to collaborate on.",
  },
};
