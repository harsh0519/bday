// 'use client';

// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// interface StarfieldBackdropProps {
//   className?: string;
//   enableParallax?: boolean;
// }

// export function StarfieldBackdrop({ className, enableParallax = false }: StarfieldBackdropProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const mouseRef = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a0008);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       5000
//     );
//     camera.position.z = 200;

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       alpha: false,
//       antialias: true,
//       precision: 'highp'
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     rendererRef.current = renderer;

//     const createStarConstellation = () => {
//       const geometry = new THREE.BufferGeometry();
//       const starCount = 800;

//       const positions = new Float32Array(starCount * 3);
//       const colors = new Float32Array(starCount * 3);
//       const sizes = new Float32Array(starCount);

//       for (let i = 0; i < starCount; i++) {
//         const distance = Math.random() * 600 - 100;
//         const angle = Math.random() * Math.PI * 2;
//         const radius = Math.random() ** 0.5 * 400;

//         positions[i * 3] = Math.cos(angle) * radius;
//         positions[i * 3 + 1] = Math.sin(angle) * radius;
//         positions[i * 3 + 2] = distance;

//         // const brightness = Math.random();
//         // const colorChoice = Math.random();

//         // if (brightness < 0.1) {
//         //   colors[i * 3] = 1;
//         //   colors[i * 3 + 1] = 1;
//         //   colors[i * 3 + 2] = 0.95;
//         // } else if (colorChoice < 0.6) {
//         //   const whiteVariation = 0.8 + Math.random() * 0.2;
//         //   colors[i * 3] = whiteVariation;
//         //   colors[i * 3 + 1] = whiteVariation;
//         //   colors[i * 3 + 2] = 1;
//         // } else if (colorChoice < 0.8) {
//         //   colors[i * 3] = 0.7 + Math.random() * 0.3;
//         //   colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
//         //   colors[i * 3 + 2] = 1;
//         // } else if (colorChoice < 0.95) {
//         //   colors[i * 3] = 1;
//         //   colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
//         //   colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
//         // } else {
//         //   colors[i * 3] = 1;
//         //   colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
//         //   colors[i * 3 + 2] = 0.4 + Math.random() * 0.2;
//         // }
// const brightness = 0.6 + Math.random() * 0.4; // 0.6–1.0 range so no star is too dim
// const colorChoice = Math.random();

// if (colorChoice < 0.35) {
//   // Pink #ff6b9d with brightness variation
//   colors[i * 3] = brightness;
//   colors[i * 3 + 1] = 0.42 * brightness;
//   colors[i * 3 + 2] = 0.62 * brightness;
// } else if (colorChoice < 0.6) {
//   // Soft pink variation with brightness
//   colors[i * 3] = brightness;
//   colors[i * 3 + 1] = (0.55 + Math.random() * 0.15) * brightness;
//   colors[i * 3 + 2] = (0.7 + Math.random() * 0.15) * brightness;
// } else if (colorChoice < 0.8) {
//   // Gold #ffd700 with brightness variation
//   colors[i * 3] = brightness;
//   colors[i * 3 + 1] = 0.84 * brightness;
//   colors[i * 3 + 2] = 0 * brightness;
// } else if (colorChoice < 0.92) {
//   // Warm gold variation with brightness
//   colors[i * 3] = brightness;
//   colors[i * 3 + 1] = (0.75 + Math.random() * 0.15) * brightness;
//   colors[i * 3 + 2] = (0.1 + Math.random() * 0.15) * brightness;
// } else {
//   // White sparkle — brightness still varies so not all identical
//   colors[i * 3] = brightness;
//   colors[i * 3 + 1] = brightness;
//   colors[i * 3 + 2] = brightness;
// }
//         const sizeRandom = Math.random();
//         if (sizeRandom < 0.7) {
//           sizes[i] = Math.random() * 1.5;
//         } else if (sizeRandom < 0.95) {
//           sizes[i] = Math.random() * 2.5 + 0.5;
//         } else {
//           sizes[i] = Math.random() * 3.5 + 1.5;
//         }
//       }

//       geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//       geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

//       const material = new THREE.PointsMaterial({
//         size: 2,
//         vertexColors: true,
//         sizeAttenuation: true,
//         transparent: true,
//         opacity: 0.85
//       });

//       return new THREE.Points(geometry, material);
//     };

//     const stars = createStarConstellation();
//     scene.add(stars);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);

//     const pointLight1 = new THREE.PointLight(0xff6b9d, 0.6);
//     pointLight1.position.set(200, 200, 200);
//     scene.add(pointLight1);

//     const pointLight2 = new THREE.PointLight(0xffd700, 0.5);
//     pointLight2.position.set(-200, -200, 200);
//     scene.add(pointLight2);

//     const handleMouseMove = (e: MouseEvent) => {
//       mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//       mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     };

//     if (enableParallax) {
//       window.addEventListener('mousemove', handleMouseMove);
//     }

//     let animationFrameId: number;
//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       stars.rotation.x += 0.00005;
//       stars.rotation.y += 0.0001;
//       stars.rotation.z += 0.00003;

//       if (enableParallax) {
//         camera.position.x = mouseRef.current.x * 80;
//         camera.position.y = mouseRef.current.y * 80;
//         camera.lookAt(0, 0, 0);
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (enableParallax) {
//         window.removeEventListener('mousemove', handleMouseMove);
//       }
//       cancelAnimationFrame(animationFrameId);
//       stars.geometry.dispose();
//       (stars.material as THREE.Material).dispose();
//       renderer.dispose();
//     };
//   }, [enableParallax]);

//   return <canvas ref={canvasRef} className={className} />;
// }
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StarfieldBackdropProps {
  className?: string;
  enableParallax?: boolean;
}

export function StarfieldBackdrop({ className, enableParallax = false }: StarfieldBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: false,
      antialias: true,
      precision: 'highp',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // ── Starfield ────────────────────────────────────────────────
    const createStarConstellation = () => {
      const geometry  = new THREE.BufferGeometry();
      const starCount = 800;
      const positions = new Float32Array(starCount * 3);
      const colors    = new Float32Array(starCount * 3);
      const sizes     = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const distance = Math.random() * 600 - 100;
        const angle    = Math.random() * Math.PI * 2;
        const radius   = Math.random() ** 0.5 * 400;

        positions[i * 3]     = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = distance;

        const brightness  = 0.6 + Math.random() * 0.4;
        const colorChoice = Math.random();

        if (colorChoice < 0.35) {
          colors[i * 3] = brightness; colors[i * 3 + 1] = 0.42 * brightness; colors[i * 3 + 2] = 0.62 * brightness;
        } else if (colorChoice < 0.6) {
          colors[i * 3] = brightness; colors[i * 3 + 1] = (0.55 + Math.random() * 0.15) * brightness; colors[i * 3 + 2] = (0.7 + Math.random() * 0.15) * brightness;
        } else if (colorChoice < 0.8) {
          colors[i * 3] = brightness; colors[i * 3 + 1] = 0.84 * brightness; colors[i * 3 + 2] = 0;
        } else if (colorChoice < 0.92) {
          colors[i * 3] = brightness; colors[i * 3 + 1] = (0.75 + Math.random() * 0.15) * brightness; colors[i * 3 + 2] = (0.1 + Math.random() * 0.15) * brightness;
        } else {
          colors[i * 3] = brightness; colors[i * 3 + 1] = brightness; colors[i * 3 + 2] = brightness;
        }

        const sizeRandom = Math.random();
        sizes[i] = sizeRandom < 0.7 ? Math.random() * 1.5 : sizeRandom < 0.95 ? Math.random() * 2.5 + 0.5 : Math.random() * 3.5 + 1.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
      geometry.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

      return new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 2, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.85,
      }));
    };

    // ── Shooting Star trail mesh builder ─────────────────────────
    // Each trail is a ribbon mesh — for each history point we emit
    // two vertices offset perpendicular to the travel direction,
    // one on each side. Colors go: blue edge → white center → blue edge
    // Length-wise: white near head, blue near tail end.

    const SHOOTING_STAR_COUNT = 5;
    const TRAIL_LENGTH        = 100; // number of spine points
    // Each segment = 2 verts * 3 rows (center + 2 edges) = ribbon
    // We use 3 rows across width: edge-L, center, edge-R
    const ROWS   = 3;  // left-blue, center-white, right-blue
    const VERTS  = TRAIL_LENGTH * ROWS;
    const FACES  = (TRAIL_LENGTH - 1) * (ROWS - 1) * 2; // tris

    const buildTrailGeometry = () => {
      const geo       = new THREE.BufferGeometry();
      const positions = new Float32Array(VERTS * 3);
      const colors    = new Float32Array(VERTS * 3);
      const indices   = [];

      // Build index buffer — static, positions update each frame
      for (let seg = 0; seg < TRAIL_LENGTH - 1; seg++) {
        for (let row = 0; row < ROWS - 1; row++) {
          const a = seg * ROWS + row;
          const b = seg * ROWS + row + 1;
          const c = (seg + 1) * ROWS + row;
          const d = (seg + 1) * ROWS + row + 1;
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
      geo.setIndex(indices);
      return geo;
    };

    const updateTrailMesh = (
      geo: THREE.BufferGeometry,
      history: { x: number; y: number; z: number }[],
      activeCount: number // how many spine points to draw
    ) => {
      const pos    = geo.attributes.position.array as Float32Array;
      const col    = geo.attributes.color.array    as Float32Array;
      const half   = 2.5; // half-width of ribbon in scene units

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const t     = i / (TRAIL_LENGTH - 1); // 0=head 1=tail
        const pt    = history[i] ?? history[history.length - 1] ?? { x: 0, y: 0, z: 0 };

        // Perpendicular direction — use next/prev point to find tangent
        const next  = history[Math.max(0, i - 1)] ?? pt;
        const prev  = history[Math.min(history.length - 1, i + 1)] ?? pt;
        const dx    = next.x - prev.x;
        const dy    = next.y - prev.y;
        const len   = Math.sqrt(dx * dx + dy * dy) || 1;
        // Perpendicular = rotate tangent 90°
        const px    = -dy / len;
        const py    =  dx / len;

        // Width tapers: fat near head, thin at tail
        const width = half * (1 - t * 0.7);

        // Row 0 = left edge, Row 1 = center, Row 2 = right edge
        const offsets = [-width, 0, width];

        for (let row = 0; row < ROWS; row++) {
          const vi  = (i * ROWS + row) * 3;
          const off = offsets[row];

          pos[vi]     = pt.x + px * off;
          pos[vi + 1] = pt.y + py * off;
          pos[vi + 2] = pt.z;

          // Color: length-wise (head=white, tail=blue)
          // and width-wise (center=white, edges=blue)
          const lengthBlend = t;          // 0=head(white) → 1=tail(blue)
          const widthBlend  = Math.abs(off / (width || 1)); // 0=center → 1=edge

          // Combine: center+head = pure white, edge+tail = deep blue
          const whiteness = (1 - lengthBlend) * (1 - widthBlend * 0.8);

          // R: white center fades to 0 at blue tail edges
          col[vi]     = whiteness;
          // G: same
          col[vi + 1] = whiteness;
          // B: always present, stronger at edges and tail
          col[vi + 2] = 0.4 + widthBlend * 0.6 + lengthBlend * 0.3;
          // clamp B
          col[vi + 2] = Math.min(1, col[vi + 2]);
        }
      }

      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate    = true;

      // Draw only the segments we have history for
      const segCount = Math.max(0, activeCount - 1);
      geo.setDrawRange(0, segCount * (ROWS - 1) * 2 * 3); // tris * 3 indices
    };

    // ── Shooting star state ──────────────────────────────────────
    const shootingStarData = Array.from({ length: SHOOTING_STAR_COUNT }, () => ({
      speed:       Math.random() * 250 + 100,
      delay:       Math.random() * 6,
      headX:       Math.random() * 800 - 200,
      headY:       Math.random() * 200 + 150,
      headZ:       Math.random() * 100  - 50,
      dirX:      -(Math.random() * 0.6  + 0.5),
      dirY:      -(Math.random() * 0.3  + 0.15),
      history:     [] as { x: number; y: number; z: number }[],
      active:      false,
      dying:       false,
      headScale:   0,
      headOpacity: 0,
    }));

    const createShootingStars = () => {
      const group = new THREE.Group();

      for (let s = 0; s < SHOOTING_STAR_COUNT; s++) {
        // Trail ribbon mesh
        const trailGeo = buildTrailGeometry();
        const trailMat = new THREE.MeshBasicMaterial({
          vertexColors: true,
          transparent:  true,
          opacity:      0.95,
          blending:     THREE.AdditiveBlending,
          depthWrite:   false,
          side:         THREE.DoubleSide,
        });
        const trailMesh = new THREE.Mesh(trailGeo, trailMat);

        // Head: canvas radial gradient → round sprite
        const hc  = document.createElement('canvas');
        hc.width  = 64;
        hc.height = 64;
        const ctx = hc.getContext('2d')!;
        const g   = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0,   'rgba(255,255,255,1)');
        g.addColorStop(0.25,'rgba(200,220,255,0.9)');
        g.addColorStop(0.6, 'rgba(80,120,255,0.4)');
        g.addColorStop(1,   'rgba(20,40,180,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();

        const headGeo = new THREE.BufferGeometry();
        headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));

        const headMat = new THREE.PointsMaterial({
          size: 10, map: new THREE.CanvasTexture(hc),
          transparent: true, opacity: 0,
          blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
        });

        const starGroup = new THREE.Group();
        starGroup.add(trailMesh);                    // index 0
        starGroup.add(new THREE.Points(headGeo, headMat)); // index 1
        group.add(starGroup);
      }

      return group;
    };

    // ── Scene setup ──────────────────────────────────────────────
    const stars         = createStarConstellation();
    const shootingGroup = createShootingStars();
    scene.add(stars);
    scene.add(shootingGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pl1 = new THREE.PointLight(0xff6b9d, 0.6); pl1.position.set(200, 200, 200); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xffd700, 0.5); pl2.position.set(-200, -200, 200); scene.add(pl2);

    // ── Mouse parallax ───────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (enableParallax) window.addEventListener('mousemove', handleMouseMove);

    // ── Animate ──────────────────────────────────────────────────
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now       = performance.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime        = now;

      stars.rotation.x += 0.00005;
      stars.rotation.y += 0.0001;
      stars.rotation.z += 0.00003;

      shootingGroup.children.forEach((starGroup, i) => {
        const data      = shootingStarData[i];
        const trailMesh = starGroup.children[0] as THREE.Mesh;
        const head      = starGroup.children[1] as THREE.Points;
        const headMat   = head.material as THREE.PointsMaterial;

        // ── Waiting ─────────────────────────────────────────────
        if (!data.active && !data.dying) {
          data.delay -= deltaTime;
          if (data.delay > 0) return;
          data.active = true; data.headScale = 0; data.headOpacity = 0;
        }

        // ── Dying: retract tail, fade head with it ───────────────
        if (data.dying) {
          if (data.history.length > 0) {
            data.history.pop();
            if (data.history.length > 0) data.history.pop();

            updateTrailMesh(trailMesh.geometry as THREE.BufferGeometry, data.history, data.history.length);

            const p = data.history.length / TRAIL_LENGTH;
            headMat.opacity = p * 0.95;
          } else {
            headMat.opacity  = 0;
            data.headX       = Math.random() * 800 - 200;
            data.headY       = Math.random() * 200 + 150;
            data.headZ       = Math.random() * 100  - 50;
            data.speed       = Math.random() * 250 + 100;
            data.dirX        = -(Math.random() * 0.6 + 0.5);
            data.dirY        = -(Math.random() * 0.3 + 0.15);
            data.delay       = Math.random() * 8;
            data.active      = false;
            data.dying       = false;
            data.headScale   = 0;
            data.headOpacity = 0;
            data.history     = [];
          }
          return;
        }

        // ── Active ───────────────────────────────────────────────
        data.headX += data.dirX * data.speed * deltaTime;
        data.headY += data.dirY * data.speed * deltaTime;

        data.headScale   = Math.min(1, data.headScale + deltaTime / 0.3);
        data.headOpacity = data.headScale * 0.95;

        const pulse     = 1 + Math.sin(now * 0.008) * 0.12;
        headMat.size    = data.headScale * 10 * pulse;
        headMat.opacity = data.headOpacity;

        const headPos   = head.geometry.attributes.position.array as Float32Array;
        headPos[0] = data.headX; headPos[1] = data.headY; headPos[2] = data.headZ;
        head.geometry.attributes.position.needsUpdate = true;

        data.history.unshift({ x: data.headX, y: data.headY, z: data.headZ });
        if (data.history.length > TRAIL_LENGTH) data.history.pop();

        updateTrailMesh(trailMesh.geometry as THREE.BufferGeometry, data.history, data.history.length);

        if (data.headX < -600 || data.headY < -400) {
          data.active = false;
          data.dying  = true;
        }
      });

      if (enableParallax) {
        camera.position.x = mouseRef.current.x * 80;
        camera.position.y = mouseRef.current.y * 80;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ───────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      if (enableParallax) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      stars.geometry.dispose();
      (stars.material as THREE.Material).dispose();
      shootingGroup.children.forEach((sg) => {
        sg.children.forEach((c) => {
          (c as THREE.Mesh | THREE.Points).geometry.dispose();
          ((c as THREE.Mesh | THREE.Points).material as THREE.Material).dispose();
        });
      });
      renderer.dispose();
    };
  }, [enableParallax]);

  return <canvas ref={canvasRef} className={className} />;
}