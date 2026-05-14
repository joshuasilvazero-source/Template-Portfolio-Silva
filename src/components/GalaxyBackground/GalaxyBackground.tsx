'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !mountRef.current) return;
    const mount = mountRef.current;
    const isMobile = window.innerWidth < 768;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.FogExp2(0x000510, 0.002);

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 600);
    camera.position.set(0, 18, 58);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ── Galaxy spiral star field ──────────────────────────────────────────────
    const STAR_COUNT = isMobile ? 6000 : 14000;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);

    const cCenter = new THREE.Color(0xffffff);
    const cMid    = new THREE.Color(0x6688ff);
    const cOuter  = new THREE.Color(0x9955ff);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 110 + 4;
      const arms = 3;
      const spinAngle  = radius * 0.28;
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;

      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 5;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.8;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 5;

      starPos[i3]     = Math.cos(branchAngle + spinAngle) * radius + rx;
      starPos[i3 + 1] = ry;
      starPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

      const t = Math.min(radius / 110, 1);
      const mixed = t < 0.5
        ? cCenter.clone().lerp(cMid,   t * 2)
        : cMid.clone().lerp(cOuter, (t - 0.5) * 2);
      starCol[i3]     = mixed.r;
      starCol[i3 + 1] = mixed.g;
      starCol[i3 + 2] = mixed.b;
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeom.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));

    const galaxyGroup = new THREE.Group();
    galaxyGroup.add(new THREE.Points(starGeom, new THREE.PointsMaterial({
      size: 0.33, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true,
    })));
    galaxyGroup.position.set(8, -18, -75);
    galaxyGroup.rotation.x = 0.28;
    scene.add(galaxyGroup);

    // ── Background scattered stars (close) ────────────────────────────────────
    const BG_COUNT = isMobile ? 800 : 2000;
    const bgPos = new Float32Array(BG_COUNT * 3);
    for (let i = 0; i < BG_COUNT; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * 400;
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      bgPos[i * 3 + 2] = -5 - Math.random() * 200;
    }
    const bgGeom = new THREE.BufferGeometry();
    bgGeom.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    scene.add(new THREE.Points(bgGeom, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.12, transparent: true, opacity: 0.55, sizeAttenuation: true,
    })));

    // ── Nebula clouds ─────────────────────────────────────────────────────────
    const nebulaDefs = [
      { x: -38, y: 12,  z: -128, color: 0x3366ff, count: isMobile ? 500 : 1200, spread: 22 },
      { x:  45, y: -7,  z: -155, color: 0x7733ff, count: isMobile ? 500 : 1200, spread: 18 },
      { x:  -6, y: 24,  z: -190, color: 0x00ddcc, count: isMobile ? 350 : 950,  spread: 15 },
      { x:  25, y: 35,  z: -210, color: 0xff4488, count: isMobile ? 250 : 700,  spread: 12 },
    ];
    nebulaDefs.forEach(({ x, y, z, color, count, spread }) => {
      const nPos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(Math.random() * 2 - 1);
        const r     = Math.pow(Math.random(), 0.55) * spread;
        nPos[i * 3]     = x + Math.sin(phi) * Math.cos(theta) * r;
        nPos[i * 3 + 1] = y + Math.cos(phi) * r * 0.38;
        nPos[i * 3 + 2] = z + Math.sin(phi) * Math.sin(theta) * r;
      }
      const ng = new THREE.BufferGeometry();
      ng.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
      scene.add(new THREE.Points(ng, new THREE.PointsMaterial({
        color, size: 0.65, transparent: true, opacity: 0.22, sizeAttenuation: true,
      })));
    });

    // ── Black hole ────────────────────────────────────────────────────────────
    const BH = new THREE.Vector3(6, 2, -52);

    // Dark core
    const holeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    holeMesh.position.copy(BH);
    scene.add(holeMesh);

    // Inner glow atmosphere
    const atmoMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x1144ff, transparent: true, opacity: 0.09, side: THREE.BackSide }),
    );
    atmoMesh.position.copy(BH);
    scene.add(atmoMesh);

    // Outer glow atmosphere
    const outerAtmo = new THREE.Mesh(
      new THREE.SphereGeometry(9, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x220055, transparent: true, opacity: 0.04, side: THREE.BackSide }),
    );
    outerAtmo.position.copy(BH);
    scene.add(outerAtmo);

    // Accretion disk rings
    const diskGroup = new THREE.Group();
    diskGroup.position.copy(BH);
    type DiskRing = { mesh: THREE.Mesh; rs: number };
    const diskRings: DiskRing[] = [
      { r: 5.8,  tube: 0.10, color: 0xffffff, op: 0.95, tiltX: 0.16, tiltZ: 0.04, rs: 0.030 },
      { r: 7.2,  tube: 0.52, color: 0xffcc44, op: 0.82, tiltX: 0.18, tiltZ: 0.06, rs: 0.021 },
      { r: 9.6,  tube: 0.90, color: 0xff5500, op: 0.62, tiltX: 0.20, tiltZ: 0.08, rs: 0.014 },
      { r: 12.2, tube: 1.28, color: 0xaa22ee, op: 0.40, tiltX: 0.22, tiltZ: 0.10, rs: 0.009 },
      { r: 15.8, tube: 1.65, color: 0x440088, op: 0.20, tiltX: 0.25, tiltZ: 0.12, rs: 0.005 },
    ].map(r => {
      const tg  = new THREE.TorusGeometry(r.r, r.tube, 16, 128);
      const mat = new THREE.MeshBasicMaterial({ color: r.color, transparent: true, opacity: r.op });
      const torus = new THREE.Mesh(tg, mat);
      torus.rotation.x = r.tiltX;
      torus.rotation.z = r.tiltZ;
      diskGroup.add(torus);
      return { mesh: torus, rs: r.rs };
    });
    scene.add(diskGroup);

    // ── Swirl particles (pulled into black hole) ──────────────────────────────
    const SW = isMobile ? 200 : 550;
    const swArr = new Float32Array(SW * 3);
    const swAng = new Float32Array(SW);
    const swRad = new Float32Array(SW);
    const swSpd = new Float32Array(SW);
    const swY   = new Float32Array(SW);
    for (let i = 0; i < SW; i++) {
      swAng[i] = Math.random() * Math.PI * 2;
      swRad[i] = 17 + Math.random() * 20;
      swSpd[i] = 0.005 + Math.random() * 0.009;
      swY[i]   = BH.y + (Math.random() - 0.5) * 2.5;
    }
    const swGeom = new THREE.BufferGeometry();
    swGeom.setAttribute('position', new THREE.BufferAttribute(swArr, 3));
    scene.add(new THREE.Points(swGeom, new THREE.PointsMaterial({
      color: 0x88bbff, size: 0.16, transparent: true, opacity: 0.55, sizeAttenuation: true,
    })));

    // ── Cosmic dust ───────────────────────────────────────────────────────────
    const DC = isMobile ? 1200 : 3000;
    const dustPos = new Float32Array(DC * 3);
    for (let i = 0; i < DC; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 300;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      dustPos[i * 3 + 2] = -12 - Math.random() * 300;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    scene.add(new THREE.Points(dustGeom, new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.07, transparent: true, opacity: 0.28, sizeAttenuation: true,
    })));

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1133, 2));

    const bhLight = new THREE.PointLight(0x4488ff, 9, 100);
    bhLight.position.copy(BH);
    scene.add(bhLight);

    const diskLight = new THREE.PointLight(0xff8800, 4.5, 70);
    diskLight.position.set(BH.x + 9, BH.y + 2, BH.z);
    scene.add(diskLight);

    const nebLight = new THREE.PointLight(0x5533ff, 3, 130);
    nebLight.position.set(-38, 12, -130);
    scene.add(nebLight);

    const pinkLight = new THREE.PointLight(0xff3388, 2, 100);
    pinkLight.position.set(25, 35, -150);
    scene.add(pinkLight);

    // ── Mouse + resize ────────────────────────────────────────────────────────
    const mouse  = { x: 0, y: 0 };
    const camT   = { x: 0, y: 18 };

    const onMouse  = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    let frameId: number;
    let t = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      galaxyGroup.rotation.y += 0.00007;

      diskRings.forEach(({ mesh, rs }) => { mesh.rotation.z += rs; });

      bhLight.intensity   = 8   + Math.sin(t * 0.7)  * 3;
      diskLight.intensity = 4   + Math.sin(t * 1.1 + 1) * 2;

      // Swirl particles spiral inward
      const sA = swGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < SW; i++) {
        swAng[i] += swSpd[i];
        swRad[i] -= 0.014;
        if (swRad[i] < 5.0) {
          swRad[i] = 17 + Math.random() * 20;
          swAng[i] = Math.random() * Math.PI * 2;
          swY[i]   = BH.y + (Math.random() - 0.5) * 2.5;
        }
        sA[i * 3]     = BH.x + Math.cos(swAng[i]) * swRad[i];
        sA[i * 3 + 1] = swY[i];
        sA[i * 3 + 2] = BH.z + Math.sin(swAng[i]) * swRad[i];
      }
      swGeom.attributes.position.needsUpdate = true;

      // Smooth mouse parallax
      camT.x += (mouse.x * 5  - camT.x) * 0.028;
      camT.y += (18 + mouse.y * 2 - camT.y) * 0.028;
      camera.position.x = camT.x;
      camera.position.y = camT.y + Math.sin(t * 0.22) * 0.15;
      camera.lookAt(camT.x * 0.12, 1, -28);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={mountRef}
      className='fixed inset-0 -z-10 h-screen w-screen overflow-hidden'
      style={{ pointerEvents: 'none' }}
    />
  );
};
