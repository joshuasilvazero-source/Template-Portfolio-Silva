'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.8)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1400
    );

    camera.position.set(isMobile ? -4 : -10, 5.5, isMobile ? 58 : 72);

    const mouse = { x: 0, y: 0 };
    const camTarget = { x: isMobile ? -4 : -10, y: 5.5 };

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    function createStarLayer(
      count: number,
      spreadX: number,
      spreadY: number,
      depth: number,
      size: number,
      opacity: number,
      speed: number
    ) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const velocities = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] = (Math.random() - 0.5) * spreadX;
        positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i3 + 2] = -Math.random() * depth;

        velocities[i] = speed * (0.65 + Math.random() * 0.7);

        const type = Math.random();

        if (type < 0.68) {
          colors[i3] = 0.86;
          colors[i3 + 1] = 0.92;
          colors[i3 + 2] = 1.0;
        } else if (type < 0.9) {
          colors[i3] = 1.0;
          colors[i3 + 1] = 0.9;
          colors[i3 + 2] = 0.72;
        } else {
          colors[i3] = 1.0;
          colors[i3 + 1] = 0.58;
          colors[i3 + 2] = 0.36;
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.NormalBlending,
      });

      return {
        points: new THREE.Points(geometry, material),
        geometry,
        velocities,
        spreadX,
        spreadY,
      };
    }

    const farStars = createStarLayer(
      isMobile ? 1200 : 3200,
      1800,
      950,
      1400,
      0.26,
      0.48,
      0.018
    );

    const midStars = createStarLayer(
      isMobile ? 900 : 2400,
      1200,
      720,
      900,
      0.42,
      0.72,
      0.04
    );

    const nearStars = createStarLayer(
      isMobile ? 500 : 1300,
      750,
      460,
      520,
      0.7,
      0.9,
      0.085
    );

    scene.add(farStars.points, midStars.points, nearStars.points);

    const blackHoleGroup = new THREE.Group();

    blackHoleGroup.position.set(
      isMobile ? 6.5 : 26,
      isMobile ? 1.2 : 3,
      isMobile ? -22 : -24
    );

    blackHoleGroup.scale.setScalar(isMobile ? 0.82 : 1.08);
    scene.add(blackHoleGroup);

    const eventHorizon = new THREE.Mesh(
      new THREE.SphereGeometry(4.2, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );

    blackHoleGroup.add(eventHorizon);

    function createAccretionDisk(
      innerRadius: number,
      outerRadius: number,
      count: number,
      heightSpread: number,
      size: number,
      opacity: number
    ) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const hot = new THREE.Color(0xffffff);
      const gold = new THREE.Color(0xffc46a);
      const orange = new THREE.Color(0xff641c);
      const red = new THREE.Color(0x7a1608);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;

        const radius =
          innerRadius +
          Math.pow(Math.random(), 0.52) * (outerRadius - innerRadius);

        const radialT = (radius - innerRadius) / (outerRadius - innerRadius);

        const vertical =
          (Math.random() - 0.5) * heightSpread * (1 - radialT * 0.55);

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = vertical;
        positions[i3 + 2] = Math.sin(angle) * radius;

        const doppler = Math.sin(angle + Math.PI) * 0.5 + 0.5;
        const heat = Math.pow(1 - radialT, 1.35);

        const brightness = Math.min(
          1,
          heat * 0.72 + Math.pow(doppler, 2.6) * 0.6
        );

        const color =
          radialT < 0.22
            ? hot.clone().lerp(gold, radialT / 0.22)
            : radialT < 0.58
              ? gold.clone().lerp(orange, (radialT - 0.22) / 0.36)
              : orange.clone().lerp(red, (radialT - 0.58) / 0.42);

        colors[i3] = color.r * (0.55 + brightness);
        colors[i3 + 1] = color.g * (0.55 + brightness);
        colors[i3 + 2] = color.b * (0.55 + brightness);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        })
      );
    }

    const diskLayers = [
      createAccretionDisk(4.25, 6.2, isMobile ? 260 : 760, 0.22, 0.13, 0.95),
      createAccretionDisk(5.8, 9.8, isMobile ? 360 : 1100, 0.44, 0.12, 0.86),
      createAccretionDisk(9.0, 14.5, isMobile ? 280 : 850, 0.72, 0.11, 0.64),
      createAccretionDisk(13.0, 20.0, isMobile ? 180 : 520, 1.0, 0.1, 0.42),
    ];

    diskLayers.forEach((disk) => {
      disk.rotation.x = 0.38;
      disk.rotation.z = 0;
      disk.rotation.y = 0;
      blackHoleGroup.add(disk);
    });

    scene.add(new THREE.AmbientLight(0x050814, 1.25));

    const blackHoleLight = new THREE.PointLight(0xff9b38, 8.5, 95);
    blackHoleLight.position.copy(blackHoleGroup.position);
    scene.add(blackHoleLight);

    const textShineLight = new THREE.PointLight(0xffb15a, 3.8, 105);
    textShineLight.position.set(isMobile ? 7 : 13, 2, 8);
    scene.add(textShineLight);

    const blueFill = new THREE.PointLight(0x223cff, 2.4, 180);
    blueFill.position.set(-38, 20, -140);
    scene.add(blueFill);

    let raf: number;
    let t = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.01;

      const updateStarLayer = (
        layer: typeof farStars,
        limit: number,
        resetZ: number
      ) => {
        const arr = layer.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < arr.length; i += 3) {
          const index = i / 3;

          arr[i + 2] += layer.velocities[index];
          arr[i] += Math.sin(t + index * 0.017) * 0.0009;
          arr[i + 1] += Math.cos(t + index * 0.013) * 0.0009;

          if (arr[i + 2] > limit) {
            arr[i] = (Math.random() - 0.5) * layer.spreadX;
            arr[i + 1] = (Math.random() - 0.5) * layer.spreadY;
            arr[i + 2] = -resetZ;
          }
        }

        layer.geometry.attributes.position.needsUpdate = true;
      };

      updateStarLayer(farStars, 260, 1200);
      updateStarLayer(midStars, 180, 820);
      updateStarLayer(nearStars, 95, 520);

      farStars.points.rotation.y += 0.000025;
      midStars.points.rotation.y += 0.00006;
      nearStars.points.rotation.y += 0.00012;

      const diskSpeeds = [0.009, 0.006, 0.0036, 0.002];

      diskLayers.forEach((disk, index) => {
        disk.rotation.y += diskSpeeds[index] || 0.002;
      });

      blackHoleGroup.rotation.y += 0.00062;
      blackHoleGroup.rotation.x += 0.0001;

      blackHoleLight.intensity = 8.0 + Math.sin(t * 1.3) * 1.2;
      textShineLight.intensity = 3.7 + Math.sin(t * 1.1) * 0.8;

      blackHoleGroup.rotation.y +=
        (mouse.x * 0.012 - blackHoleGroup.rotation.y) * 0.006;

      blackHoleGroup.rotation.x +=
        (-mouse.y * 0.009 - blackHoleGroup.rotation.x) * 0.006;

      camTarget.x +=
        ((isMobile ? -4 : -10) + mouse.x * 1.8 - camTarget.x) * 0.016;

      camTarget.y +=
        (5.5 + mouse.y * 1.1 - camTarget.y) * 0.016;

      camera.position.x = camTarget.x;
      camera.position.y = camTarget.y + Math.sin(t * 0.18) * 0.08;

      camera.lookAt(isMobile ? -2 : -5, 0.5, -24);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();

          const material = object.material;

          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else {
            material.dispose();
          }
        }
      });

      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={mountRef}
        className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden"
        style={{ pointerEvents: 'none' }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[9]"
        style={{
          background:
            'radial-gradient(circle at 78% 42%, rgba(255,145,70,0.11), transparent 15%, rgba(255,145,70,0.03) 25%, transparent 42%)',
          filter: 'blur(18px)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[8]"
        style={{
          background:
            'radial-gradient(circle at 76% 44%, rgba(255,180,90,0.035), transparent 30%)',
          filter: 'blur(48px)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[7]"
        style={{
          background:
            'radial-gradient(circle at center, transparent 48%, rgba(0,0,0,0.68) 100%)',
        }}
      />
    </>
  );
}
