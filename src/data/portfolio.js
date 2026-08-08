/**
 * Core portfolio data — independent of any theme's visual presentation.
 *
 * Themes import this data and map it into their own labels/structure.
 * This file is managed by the admin editor. Do not edit manually.
 */

export const profile = {
  "name": "Naksh Chandna",
  "company": "Yamaha Motor Solutions India Pvt. Ltd.",
  "location": "Faridabad, India",
  "title": "Associate Software Engineer",
  "primarySkills": "Python, Flutter, SAP, FastAPI, JavaScript",
  "experience": "1+ Years",
  "focus": "Enterprise Systems, Automation & Developer Tools",
  "hobbies": "Sketching, Learning Guitar, Badminton, Table Tennis"
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
    "category": "Enterprise Technologies",
    "items": [
      {
        "label": "SAP ABAP",
        "value": 85,
        "color": "#d85a1a"
      },
      {
        "label": "SAP BTP",
        "value": 82,
        "color": "#efc56c"
      },
      {
        "label": "RAP",
        "value": 80,
        "color": "#f3ddaf"
      },
      {
        "label": "OData Services",
        "value": 76,
        "color": "#9d2c12"
      }
    ]
  },
  {
    "category": "Programming Languages & Frameworks",
    "items": [
      {
        "label": "Python / FastAPI",
        "value": 84,
        "color": "#4b8bbe"
      },
      {
        "label": "Flutter",
        "value": 80,
        "color": "#4cc2ff"
      },
      {
        "label": "Go",
        "value": 50,
        "color": "#5dc9e2"
      },
      {
        "label": "JavaScript",
        "value": 78,
        "color": "#e9b949"
      },
      {
        "label": "C++",
        "value": 70,
        "color": "#6b8cff"
      }
    ]
  }
];

export const projects = [
  {
    "title": "UNLOOP",
    "description": "A productivity-focused platform designed to reduce short-form content consumption across applications such as YouTube Shorts and Instagram Reels. Handles real-time activity tracking, browser event detection, navigation monitoring, and behavioral analytics.",
    "tags": [
      "Behavior Tracking",
      "Realtime Systems",
      "Automation"
    ],
    "link": "https://unloop.iamnaksh.tech"
  },
  {
    "title": "CLISKY",
    "description": "An AI-powered command-line assistant that detects the user's environment and generates contextual commands. Built with a modular architecture supporting Linux distribution awareness, environment configuration, and AI-assisted command generation.",
    "tags": [
      "AI CLI",
      "Python",
      "System Aware"
    ],
    "link": "https://pypi.org/project/clisky/"
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
