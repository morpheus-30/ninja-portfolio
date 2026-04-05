import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ABOUT_BLURB,
  ABOUT_STATS,
  CONTACT_CONTENT,
  HOME_CONTENT,
  PROJECTS,
  SECTIONS,
  SITE_ASSETS,
  SKILL_GROUPS,
} from "./siteData";
import { C, F, MOTION } from "./theme";

const CHARACTER_ACTIONS = {
  idle: { src: SITE_ASSETS.character.idle },
  run: { src: SITE_ASSETS.character.run },
  crouchWalk: { src: SITE_ASSETS.character.crouchWalk },
  jump: { src: SITE_ASSETS.character.jump },
  crouch: { src: SITE_ASSETS.character.crouch },
  attack1: { src: SITE_ASSETS.character.attack1 },
  attack2: { src: SITE_ASSETS.character.attack2 },
  attack3: { src: SITE_ASSETS.character.attack3 },
  crouchAttack1: { src: SITE_ASSETS.character.crouchAttack1 },
  crouchAttack2: { src: SITE_ASSETS.character.crouchAttack2 },
  crouchAttack3: { src: SITE_ASSETS.character.crouchAttack3 },
};

const SECTION_POINTS = SECTIONS.map(
  (_, index) => 10 + (index / (SECTIONS.length - 1)) * 80
);

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function pickRandomAction(actions) {
  return actions[Math.floor(Math.random() * actions.length)];
}

function ThreeScene({ sectionIndex }) {
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
        color: 0xefc56c,
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
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    targetZRef.current = sectionIndex * -0.85;
    scene.userData.triggerSweep?.();
  }, [sectionIndex]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}

function NarutoWalker({ action, direction, isMobile }) {
  const actionConfig = CHARACTER_ACTIONS[action] ?? CHARACTER_ACTIONS.idle;
  const frameWidth = isMobile ? 150 : 400;
  const frameHeight = isMobile ? 118 : 200;
  const spriteHeight =
    action === "jump"
      ? isMobile
        ? 114
        : 200
      : action === "crouchAttack2" || action === "crouchAttack1"
      ? isMobile
        ? 112
        : 220
      : action === "crouchAttack3"
      ? isMobile
        ? 108
        : 180
      : isMobile
      ? 102
      : 146;
  const spriteBottom = action === "crouchAttack2" ? (isMobile ? -6 : -20) : 0;

  return (
    <div
      style={{
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
  return (
    <section
      style={{
        width: isMobile
          ? "calc(100vw - 1.5rem)"
          : "min(1120px, calc(100vw - 2.5rem))",
        minHeight: isMobile ? "calc(100vh - 7.5rem)" : "min(70vh, 760px)",
        maxHeight: isMobile ? "calc(100vh - 7.5rem)" : "none",
        padding: isMobile ? "1rem" : "clamp(1.6rem, 2vw, 2.2rem)",
        border: `2px solid rgba(125, 75, 28, 0.72)`,
        borderRadius: isMobile ? "14px 24px 14px 24px" : "18px 42px 18px 42px",
        background:
          "linear-gradient(180deg, rgba(66,34,18,0.88) 0%, rgba(34,18,10,0.94) 100%)",
        boxShadow:
          "0 28px 80px rgba(0, 0, 0, 0.28), inset 0 0 0 2px rgba(239,197,108,0.08), inset 0 18px 30px rgba(255,182,85,0.05)",
        display: "grid",
        alignItems: "center",
        position: "relative",
        overflowX: "hidden",
        overflowY: isMobile ? "auto" : "hidden",
        WebkitOverflowScrolling: isMobile ? "touch" : "auto",
        overscrollBehavior: isMobile ? "contain" : "auto",
        touchAction: isMobile ? "pan-y" : "auto",
        clipPath: isMobile
          ? "polygon(0 12px, 12px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 14px 100%, 0 calc(100% - 14px))"
          : "polygon(0 18px, 18px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "14px",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0), rgba(239,197,108,0.28), rgba(216,90,26,0.45), rgba(239,197,108,0.28), rgba(0,0,0,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(239,197,108,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(239,197,108,0.12) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "visible",
          paddingRight: isMobile ? "0.2rem" : 0,
        }}
      >
        <p
          style={{
            color: C.gold,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontSize: "0.74rem",
            marginBottom: "0.7rem",
            fontFamily: F.display,
          }}
        >
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
  return (
    <div
      style={{
        padding: "1rem 1.1rem",
        borderRadius: "12px 22px 12px 18px",
        border: `1px solid rgba(125, 75, 28, 0.8)`,
        background:
          "linear-gradient(180deg, rgba(73,37,19,0.75) 0%, rgba(42,22,12,0.88) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(239,197,108,0.07)",
      }}
    >
      <div
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
  return (
    <article
      style={{
        padding: "1.2rem",
        borderRadius: "14px 26px 14px 22px",
        border: `1px solid rgba(125, 75, 28, 0.8)`,
        background:
          "linear-gradient(180deg, rgba(70,35,18,0.7) 0%, rgba(40,20,12,0.85) 100%)",
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
              background: "rgba(239,197,108,0.09)",
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

export default function Portfolio() {
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

  const triggerTransition = useCallback((nextIdx) => {
    if (
      lockRef.current ||
      nextIdx < 0 ||
      nextIdx >= SECTIONS.length ||
      nextIdx === sectionRef.current
    ) {
      return;
    }

    lockRef.current = true;
    const currentX = spriteXRef.current;
    const nextX = 10 + (nextIdx / (SECTIONS.length - 1)) * 80;

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
  }, []);

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

      SECTION_POINTS.forEach((point, index) => {
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
        Math.min(SECTIONS.length - 1, currentIndex + step)
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

      if (key === "a") {
        moveToSectionPoint(-1);
      } else if (key === "d") {
        moveToSectionPoint(1);
      } else if (key === "s") {
        setCharacterAction("crouch");
      } else if (key === "w") {
        setCharacterAction("jump");
        actionTimerRef.current = window.setTimeout(endTransientAction, 520);
      } else if (key === "e") {
        setCharacterAction(
          pressedKeysRef.current.has("s")
            ? pickRandomAction([
                "crouchAttack1",
                "crouchAttack2",
                "crouchAttack3",
              ])
            : pickRandomAction(["attack1", "attack2", "attack3"])
        );
        actionTimerRef.current = window.setTimeout(endTransientAction, 420);
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
  }, [characterAction, triggerTransition]);

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
        background:
          "radial-gradient(circle at top, rgba(216,90,26,0.22) 0%, rgba(216,90,26,0) 36%), linear-gradient(180deg, #34150d 0%, #160b08 38%, #090606 100%)",
        fontFamily: F.body,
        color: C.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&family=Teko:wght@400;500;600;700&display=swap');
        @font-face {
          font-family: 'NinjaNaruto';
          src: url('/njnaruto.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        html, body, * { cursor: url('/assets/kunai-cursor.png') 8 8, auto; }
        button, input, textarea { font: inherit; }
        button, a, [role="button"], nav *, button:hover, a:hover, [role="button"]:hover {
          cursor: url('/assets/kunai-focus-cursor.png') 8 8, pointer !important;
        }
        a { color: inherit; }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(12,8,6,0.22), rgba(8,6,5,0.48)), url(${SITE_ASSETS.sectionBackgrounds[displayIdx]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.88) saturate(0.95)",
          transform: "scale(1.03)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 18%, rgba(239,197,108,0.22) 0, rgba(239,197,108,0.08) 10%, rgba(239,197,108,0) 21%), linear-gradient(180deg, rgba(219,108,43,0.08) 0%, rgba(36,17,11,0.03) 30%, rgba(6,5,5,0.08) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          backgroundImage:
            "linear-gradient(rgba(239,197,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(239,197,108,0.05) 1px, transparent 1px)",
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
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(24,35,17,0.78) 20%, rgba(15,21,10,0.98) 100%)",
          clipPath:
            "polygon(0 55%, 12% 40%, 21% 58%, 34% 36%, 46% 56%, 57% 32%, 71% 53%, 82% 34%, 100% 60%, 100% 100%, 0 100%)",
        }}
      />
      <ThreeScene sectionIndex={displayIdx} />

      <nav
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
          background: C.smoke,
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
          {SECTIONS.map((section, idx) => (
            <button
              key={section}
              onClick={() => triggerTransition(idx)}
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
              {section}
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
              <div
                style={{
                  justifySelf: "center",
                  width: isMobile
                    ? "min(100%, 220px)"
                    : isCompactHero
                    ? "min(100%, 240px)"
                    : "min(100%, 290px)",
                  aspectRatio: "4 / 5",
                  maxHeight: `${heroPortraitMaxHeight}px`,
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: `1px solid ${C.line}`,
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={SITE_ASSETS.heroProfile}
                  alt="Naruto portrait"
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
            </div>
          </SectionShell>
        )}

        {displayIdx === 1 && (
          <SectionShell
            title="Ninja Profile"
            kicker="Character Sheet"
            isMobile={isMobile}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.9rem",
              }}
            >
              {ABOUT_STATS.map(([label, value]) => (
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
              {ABOUT_BLURB}
            </div>
          </SectionShell>
        )}

        {displayIdx === 2 && (
          <SectionShell
            title="Jutsu Arsenal"
            kicker="Power Levels"
            isMobile={isMobile}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.6rem",
              }}
            >
              {SKILL_GROUPS.map((group) => (
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
            title="Mission Board"
            kicker="Recent Arcs"
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
              {PROJECTS.map((project) => (
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
                value="New portfolio message for Nakshatra-kun"
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
                  background: "rgba(255,255,255,0.04)",
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
                  background: "rgba(255,255,255,0.04)",
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
                  background: "rgba(255,255,255,0.04)",
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
                {contactState === "loading" ? "Summoning..." : "Summon Contact"}
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
                        ? "linear-gradient(180deg, rgba(76,58,20,0.75) 0%, rgba(48,31,12,0.9) 100%)"
                        : contactState === "error"
                        ? "linear-gradient(180deg, rgba(89,26,16,0.75) 0%, rgba(52,18,12,0.9) 100%)"
                        : "linear-gradient(180deg, rgba(73,37,19,0.75) 0%, rgba(42,22,12,0.88) 100%)",
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
                      ? "Mission Complete"
                      : contactState === "error"
                      ? "Transmission Failed"
                      : "Shadow Clone Jutsu"}
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
              background:
                "linear-gradient(90deg, rgba(0,0,0,0), rgba(239,197,108,0.4), rgba(216,90,26,0.52), rgba(239,197,108,0.4), rgba(0,0,0,0))",
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
                background:
                  "linear-gradient(180deg, rgba(62,31,18,0.95) 0%, rgba(28,15,10,0.96) 100%)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
                color: C.sand,
                whiteSpace: "nowrap",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                pointerEvents: "none",
              }}
            >
              <div style={{ fontFamily: F.display, color: C.gold }}>
                `WASD` Move • `E` Attack
              </div>
              <div>Hold `S` to crouch or crouch-walk</div>
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: isMobile ? "4px" : "6px",
                width: isMobile ? "78px" : "110px",
                height: isMobile ? "18px" : "28px",
                transform: "translateX(-50%)",
                transition:
                  "width 160ms ease",
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
