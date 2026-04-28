'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StarfieldBackdropProps {
  className?: string;
  enableParallax?: boolean;
}

export function StarfieldBackdrop({ className, enableParallax = false }: StarfieldBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: false,
      antialias: true,
      precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const createStarConstellation = () => {
      const geometry = new THREE.BufferGeometry();
      const starCount = 800;

      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const distance = Math.random() * 600 - 100;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() ** 0.5 * 400;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = distance;

        const brightness = Math.random();
        const colorChoice = Math.random();

        if (brightness < 0.1) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0.95;
        } else if (colorChoice < 0.6) {
          const whiteVariation = 0.8 + Math.random() * 0.2;
          colors[i * 3] = whiteVariation;
          colors[i * 3 + 1] = whiteVariation;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.8) {
          colors[i * 3] = 0.7 + Math.random() * 0.3;
          colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.95) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
        } else {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;
          colors[i * 3 + 2] = 0.4 + Math.random() * 0.2;
        }

        const sizeRandom = Math.random();
        if (sizeRandom < 0.7) {
          sizes[i] = Math.random() * 1.5;
        } else if (sizeRandom < 0.95) {
          sizes[i] = Math.random() * 2.5 + 0.5;
        } else {
          sizes[i] = Math.random() * 3.5 + 1.5;
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85
      });

      return new THREE.Points(geometry, material);
    };

    const stars = createStarConstellation();
    scene.add(stars);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b9d, 0.6);
    pointLight1.position.set(200, 200, 200);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd700, 0.5);
    pointLight2.position.set(-200, -200, 200);
    scene.add(pointLight2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (enableParallax) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      stars.rotation.x += 0.00005;
      stars.rotation.y += 0.0001;
      stars.rotation.z += 0.00003;

      if (enableParallax) {
        camera.position.x = mouseRef.current.x * 80;
        camera.position.y = mouseRef.current.y * 80;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (enableParallax) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      stars.geometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [enableParallax]);

  return <canvas ref={canvasRef} className={className} />;
}
