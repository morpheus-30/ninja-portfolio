/**
 * Global stylesheet for the portfolio experience.
 *
 * The app root carries `t-<themeId>`, so world-specific rules branch in CSS
 * (`.t-naruto .panel`) instead of through inline ternaries in every component.
 * Anything that differs per theme but not per element belongs here.
 */
export function buildGlobalStyles({ assets, C, MOTION, UI, W }) {
  const accent = C.cyan ?? C.gold;
  const staggerDelays = Array.from(
    { length: 14 },
    (_, i) =>
      `    .rise-stagger > *:nth-child(${i + 1}) { animation-delay: calc(var(--step) * ${i}); }`
  ).join("\n");

  return `
    @font-face {
      font-family: 'NinjaNaruto';
      src: url('/njnaruto.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'PixelGame';
      src: url('/assets/themes/pop/PixelGame.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { overflow: hidden; }
    html, body, * { cursor: url('${assets.ui.cursor}') 8 8, auto; }
    button, input, textarea, select { font: inherit; color: inherit; }
    button, a, [role="button"], nav *, button:hover, a:hover, [role="button"]:hover {
      cursor: url('${assets.ui.focusCursor}') 8 8, pointer !important;
    }
    a { color: inherit; }

    /* ---------------------------------------------------------------
       Browser surfaces. Selection, caret, scrollbars and focus rings ship
       with defaults that belong to no design system — theme them.
       --------------------------------------------------------------- */
    ::selection { background: ${W.selectionBackground}; color: ${C.text}; }
    * { caret-color: ${C.gold}; }
    * { scrollbar-width: thin; scrollbar-color: ${W.scrollThumb} ${W.scrollTrack}; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: ${W.scrollTrack}; }
    ::-webkit-scrollbar-thumb {
      background: ${W.scrollThumb};
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover { background: ${C.gold}; background-clip: content-box; }
    ::-webkit-scrollbar-corner { background: transparent; }
    :focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }
    .t-pop :focus-visible { outline-color: ${accent}; outline-offset: 2px; }
    /* Figures line up in the stat ledger and the meters. */
    .tnum { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }

    /* ---------------------------------------------------------------
       Motion. One easing family, all CSS, nothing per-frame in JS.
       --------------------------------------------------------------- */
    :root {
      --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
      --step: ${MOTION.staggerStepMs}ms;
    }

    /* Sections arrive from the side the character travelled towards, so the
       content follows the sprite rather than ignoring it. */
    @keyframes sectionEnterRight {
      from { opacity: 0; transform: translate3d(52px, 0, 0) scale(0.985); filter: blur(5px); }
      to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
    }
    @keyframes sectionEnterLeft {
      from { opacity: 0; transform: translate3d(-52px, 0, 0) scale(0.985); filter: blur(5px); }
      to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
    }
    .section-enter-right { animation: sectionEnterRight ${MOTION.sectionEnterMs}ms var(--ease-out); }
    .section-enter-left  { animation: sectionEnterLeft  ${MOTION.sectionEnterMs}ms var(--ease-out); }

    /* Staggered children: add rise-stagger to a container. */
    @keyframes riseIn {
      from { opacity: 0; transform: translate3d(0, 16px, 0) scale(0.97); }
      to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    }
    .rise-stagger > * { animation: riseIn 520ms var(--ease-out) both; }
${staggerDelays}

    @keyframes ruleIn {
      from { transform: scaleX(0); opacity: 0; }
      to   { transform: scaleX(1); opacity: 1; }
    }
    @keyframes meterFill {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    .meter-fill {
      transform-origin: left center;
      animation: meterFill 820ms var(--ease-out) both;
      animation-delay: 200ms;
    }
    @keyframes heartPop {
      0%   { opacity: 0; transform: scale(0.4); }
      70%  { opacity: 1; transform: scale(1.18); }
      100% { opacity: 1; transform: scale(1); }
    }
    .heart-pop { animation: heartPop 340ms var(--ease-out) both; }

    /* Streaks behind the sprite while it travels. */
    .speed-lines { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    .speed-lines > span {
      position: absolute;
      right: 62%;
      top: var(--y);
      width: var(--len);
      height: 2px;
      border-radius: 2px;
      background: linear-gradient(270deg, ${C.gold}00, ${C.sunset}cc, ${C.gold}00);
      animation: speedStreak 420ms linear infinite;
      animation-delay: var(--delay);
      opacity: 0;
    }
    @keyframes speedStreak {
      0%   { opacity: 0; transform: translateX(18px) scaleX(0.4); }
      35%  { opacity: 0.85; }
      100% { opacity: 0; transform: translateX(-58px) scaleX(1); }
    }
    @keyframes groundPulse {
      0%   { transform: scaleY(1); filter: brightness(1); }
      40%  { transform: scaleY(2.1); filter: brightness(1.7); }
      100% { transform: scaleY(1); filter: brightness(1); }
    }
    .ground-pulse { animation: groundPulse ${MOTION.runDurationMs}ms var(--ease-out) both; }

    /* ---------------------------------------------------------------
       Scene backdrop. Layers crossfade; only the visible one drifts.
       --------------------------------------------------------------- */
    .backdrop-layer {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-repeat: no-repeat;
      transform: scale(1.06);
      will-change: opacity;
      transition: opacity 900ms var(--ease-out), background-position 900ms var(--ease-out);
    }
    /* Running the drift only on the active layer keeps four idle full-screen
       layers off the compositor. */
    .backdrop-layer.is-active { animation: ${W.backdropDrift ?? "none"}; }

    @keyframes driftScroll {
      from { transform: scale(1.06) translate3d(0, 0, 0); }
      to   { transform: scale(1.15) translate3d(-1.6%, -1.1%, 0); }
    }
    @keyframes driftCabinet {
      from { transform: scale(1.05) translate3d(0, 0, 0); }
      to   { transform: scale(1.12) translate3d(1.4%, -0.8%, 0); }
    }

    /* Naruto: lamplight from below, breathing. */
    .ember-breathe {
      position: absolute;
      inset: 0;
      pointer-events: none;
      animation: emberBreathe 9s ease-in-out infinite alternate;
    }
    @keyframes emberBreathe {
      from { opacity: 0.55; transform: translate3d(0, 1.5%, 0) scale(1); }
      to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1.06); }
    }

    /* Gameverse: a tube that never quite holds sync. */
    .crt-roll {
      position: absolute;
      left: 0;
      right: 0;
      height: 28vh;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgba(111,247,255,0) 0%,
        rgba(111,247,255,0.05) 42%,
        rgba(214,252,255,0.09) 50%,
        rgba(111,247,255,0.04) 58%,
        rgba(111,247,255,0) 100%
      );
      animation: crtRoll 8.5s linear infinite;
    }
    @keyframes crtRoll {
      from { transform: translateY(-30vh); }
      to   { transform: translateY(130vh); }
    }
    .crt-flicker {
      position: absolute;
      inset: 0;
      pointer-events: none;
      animation: crtFlicker 5.5s steps(1, end) infinite;
    }
    @keyframes crtFlicker {
      0%, 42%, 47%, 100% { opacity: 1; }
      44% { opacity: 0.93; }
      45% { opacity: 1.02; }
    }

    /* ---------------------------------------------------------------
       Panel — the shared shell each world dresses differently.
       --------------------------------------------------------------- */
    .panel { position: relative; isolation: isolate; }
    .panel-layer { position: absolute; inset: 0; pointer-events: none; }
    .panel-grain {
      background-image: ${W.grain};
      opacity: ${W.grainOpacity};
      mix-blend-mode: ${W.grainBlend};
    }
    .panel-bleed { background: ${W.inkBleed}; }

    /* The section name runs down the margin as an annotation. It is not an
       eyebrow stacked above the heading. */
    .panel-rail {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 2.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 4;
    }
    .panel-rail > span {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      letter-spacing: 0.42em;
      text-transform: uppercase;
      font-size: 0.66rem;
      color: ${W.railLabelColor};
      opacity: 0.78;
      white-space: nowrap;
    }
    .panel-rail::before, .panel-rail::after {
      content: "";
      position: absolute;
      left: 50%;
      width: 1px;
      background: linear-gradient(180deg, transparent, ${C.line}, transparent);
    }
    .panel-rail::before { top: 8%; height: 22%; }
    .panel-rail::after { bottom: 8%; height: 22%; }

    .display-title { text-wrap: balance; letter-spacing: -0.01em; }

    /* ---------------------------------------------------------------
       Naruto — ink and ember on pressed paper.
       --------------------------------------------------------------- */
    .t-naruto .panel-fibre {
      background-image: ${W.fibre ?? "none"};
      opacity: 0.07;
      mix-blend-mode: soft-light;
    }
    /* Hanko seal pressed into the lower corner of every panel. */
    .t-naruto .panel-seal {
      position: absolute;
      right: 1.1rem;
      bottom: 1.1rem;
      width: 58px;
      height: 58px;
      background-image: ${W.seal ?? "none"};
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.15;
      transform: rotate(-7deg);
      pointer-events: none;
      z-index: 4;
    }
    .t-naruto .display-title {
      color: ${C.text};
      text-shadow: 0 2px 0 rgba(0,0,0,0.42), 0 0 32px ${C.ember}33;
    }
    /* Brushed rule under the heading — wet at the start, dry at the end. */
    .title-rule {
      height: 3px;
      background: linear-gradient(90deg, ${C.ember} 0%, ${C.ember} 16%, ${C.gold} 46%, ${C.gold}44 78%, transparent 100%);
      transform-origin: left center;
      animation: ruleIn 700ms var(--ease-out) both;
      animation-delay: 120ms;
      border-radius: 0 2px 2px 0;
    }
    .t-pop .title-rule {
      border-radius: 0;
      background: repeating-linear-gradient(90deg, ${accent} 0 8px, transparent 8px 12px);
    }

    /* ---------------------------------------------------------------
       Gameverse — a CRT arcade cabinet. The bezel is hardware; the panel
       interior is the game on screen, which is where the stone and treasure
       sprites belong.
       --------------------------------------------------------------- */
    .t-pop .panel-scanline {
      background: ${W.scanline ?? "none"};
      opacity: 0.5;
      z-index: 5;
    }
    .t-pop .panel-fibre {
      background-image: ${W.fibre ?? "none"};
      opacity: 0.45;
      mix-blend-mode: overlay;
      z-index: 5;
    }
    .t-pop .panel { image-rendering: pixelated; }
    .t-pop .display-title {
      letter-spacing: 0.02em;
      color: ${C.text};
      /* Chromatic fringe: convergence on a real tube is never perfect. */
      text-shadow:
        -1.5px 0 0 rgba(255,46,136,0.5),
        1.5px 0 0 rgba(111,247,255,0.42),
        0 0 22px rgba(111,247,255,0.22);
    }
    /* HUD title bar replaces the eyebrow — it reads as cabinet chrome. */
    .hud-bar {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.28rem 0.6rem;
      border: 1px solid rgba(111,247,255,0.22);
      background: linear-gradient(180deg, rgba(111,247,255,0.1), rgba(111,247,255,0.02));
      font-family: 'VT323', monospace;
      font-size: 0.98rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${accent};
    }
    .hud-dot {
      width: 7px;
      height: 7px;
      background: ${C.ember};
      box-shadow: 0 0 8px ${C.ember};
      flex: 0 0 auto;
      animation: pressStart 1.1s steps(1, end) infinite;
    }
    @keyframes pressStart {
      0%, 55% { opacity: 1; }
      56%, 100% { opacity: 0.15; }
    }
    .hud-fill {
      flex: 1;
      height: 1px;
      background: repeating-linear-gradient(90deg, rgba(111,247,255,0.4) 0 4px, transparent 4px 8px);
    }

    /* ---------------------------------------------------------------
       Stat ledger. Rows with hairline rules, not cards inside a card.
       --------------------------------------------------------------- */
    .ledger { display: grid; width: 100%; }
    .ledger-row {
      display: grid;
      grid-template-columns: minmax(7.5rem, 0.42fr) 1fr;
      gap: 0.9rem;
      align-items: baseline;
      padding: 0.6rem 0.2rem;
      border-bottom: 1px solid ${C.line};
      transition: background-color 180ms ease, transform 180ms var(--ease-out);
    }
    .ledger-row:last-child { border-bottom: 0; }
    .ledger-row:hover {
      background: rgba(255,255,255,0.028);
      transform: translateX(4px);
    }
    .ledger-key {
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${C.gold};
      opacity: 0.88;
    }
    .ledger-value { color: ${C.text}; font-size: 0.99rem; line-height: 1.45; font-weight: 600; }
    .t-pop .ledger-key { font-family: 'VT323', monospace; font-size: 0.88rem; color: ${accent}; }
    .t-pop .ledger-row { border-bottom-color: rgba(111,247,255,0.14); }

    /* ---------------------------------------------------------------
       Skill meters. A row and a bar, no nested panel.
       --------------------------------------------------------------- */
    .meter-row { padding: 0.4rem 0; }
    .meter-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 0.3rem;
    }
    .meter-label {
      color: ${C.text};
      font-size: 0.94rem;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .meter-value { color: ${C.gold}; font-size: 0.84rem; font-weight: 700; flex: 0 0 auto; }
    .meter-track {
      height: 7px;
      background: rgba(0,0,0,0.42);
      border: 1px solid ${C.line};
      overflow: hidden;
    }
    .t-naruto .meter-track { border-radius: 4px; }
    .t-pop .meter-track {
      border-radius: 0;
      border-color: rgba(111,247,255,0.2);
      /* Segmented like an energy bar rather than a smooth fill. */
      background-image: repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.6) 6px 8px);
    }
    .t-pop .meter-value { font-family: 'VT323', monospace; font-size: 1rem; }
    /* Any number of groups: columns come from available width, not a count.
       Groups have unequal lengths, so each ends where its content ends rather
       than stretching to match its tallest neighbour. */
    .skill-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.5rem), 1fr));
      gap: 1.2rem 2rem;
      align-content: start;
      width: 100%;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 0.4rem;
    }
    .skill-group { min-width: 0; align-self: start; }

    /* A long list tightens instead of overflowing the panel. */
    .skill-groups.is-dense { gap: 0.9rem 1.8rem; --heart-size: 14px; }
    .skill-groups.is-dense .meter-row { padding: 0.22rem 0; }
    .skill-groups.is-dense .meter-head { margin-bottom: 0.18rem; }
    .skill-groups.is-dense .meter-label { font-size: 0.86rem; }
    .skill-groups.is-dense .meter-value { font-size: 0.78rem; }
    .skill-groups.is-dense .meter-track { height: 5px; }
    .skill-groups.is-dense .group-heading {
      padding-bottom: 0.32rem;
      margin-bottom: 0.38rem;
    }

    /* Sized from a token so density can shrink the row without touching JSX. */
    .heart {
      width: var(--heart-size, 18px);
      height: var(--heart-size, 18px);
      object-fit: contain;
      image-rendering: pixelated;
      flex: 0 0 auto;
    }

    .group-heading {
      font-size: 0.68rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: ${C.gold};
      padding-bottom: 0.45rem;
      border-bottom: 1px solid ${C.line};
      margin-bottom: 0.5rem;
    }
    .t-pop .group-heading { font-family: 'VT323', monospace; font-size: 0.92rem; color: ${accent}; }

    /* ---------------------------------------------------------------
       Project cards + detail dialog.
       --------------------------------------------------------------- */
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
      gap: 0.85rem;
      align-content: start;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 0.35rem;
    }
    .project-card {
      position: relative;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 0.5rem;
      text-align: left;
      width: 100%;
      padding: 0.9rem 1rem 0.8rem;
      border: ${UI.missionCardBorder};
      background: ${UI.missionCardBackground};
      color: inherit;
      transition:
        transform 220ms var(--ease-out),
        border-color 220ms ease,
        box-shadow 220ms ease;
    }
    .project-card:hover, .project-card:focus-visible {
      transform: translateY(-3px);
      border-color: ${C.gold};
      box-shadow: 0 18px 34px -10px rgba(0,0,0,0.62), 0 4px 10px -4px rgba(0,0,0,0.42);
    }
    .t-naruto .project-card { border-radius: 3px 14px 3px 14px; }
    .t-pop .project-card:hover, .t-pop .project-card:focus-visible { border-color: ${accent}; }
    .project-head { display: flex; align-items: center; gap: 0.55rem; }
    .project-rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      flex: 0 0 auto;
      font-size: 0.76rem;
      font-weight: 700;
      color: ${C.ink};
      background: ${C.gold};
    }
    .t-naruto .project-rank, .project-dialog[data-theme="naruto"] .project-rank { border-radius: 50%; }
    .t-pop .project-rank { font-family: 'VT323', monospace; font-size: 0.95rem; }
    .project-name { font-size: 1.1rem; line-height: 1.2; color: ${C.text}; text-wrap: balance; }
    .t-pop .project-name { font-family: 'VT323', monospace; font-size: 1.45rem; letter-spacing: 0.04em; }
    /* Long descriptions clamp instead of stretching the card. The full text
       lives in the dialog, so clamping loses nothing. */
    .project-desc {
      color: ${C.muted};
      font-size: 0.88rem;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .tag-row { display: flex; flex-wrap: wrap; gap: 0.32rem; align-items: center; }
    .tag {
      padding: 0.14rem 0.44rem;
      font-size: 0.7rem;
      line-height: 1.5;
      color: ${C.sand};
      background: ${UI.pillBackground};
      border: 1px solid ${C.line};
      white-space: nowrap;
    }
    .t-naruto .tag, .project-dialog[data-theme="naruto"] .tag { border-radius: 999px; }
    .t-pop .tag, .project-dialog[data-theme="pop"] .tag { font-family: 'VT323', monospace; font-size: 0.84rem; }
    .tag--more { color: ${C.gold}; border-style: dashed; background: transparent; }
    .project-open {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.68rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${C.gold};
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 200ms ease, transform 200ms var(--ease-out);
    }
    .project-card:hover .project-open,
    .project-card:focus-visible .project-open { opacity: 1; transform: translateY(0); }

    /* Native <dialog>: Escape, focus trap and an inert background come free. */
    .project-dialog {
      /* The universal reset above zeroes margin, which overrides the UA rule
         (dialog { margin: auto }) that centres a modal. Restore it here rather
         than carving dialog out of the reset. */
      position: fixed;
      inset: 0;
      margin: auto;
      width: min(46rem, calc(100vw - 2rem));
      max-height: min(84vh, 44rem);
      padding: 0;
      border: ${UI.missionCardBorder};
      background: ${UI.sectionBackground};
      color: ${C.text};
      box-shadow: 0 44px 90px -20px rgba(0,0,0,0.88), 0 12px 28px -10px rgba(0,0,0,0.6);
      overflow: hidden;
    }
    .project-dialog[data-theme="naruto"] { border-radius: 4px 20px 4px 20px; }
    .project-dialog::backdrop {
      background: rgba(4, 3, 2, 0.74);
      backdrop-filter: blur(6px);
    }
    .project-dialog[open] { animation: dialogIn 300ms var(--ease-out); }
    @keyframes dialogIn {
      from { opacity: 0; transform: translateY(14px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .dialog-body {
      position: relative;
      max-height: min(84vh, 44rem);
      overflow-y: auto;
      padding: clamp(1.2rem, 2.4vw, 1.9rem);
      display: grid;
      gap: 0.85rem;
      align-content: start;
    }
    .dialog-close {
      position: absolute;
      top: 0.7rem;
      right: 0.7rem;
      width: 2.1rem;
      height: 2.1rem;
      display: grid;
      place-items: center;
      border: 1px solid ${C.line};
      background: rgba(0,0,0,0.35);
      color: ${C.sand};
      z-index: 2;
      transition: color 160ms ease, border-color 160ms ease, transform 200ms var(--ease-out);
    }
    .dialog-close:hover { color: ${C.gold}; border-color: ${C.gold}; transform: rotate(90deg); }
    .dialog-desc { color: ${C.muted}; line-height: 1.75; font-size: 0.98rem; max-width: 62ch; }
    .dialog-link {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.6rem 1rem;
      border: 1px solid ${C.gold};
      color: ${C.text};
      text-decoration: none;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 0.8rem;
      justify-self: start;
      transition: background-color 180ms ease, color 180ms ease;
    }
    .dialog-link:hover { background: ${C.gold}; color: ${C.ink}; }
    .project-dialog[data-theme="naruto"] .dialog-link { border-radius: 999px; }
    .project-dialog[data-theme="pop"] .dialog-link { font-family: 'VT323', monospace; font-size: 1rem; }

    /* Icons lean out on hover. */
    .link-arrow { transition: transform 200ms var(--ease-out); flex: 0 0 auto; }
    a:hover .link-arrow, button:hover .link-arrow { transform: translate(3px, -3px); }

    /* ---------------------------------------------------------------
       Nav.
       --------------------------------------------------------------- */
    .nav-item { position: relative; }
    .nav-item::after {
      content: "";
      position: absolute;
      left: 12%;
      right: 12%;
      bottom: 2px;
      height: 2px;
      background: linear-gradient(90deg, ${C.ember}, ${C.gold});
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 320ms var(--ease-out), opacity 320ms ease;
      opacity: 0;
    }
    .nav-item.is-active::after { transform: scaleX(1); opacity: 1; }
    .nav-item:hover::after { transform: scaleX(0.55); opacity: 0.6; }
    .nav-item.is-active:hover::after { transform: scaleX(1); opacity: 1; }

    .gameverse-nav {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(111,247,255,0.24) !important;
      border-radius: 0 !important;
      background: linear-gradient(180deg, rgba(8,13,22,0.94), rgba(4,6,11,0.96)) !important;
      box-shadow:
        inset 0 1px 0 rgba(111,247,255,0.18),
        inset 0 0 24px rgba(111,247,255,0.05),
        0 14px 30px -10px rgba(0,0,0,0.72);
      font-family: 'VT323', monospace;
    }
    .gameverse-nav::after {
      content: "";
      position: absolute;
      inset: 0;
      background: ${W.scanline ?? "none"};
      opacity: 0.34;
      pointer-events: none;
    }
    .gameverse-nav-button {
      position: relative;
      border-radius: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: ${C.muted} !important;
      font-family: 'VT323', monospace !important;
      font-size: 1.15rem !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      transition: color 140ms steps(2, end), text-shadow 140ms steps(2, end);
    }
    .gameverse-nav-button.is-active {
      color: ${accent} !important;
      text-shadow: 0 0 10px rgba(111,247,255,0.4);
    }
    .gameverse-nav-button:hover { color: ${C.gold} !important; }
    .gameverse-nav-label { position: relative; display: inline-block; line-height: 1; }
    .gameverse-nav-button.is-active .gameverse-nav-label::before { content: "["; margin-right: 0.26em; }
    .gameverse-nav-button.is-active .gameverse-nav-label::after { content: "]"; margin-left: 0.26em; }

    /* ---------------------------------------------------------------
       Buttons + inputs.
       --------------------------------------------------------------- */
    .cta {
      position: relative;
      isolation: isolate;
      padding: 0.76rem 1.2rem;
      border: 1px solid ${C.gold};
      background: transparent;
      color: ${C.text};
      letter-spacing: 0.1em;
      text-transform: uppercase;
      overflow: hidden;
      transition: color 200ms ease, transform 200ms var(--ease-out), box-shadow 200ms ease;
    }
    .cta::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, ${C.ember}, ${C.sunset});
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 300ms var(--ease-out);
      z-index: -1;
    }
    .cta:hover::before { transform: scaleX(1); }
    .cta:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.6); }
    .cta.is-primary::before { transform: scaleX(1); }
    .t-naruto .cta { border-radius: 999px; }
    .t-pop .cta {
      border-radius: 0;
      font-family: 'VT323', monospace;
      font-size: 1.08rem;
      border-color: rgba(111,247,255,0.42);
    }
    .t-pop .cta:hover { color: ${C.ink}; }
    .t-pop .cta::before { background: linear-gradient(90deg, ${accent}, ${C.gold}); }

    .field {
      width: 100%;
      padding: 0.82rem 0.95rem;
      border: 1px solid ${C.line};
      background: ${UI.inputBackground};
      color: ${C.text};
      transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
    }
    .field::placeholder { color: ${C.muted}; opacity: 0.74; }
    .field:focus {
      outline: none;
      border-color: ${C.gold};
      box-shadow: 0 0 0 3px ${C.gold}22;
    }
    .t-naruto .field { border-radius: 10px; }
    .t-pop .field { border-radius: 0; font-family: 'Rajdhani', sans-serif; }
    .t-pop .field:focus { border-color: ${accent}; box-shadow: 0 0 0 3px rgba(111,247,255,0.16); }

    /* Respect the OS setting — everything above degrades to a plain cut. */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 1ms !important;
        scroll-behavior: auto !important;
      }
      .speed-lines, .hud-dot, .crt-roll, .crt-flicker { display: none; }
      .backdrop-layer, .backdrop-layer.is-active { animation: none; }
    }
  `;
}
