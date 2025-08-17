import { useEffect, useRef } from 'react';

function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Global speed factor (smaller = slower)
    const SPEED_FACTOR = 0.3;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = window.innerWidth < 640 ? 50 : 100;
    const colors = ['#22d3ee', '#a3e635', '#e0e7ff'];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.isOrb = Math.random() < 0.2;
      }

      update() {
        this.x += this.speedX * SPEED_FACTOR;
        this.y += this.speedY * SPEED_FACTOR;
        if (this.isOrb) {
          this.opacity = 0.3 + Math.sin(Date.now() * 0.002 * SPEED_FACTOR) * 0.2;
        }
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        if (
          this.x < -50 ||
          this.x > canvas.width + 50 ||
          this.y < -50 ||
          this.y > canvas.height + 50
        ) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        if (this.isOrb) {
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(
            this.color.slice(3, 5),
            16
          )}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.opacity})`;
          ctx.shadowBlur = 20;
          ctx.shadowColor = this.color;
        } else {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Comet system
    const comets = [];
    const cometCount = window.innerWidth < 640 ? 2 : 5;

    class Comet {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.length = Math.random() * 30 + 20;
        this.speed = Math.random() * 5 + 5;
        this.angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed * SPEED_FACTOR;
        this.y += Math.sin(this.angle) * this.speed * SPEED_FACTOR;
        this.opacity -= 0.005 * SPEED_FACTOR;
        if (
          this.opacity <= 0 ||
          this.x > canvas.width + 50 ||
          this.y > canvas.height + 50
        ) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(
          this.color.slice(3, 5),
          16
        )}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Shape system
    const shapes = [];
    const shapeCount = window.innerWidth < 640 ? 3 : 6;

    class Shape {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.sides = Math.floor(Math.random() * 3) + 3;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.rotation = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX * SPEED_FACTOR;
        this.y += this.speedY * SPEED_FACTOR;
        this.rotation += 0.02 * SPEED_FACTOR;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
          const angle = (Math.PI * 2 * i) / this.sides + this.rotation;
          const x = this.x + this.size * Math.cos(angle);
          const y = this.y + this.size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Initialize particles, comets, shapes
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    for (let i = 0; i < cometCount; i++) comets.push(new Comet());
    for (let i = 0; i < shapeCount; i++) shapes.push(new Shape());

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      comets.forEach((c) => {
        c.update();
        c.draw();
      });
      shapes.forEach((s) => {
        s.update();
        s.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-animation">
      <canvas ref={canvasRef}></canvas>
      <div className="wave"></div>
    </div>
  );
}

export default BackgroundAnimation;
