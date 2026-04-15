import * as THREE from 'three';

export function createStarField(count: number = 1000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  // Color palette
  const colorPalette = [
    { r: 1, g: 0.8, b: 1 }, // pink
    { r: 1, g: 1, b: 1 },     // white
    { r: 1, g: 0.84, b: 0 }   // gold
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;     // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z

    sizes[i] = Math.random() * 3 + 1;

    const colorIndex = Math.floor(Math.random() * colorPalette.length);
    colors[i * 3] = colorPalette[colorIndex].r;
    colors[i * 3 + 1] = colorPalette[colorIndex].g;
    colors[i * 3 + 2] = colorPalette[colorIndex].b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}

export function createParticles(particleCount: number = 500) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const lifetimes = new Float32Array(particleCount);

  const colorPalette = [
    { r: 1, g: 0.42, b: 0.61 },  // #ff6b9d
    { r: 1, g: 0.84, b: 0 }      // #ffd700
  ];

  for (let i = 0; i < particleCount; i++) {
    // Start at center
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.5 + 0.5;
    velocities[i * 3] = Math.cos(angle) * distance;
    velocities[i * 3 + 1] = Math.sin(angle) * distance;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

    // Random color
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Random lifetime
    lifetimes[i] = Math.random() * 2 + 1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  (points as any).velocities = velocities;
  (points as any).lifetimes = lifetimes;

  return points;
}

export function animateParticles(
  points: THREE.Points,
  deltaTime: number,
  gravity: number = 0.98
) {
  const velocities = (points as any).velocities as Float32Array;
  const lifetimes = (points as any).lifetimes as Float32Array;
  const positions = points.geometry.attributes.position.array as Float32Array;
  const count = positions.length / 3;

  for (let i = 0; i < count; i++) {
    // Apply velocity
    positions[i * 3] += velocities[i * 3] * deltaTime;
    positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime;
    positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime;

    // Apply gravity
    velocities[i * 3 + 1] -= gravity * deltaTime;

    // Decrease lifetime
    lifetimes[i] -= deltaTime;
  }

  (points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
}
