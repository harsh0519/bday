export function createConfetti(container: HTMLElement) {
  const confettiPieces = 50;
  const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#ffb6d9'];

  for (let i = 0; i < confettiPieces; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = container.offsetWidth / 2 + 'px';
    confetti.style.top = container.offsetHeight / 2 + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.opacity = '0.8';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';

    container.appendChild(confetti);

    const angle = (Math.PI * 2 * i) / confettiPieces;
    const velocity = 5 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 3;
    const gravity = 0.1;

    let x = container.offsetWidth / 2;
    let y = container.offsetHeight / 2;
    let life = 2;

    const animate = () => {
      x += vx;
      y += vy;
      vy += gravity;
      life -= 0.016;

      confetti.style.left = x + 'px';
      confetti.style.top = y + 'px';
      confetti.style.opacity = String(Math.max(0, life / 2));

      if (life > 0) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };

    animate();
  }
}

export function createBalloons(container: HTMLElement) {
  const balloonCount = 30;
  const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#ffb6d9', '#87ceeb'];

  for (let i = 0; i < balloonCount; i++) {
    const balloon = document.createElement('div');
    balloon.style.position = 'fixed';
    balloon.style.left = Math.random() * container.offsetWidth + 'px';
    balloon.style.bottom = '-50px';
    balloon.style.width = '20px';
    balloon.style.height = '30px';
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.borderRadius = '50% 50% 50% 0';
    balloon.style.opacity = '0.8';
    balloon.style.pointerEvents = 'none';
    balloon.style.zIndex = '999';

    container.appendChild(balloon);

    const startX = parseFloat(balloon.style.left);
    const duration = 3 + Math.random() * 2;
    const wobble = Math.random() * 100 - 50;
    let elapsed = 0;

    const animate = () => {
      elapsed += 0.016;
      const progress = elapsed / duration;

      if (progress < 1) {
        const newY = -50 + (container.offsetHeight + 100) * progress;
        const wobbleX = Math.sin(progress * Math.PI * 4) * wobble;

        balloon.style.bottom = newY + 'px';
        balloon.style.left = startX + wobbleX + 'px';
        balloon.style.opacity = String(Math.max(0, 0.8 - progress * 0.5));

        requestAnimationFrame(animate);
      } else {
        balloon.remove();
      }
    };

    animate();
  }
}
