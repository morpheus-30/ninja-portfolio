export function buildGlobalStyles({ assets, C }) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Oxanium:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=Teko:wght@400;500;600;700&family=VT323&display=swap');
    @font-face {
      font-family: 'NinjaNaruto';
      src: url('/njnaruto.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'PixelGame';
      src: url('/assets/themes/pop/PixelGame.otf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { overflow: hidden; }
    html, body, * { cursor: url('${assets.ui.cursor}') 8 8, auto; }
    button, input, textarea { font: inherit; }
    button, a, [role="button"], nav *, button:hover, a:hover, [role="button"]:hover {
      cursor: url('${assets.ui.focusCursor}') 8 8, pointer !important;
    }
    a { color: inherit; }
    .gameverse-card {
      isolation: isolate;
    }
    .gameverse-nav {
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px) saturate(112%);
      -webkit-backdrop-filter: blur(10px) saturate(112%);
      border: 4px solid rgba(78, 58, 36, 0.92) !important;
      border-radius: 0 !important;
      background:
        linear-gradient(rgba(9, 8, 10, 0.88), rgba(9, 8, 10, 0.88)) padding-box,
        linear-gradient(180deg, rgba(58,42,27,1) 0%, rgba(128,95,57,1) 46%, rgba(227,194,129,1) 100%) border-box !important;
      box-shadow:
        0 0 0 2px rgba(24, 18, 12, 0.95) inset,
        0 0 0 6px rgba(121, 93, 61, 0.34) inset,
        0 16px 34px rgba(0,0,0,0.34);
      font-family: 'VT323', 'PixelGame', monospace;
      image-rendering: pixelated;
    }
    .gameverse-nav::before {
      content: "";
      position: absolute;
      inset: 6px;
      border: 2px solid rgba(198, 163, 104, 0.45);
      pointer-events: none;
      box-shadow: inset 0 0 0 2px rgba(41, 29, 18, 0.9);
    }
    .gameverse-nav::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          180deg,
          rgba(255,244,216,0.024) 0,
          rgba(255,244,216,0.024) 1px,
          rgba(255,255,255,0) 1px,
          rgba(255,255,255,0) 4px
        );
      mix-blend-mode: soft-light;
      opacity: 0.22;
      pointer-events: none;
    }
    .gameverse-nav-button {
      position: relative;
      border-radius: 0 !important;
      border: 0 !important;
      padding-top: 0.4rem !important;
      padding-bottom: 0.38rem !important;
      background: transparent !important;
      color: #d6c49d !important;
      font-family: 'VT323', 'PixelGame', monospace !important;
      font-size: 1.15rem !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      text-shadow: 0 0 0.5px rgba(255, 234, 190, 0.18);
      transition:
        color 140ms steps(2, end),
        text-shadow 140ms steps(2, end),
        filter 140ms steps(2, end);
    }
    .gameverse-nav-button + .gameverse-nav-button::before {
      content: "";
      position: absolute;
      left: -0.05rem;
      top: 18%;
      bottom: 18%;
      width: 2px;
      background: linear-gradient(180deg, transparent, rgba(163,130,88,0.1), rgba(214,180,122,0.65), rgba(163,130,88,0.1), transparent);
      pointer-events: none;
    }
    .gameverse-nav-button.is-active {
      color: #f4d98f !important;
      text-shadow:
        0 0 0.5px rgba(255, 236, 173, 0.95),
        0 0 10px rgba(233, 199, 116, 0.28);
    }
    .gameverse-nav-label {
      position: relative;
      display: inline-block;
      line-height: 1;
      transition: color 140ms steps(2, end), text-shadow 140ms steps(2, end);
    }
    .gameverse-nav-button.is-active .gameverse-nav-label::before {
      content: "[ ";
      color: #f3d685;
      text-shadow:
        0 0 0.5px rgba(255, 236, 173, 0.92),
        0 0 8px rgba(233, 199, 116, 0.22);
    }
    .gameverse-nav-button.is-active .gameverse-nav-label::after {
      content: " ]";
      color: #f3d685;
      text-shadow:
        0 0 0.5px rgba(255, 236, 173, 0.92),
        0 0 8px rgba(233, 199, 116, 0.22);
    }
    .gameverse-nav-button:hover .gameverse-nav-label {
      color: #6ff7ff;
      text-shadow:
        0 0 0.5px rgba(111, 247, 255, 0.95),
        0 0 8px rgba(111, 247, 255, 0.42);
      animation: gvFlicker 220ms steps(3, end) 1;
    }
    .gameverse-project-title-link:hover {
      color: #6ff7ff !important;
      text-shadow:
        0.8px 0 0 rgba(255,70,85,0.52),
        -0.8px 0 0 rgba(111,255,233,0.45),
        0 0 10px rgba(111,247,255,0.36);
      animation: gvFlicker 220ms steps(3, end) 1;
    }
    .project-title-link:hover {
      color: ${C.gold} !important;
    }
    .gameverse-nav-dot {
      display: none;
    }
    .gameverse-hud-button {
      position: relative;
      border: 1px solid transparent !important;
      background: rgba(255,70,85,0.06) !important;
      overflow: hidden;
      transition:
        color 140ms ease,
        background-color 140ms ease,
        text-shadow 140ms ease,
        transform 140ms ease;
    }
    .gameverse-hud-button::before,
    .gameverse-hud-button::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .gameverse-hud-button::before {
      background:
        linear-gradient(${C.ember}, ${C.ember}) top left / 16px 2px no-repeat,
        linear-gradient(${C.ember}, ${C.ember}) top left / 2px 16px no-repeat,
        linear-gradient(${C.gold}, ${C.gold}) bottom right / 16px 2px no-repeat,
        linear-gradient(${C.gold}, ${C.gold}) bottom right / 2px 16px no-repeat;
      opacity: 0.95;
    }
    .gameverse-hud-button::after {
      background:
        linear-gradient(${C.gold}, ${C.gold}) top right / 12px 2px no-repeat,
        linear-gradient(${C.gold}, ${C.gold}) top right / 2px 12px no-repeat,
        linear-gradient(${C.ember}, ${C.ember}) bottom left / 12px 2px no-repeat,
        linear-gradient(${C.ember}, ${C.ember}) bottom left / 2px 12px no-repeat;
      opacity: 0.7;
    }
    .gameverse-hud-button:hover {
      color: #6fffe9 !important;
      text-shadow:
        0.8px 0 0 rgba(255,70,85,0.52),
        -0.8px 0 0 rgba(111,255,233,0.45);
      transform: translateY(-1px);
      animation: gvGlitch 180ms steps(2, end) 1;
      background: rgba(255,70,85,0.12) !important;
    }
    .gameverse-boot::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(255, 70, 85, 0.05), transparent 20%, transparent 82%, rgba(255, 70, 85, 0.035)),
        radial-gradient(circle at top right, rgba(255, 70, 85, 0.08), transparent 28%);
      pointer-events: none;
      z-index: 0;
    }
    .gameverse-stat {
      position: relative;
      border-color: rgba(240, 214, 175, 0.26) !important;
      background:
        linear-gradient(180deg, rgba(23,17,14,0.58) 0%, rgba(13,9,7,0.72) 100%) !important;
      transition:
        border-color 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease,
        transform 180ms ease;
    }
    .gameverse-stat:hover {
      border-color: rgba(246, 223, 190, 0.36) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,241,216,0.12),
        0 14px 28px rgba(0,0,0,0.18);
      transform: translateY(-1px);
    }
    .gameverse-stat-label {
      text-shadow: 0 1px 0 rgba(63,40,19,0.85);
    }
    .gameverse-stat-value {
      color: #fff4dd;
      text-shadow: 0 1px 0 rgba(63,40,19,0.65);
    }
    .gameverse-input {
      font-family: 'Rajdhani', 'Oxanium', sans-serif;
      letter-spacing: 0.03em;
      transition:
        border-color 160ms ease,
        box-shadow 160ms ease,
        background-color 160ms ease,
        transform 160ms ease;
    }
    .gameverse-input::placeholder {
      color: rgba(248, 222, 176, 0.48);
      letter-spacing: 0.04em;
    }
    .gameverse-input:focus {
      outline: none;
      border-color: rgba(255, 223, 169, 0.42) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,241,216,0.08),
        0 0 0 1px rgba(255, 208, 127, 0.18),
        0 10px 18px rgba(0,0,0,0.12) !important;
      background:
        linear-gradient(180deg, rgba(32,24,19,0.64) 0%, rgba(16,11,9,0.76) 100%) !important;
    }
    .gameverse-contact-button {
      transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        filter 160ms ease;
    }
    .gameverse-contact-button:hover {
      transform: translateY(-1px);
      filter: brightness(1.04);
      box-shadow:
        inset 0 1px 0 rgba(255,232,187,0.14),
        0 12px 22px rgba(0,0,0,0.16) !important;
    }
    .gameverse-theme-button {
      border-top-color: rgba(255,70,85,0.32) !important;
    }
    @keyframes gvGlitch {
      0% { transform: translateX(0); }
      33% { transform: translateX(1px); }
      66% { transform: translateX(-1px); }
      100% { transform: translateX(0); }
    }
    @keyframes gvFlicker {
      0% { opacity: 1; filter: brightness(1); }
      25% { opacity: 0.62; filter: brightness(1.24); }
      45% { opacity: 1; filter: brightness(0.96); }
      70% { opacity: 0.78; filter: brightness(1.18); }
      100% { opacity: 1; filter: brightness(1); }
    }
    @keyframes gvPulseDot {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.35); opacity: 1; }
    }
    @keyframes gvNavPulse {
      0%, 100% { box-shadow: 0 0 0 2px rgba(24, 18, 12, 0.95) inset, 0 0 0 6px rgba(121, 93, 61, 0.34) inset, 0 16px 34px rgba(0,0,0,0.34); }
      50% { box-shadow: 0 0 0 2px rgba(24, 18, 12, 0.95) inset, 0 0 0 6px rgba(166, 132, 84, 0.4) inset, 0 18px 38px rgba(0,0,0,0.38); }
    }
  `;
}
