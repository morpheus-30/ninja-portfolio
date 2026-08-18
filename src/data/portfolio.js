/**
 * Core portfolio data — independent of any theme's visual presentation.
 *
 * Themes import this data and map it into their own labels/structure.
 * This file is managed by the admin editor. Do not edit manually.
 */

export const profile = {
  "name": "Nakshatra Chandna",
  "company": "Yamaha Motor Solutions India Pvt. Ltd.",
  "location": "India",
  "title": "Associate Software Engineer",
  "primarySkills": "Python, Flutter, SAP, FastAPI, JavaScript, Express",
  "experience": "1+ Years",
  "focus": "AI AI AIIIII!",
  "hobbies": "Sketching, Guitar, Badminton, Table Tennis"
};

export const bio = {
  "headline": "Software Engineer",
  "intro": "Associate Software Engineer building practical systems across enterprise software, automation, AI-powered tools, and developer productivity solutions.",
  "paragraphs": [
    "Currently working at Yamaha Motor Solutions India, developing enterprise applications and internal systems with a focus on maintainability, scalability, and reliable execution.",
    "Experienced in Python, Flutter, SAP ABAP, FastAPI, JavaScript, and C++. Passionate about backend engineering, automation, developer tooling, and AI-driven products."
  ],
  "blurb": "Nakshatra Chandna enjoys building systems that solve real problems through enterprise applications, automation platforms, developer tools, and AI-powered products. His focus is on creating software that is reliable, maintainable, and useful in real-world environments while continuously exploring new technologies and engineering practices."
};

export const skills = [
  {
    "category": "Languages",
    "items": [
      {
        "label": "Typescriot",
        "value": 70,
        "color": "#8b4dff"
      },
      {
        "label": "Javascript",
        "value": 70,
        "color": "#4dff70"
      },
      {
        "label": "Python",
        "value": 70,
        "color": "#cf4dff"
      },
      {
        "label": "C++",
        "value": 80,
        "color": "#ff4dbe"
      },
      {
        "label": "Kotlin",
        "value": 60,
        "color": "#4fff4d"
      },
      {
        "label": "ABAP",
        "value": 80,
        "color": "#ff4dde"
      }
    ]
  },
  {
    "category": "Frameworks & Libraries",
    "items": [
      {
        "label": "React",
        "value": 70,
        "color": "#4f9eff"
      },
      {
        "label": "Next.js",
        "value": 60,
        "color": "#ff4dcf"
      },
      {
        "label": "Express.js",
        "value": 75,
        "color": "#ffac4d"
      },
      {
        "label": "Flask",
        "value": 60,
        "color": "#4dff8b"
      },
      {
        "label": "Tailwind CSS",
        "value": 50,
        "color": "#a64dff"
      },
      {
        "label": "FastAPI",
        "value": 75,
        "color": "#cfff4d"
      },
      {
        "label": "Prisma",
        "value": 76,
        "color": "#8b4dff"
      },
      {
        "label": "Flutter",
        "value": 80,
        "color": "#82ff4d"
      },
      {
        "label": "Android SDK",
        "value": 80,
        "color": "#4ddbff"
      },
      {
        "label": "SAP UI5/CAP",
        "value": 70,
        "color": "#ffac4d"
      },
      {
        "label": "LangChain",
        "value": 40,
        "color": "#ff4d79"
      },
      {
        "label": "SAP RAP",
        "value": 75,
        "color": "#020203"
      }
    ]
  },
  {
    "category": "Database & APIs",
    "items": [
      {
        "label": "PostgreSQL",
        "value": 70,
        "color": "#4d58ff"
      },
      {
        "label": "Firebase",
        "value": 79,
        "color": "#143918"
      },
      {
        "label": "SAP HANA Cloud",
        "value": 80,
        "color": "#4dff4f"
      },
      {
        "label": "REST",
        "value": 60,
        "color": "#d84dff"
      },
      {
        "label": "OData",
        "value": 70,
        "color": "#ff704d"
      },
      {
        "label": "WebSockets",
        "value": 60,
        "color": "#58ff4d"
      },
      {
        "label": "JWT",
        "value": 70,
        "color": "#4dffd2"
      },
      {
        "label": "OAuth 2.0",
        "value": 75,
        "color": "#ff4d70"
      }
    ]
  },
  {
    "category": "Cloud & Tools",
    "items": [
      {
        "label": "AWS",
        "value": 45,
        "color": "#d84dff"
      },
      {
        "label": "DigitalOcean",
        "value": 50,
        "color": "#4dff61"
      },
      {
        "label": "Docker",
        "value": 50,
        "color": "#ffa34d"
      },
      {
        "label": "Git",
        "value": 80,
        "color": "#eaff4d"
      },
      {
        "label": "Nginx",
        "value": 70,
        "color": "#4dffb2"
      },
      {
        "label": "Vercel",
        "value": 60,
        "color": "#f34dff"
      },
      {
        "label": "SAP BTP",
        "value": 50,
        "color": "#4dff70"
      },
      {
        "label": "Chrome Extensions (Manifest V3)",
        "value": 70,
        "color": "#4dc9ff"
      }
    ]
  }
];

export const projects = [
  {
    "title": "UNLOOP",
    "description": "A productivity-focused platform designed to reduce short-form content consumption across applications such as YouTube Shorts and Instagram Reels. Handles real-time activity tracking, browser event detection, navigation monitoring, and behavioral analytics. PSSST! Android launching soon!!",
    "tags": [
      "Behavior Tracking",
      "Realtime Systems",
      "Automation"
    ],
    "link": "https://unloop.iamnaksh.tech"
  },
  {
    "title": "Queryless",
    "description": "An AI-powered platform enabling natural language querying of SAP HANA Cloud databases,\ntranslating plain-English questions into executable queries and returning contextual results. Implemented an MCP\n(Model Context Protocol) server architecture with agent-based workflows for schema understanding, query generation,\nand multi-step reasoning over enterprise data models.",
    "tags": [
      "AI",
      "MCP",
      "SAP HANA",
      "Express.js",
      "AWS"
    ],
    "link": "https://queryless.iamnaksh.tech/"
  },
  {
    "title": "MyNotion",
    "description": "A multi-tenant RAG assistant that indexes a Notion workspace and answers questions over it through semantic search. Incremental sync keeps the Qdrant vector store current as pages change, so answers stay grounded in the latest content.",
    "tags": [
      "RAG",
      "Qdrant",
      "Python",
      "LLM",
      "Streamlit"
    ],
    "link": "https://mynotion.streamlit.app/"
  },
  {
    "title": "Gitroaster",
    "description": "A deployed web application that analyzes GitHub profiles using repository metadata and activity patterns to generate context-aware AI-powered insights and humorous evaluations.",
    "tags": [
      "GitHub API",
      "Data Processing",
      "Generative AI"
    ],
    "link": "http://gitroaster.streamlit.app/"
  }
];
