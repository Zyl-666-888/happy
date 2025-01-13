class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.hue = Math.random() * 360;
        this.gravity = 0.08;
    }

    createRocket(startX, endX, endY) {
        const rocket = {
            x: startX,
            y: this.canvas.height,
            targetX: endX,
            targetY: endY,
            speed: 15,
            angle: Math.atan2(endY - this.canvas.height, endX - startX),
            trail: [],
            size: 3,
            hue: this.hue,
            brightness: 90,
            alpha: 1
        };
        this.rockets.push(rocket);
    }

    createParticles(x, y) {
        const particleCount = Math.floor(Math.random() * 50) + 30;
        const circles = Math.floor(Math.random() * 3) + 2;

        for (let circle = 0; circle < circles; circle++) {
            const radius = (circle + 1) * (Math.random() * 20 + 20);
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = radius / 5;
                const particle = {
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 3 + 1,
                    hue: this.hue + Math.random() * 20 - 10,
                    brightness: Math.random() * 20 + 80,
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.015,
                    drag: 0.98
                };
                this.particles.push(particle);
            }
        }
    }

    update() {
        // 更新火箭
        this.rockets.forEach((rocket, index) => {
            rocket.x += Math.cos(rocket.angle) * rocket.speed;
            rocket.y += Math.sin(rocket.angle) * rocket.speed;

            rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1 });
            if (rocket.trail.length > 20) rocket.trail.shift();

            const dx = rocket.targetX - rocket.x;
            const dy = rocket.targetY - rocket.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 15) {
                this.createParticles(rocket.x, rocket.y);
                this.rockets.splice(index, 1);
            }
        });

        // 更新粒子
        this.particles = this.particles.filter(particle => {
            particle.vx *= particle.drag;
            particle.vy *= particle.drag;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += this.gravity;
            particle.alpha -= particle.decay;

            return particle.alpha > 0;
        });
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制火箭
        this.rockets.forEach(rocket => {
            rocket.trail.forEach((point, index) => {
                const opacity = (index / rocket.trail.length) * rocket.alpha;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, rocket.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${rocket.hue}, 100%, ${rocket.brightness}%, ${opacity})`;
                this.ctx.fill();
            });
        });

        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
            this.ctx.fill();
        });
    }
}

const canvas = document.getElementById('fireworks');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = new Firework(canvas);

function animate() {
    if (Math.random() < 0.05) {
        const startX = Math.random() * canvas.width;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * (canvas.height * 0.6);
        fireworks.hue = Math.random() * 360;
        fireworks.createRocket(startX, endX, endY);
    }

    fireworks.update();
    fireworks.draw();

    requestAnimationFrame(animate);
}

animate();

canvas.addEventListener('click', (e) => {
    fireworks.hue = Math.random() * 360;
    const startX = e.clientX;
    fireworks.createRocket(startX, e.clientX, e.clientY);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}); 