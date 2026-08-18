import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThemeTokens } from "../context/theme-context";

export default function ThreeScene({ sectionIndex }) {
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
    const scene3d = theme.design.scene ?? {};
    const count = scene3d.particleCount ?? 160;
    const rise = scene3d.particleRise ?? 0.015;
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
        size: scene3d.particleSize ?? 0.7,
        depthWrite: false,
        color: 0xffffff,
      })
    );

    const sweep = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 26),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(scene3d.sweepColor ?? "#2e140b"),
        transparent: true,
        opacity: 0,
      })
    );

    sweep.position.z = -7;
    scene.add(pointCloud);
    scene.add(sweep);

    // Capping at 2 keeps a full-screen canvas cheap on 3x displays.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        pointPositions[i * 3 + 1] += rise;
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
  }, [theme.assets.ui.particleSprite, theme.design.scene]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    targetZRef.current = sectionIndex * -0.85;
    scene.userData.triggerSweep?.();
  }, [sectionIndex]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}
