import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import ThemeSelector from "./components/ThemeSelector";
import { ThemeProvider, useThemeTokens } from "./theme-context";
import { THEMES, getThemeById } from "./themes";

function buildCharacterActions(characterAssets) {
  return {
    idle: { src: characterAssets.idle },
    run: { src: characterAssets.run ?? characterAssets.idle },
    crouchWalk: {
      src:
        characterAssets.crouchWalk ??
        characterAssets.run ??
        characterAssets.idle,
    },
    jump: { src: characterAssets.jump ?? characterAssets.idle },
    crouch: { src: characterAssets.crouch ?? characterAssets.idle },
    attack1: {
      src:
        characterAssets.attack1 ?? characterAssets.run ?? characterAssets.idle,
    },
    attack2: {
      src:
        characterAssets.attack2 ??
        characterAssets.attack1 ??
        characterAssets.run ??
        characterAssets.idle,
    },
    attack3: {
      src:
        characterAssets.attack3 ??
        characterAssets.attack2 ??
        characterAssets.attack1 ??
        characterAssets.run ??
        characterAssets.idle,
    },
    crouchAttack1: {
      src:
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
    crouchAttack2: {
      src:
        characterAssets.crouchAttack2 ??
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
    crouchAttack3: {
      src:
        characterAssets.crouchAttack3 ??
        characterAssets.crouchAttack2 ??
        characterAssets.crouchAttack1 ??
        characterAssets.crouch ??
        characterAssets.idle,
    },
  };
}

function getSectionPoints(sections) {
  return sections.map(
    (_, index) => 10 + (index / Math.max(sections.length - 1, 1)) * 80
  );
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function pickRandomAction(actions) {
  return actions[Math.floor(Math.random() * actions.length)];
}

function getActionDuration(theme, action) {
  return theme.design.motion.actionDurations?.[action] ?? 420;
}

function ThreeScene({ sectionIndex }) {
  const { C } = useThemeTokens();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const targetZRef = useRef(0);
  const currentZRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    const particles = new THREE.BufferGeometry();
    const count = 160;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pointCloud = new THREE.Points(
      particles,
      new THREE.PointsMaterial({
        color: new THREE.Color(C.gold),
        size: 0.045,
        transparent: true,
        opacity: 0.7,
      })
    );

    const sweep = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 26),
      new THREE.MeshBasicMaterial({
        color: 0x2e140b,
        transparent: true,
        opacity: 0,
      })
    );

    sweep.position.z = -7;
    scene.add(pointCloud);
    scene.add(sweep);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    let sweepActive = false;
    let sweepDirection = -1;
    let t = 0;

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.set(0, 0, 5);
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.008;

      const pointPositions = particles.attributes.position.array;
      for (let i = 0; i < count; i += 1) {
        pointPositions[i * 3 + 1] += 0.015;
        pointPositions[i * 3] += Math.sin(t + i * 0.3) * 0.0025;
        if (pointPositions[i * 3 + 1] > 8) pointPositions[i * 3 + 1] = -8;
      }
      particles.attributes.position.needsUpdate = true;
      pointCloud.rotation.y = t * 0.1;

      currentZRef.current += (targetZRef.current - currentZRef.current) * 0.08;
      camera.position.z = 5 + currentZRef.current;

      if (sweepActive) {
        sweep.position.z += sweepDirection * 0.38;
        if (sweepDirection < 0) {
          sweep.material.opacity = Math.min(
            0.94,
            sweep.material.opacity + 0.09
          );
          if (sweep.position.z < -1.8) sweepDirection = 1;
        } else {
          sweep.material.opacity = Math.max(0, sweep.material.opacity - 0.08);
          if (sweep.position.z > 6.5) {
            sweep.position.z = -7;
            sweep.material.opacity = 0;
            sweepDirection = -1;
            sweepActive = false;
          }
        }
      }

      renderer.render(scene, camera);
    };

    scene.userData.triggerSweep = () => {
      sweep.position.z = -7;
      sweep.material.opacity = 0;
      sweepDirection = -1;
      sweepActive = true;
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      particles.dispose();
      pointCloud.material.dispose();
      sweep.geometry.dispose();
      sweep.material.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [C.gold]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    targetZRef.current = sectionIndex * -0.85;
    scene.userData.triggerSweep?.();
  }, [sectionIndex]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}

function NarutoWalker({ action, direction, isMobile }) {
  const { theme } = useThemeTokens();
  const characterActions = buildCharacterActions(theme.assets.character);
  const actionConfig = characterActions[action] ?? characterActions.idle;

  // Outer sprite viewport.
  // If Gameverse or Naruto feels too zoomed in overall, start with frameWidth/frameHeight.
  const frameWidth = isMobile ? 150 : 400;
  const frameHeight = isMobile ? 118 : 240;

  // Per-action sprite height tuning lives here.
  // Adjust these branches when a specific GIF looks too tall or too small.
  // For Gameverse-specific tuning, add `theme.id === "pop"` checks inside the branch you want.
  const spriteHeight =
    // Gameverse run GIF is taller in source, so keep it shorter than Naruto's run.
    action === "run" && theme.id === "pop"
      ? isMobile
        ? 92
        : 110
      : (action === "attack2" || action === "attack3") && theme.id === "pop"
      ? isMobile
        ? 108
        : 170
      : action === "attack1" && theme.id === "pop"
      ? isMobile
        ? 108
        : 140
      : action === "jump" && theme.id === "pop"
      ? isMobile
        ? 114
        : 240
      : theme.id === "pop"
      ? isMobile
        ? 108
        : 200
      : // Jump GIF needs the tallest frame so the full arc stays visible.
      action === "jump"
      ? isMobile
        ? 114
        : 200
      : // These two crouch attack GIFs are smaller in source, so we upscale them.
      action === "crouchAttack2" || action === "crouchAttack1"
      ? isMobile
        ? 112
        : 220
      : // Third crouch attack gets its own slightly smaller tuning.
      action === "crouchAttack3"
      ? isMobile
        ? 108
        : 180
      : // Default size for idle/run/crouch/most other actions.
      isMobile
      ? 102
      : 146;

  // Vertical offset fixes GIFs whose feet sit too high in the frame.
  // This is the place to lower or raise a Gameverse GIF if it floats above the ground.
  const spriteBottom =
    theme.id === "pop"
      ? isMobile
        ? -2
        : 20
      : action === "crouchAttack2"
      ? isMobile
        ? -6
        : -20
      : 0;

  return (
    <div
      style={{
        // This div is the clipping box for the character GIF.
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        overflow: "hidden",
        position: "relative",
        display: "block",
        transition: "width 160ms ease, height 160ms ease",
      }}
    >
      <img
        src={actionConfig.src}
        alt="Naruto runner"
        style={{
          // This img is the actual sprite. `spriteHeight` and `spriteBottom`
          // are the main controls for Gameverse character sizing/alignment.
          position: "absolute",
          height: `${spriteHeight}px`,
          width: "auto",
          left: "50%",
          bottom: `${spriteBottom}px`,
          display: "block",
          transform:
            direction === "left"
              ? "translateX(-50%) scaleX(-1)"
              : "translateX(-50%) scaleX(1)",
          transformOrigin: "center center",
          mixBlendMode: action === "idle" ? "multiply" : "normal",
          filter:
            action === "run"
              ? "drop-shadow(0 10px 18px rgba(0,0,0,0.62)) drop-shadow(0 0 14px rgba(216,90,26,0.28))"
              : "drop-shadow(0 10px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(216,90,26,0.3)) saturate(1.05) contrast(1.04)",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    </div>
  );
}

function SectionShell({ title, kicker, children, isMobile, titleStyle }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";

  return (
    <section
      className={isGameverse ? "gameverse-card gameverse-boot" : undefined}
      style={{
        "--gv-cut": isMobile ? "18px" : "26px",
        width: isMobile
          ? "calc(100vw - 1.5rem)"
          : "min(1120px, calc(100vw - 2.5rem))",
        minHeight: isMobile ? "calc(100vh - 7.5rem)" : "min(70vh, 760px)",
        maxHeight: isMobile ? "calc(100vh - 7.5rem)" : "none",
        padding: isMobile ? "1rem" : "clamp(1.6rem, 2vw, 2.2rem)",
        border: UI.sectionBorder,
        borderRadius: isGameverse
          ? "0"
          : isMobile
          ? "14px 24px 14px 24px"
          : "18px 42px 18px 42px",
        background: UI.sectionBackground,
        boxShadow: UI.sectionShadow,
        display: "grid",
        alignItems: "center",
        position: "relative",
        overflowX: "hidden",
        overflowY: isMobile ? "auto" : "hidden",
        WebkitOverflowScrolling: isMobile ? "touch" : "auto",
        overscrollBehavior: isMobile ? "contain" : "auto",
        touchAction: isMobile ? "pan-y" : "auto",
        clipPath: isGameverse
          ? "polygon(var(--gv-cut) 0, calc(100% - var(--gv-cut)) 0, 100% var(--gv-cut), 100% calc(100% - var(--gv-cut)), calc(100% - var(--gv-cut)) 100%, var(--gv-cut) 100%, 0 calc(100% - var(--gv-cut)), 0 var(--gv-cut))"
          : isMobile
          ? "polygon(0 12px, 12px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 14px 100%, 0 calc(100% - 14px))"
          : "polygon(0 18px, 18px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {isGameverse && (
        <>
          <div className="gameverse-particles" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={index}
                className="gameverse-pixel"
                style={{
                  "--x": `${(index * 29) % 100}%`,
                  "--delay": `${(index % 8) * 0.55}s`,
                  "--duration": `${8 + (index % 4)}s`,
                  "--size": `${index % 3 === 0 ? 3 : 2}px`,
                }}
              />
            ))}
          </div>
          <div className="gameverse-scanline" aria-hidden="true" />
          <span className="gv-corner gv-corner-tl" aria-hidden="true" />
          <span className="gv-corner gv-corner-tr" aria-hidden="true" />
          <span className="gv-corner gv-corner-bl" aria-hidden="true" />
          <span className="gv-corner gv-corner-br" aria-hidden="true" />
        </>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 74%, rgba(255,255,255,0.04) 100%)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: isMobile ? "10px" : "14px",
          border: `1px solid ${C.line}`,
          borderRadius: isGameverse
            ? "0"
            : isMobile
            ? "10px 18px 10px 18px"
            : "14px 28px 14px 28px",
          clipPath: isGameverse
            ? "polygon(var(--gv-cut) 0, calc(100% - var(--gv-cut)) 0, 100% var(--gv-cut), 100% calc(100% - var(--gv-cut)), calc(100% - var(--gv-cut)) 100%, var(--gv-cut) 100%, 0 calc(100% - var(--gv-cut)), 0 var(--gv-cut))"
            : "none",
          opacity: 0.45,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: isMobile ? "10px" : "14px",
          left: isMobile ? "10px" : "14px",
          width: isMobile ? "48px" : "78px",
          height: isMobile ? "48px" : "78px",
          borderTop: `2px solid ${C.line}`,
          borderLeft: `2px solid ${C.line}`,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: isMobile ? "10px" : "14px",
          bottom: isMobile ? "10px" : "14px",
          width: isMobile ? "60px" : "104px",
          height: isMobile ? "60px" : "104px",
          borderRight: `2px solid ${C.line}`,
          borderBottom: `2px solid ${C.line}`,
          opacity: 0.32,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: isMobile ? "96px" : "180px",
          height: isMobile ? "96px" : "180px",
          background: `linear-gradient(135deg, ${C.ember}00 0%, ${C.ember}22 48%, ${C.ember}00 48%)`,
          pointerEvents: "none",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: isMobile ? "110px" : "220px",
          height: isMobile ? "110px" : "220px",
          background: `linear-gradient(315deg, ${C.gold}00 0%, ${C.gold}14 42%, ${C.gold}00 42%)`,
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: isMobile ? "auto 10px 10px auto" : "auto 14px 14px auto",
          width: isMobile ? "68px" : "108px",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.gold})`,
          opacity: 0.72,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "14px",
          background: UI.sectionTopBar,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: UI.sectionGrid,
          backgroundSize: "34px 34px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: isMobile ? "1rem" : "1.3rem",
          right: isMobile ? "0.9rem" : "1.4rem",
          display: "grid",
          gap: isMobile ? "0.32rem" : "0.42rem",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: isMobile ? "28px" : "42px",
              height: "2px",
              background:
                index === 1
                  ? `linear-gradient(90deg, ${C.gold}, ${C.ember})`
                  : C.line,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "visible",
          paddingRight: isMobile ? "0.2rem" : 0,
          paddingTop: isMobile ? "0.15rem" : "0.2rem",
        }}
      >
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            color: C.gold,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontSize: "0.74rem",
            marginBottom: "0.7rem",
            fontFamily: F.display,
          }}
        >
          <span
            style={{
              width: isMobile ? "24px" : "34px",
              height: "2px",
              background: `linear-gradient(90deg, ${C.ember}, ${C.gold})`,
              display: "inline-block",
              flex: "0 0 auto",
            }}
          />
          {kicker}
        </p>
        <h2
          style={{
            fontFamily: F.display,
            fontSize: isMobile
              ? "clamp(1.9rem, 11vw, 3rem)"
              : "clamp(2.4rem, 5vw, 4.8rem)",
            lineHeight: isMobile ? 1 : 0.95,
            color: C.text,
            marginBottom: isMobile ? "0.9rem" : "1.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            textShadow: `0 0 24px ${C.ember}22`,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  return (
    <div
      className={isGameverse ? "gameverse-stat" : undefined}
      style={{
        padding: "1rem 1.1rem",
        borderRadius: "12px 22px 12px 18px",
        border: UI.statCardBorder,
        background: UI.statCardBackground,
        boxShadow: "inset 0 0 0 1px rgba(239,197,108,0.07)",
      }}
    >
      <div
        className={isGameverse ? "gameverse-stat-label" : undefined}
        style={{
          color: C.gold,
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: F.display,
        }}
      >
        {label}
      </div>
      <div
        className={isGameverse ? "gameverse-stat-value" : undefined}
        style={{
          color: C.text,
          fontSize: "1rem",
          marginTop: "0.35rem",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SkillBar({ label, value, color }) {
  const { C } = useThemeTokens();
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.35rem",
        }}
      >
        <span style={{ color: C.text }}>{label}</span>
        <span style={{ color: C.gold }}>{value}%</span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "2px",
          background: "rgba(0,0,0,0.3)",
          overflow: "hidden",
          border: "1px solid rgba(239,197,108,0.12)",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: "1px",
            background: `linear-gradient(90deg, ${color}, ${C.gold})`,
            boxShadow: `0 0 18px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

function MissionCard({ rank, title, desc, tags }) {
  const { C, F, UI } = useThemeTokens();
  return (
    <article
      style={{
        padding: "1.2rem",
        borderRadius: "14px 26px 14px 22px",
        border: UI.missionCardBorder,
        background: UI.missionCardBackground,
        boxShadow: "inset 0 0 0 1px rgba(239,197,108,0.06)",
      }}
    >
      <div
        style={{
          color: C.gold,
          marginBottom: "0.6rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: F.display,
        }}
      >
        Rank {rank}
      </div>
      <h3
        style={{ color: C.text, fontSize: "1.2rem", marginBottom: "0.45rem" }}
      >
        {title}
      </h3>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: "0.9rem" }}>
        {desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.28rem 0.55rem",
              borderRadius: "999px",
              background: UI.pillBackground,
              border: `1px solid ${C.line}`,
              color: C.sand,
              fontSize: "0.78rem",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function ThemeLoadingScreen({ theme }) {
  const { colors: C, fonts: F } = theme.design;
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000000",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        color: C.text,
        fontFamily: F.body,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(239,197,108,0.1) 0%, rgba(239,197,108,0.04) 16%, rgba(0,0,0,0) 42%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          justifyItems: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          isolation: "isolate",
        }}
      >
        {theme.assets.ui.loader && (
          <img
            src={theme.assets.ui.loader}
            alt={`${theme.label} loading`}
            style={{
              width: isMobile ? "min(72vw, 260px)" : "min(44vw, 220px)",
              maxWidth: isMobile ? "260px" : "220px",
              minWidth: isMobile ? "180px" : "120px",
              height: "auto",
              display: "block",
              opacity: 1,
              filter:
                "contrast(1.04) brightness(1.02) drop-shadow(0 14px 28px rgba(0,0,0,0.45))",
            }}
          />
        )}
        <div
          style={{
            fontFamily: F.display,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {theme.content.controls.loadingText}
        </div>
      </div>
    </div>
  );
}

function PortfolioExperience({ activeTheme, onSwitchTheme }) {
  const { theme, C, F, MOTION, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const { assets, content, sections } = activeTheme;
  const HOME_CONTENT = content.home;
  const ABOUT_CONTENT = content.about;
  const SKILLS_CONTENT = content.skills;
  const PROJECTS_CONTENT = content.projects;
  const CONTACT_CONTENT = content.contact;
  const CONTROLS_CONTENT = content.controls;
  const sectionPoints = useMemo(() => getSectionPoints(sections), [sections]);
  const initialSpriteX = 10;
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1440 : window.innerWidth
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === "undefined" ? 900 : window.innerHeight
  );
  const [sectionIdx, setSectionIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [characterAction, setCharacterAction] = useState("idle");
  const [direction, setDirection] = useState("right");
  const [spriteX, setSpriteX] = useState(initialSpriteX);
  const [visible, setVisible] = useState(true);
  const [contactState, setContactState] = useState("idle");
  const [contactMessage, setContactMessage] = useState("");
  const [showCharacterHelp, setShowCharacterHelp] = useState(false);
  const [isThemeMounted, setIsThemeMounted] = useState(false);

  const sectionRef = useRef(0);
  const runningTimerRef = useRef(null);
  const actionTimerRef = useRef(null);
  const swapTimerRef = useRef(null);
  const lockRef = useRef(false);
  const touchStartRef = useRef(null);
  const spriteXRef = useRef(initialSpriteX);
  const contactFormRef = useRef(null);
  const pressedKeysRef = useRef(new Set());
  const isMobile = viewportWidth < 768;
  const isCompactHero = !isMobile && viewportWidth < 1180;
  const heroPortraitMaxHeight = isMobile
    ? Math.min(Math.max(viewportHeight * 0.28, 180), 260)
    : isCompactHero
    ? Math.min(Math.max(viewportHeight * 0.34, 220), 300)
    : Math.min(Math.max(viewportHeight * 0.42, 240), 360);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsThemeMounted(true), 40);
    return () => window.clearTimeout(timer);
  }, []);

  const triggerTransition = useCallback(
    (nextIdx) => {
      if (
        lockRef.current ||
        nextIdx < 0 ||
        nextIdx >= sections.length ||
        nextIdx === sectionRef.current
      ) {
        return;
      }

      lockRef.current = true;
      const currentX = spriteXRef.current;
      const nextX = 10 + (nextIdx / Math.max(sections.length - 1, 1)) * 80;

      setDirection(nextX >= currentX ? "right" : "left");
      setCharacterAction(
        pressedKeysRef.current.has("s") ? "crouchWalk" : "run"
      );
      setSpriteX(nextX);
      spriteXRef.current = nextX;
      setVisible(false);
      setSectionIdx(nextIdx);
      sectionRef.current = nextIdx;

      window.clearTimeout(runningTimerRef.current);
      window.clearTimeout(swapTimerRef.current);

      runningTimerRef.current = window.setTimeout(() => {
        if (
          !pressedKeysRef.current.has("a") &&
          !pressedKeysRef.current.has("d")
        ) {
          setCharacterAction(
            pressedKeysRef.current.has("s") ? "crouch" : "idle"
          );
        }
      }, MOTION.runDurationMs);

      swapTimerRef.current = window.setTimeout(() => {
        setDisplayIdx(nextIdx);
        setVisible(true);
      }, MOTION.swapDelayMs);

      window.setTimeout(() => {
        lockRef.current = false;
      }, MOTION.scrollLockMs);
    },
    [
      MOTION.runDurationMs,
      MOTION.scrollLockMs,
      MOTION.swapDelayMs,
      sections.length,
    ]
  );

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 18) return;
      triggerTransition(sectionRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    // const onKeyDown = (event) => {
    //   if (["ArrowDown", "PageDown", " ", "j"].includes(event.key)) {
    //     event.preventDefault();
    //     triggerTransition(sectionRef.current + 1);
    //   }
    //   if (["ArrowUp", "PageUp", "k"].includes(event.key)) {
    //     event.preventDefault();
    //     triggerTransition(sectionRef.current - 1);
    //   }
    // };

    const onTouchStart = (event) => {
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const onTouchEnd = (event) => {
      if (touchStartRef.current == null) return;

      const deltaX = touchStartRef.current.x - event.changedTouches[0].clientX;
      const deltaY = touchStartRef.current.y - event.changedTouches[0].clientY;

      if (
        isMobile &&
        Math.abs(deltaX) > 40 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        triggerTransition(sectionRef.current + (deltaX > 0 ? 1 : -1));
      }

      touchStartRef.current = null;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });
    // window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      // window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(runningTimerRef.current);
      window.clearTimeout(actionTimerRef.current);
      window.clearTimeout(swapTimerRef.current);
    };
  }, [isMobile, triggerTransition]);

  useEffect(() => {
    const closestSectionIndex = () => {
      let closestIndex = 0;
      let closestDistance = Infinity;

      sectionPoints.forEach((point, index) => {
        const distance = Math.abs(spriteXRef.current - point);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const endTransientAction = () => {
      const keys = pressedKeysRef.current;
      if (keys.has("s")) {
        setCharacterAction("crouch");
      } else {
        setCharacterAction("idle");
      }
    };

    const moveToSectionPoint = (step) => {
      if (characterAction === "jump") return;

      const currentIndex = closestSectionIndex();
      const nextIndex = Math.max(
        0,
        Math.min(sections.length - 1, currentIndex + step)
      );

      if (nextIndex === currentIndex) return;

      triggerTransition(nextIndex);
    };

    const onActionKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (!["w", "a", "s", "d", "e"].includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }

      if (["w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
      }

      pressedKeysRef.current.add(key);
      window.clearTimeout(actionTimerRef.current);

      if (
        (key === "a" || key === "d") &&
        (pressedKeysRef.current.has("s") ||
          pressedKeysRef.current.has("w") ||
          characterAction === "crouch" ||
          characterAction === "jump")
      ) {
        return;
      }

      if (key === "a") {
        moveToSectionPoint(-1);
      } else if (key === "d") {
        moveToSectionPoint(1);
      } else if (key === "s") {
        setCharacterAction("crouch");
      } else if (key === "w") {
        setCharacterAction("jump");
        actionTimerRef.current = window.setTimeout(
          endTransientAction,
          getActionDuration(activeTheme, "jump")
        );
      } else if (key === "e") {
        const attackAction = pressedKeysRef.current.has("s")
          ? pickRandomAction([
              "crouchAttack1",
              "crouchAttack2",
              "crouchAttack3",
            ])
          : pickRandomAction(["attack1", "attack2", "attack3"]);

        setCharacterAction(attackAction);
        actionTimerRef.current = window.setTimeout(
          endTransientAction,
          getActionDuration(activeTheme, attackAction)
        );
      }
    };

    const onActionKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (!["w", "a", "s", "d", "e"].includes(key)) return;
      if (
        isTypingTarget(event.target) ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      pressedKeysRef.current.delete(key);

      if (
        key === "s" &&
        !pressedKeysRef.current.has("w") &&
        !pressedKeysRef.current.has("e")
      ) {
        if (lockRef.current && characterAction === "crouchWalk") {
          return;
        }

        setCharacterAction("idle");
      }

      if (
        (key === "a" || key === "d") &&
        !pressedKeysRef.current.has("a") &&
        !pressedKeysRef.current.has("d")
      ) {
        if (
          lockRef.current ||
          characterAction === "run" ||
          characterAction === "crouchWalk"
        ) {
          return;
        }

        if (
          !pressedKeysRef.current.has("w") &&
          !pressedKeysRef.current.has("s") &&
          !pressedKeysRef.current.has("e")
        ) {
          setCharacterAction("idle");
        }
      }
    };

    window.addEventListener("keydown", onActionKeyDown);
    window.addEventListener("keyup", onActionKeyUp);
    return () => {
      window.removeEventListener("keydown", onActionKeyDown);
      window.removeEventListener("keyup", onActionKeyUp);
    };
  }, [
    activeTheme,
    characterAction,
    sectionPoints,
    sections.length,
    triggerTransition,
  ]);

  const handleContactSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = contactFormRef.current;
      if (!form || contactState === "loading") return;

      setContactState("loading");
      setContactMessage("Shadow clone dispatch in progress...");

      try {
        const formData = new FormData(form);
        const response = await fetch(
          "https://formsubmit.co/ajax/nakshatrachandna7@gmail.com",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Unable to send message.");
        }

        form.reset();
        setContactState("success");
        setContactMessage(
          "Mission scroll delivered. Nakshatra-kun will receive your message by email."
        );
      } catch (error) {
        setContactState("error");
        setContactMessage(
          error.message || "Transmission failed. Try again in a moment."
        );
      }
    },
    [contactState]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: UI.appBackground,
        fontFamily: F.body,
        color: C.text,
        opacity: isThemeMounted ? 1 : 0,
        transform: isThemeMounted ? "scale(1)" : "scale(1.025)",
        transition:
          "opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Oxanium:wght@300;400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=Teko:wght@400;500;600;700&display=swap');
        @font-face {
          font-family: 'NinjaNaruto';
          src: url('/njnaruto.ttf') format('truetype');
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
          backdrop-filter: blur(16px) saturate(135%);
          -webkit-backdrop-filter: blur(16px) saturate(135%);
          border-bottom: 1px solid rgba(255,70,85,0.7);
          box-shadow:
            0 0 0 1px rgba(255,70,85,0.08) inset,
            0 10px 40px rgba(0,0,0,0.28);
          animation: gvNavPulse 3.8s ease-in-out infinite;
        }
        .gameverse-nav::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              180deg,
              rgba(255,255,255,0.035) 0,
              rgba(255,255,255,0.035) 1px,
              rgba(255,255,255,0) 1px,
              rgba(255,255,255,0) 4px
            );
          mix-blend-mode: screen;
          opacity: 0.28;
          pointer-events: none;
        }
        .gameverse-nav-button {
          position: relative;
          border-radius: 0 !important;
          border-top: 2px solid transparent !important;
          border-left: 0 !important;
          border-right: 0 !important;
          border-bottom: 0 !important;
          padding-top: 0.58rem !important;
          padding-bottom: 0.52rem !important;
          background: rgba(255,255,255,0.01) !important;
          transform: skewX(-10deg);
        }
        .gameverse-nav-button + .gameverse-nav-button::before {
          content: "";
          position: absolute;
          left: -0.18rem;
          top: 22%;
          bottom: 22%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(255,70,85,0.45), transparent);
          pointer-events: none;
        }
        .gameverse-nav-button.is-active {
          border-top-color: ${C.ember} !important;
          box-shadow: inset 0 1px 0 rgba(255,70,85,0.42), 0 -8px 20px rgba(255,70,85,0.05) inset;
        }
        .gameverse-nav-label {
          position: relative;
          display: inline-block;
          transform: skewX(10deg);
          transition: text-shadow 140ms ease, transform 140ms ease;
        }
        .gameverse-nav-button:hover .gameverse-nav-label {
          text-shadow:
            0.8px 0 0 rgba(255,70,85,0.62),
            -0.8px 0 0 rgba(97,218,251,0.34);
          animation: gvGlitch 180ms steps(2, end) 1;
        }
        .gameverse-nav-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-left: 0.45rem;
          border-radius: 999px;
          background: ${C.ember};
          box-shadow: 0 0 10px rgba(255,70,85,0.85);
          animation: gvPulseDot 1.15s ease-in-out infinite;
          vertical-align: middle;
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
        .gv-corner {
          position: absolute;
          width: 38px;
          height: 38px;
          z-index: 3;
          pointer-events: none;
          opacity: 0.8;
          filter: drop-shadow(0 0 8px rgba(255, 70, 85, 0.28));
          animation: gvBootFlicker 2.8s steps(2, end) infinite;
        }
        .gv-corner::before,
        .gv-corner::after {
          content: "";
          position: absolute;
          background: linear-gradient(90deg, ${C.ember}, ${C.gold});
          box-shadow: 0 0 10px rgba(255, 70, 85, 0.32);
        }
        .gv-corner::before { width: 100%; height: 2px; }
        .gv-corner::after { width: 2px; height: 100%; }
        .gv-corner-tl { top: 14px; left: 14px; }
        .gv-corner-tl::before { top: 0; left: 0; }
        .gv-corner-tl::after { top: 0; left: 0; }
        .gv-corner-tr { top: 14px; right: 14px; }
        .gv-corner-tr::before { top: 0; right: 0; }
        .gv-corner-tr::after { top: 0; right: 0; }
        .gv-corner-bl { bottom: 14px; left: 14px; }
        .gv-corner-bl::before { bottom: 0; left: 0; }
        .gv-corner-bl::after { bottom: 0; left: 0; }
        .gv-corner-br { bottom: 14px; right: 14px; }
        .gv-corner-br::before { bottom: 0; right: 0; }
        .gv-corner-br::after { bottom: 0; right: 0; }
        .gameverse-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 72px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0.04) 35%,
              rgba(255, 70, 85, 0.08) 50%,
              rgba(255, 255, 255, 0.03) 65%,
              rgba(255, 255, 255, 0)
            );
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 2;
          animation: gvScan 5.2s linear infinite;
        }
        .gameverse-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .gameverse-pixel {
          position: absolute;
          left: var(--x);
          bottom: -10px;
          width: var(--size);
          height: var(--size);
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 0 0 6px rgba(255,255,255,0.2);
          opacity: 0;
          animation: gvRise var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        .gameverse-stat {
          position: relative;
          border-color: rgba(255, 70, 85, 0.22) !important;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 70, 85, 0.05), transparent 38%),
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px),
            rgba(10, 15, 24, 0.56) !important;
          background-size: auto, 10px 10px, auto !important;
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background-color 180ms ease,
            transform 180ms ease;
        }
        .gameverse-stat:hover {
          border-color: rgba(255, 70, 85, 0.72) !important;
          box-shadow:
            0 0 0 1px rgba(255, 70, 85, 0.18) inset,
            0 0 18px rgba(255, 70, 85, 0.16),
            0 0 28px rgba(255, 70, 85, 0.1);
          transform: translateY(-1px);
        }
        .gameverse-stat-label {
          text-shadow:
            0.6px 0 0 rgba(255, 70, 85, 0.45),
            -0.6px 0 0 rgba(90, 180, 255, 0.28),
            0 0 8px rgba(255, 209, 102, 0.08);
        }
        .gameverse-stat-value {
          color: #6fffe9;
          text-shadow: 0 0 12px rgba(111,255,233,0.14);
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
        @keyframes gvPulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.35); opacity: 1; }
        }
        @keyframes gvNavPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,70,85,0.08) inset, 0 10px 40px rgba(0,0,0,0.28), 0 1px 0 rgba(255,70,85,0.22); }
          50% { box-shadow: 0 0 0 1px rgba(255,70,85,0.12) inset, 0 10px 40px rgba(0,0,0,0.28), 0 1px 0 rgba(255,70,85,0.42); }
        }
        @keyframes gvBootFlicker {
          0%, 100% { opacity: 0.78; }
          8% { opacity: 0.35; }
          10% { opacity: 0.92; }
          14% { opacity: 0.45; }
          18% { opacity: 0.85; }
          60% { opacity: 0.74; }
        }
        @keyframes gvScan {
          0% { transform: translateY(-120%); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { transform: translateY(900%); opacity: 0; }
        }
        @keyframes gvRise {
          0% { transform: translateY(0); opacity: 0; }
          12% { opacity: 0.65; }
          100% { transform: translateY(-120%); opacity: 0; }
        }
        @media (max-width: 768px) {
          .gv-corner {
            width: 26px;
            height: 26px;
          }
          .gv-corner-tl,
          .gv-corner-tr {
            top: 10px;
          }
          .gv-corner-bl,
          .gv-corner-br {
            bottom: 10px;
          }
          .gv-corner-tl,
          .gv-corner-bl {
            left: 10px;
          }
          .gv-corner-tr,
          .gv-corner-br {
            right: 10px;
          }
          .gameverse-scanline {
            height: 56px;
          }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `${UI.backgroundImageOverlay}, url(${assets.sectionBackgrounds[displayIdx]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: UI.backgroundFilter,
          transform: "scale(1.03)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: UI.topAtmosphere,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          backgroundImage: UI.gridOverlay,
          backgroundSize: "84px 84px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.2))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "45vh",
          background: UI.bottomAtmosphere,
          clipPath:
            "polygon(0 55%, 12% 40%, 21% 58%, 34% 36%, 46% 56%, 57% 32%, 71% 53%, 82% 34%, 100% 60%, 100% 100%, 0 100%)",
        }}
      />
      <ThreeScene sectionIndex={displayIdx} />

      <nav
        className={isGameverse ? "gameverse-nav" : undefined}
        style={{
          position: "fixed",
          top: isMobile ? "0.55rem" : "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile
            ? "calc(100vw - 0.75rem)"
            : "min(1120px, calc(100vw - 1.5rem))",
          zIndex: 30,
          padding: isMobile ? "0.55rem 0.6rem" : "0.75rem 1rem",
          borderRadius: isMobile ? "18px" : "999px",
          border: `1px solid ${C.line}`,
          background: UI.navBackground,
          backdropFilter: "blur(14px)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.45rem" : "1rem",
        }}
      >
        <div
          style={{
            fontFamily: F.display,
            fontSize: isMobile ? "1.15rem" : "1.5rem",
            letterSpacing: "0.12em",
            color: C.gold,
          }}
        >
          IAMNAKSH.TECH
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            flexWrap: isMobile ? "nowrap" : "wrap",
            justifyContent: isMobile ? "flex-start" : "flex-end",
            width: isMobile ? "100%" : "auto",
            overflowX: isMobile ? "auto" : "visible",
            paddingBottom: isMobile ? "0.1rem" : 0,
            scrollbarWidth: "none",
          }}
        >
          <button
            onClick={onSwitchTheme}
            className={
              isGameverse
                ? "gameverse-nav-button gameverse-theme-button"
                : undefined
            }
            style={{
              borderRadius: "999px",
              border: `1px solid ${C.line}`,
              background: UI.themeButtonBackground,
              color: C.sand,
              padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              cursor: "pointer",
              fontFamily: F.display,
              whiteSpace: "nowrap",
              fontSize: isMobile ? "0.82rem" : "1rem",
              flex: "0 0 auto",
            }}
          >
            {CONTROLS_CONTENT.switchTheme}
          </button>
          {sections.map((section, idx) => (
            <button
              key={section}
              onClick={() => triggerTransition(idx)}
              className={
                isGameverse
                  ? `gameverse-nav-button ${
                      idx === sectionIdx ? "is-active" : ""
                    }`
                  : undefined
              }
              style={{
                borderRadius: "999px",
                border: `1px solid ${
                  idx === sectionIdx ? "rgba(239,197,108,0.55)" : "transparent"
                }`,
                background:
                  idx === sectionIdx ? "rgba(239,197,108,0.12)" : "transparent",
                color: idx === sectionIdx ? C.text : C.muted,
                padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontFamily: F.display,
                whiteSpace: "nowrap",
                fontSize: isMobile ? "0.82rem" : "1rem",
              }}
            >
              <span className={isGameverse ? "gameverse-nav-label" : undefined}>
                {section}
              </span>
              {isGameverse && idx === sectionIdx ? (
                <span className="gameverse-nav-dot" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      </nav>

      <main
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: isMobile ? "start center" : "center",
          padding: isMobile
            ? "5.85rem 0.75rem 1.25rem"
            : "5.8rem 0.9rem 8.8rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.985)",
          transition: "opacity 320ms ease, transform 320ms ease",
          overflow: "hidden",
        }}
      >
        {displayIdx === 0 && (
          <SectionShell
            title={HOME_CONTENT.title}
            kicker={HOME_CONTENT.kicker}
            isMobile={isMobile}
            titleStyle={{
              fontSize: isMobile
                ? "clamp(1.9rem, 10vw, 2.8rem)"
                : isCompactHero
                ? "clamp(2rem, 3.8vw, 3.4rem)"
                : "clamp(2.2rem, 4.5vw, 4rem)",
              lineHeight: isMobile ? 1 : 0.98,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile || isCompactHero
                    ? "minmax(0, 1fr)"
                    : "minmax(0, 1.3fr) minmax(240px, 0.7fr)",
                gap: isMobile ? "1rem" : "1.6rem",
                alignItems: isMobile || isCompactHero ? "start" : "center",
              }}
            >
              <div style={{ maxWidth: isCompactHero ? "100%" : "720px" }}>
                <p
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    color: C.sand,
                    marginBottom: "0.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {HOME_CONTENT.intro}
                </p>
                {HOME_CONTENT.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    style={{
                      color: C.muted,
                      lineHeight: 1.8,
                      maxWidth: "640px",
                      marginBottom:
                        index === HOME_CONTENT.paragraphs.length - 1
                          ? "1.4rem"
                          : "1rem",
                      fontSize: isMobile ? "0.96rem" : "1rem",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
                <div
                  style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}
                >
                  {HOME_CONTENT.ctas.map(([label, idx]) => (
                    <button
                      key={label}
                      onClick={() => triggerTransition(idx)}
                      className={
                        isGameverse ? "gameverse-hud-button" : undefined
                      }
                      style={{
                        padding: "0.8rem 1.15rem",
                        borderRadius: "999px",
                        border: `1px solid ${C.gold}`,
                        background:
                          label === "View Missions"
                            ? `linear-gradient(90deg, ${C.ember}, ${C.sunset})`
                            : "transparent",
                        color: C.text,
                        cursor: "pointer",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: F.display,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div
                  style={{
                    justifySelf: "center",
                    width: isCompactHero
                      ? "min(100%, 240px)"
                      : "min(100%, 290px)",
                    aspectRatio: "4 / 5",
                    maxHeight: `${heroPortraitMaxHeight}px`,
                    borderRadius: "28px",
                    overflow: "hidden",
                    border: `1px solid ${C.line}`,
                    background: UI.mediaFrameBackground,
                    boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={assets.heroProfile}
                    alt={`${activeTheme.label} portrait`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                      filter: "saturate(0.94) contrast(1.03)",
                    }}
                  />
                </div>
              )}
            </div>
          </SectionShell>
        )}

        {displayIdx === 1 && (
          <SectionShell
            title={ABOUT_CONTENT.title}
            kicker={ABOUT_CONTENT.kicker}
            isMobile={isMobile}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.9rem",
              }}
            >
              {ABOUT_CONTENT.stats.map(([label, value]) => (
                <StatCard key={label} label={label} value={value} />
              ))}
            </div>
            <div
              style={{
                marginTop: "1.2rem",
                maxWidth: "860px",
                color: C.muted,
                lineHeight: 1.8,
                fontSize: "1rem",
              }}
            >
              {ABOUT_CONTENT.blurb}
            </div>
          </SectionShell>
        )}

        {displayIdx === 2 && (
          <SectionShell
            title={SKILLS_CONTENT.title}
            kicker={SKILLS_CONTENT.kicker}
            isMobile={isMobile}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.6rem",
              }}
            >
              {SKILLS_CONTENT.groups.map((group) => (
                <div key={group.title}>
                  <p
                    style={{
                      color: C.gold,
                      marginBottom: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {group.title}
                  </p>
                  {group.skills.map((skill) => (
                    <SkillBar
                      key={skill.label}
                      label={skill.label}
                      value={skill.value}
                      color={skill.color}
                    />
                  ))}
                </div>
              ))}
            </div>
          </SectionShell>
        )}

        {displayIdx === 3 && (
          <SectionShell
            title={PROJECTS_CONTENT.title}
            kicker={PROJECTS_CONTENT.kicker}
            isMobile={isMobile}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {PROJECTS_CONTENT.items.map((project) => (
                <MissionCard key={project.title} {...project} />
              ))}
            </div>
          </SectionShell>
        )}

        {displayIdx === 4 && (
          <SectionShell
            title={CONTACT_CONTENT.title}
            kicker={CONTACT_CONTENT.kicker}
            isMobile={isMobile}
          >
            <form
              ref={contactFormRef}
              onSubmit={handleContactSubmit}
              style={{ display: "grid", gap: "0.85rem", maxWidth: "620px" }}
            >
              <input
                type="hidden"
                name="_subject"
                value={CONTACT_CONTENT.subject}
              />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="text"
                name="_honey"
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
              />
              <input
                type="text"
                name="name"
                placeholder={CONTACT_CONTENT.placeholders.name}
                required
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${C.line}`,
                  padding: "0.95rem 1rem",
                  background: UI.inputBackground,
                  color: C.text,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder={CONTACT_CONTENT.placeholders.email}
                required
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${C.line}`,
                  padding: "0.95rem 1rem",
                  background: UI.inputBackground,
                  color: C.text,
                }}
              />
              <textarea
                rows={4}
                name="message"
                placeholder={CONTACT_CONTENT.placeholders.brief}
                required
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${C.line}`,
                  padding: "0.95rem 1rem",
                  background: UI.inputBackground,
                  color: C.text,
                  resize: "none",
                }}
              />
              <button
                type="submit"
                disabled={contactState === "loading"}
                style={{
                  padding: "0.95rem 1.1rem",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  color: C.text,
                  background: `linear-gradient(90deg, ${C.ember}, ${C.sunset})`,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  opacity: contactState === "loading" ? 0.7 : 1,
                }}
              >
                {contactState === "loading"
                  ? CONTACT_CONTENT.loadingLabel
                  : CONTACT_CONTENT.submitLabel}
              </button>
              {contactState !== "idle" && (
                <div
                  style={{
                    marginTop: "0.25rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "14px 22px 14px 18px",
                    border: `1px solid ${
                      contactState === "success"
                        ? "rgba(239,197,108,0.4)"
                        : contactState === "error"
                        ? "rgba(157,44,18,0.65)"
                        : "rgba(125,75,28,0.8)"
                    }`,
                    background:
                      contactState === "success"
                        ? UI.contactSuccessBackground
                        : contactState === "error"
                        ? UI.contactErrorBackground
                        : UI.contactPendingBackground,
                    color: contactState === "error" ? "#ffd7c9" : C.sand,
                    lineHeight: 1.6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: F.display,
                      fontSize: "0.95rem",
                      letterSpacing: "0.08em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {contactState === "success"
                      ? CONTACT_CONTENT.status.success
                      : contactState === "error"
                      ? CONTACT_CONTENT.status.error
                      : CONTACT_CONTENT.status.pending}
                  </div>
                  <div style={{ fontSize: "0.92rem" }}>{contactMessage}</div>
                </div>
              )}
            </form>
          </SectionShell>
        )}
      </main>

      {!isMobile && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: "138px",
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: isMobile ? "auto 0 12px 0" : "auto 0 18px 0",
              height: isMobile ? "16px" : "22px",
              background: UI.groundGlow,
              boxShadow: "0 0 28px rgba(216,90,26,0.2)",
            }}
          />
          <div
            onMouseEnter={() => setShowCharacterHelp(true)}
            onMouseLeave={() => setShowCharacterHelp(false)}
            style={{
              position: "absolute",
              left: `${spriteX}%`,
              bottom: isMobile ? "8px" : "12px",
              transform: "translateX(-50%)",
              transition: "left 680ms cubic-bezier(0.2, 0.9, 0.3, 1)",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: isMobile ? "108px" : "168px",
                transform: showCharacterHelp
                  ? "translate(-50%, 0)"
                  : "translate(-50%, 8px)",
                opacity: showCharacterHelp ? 1 : 0,
                transition: "opacity 180ms ease, transform 180ms ease",
                padding: "0.65rem 0.85rem",
                borderRadius: "14px 20px 14px 18px",
                border: `1px solid ${C.line}`,
                background: UI.helpTooltipBackground,
                boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
                color: C.sand,
                whiteSpace: "nowrap",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                pointerEvents: "none",
              }}
            >
              <div style={{ fontFamily: F.display, color: C.gold }}>
                {CONTROLS_CONTENT.helpTitle}
              </div>
              <div>{CONTROLS_CONTENT.helpText}</div>
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: isMobile ? "4px" : "6px",
                width: isMobile ? "78px" : "110px",
                height: isMobile ? "18px" : "28px",
                transform: "translateX(-50%)",
                transition: "width 160ms ease",
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0) 72%)",
              }}
            />
            <NarutoWalker
              action={characterAction}
              direction={direction}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [pendingThemeId, setPendingThemeId] = useState(null);
  const [isEnteringTheme, setIsEnteringTheme] = useState(false);
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const activeTheme = selectedThemeId ? getThemeById(selectedThemeId) : null;
  const loadingTheme = pendingThemeId ? getThemeById(pendingThemeId) : null;

  const handleThemeSelect = useCallback((themeId) => {
    setPendingThemeId(themeId);
    setIsEnteringTheme(true);

    window.setTimeout(() => {
      setIsThemeLoading(true);
      setIsEnteringTheme(false);
    }, 700);

    window.setTimeout(() => {
      setSelectedThemeId(themeId);
      setIsThemeLoading(false);
      setPendingThemeId(null);
    }, 2200);
  }, []);

  const handleSwitchTheme = useCallback(() => {
    setSelectedThemeId(null);
    setPendingThemeId(null);
    setIsEnteringTheme(false);
    setIsThemeLoading(false);
  }, []);

  if (isThemeLoading && loadingTheme) {
    return <ThemeLoadingScreen theme={loadingTheme} />;
  }

  if (!activeTheme) {
    return (
      <ThemeSelector
        themes={THEMES}
        onSelect={handleThemeSelect}
        isEnteringTheme={isEnteringTheme}
        pendingThemeId={pendingThemeId}
      />
    );
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <PortfolioExperience
        activeTheme={activeTheme}
        onSwitchTheme={handleSwitchTheme}
      />
    </ThemeProvider>
  );
}
