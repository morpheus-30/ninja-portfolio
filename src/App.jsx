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
  const { theme } = useThemeTokens();
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

    const texture = new THREE.TextureLoader().load(
      theme.assets.ui.particleSprite
    );

    const pointCloud = new THREE.Points(
      particles,
      new THREE.PointsMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        size: theme.id === "pop" ? 0.28 : 0.7,
        depthWrite: false,
        color: 0xffffff,
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
      texture.dispose();
      particles.dispose();
      pointCloud.material.dispose();
      sweep.geometry.dispose();
      sweep.material.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [theme.assets.ui.particleSprite, theme.id]);

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
  const gameverseClip =
    "polygon(var(--gv-cut) 0, calc(100% - var(--gv-cut)) 0, 100% var(--gv-cut), 100% calc(100% - var(--gv-cut)), calc(100% - var(--gv-cut)) 100%, var(--gv-cut) 100%, 0 calc(100% - var(--gv-cut)), 0 var(--gv-cut))";
  const gameverseInnerInset = isMobile ? "14px" : "18px";
  const gameverseWoodInset = isMobile ? "20px" : "26px";
  const gameverseFrameSprite = {
    position: "absolute",
    pointerEvents: "none",
    imageRendering: "pixelated",
    filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.22))",
    opacity: 0.96,
  };
  const randomBottomStones = useMemo(
    () =>
      Array.from({ length: isMobile ? 5 : 8 }, (_, index) => ({
        id: index,
        left: 8 + Math.random() * 84,
        bottom: Math.random() * (isMobile ? 4 : 6),
        width: isMobile ? 22 + Math.random() * 8 : 42 + Math.random() * 18,
        flip: Math.random() > 0.5,
        opacity: 0.82 + Math.random() * 0.16,
      })),
    [isMobile]
  );

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
          ? gameverseClip
          : isMobile
          ? "polygon(0 12px, 12px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 14px 100%, 0 calc(100% - 14px))"
          : "polygon(0 18px, 18px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGameverse
            ? "linear-gradient(180deg, rgba(255,240,214,0.08) 0%, rgba(255,240,214,0.02) 18%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 74%, rgba(255,255,255,0.04) 100%)",
          opacity: isGameverse ? 0.9 : 0.55,
          pointerEvents: "none",
        }}
      />
      {isGameverse && (
        <div
          style={{
            position: "absolute",
            inset: gameverseInnerInset,
            clipPath: gameverseClip,
            backgroundImage: `url(${theme.assets.ui.stoneTile})`,
            backgroundSize: isMobile ? "280px 280px" : "340px 340px",
            backgroundPosition: "center",
            filter: "saturate(0.9) brightness(0.68)",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        />
      )}
      {isGameverse && (
        <div
          style={{
            position: "absolute",
            inset: gameverseWoodInset,
            clipPath: gameverseClip,
            background:
              "linear-gradient(180deg, rgba(152,108,63,0.46) 0%, rgba(112,74,40,0.5) 46%, rgba(85,53,29,0.56) 100%)",
            boxShadow:
              "inset 0 2px 0 rgba(255,233,188,0.16), inset 0 -3px 0 rgba(59,32,13,0.36)",
            opacity: 0.72,
            pointerEvents: "none",
          }}
        />
      )}
      {isGameverse && (
        <div
          style={{
            position: "absolute",
            inset: gameverseWoodInset,
            clipPath: gameverseClip,
            background:
              "linear-gradient(180deg, rgba(255,221,165,0.07) 0 2%, rgba(0,0,0,0) 2% 24%, rgba(68,42,20,0.18) 24% 26%, rgba(0,0,0,0) 26% 48%, rgba(68,42,20,0.18) 48% 50%, rgba(0,0,0,0) 50% 72%, rgba(68,42,20,0.18) 72% 74%, rgba(0,0,0,0) 74% 100%), linear-gradient(90deg, rgba(247,221,168,0.05), rgba(95,58,29,0.12) 28%, rgba(247,221,168,0.03) 54%, rgba(95,58,29,0.12) 78%, rgba(247,221,168,0.05))",
            opacity: 0.46,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: gameverseInnerInset,
          border: isGameverse
            ? "4px solid rgba(86, 71, 56, 0.96)"
            : `1px solid ${C.line}`,
          borderRadius: isGameverse
            ? "0"
            : isMobile
            ? "10px 18px 10px 18px"
            : "14px 28px 14px 28px",
          clipPath: isGameverse ? gameverseClip : "none",
          boxShadow: isGameverse
            ? "inset 0 0 0 2px rgba(58,45,33,0.95), inset 0 0 0 8px rgba(191,168,125,0.12)"
            : undefined,
          opacity: isGameverse ? 1 : 0.45,
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
          background: isGameverse
            ? "linear-gradient(135deg, rgba(231,197,146,0) 0%, rgba(231,197,146,0.14) 48%, rgba(231,197,146,0) 48%)"
            : `linear-gradient(135deg, ${C.ember}00 0%, ${C.ember}22 48%, ${C.ember}00 48%)`,
          pointerEvents: "none",
          opacity: isGameverse ? 0.75 : 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: isMobile ? "110px" : "220px",
          height: isMobile ? "110px" : "220px",
          background: isGameverse
            ? "linear-gradient(315deg, rgba(108,71,39,0) 0%, rgba(108,71,39,0.18) 42%, rgba(108,71,39,0) 42%)"
            : `linear-gradient(315deg, ${C.gold}00 0%, ${C.gold}14 42%, ${C.gold}00 42%)`,
          pointerEvents: "none",
          opacity: isGameverse ? 0.8 : 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: isMobile ? "auto 10px 10px auto" : "auto 14px 14px auto",
          width: isMobile ? "68px" : "108px",
          height: "1px",
          background: isGameverse
            ? "linear-gradient(90deg, transparent, rgba(211,181,134,0.9))"
            : `linear-gradient(90deg, transparent, ${C.gold})`,
          opacity: isGameverse ? 0.5 : 0.72,
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
      {isGameverse && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: isMobile ? "44px" : "72px",
            pointerEvents: "none",
          }}
        >
          {randomBottomStones.map((stone) => (
            <img
              key={stone.id}
              src={theme.assets.ui.stoneSprite}
              alt=""
              style={{
                ...gameverseFrameSprite,
                left: `${stone.left}%`,
                bottom: `${stone.bottom}px`,
                width: `${stone.width}px`,
                transform: stone.flip
                  ? "translateX(-50%) scaleX(-1)"
                  : "translateX(-50%) scaleX(1)",
                opacity: stone.opacity,
              }}
            />
          ))}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isGameverse
            ? "linear-gradient(135deg, rgba(255,242,214,0.05) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isGameverse ? 0.06 : 0.08,
          backgroundImage: UI.sectionGrid,
          backgroundSize: isGameverse ? "100% 100%, 44px 44px" : "34px 34px",
          pointerEvents: "none",
        }}
      />
      {!isGameverse && (
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
      )}
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
        padding: isGameverse ? "0.78rem 0.9rem 0.82rem" : "1rem 1.1rem",
        borderRadius: isGameverse ? "12px" : "12px 22px 12px 18px",
        border: UI.statCardBorder,
        background: UI.statCardBackground,
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,240,214,0.12), 0 10px 22px rgba(0,0,0,0.16)"
          : "inset 0 0 0 1px rgba(239,197,108,0.07)",
      }}
    >
      <div
        className={isGameverse ? "gameverse-stat-label" : undefined}
        style={{
          color: isGameverse ? "#f0d39d" : C.gold,
          fontSize: isGameverse ? "0.66rem" : "0.72rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontFamily: isGameverse ? F.body : F.display,
        }}
      >
        {label}
      </div>
      <div
        className={isGameverse ? "gameverse-stat-value" : undefined}
        style={{
          color: C.text,
          fontSize: isGameverse ? "0.95rem" : "1rem",
          marginTop: "0.32rem",
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SkillBar({ label, value, color }) {
  const { theme, C, F } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const totalHeartUnits = Math.max(0, Math.min(10, Math.round(value / 10)));
  const fullHearts = Math.floor(totalHeartUnits / 2);
  const hasHalfHeart = totalHeartUnits % 2 === 1;
  const emptyHearts = 5 - fullHearts - (hasHalfHeart ? 1 : 0);
  const heartSprites = [
    ...Array.from({ length: fullHearts }, () => theme.assets.ui.heartFull),
    ...(hasHalfHeart ? [theme.assets.ui.heartHalf] : []),
    ...Array.from({ length: emptyHearts }, () => theme.assets.ui.heartEmpty),
  ];

  return (
    <div
      style={{
        marginBottom: isGameverse ? "0.65rem" : "1rem",
        padding: isGameverse ? "0.7rem 0.82rem" : 0,
        borderRadius: isGameverse ? "12px" : 0,
        border: isGameverse ? "1px solid rgba(232, 206, 166, 0.24)" : "none",
        background: isGameverse
          ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
          : "transparent",
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,240,214,0.1), 0 8px 18px rgba(0,0,0,0.12)"
          : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.35rem",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            color: isGameverse ? "#f6e7c3" : C.text,
            fontFamily: isGameverse ? F.body : undefined,
            letterSpacing: isGameverse ? "0.04em" : undefined,
            fontSize: isGameverse ? "0.95rem" : undefined,
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: isGameverse ? "#f3d18a" : C.gold,
            fontFamily: isGameverse ? F.body : undefined,
            fontSize: isGameverse ? "0.92rem" : undefined,
            fontWeight: isGameverse ? 700 : undefined,
            letterSpacing: isGameverse ? "0.04em" : undefined,
            flex: "0 0 auto",
          }}
        >
          {value}%
        </span>
      </div>

      {isGameverse ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.26rem",
            minHeight: "22px",
          }}
        >
          {heartSprites.map((sprite, index) => (
            <img
              key={`${label}-${index}`}
              src={sprite}
              alt=""
              aria-hidden="true"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: `drop-shadow(0 0 6px ${color}33)`,
              }}
            />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}

function MissionCard({ rank, title, desc, tags }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  return (
    <article
      style={{
        padding: isGameverse ? "1rem 1.02rem" : "1.2rem",
        borderRadius: isGameverse ? "12px" : "14px 26px 14px 22px",
        border: isGameverse
          ? "1px solid rgba(240, 214, 175, 0.22)"
          : UI.missionCardBorder,
        background: isGameverse
          ? "linear-gradient(180deg, rgba(22,17,13,0.42) 0%, rgba(10,7,6,0.56) 100%)"
          : UI.missionCardBackground,
        boxShadow: isGameverse
          ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 10px 18px rgba(0,0,0,0.14)"
          : "inset 0 0 0 1px rgba(239,197,108,0.06)",
      }}
    >
      <div
        style={{
          color: isGameverse ? "#f3d18a" : C.gold,
          marginBottom: "0.48rem",
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          fontFamily: isGameverse ? F.display : F.display,
          fontSize: isGameverse ? "1rem" : undefined,
        }}
      >
        Rank {rank}
      </div>
      <h3
        style={{
          color: C.text,
          fontSize: isGameverse ? "1.8rem" : "1.2rem",
          marginBottom: "0.42rem",
          fontFamily: isGameverse ? F.display : undefined,
          letterSpacing: isGameverse ? "0.03em" : undefined,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: isGameverse ? "#f0e2c4" : C.muted,
          lineHeight: 1.7,
          marginBottom: "0.82rem",
          fontSize: isGameverse ? "0.96rem" : undefined,
        }}
      >
        {desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: isGameverse ? "0.24rem 0.52rem" : "0.28rem 0.55rem",
              borderRadius: isGameverse ? "10px" : "999px",
              background: isGameverse
                ? "linear-gradient(180deg, rgba(86,57,33,0.68) 0%, rgba(57,37,21,0.8) 100%)"
                : UI.pillBackground,
              border: isGameverse
                ? "1px solid rgba(240, 214, 175, 0.18)"
                : `1px solid ${C.line}`,
              color: isGameverse ? "#f7e3b2" : C.sand,
              fontSize: isGameverse ? "0.72rem" : "0.78rem",
              boxShadow: isGameverse
                ? "inset 0 1px 0 rgba(247,227,178,0.06)"
                : "none",
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
  const gameverseCastleSilhouettes = useMemo(
    () =>
      isGameverse
        ? [
            {
              left: "-2%",
              width: isMobile ? "24%" : "14%",
              height: isMobile ? "76px" : "116px",
              bottom: isMobile ? "18px" : "24px",
              opacity: 0.22,
              blur: "1px",
              skew: "-5deg",
            },
            {
              left: isMobile ? "18%" : "16%",
              width: isMobile ? "18%" : "11%",
              height: isMobile ? "60px" : "92px",
              bottom: isMobile ? "28px" : "32px",
              opacity: 0.16,
              blur: "1px",
              skew: "4deg",
            },
            {
              left: isMobile ? "38%" : "37%",
              width: isMobile ? "22%" : "13%",
              height: isMobile ? "84px" : "124px",
              bottom: isMobile ? "16px" : "20px",
              opacity: 0.2,
              blur: "1px",
              skew: "-3deg",
            },
            {
              left: isMobile ? "60%" : "58%",
              width: isMobile ? "18%" : "10%",
              height: isMobile ? "64px" : "96px",
              bottom: isMobile ? "24px" : "30px",
              opacity: 0.17,
              blur: "1px",
              skew: "5deg",
            },
            {
              left: isMobile ? "74%" : "78%",
              width: isMobile ? "22%" : "12%",
              height: isMobile ? "72px" : "108px",
              bottom: isMobile ? "18px" : "24px",
              opacity: 0.19,
              blur: "1px",
              skew: "-4deg",
            },
          ]
        : [],
    [isGameverse, isMobile]
  );
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
        ((activeTheme.id === "pop" && pressedKeysRef.current.has("s")) ||
          pressedKeysRef.current.has("w") ||
          (activeTheme.id === "pop" && characterAction === "crouch") ||
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
          clipPath: isGameverse ? "none" : undefined,
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
          borderRadius: 0,
          border: "4px solid transparent",
          background: "rgba(9, 8, 10, 0.88)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "0.45rem" : "1rem",
        }}
      >
        <div
          style={{
            fontFamily: isGameverse
              ? "'VT323', 'PixelGame', monospace"
              : F.display,
            fontSize: isMobile ? "1.25rem" : "1.65rem",
            letterSpacing: isGameverse ? "0.18em" : "0.12em",
            color: isGameverse ? "#f2d48a" : C.gold,
            textTransform: isGameverse ? "uppercase" : undefined,
            textShadow: isGameverse
              ? "0 0 0.5px rgba(255,236,173,0.95), 0 0 8px rgba(233,199,116,0.18)"
              : undefined,
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
              borderRadius: isGameverse ? "0" : "999px",
              border: `1px solid ${C.line}`,
              background: UI.themeButtonBackground,
              color: isGameverse ? "#d6c49d" : C.sand,
              padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
              textTransform: "uppercase",
              letterSpacing: isGameverse ? "0.14em" : "0.12em",
              cursor: "pointer",
              fontFamily: isGameverse
                ? "'VT323', 'PixelGame', monospace"
                : F.display,
              whiteSpace: "nowrap",
              fontSize: isGameverse
                ? isMobile
                  ? "0.98rem"
                  : "1.12rem"
                : isMobile
                ? "0.82rem"
                : "1rem",
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
                borderRadius: isGameverse ? "0" : "999px",
                border: `1px solid ${
                  idx === sectionIdx ? "rgba(239,197,108,0.55)" : "transparent"
                }`,
                background: isGameverse
                  ? "transparent"
                  : idx === sectionIdx
                  ? "rgba(239,197,108,0.12)"
                  : "transparent",
                color: isGameverse
                  ? idx === sectionIdx
                    ? "#f4d98f"
                    : "#d6c49d"
                  : idx === sectionIdx
                  ? C.text
                  : C.muted,
                padding: isMobile ? "0.42rem 0.72rem" : "0.45rem 0.9rem",
                textTransform: "uppercase",
                letterSpacing: isGameverse ? "0.14em" : "0.12em",
                cursor: "pointer",
                fontFamily: isGameverse
                  ? "'VT323', 'PixelGame', monospace"
                  : F.display,
                whiteSpace: "nowrap",
                fontSize: isGameverse
                  ? isMobile
                    ? "0.98rem"
                    : "1.12rem"
                  : isMobile
                  ? "0.82rem"
                  : "1rem",
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
              <div
                style={{
                  maxWidth: isCompactHero ? "100%" : "720px",
                  padding: isGameverse
                    ? isMobile
                      ? "0.85rem 0.9rem"
                      : "1rem 1.05rem"
                    : 0,
                  borderRadius: isGameverse ? "12px" : 0,
                  border: isGameverse
                    ? "1px solid rgba(240, 214, 175, 0.22)"
                    : "none",
                  background: isGameverse
                    ? "linear-gradient(180deg, rgba(22,17,13,0.44) 0%, rgba(10,7,6,0.58) 100%)"
                    : "transparent",
                  boxShadow: isGameverse
                    ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 10px 18px rgba(0,0,0,0.12)"
                    : "none",
                }}
              >
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
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.72rem",
                maxWidth: "860px",
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
                color: C.body,
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
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: "0.95rem",
                width: "100%",
                alignItems: "start",
              }}
            >
              {SKILLS_CONTENT.groups.map((group) => (
                <div
                  key={group.title}
                  style={{
                    padding: isGameverse ? "0.9rem" : 0,
                    borderRadius: isGameverse ? "14px" : 0,
                    border: isGameverse
                      ? "1px solid rgba(240, 214, 175, 0.22)"
                      : "none",
                    background: isGameverse
                      ? "linear-gradient(180deg, rgba(22,17,13,0.42) 0%, rgba(10,7,6,0.56) 100%)"
                      : "transparent",
                    boxShadow: isGameverse
                      ? "inset 0 1px 0 rgba(255,241,216,0.08), 0 12px 22px rgba(0,0,0,0.12)"
                      : "none",
                  }}
                >
                  <p
                    style={{
                      color: C.gold,
                      marginBottom: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: isGameverse ? "0.84rem" : undefined,
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
              style={{
                display: "grid",
                gap: "0.7rem",
                maxWidth: "620px",
                padding: isGameverse ? "0.25rem 0" : 0,
              }}
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
                className={isGameverse ? "gameverse-input" : undefined}
                style={{
                  borderRadius: isGameverse ? "10px" : "16px",
                  border: isGameverse
                    ? "1px solid rgba(240, 214, 175, 0.22)"
                    : `1px solid ${C.line}`,
                  padding: isGameverse ? "0.82rem 0.95rem" : "0.95rem 1rem",
                  background: isGameverse
                    ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
                    : UI.inputBackground,
                  color: C.text,
                  boxShadow: isGameverse
                    ? "inset 0 1px 0 rgba(255,241,216,0.06), 0 8px 16px rgba(0,0,0,0.08)"
                    : "none",
                  fontSize: isGameverse ? "0.98rem" : undefined,
                }}
              />
              <input
                type="email"
                name="email"
                placeholder={CONTACT_CONTENT.placeholders.email}
                required
                className={isGameverse ? "gameverse-input" : undefined}
                style={{
                  borderRadius: isGameverse ? "10px" : "16px",
                  border: isGameverse
                    ? "1px solid rgba(240, 214, 175, 0.22)"
                    : `1px solid ${C.line}`,
                  padding: isGameverse ? "0.82rem 0.95rem" : "0.95rem 1rem",
                  background: isGameverse
                    ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
                    : UI.inputBackground,
                  color: C.text,
                  boxShadow: isGameverse
                    ? "inset 0 1px 0 rgba(255,241,216,0.06), 0 8px 16px rgba(0,0,0,0.08)"
                    : "none",
                  fontSize: isGameverse ? "0.98rem" : undefined,
                }}
              />
              <textarea
                rows={4}
                name="message"
                placeholder={CONTACT_CONTENT.placeholders.brief}
                required
                className={isGameverse ? "gameverse-input" : undefined}
                style={{
                  borderRadius: isGameverse ? "10px" : "16px",
                  border: isGameverse
                    ? "1px solid rgba(240, 214, 175, 0.22)"
                    : `1px solid ${C.line}`,
                  padding: isGameverse ? "0.86rem 0.95rem" : "0.95rem 1rem",
                  background: isGameverse
                    ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
                    : UI.inputBackground,
                  color: C.text,
                  resize: "none",
                  boxShadow: isGameverse
                    ? "inset 0 1px 0 rgba(255,241,216,0.06), 0 8px 16px rgba(0,0,0,0.08)"
                    : "none",
                  minHeight: isGameverse ? "112px" : undefined,
                  fontSize: isGameverse ? "0.98rem" : undefined,
                }}
              />
              <button
                type="submit"
                disabled={contactState === "loading"}
                className={isGameverse ? "gameverse-contact-button" : undefined}
                style={{
                  padding: isGameverse ? "0.82rem 1rem" : "0.95rem 1.1rem",
                  borderRadius: isGameverse ? "10px" : "999px",
                  border: isGameverse
                    ? "1px solid rgba(240, 214, 175, 0.24)"
                    : "none",
                  cursor: "pointer",
                  color: C.text,
                  background: isGameverse
                    ? "linear-gradient(180deg, rgba(173,118,62,0.76) 0%, rgba(117,75,39,0.88) 100%)"
                    : `linear-gradient(90deg, ${C.ember}, ${C.sunset})`,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  opacity: contactState === "loading" ? 0.7 : 1,
                  boxShadow: isGameverse
                    ? "inset 0 1px 0 rgba(255,227,178,0.14), 0 10px 18px rgba(0,0,0,0.12)"
                    : "none",
                  fontFamily: isGameverse ? F.display : undefined,
                  fontSize: isGameverse ? "0.9rem" : undefined,
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
                    borderRadius: isGameverse ? "14px" : "14px 22px 14px 18px",
                    border: isGameverse
                      ? "2px solid rgba(90, 65, 43, 0.95)"
                      : `1px solid ${
                          contactState === "success"
                            ? "rgba(239,197,108,0.4)"
                            : contactState === "error"
                            ? "rgba(157,44,18,0.65)"
                            : "rgba(125,75,28,0.8)"
                        }`,
                    background: isGameverse
                      ? "linear-gradient(180deg, rgba(118,82,49,0.92) 0%, rgba(87,57,31,0.95) 100%)"
                      : contactState === "success"
                      ? UI.contactSuccessBackground
                      : contactState === "error"
                      ? UI.contactErrorBackground
                      : UI.contactPendingBackground,
                    color: contactState === "error" ? "#ffd7c9" : C.sand,
                    lineHeight: 1.6,
                    boxShadow: isGameverse
                      ? "inset 0 1px 0 rgba(248,225,183,0.12), inset 0 0 0 1px rgba(60,42,26,0.5)"
                      : "none",
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
          {isGameverse && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
              }}
            >
              {gameverseCastleSilhouettes.map((silhouette, index) => (
                <div
                  key={`${silhouette.left}-${index}`}
                  style={{
                    position: "absolute",
                    left: silhouette.left,
                    bottom: silhouette.bottom,
                    width: silhouette.width,
                    height: silhouette.height,
                    opacity: silhouette.opacity,
                    filter: `grayscale(1) blur(${silhouette.blur})`,
                    transform: `skewX(${silhouette.skew})`,
                    transformOrigin: "bottom center",
                    background:
                      "linear-gradient(180deg, rgba(176,171,162,0.68) 0%, rgba(122,118,110,0.8) 42%, rgba(68,65,60,0.92) 100%)",
                    clipPath:
                      "polygon(0 100%, 0 56%, 10% 56%, 10% 22%, 18% 22%, 18% 52%, 30% 52%, 30% 12%, 39% 12%, 39% 47%, 51% 47%, 51% 30%, 61% 30%, 61% 56%, 73% 56%, 73% 18%, 82% 18%, 82% 52%, 92% 52%, 92% 36%, 100% 36%, 100% 100%)",
                    boxShadow:
                      "0 10px 18px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "14% 8% 0",
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0) 0 6%, rgba(58,55,51,0.48) 6% 10%, rgba(0,0,0,0) 10% 22%, rgba(58,55,51,0.4) 22% 26%, rgba(0,0,0,0) 26% 42%, rgba(58,55,51,0.46) 42% 46%, rgba(0,0,0,0) 46% 64%, rgba(58,55,51,0.38) 64% 68%, rgba(0,0,0,0) 68% 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "12px",
                  height: "48px",
                  background:
                    "linear-gradient(180deg, rgba(84,80,73,0) 0%, rgba(84,80,73,0.12) 30%, rgba(48,45,40,0.24) 100%)",
                  filter: "blur(8px)",
                  opacity: 0.72,
                }}
              />
            </div>
          )}
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
