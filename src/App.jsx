import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const IDLE_GIF =
  "https://i.pinimg.com/originals/ab/0f/af/ab0fafe8753a97c199a10b353ec6a8bb.gif";
const RUN_GIF = "/running.gif";

const SECTIONS = ["home", "about", "skills", "projects", "contact"];
const SECTION_BACKGROUNDS = [
  "/assets/backgrounds/home-konoha.jpg",
  "/assets/backgrounds/about-naruto.jpg",
  "/assets/backgrounds/skills-jutsu.jpg",
  "/assets/backgrounds/missions-cast.jpg",
  "/assets/backgrounds/contact-funny.jpg",
];
const HERO_PROFILE =
  "https://i.pinimg.com/736x/65/40/ec/6540eccd704245ae4d8a01874186887f.jpg";

const C = {
  ink: "#140b07",
  ember: "#9d2c12",
  sunset: "#d85a1a",
  gold: "#efc56c",
  sand: "#f3ddaf",
  leaf: "#3e5b2b",
  pine: "#182311",
  smoke: "rgba(12, 8, 6, 0.78)",
  panel: "rgba(26, 14, 10, 0.7)",
  line: "rgba(239, 197, 108, 0.18)",
  text: "#f6ecd4",
  muted: "#cfbf9b",
};

const F = {
  body: "'Oxanium', sans-serif",
  display: "'NinjaNaruto', 'Teko', sans-serif",
};

const SWAP_DELAY_MS = 380;
const RUN_DURATION_MS = 720;
const SCROLL_LOCK_MS = 900;

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

function NarutoWalker({ isRunning, direction }) {
  return (
    <div
      style={{
        width: isRunning ? "182px" : "164px",
        height: isRunning ? "150px" : "164px",
        overflow: "hidden",
        position: "relative",
        display: "block",
        transition: "width 160ms ease, height 160ms ease",
      }}
    >
      <img
        src={isRunning ? RUN_GIF : IDLE_GIF}
        alt="Naruto runner"
        style={{
          position: "absolute",
          width: isRunning ? "360px" : "164px",
          height: "auto",
          left: isRunning ? "-92px" : "0",
          top: isRunning ? "-38px" : "0",
          display: "block",
          transform: direction === "left" ? "scaleX(-1)" : "scaleX(1)",
          transformOrigin: "center center",
          mixBlendMode: isRunning ? "normal" : "multiply",
          filter: isRunning
            ? "drop-shadow(0 10px 18px rgba(0,0,0,0.62)) drop-shadow(0 0 14px rgba(216,90,26,0.28))"
            : "drop-shadow(0 10px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(216,90,26,0.3)) saturate(1.05) contrast(1.04)",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    </div>
  );
}

function SectionShell({ title, kicker, children }) {
  return (
    <section
      style={{
        width: "min(1120px, calc(100vw - 2.5rem))",
        minHeight: "min(70vh, 760px)",
        padding: "clamp(1.6rem, 2vw, 2.2rem)",
        border: `2px solid rgba(125, 75, 28, 0.72)`,
        borderRadius: "18px 42px 18px 42px",
        background:
          "linear-gradient(180deg, rgba(66,34,18,0.88) 0%, rgba(34,18,10,0.94) 100%)",
        boxShadow:
          "0 28px 80px rgba(0, 0, 0, 0.28), inset 0 0 0 2px rgba(239,197,108,0.08), inset 0 18px 30px rgba(255,182,85,0.05)",
        display: "grid",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        clipPath:
          "polygon(0 18px, 18px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 20px 100%, 0 calc(100% - 20px))",
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
      <div>
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
            fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
            lineHeight: 0.95,
            color: C.text,
            marginBottom: "1.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
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
  const [sectionIdx, setSectionIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] = useState("right");
  const [spriteX, setSpriteX] = useState(72);
  const [visible, setVisible] = useState(true);

  const sectionRef = useRef(0);
  const runningTimerRef = useRef(null);
  const swapTimerRef = useRef(null);
  const lockRef = useRef(false);
  const touchStartRef = useRef(null);
  const spriteXRef = useRef(72);

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
    setIsRunning(true);
    setSpriteX(nextX);
    spriteXRef.current = nextX;
    setVisible(false);
    setSectionIdx(nextIdx);
    sectionRef.current = nextIdx;

    window.clearTimeout(runningTimerRef.current);
    window.clearTimeout(swapTimerRef.current);

    runningTimerRef.current = window.setTimeout(() => {
      setIsRunning(false);
    }, RUN_DURATION_MS);

    swapTimerRef.current = window.setTimeout(() => {
      setDisplayIdx(nextIdx);
      setVisible(true);
    }, SWAP_DELAY_MS);

    window.setTimeout(() => {
      lockRef.current = false;
    }, SCROLL_LOCK_MS);
  }, []);

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 18) return;
      triggerTransition(sectionRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event) => {
      if (["ArrowDown", "PageDown", " ", "j"].includes(event.key)) {
        event.preventDefault();
        triggerTransition(sectionRef.current + 1);
      }
      if (["ArrowUp", "PageUp", "k"].includes(event.key)) {
        event.preventDefault();
        triggerTransition(sectionRef.current - 1);
      }
    };

    const onTouchStart = (event) => {
      touchStartRef.current = event.touches[0].clientY;
    };

    const onTouchEnd = (event) => {
      if (touchStartRef.current == null) return;
      const delta = touchStartRef.current - event.changedTouches[0].clientY;
      if (Math.abs(delta) > 36) {
        triggerTransition(sectionRef.current + (delta > 0 ? 1 : -1));
      }
      touchStartRef.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.clearTimeout(runningTimerRef.current);
      window.clearTimeout(swapTimerRef.current);
    };
  }, [triggerTransition]);

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
          backgroundImage: `linear-gradient(180deg, rgba(12,8,6,0.22), rgba(8,6,5,0.48)), url(${SECTION_BACKGROUNDS[displayIdx]})`,
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
          top: "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1120px, calc(100vw - 1.5rem))",
          zIndex: 30,
          padding: "0.75rem 1rem",
          borderRadius: "999px",
          border: `1px solid ${C.line}`,
          background: C.smoke,
          backdropFilter: "blur(14px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            fontFamily: F.display,
            fontSize: "1.5rem",
            letterSpacing: "0.12em",
            color: C.gold,
          }}
        >
          KONOHA.DEV
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
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
                padding: "0.45rem 0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontFamily: F.display,
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
          placeItems: "center",
          padding: "5.8rem 0.9rem 8.8rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.985)",
          transition: "opacity 320ms ease, transform 320ms ease",
        }}
      >
        {displayIdx === 0 && (
          <SectionShell
            title="Shinobi Software Engineer"
            kicker="Leaf Village Tech Corps"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.3fr) minmax(240px, 0.7fr)",
                gap: "1.6rem",
                alignItems: "center",
              }}
            >
              <div style={{ maxWidth: "720px" }}>
                <p
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    color: C.sand,
                    marginBottom: "0.8rem",
                  }}
                >
                  Nakshatra-kun is an Associate Software Engineer building
                  practical systems across Python, Flutter, SAP, and modern
                  developer tooling.
                </p>
                <p
                  style={{
                    color: C.muted,
                    lineHeight: 1.8,
                    maxWidth: "640px",
                    marginBottom: "1rem",
                  }}
                >
                  Since joining Yamaha Motor Solutions India Pvt. Ltd. in
                  January 2025 after graduating from J.C. Bose University of
                  Science and Technology, YMCA, I have been working on
                  enterprise software while balancing cloud-native thinking,
                  API-first design, and real-world product building across SAP
                  BTP, ABAP RAP, SAP HANA, and OData.
                </p>
                <p
                  style={{
                    color: C.muted,
                    lineHeight: 1.8,
                    maxWidth: "640px",
                    marginBottom: "1.4rem",
                  }}
                >
                  My strongest working zone blends Python, Flutter, and SAP,
                  while still extending comfortably into Go, FastAPI,
                  JavaScript, and C++. I like rapid prototyping, iterative
                  building, and using AI as a force multiplier without losing
                  touch with the underlying architecture, constraints, and
                  system behavior.
                </p>
                <div
                  style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}
                >
                  {[
                    ["View Missions", 3],
                    ["Ninja Profile", 1],
                    ["Contact", 4],
                  ].map(([label, idx]) => (
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
                  width: "min(100%, 290px)",
                  aspectRatio: "4 / 5",
                  borderRadius: "28px",
                  overflow: "hidden",
                  border: `1px solid ${C.line}`,
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={HERO_PROFILE}
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
          <SectionShell title="Ninja Profile" kicker="Character Sheet">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.9rem",
              }}
            >
              <StatCard label="Name" value="Nakshatra-kun" />
              <StatCard
                label="Alliance"
                value="Yamaha Motor Solutions India Pvt. Ltd."
              />
              <StatCard label="Village" value="Faridabad" />
              <StatCard label="Rank" value="Associate Software Engineer" />
              <StatCard label="Specialty" value="Python, Flutter, SAP" />
              <StatCard label="Status" value="1+ year at Yamaha" />
              <StatCard
                label="Current Arc"
                value="Enterprise software and developer-centric tools"
              />
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
              Nakshatra-kun focuses on practical, system-driven work rather than
              surface-level apps. His interests sit at the intersection of
              enterprise software, automation, AI-assisted development, and
              developer productivity, with emphasis on building systems that
              solve real, observable problems.
            </div>
          </SectionShell>
        )}

        {displayIdx === 2 && (
          <SectionShell title="Jutsu Arsenal" kicker="Power Levels">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.6rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: C.gold,
                    marginBottom: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  SAP and Enterprise
                </p>
                <SkillBar label="SAP ABAP" value={85} color={C.sunset} />
                <SkillBar label="SAP BTP" value={82} color={C.gold} />
                <SkillBar label="ABAP RAP" value={80} color={C.sand} />
                <SkillBar label="SAP HANA" value={74} color={C.leaf} />
                <SkillBar label="OData Services" value={76} color={C.ember} />
              </div>
              <div>
                <p
                  style={{
                    color: C.gold,
                    marginBottom: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  Main Battle Stack
                </p>
                <SkillBar label="Python / FastAPI" value={84} color="#4b8bbe" />
                <SkillBar label="Flutter" value={80} color="#4cc2ff" />
                <SkillBar label="Go" value={72} color="#5dc9e2" />
                <SkillBar label="JavaScript" value={78} color="#e9b949" />
                <SkillBar label="C++" value={70} color="#6b8cff" />
                <SkillBar label="Git" value={84} color="#f05032" />
              </div>
            </div>
          </SectionShell>
        )}

        {displayIdx === 3 && (
          <SectionShell title="Mission Board" kicker="Recent Arcs">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <MissionCard
                rank="S"
                title="UNLOOP"
                desc="A behavioral tracking and control system designed to reduce short-form content consumption across platforms like YouTube Shorts and Instagram Reels, handling real-time event detection, navigation tracking, scroll lag, multi-event batching, and inconsistent transitions in dynamic web flows."
                tags={["Behavior Tracking", "Realtime Events", "Automation"]}
              />
              <MissionCard
                rank="A"
                title="CLISKY"
                desc="An AI-powered CLI assistant that adapts to the user environment, including Linux distribution detection, and generates contextual command recommendations through a modular design with separate model and environment configuration layers."
                tags={["AI CLI", "Python", "Environment Aware"]}
              />
              <MissionCard
                rank="A"
                title="Gitroaster"
                desc="A fully developed and hosted tool that pulls GitHub profile data, analyzes repository activity and metadata, and generates context-aware, data-driven roasts by combining API integration, data processing, and generative AI output."
                tags={["GitHub API", "Data Processing", "Generative AI"]}
              />
            </div>
          </SectionShell>
        )}

        {displayIdx === 4 && (
          <SectionShell title="Hokage's Office" kicker="Send A Mission Brief">
            <div style={{ display: "grid", gap: "0.85rem", maxWidth: "620px" }}>
              <input
                type="text"
                placeholder="Nakshatra Chandna"
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
                placeholder="your@email.com"
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
                placeholder="Tell me about the project, role, or system you want to build."
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
                style={{
                  padding: "0.95rem 1.1rem",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  color: C.text,
                  background: `linear-gradient(90deg, ${C.ember}, ${C.sunset})`,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Summon Contact
              </button>
            </div>
          </SectionShell>
        )}
      </main>

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
            inset: "auto 0 18px 0",
            height: "22px",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0), rgba(239,197,108,0.4), rgba(216,90,26,0.52), rgba(239,197,108,0.4), rgba(0,0,0,0))",
            boxShadow: "0 0 28px rgba(216,90,26,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${spriteX}%`,
            bottom: "18px",
            width: isRunning ? "132px" : "110px",
            height: "28px",
            transform: "translateX(-50%)",
            transition:
              "left 680ms cubic-bezier(0.2, 0.9, 0.3, 1), width 160ms ease",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${spriteX}%`,
            bottom: isRunning ? "42px" : "5px",
            transform: "translateX(-50%)",
            transition: "left 680ms cubic-bezier(0.2, 0.9, 0.3, 1)",
          }}
        >
          <NarutoWalker isRunning={isRunning} direction={direction} />
        </div>
      </div>
    </div>
  );
}
