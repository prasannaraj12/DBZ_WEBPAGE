// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {

    // 1. Skew on Scroll Effect
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".glitch-text, .section-title", "skewY", "deg"),
        clamp = gsap.utils.clamp(-15, 15);

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -200);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                    skew: 0, 
                    duration: 0.8, 
                    ease: "power3", 
                    overwrite: true, 
                    onUpdate: () => skewSetter(proxy.skew)
                });
            }
        }
    });

    // 2. Word-by-Word Text Reveal
    document.querySelectorAll('.text-block p').forEach(p => {
        const text = p.innerText;
        p.innerHTML = text.split(' ').map(word => `<span class="reveal-word" style="opacity: 0.2; display: inline-block;">${word}</span>`).join(' ');
        
        gsap.to(p.querySelectorAll('.reveal-word'), {
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: p,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 1 
            }
        });
    });

    // 3. Hero Fade Out
    gsap.to(".hero-content", {
        y: 250,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom center",
            scrub: true
        }
    });

    // 4. Scouter Power Counter Animation
    const powerCounter = document.getElementById('power-counter');
    let dbzCounter = { val: 0 };
    
    ScrollTrigger.create({
        trigger: ".scouter-target",
        start: "top 80%",
        onEnter: () => {
            // Fill Bar
            gsap.to(".power-fill", {
                width: "100%",
                duration: 2.5,
                ease: "power4.out"
            });
            
            // Rapidly count up to Over 9000
            gsap.to(dbzCounter, {
                val: 9001,
                duration: 2.5,
                ease: "power3.inOut",
                onUpdate: function() {
                    powerCounter.innerHTML = Math.floor(this.targets()[0].val).toLocaleString();
                }
            });
        }
    });

    // 5. Parallax Custom elements
    gsap.utils.toArray("[data-speed]").forEach(el => {
        const speed = parseFloat(el.getAttribute("data-speed"));
        gsap.to(el, {
            y: -100 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 6. Stagger Warrior Cards
    gsap.from(".warrior-card", {
        y: 150,
        opacity: 0,
        rotationX: -45,
        transformOrigin: "top center",
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".cards-wrapper",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
    
    // 7. Dragon Radar Pop-in
    gsap.from(".dragon-radar", {
        scale: 0.5,
        opacity: 0,
        rotation: -45,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: "#lore",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    // 8. Cinematic Title Entry (Part of Hero Upgrade Request)
    gsap.from(".title-top", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".cinematic-title",
            start: "top 80%"
        }
    });

    gsap.from(".title-main", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".cinematic-title",
            start: "top 80%"
        }
    });

    gsap.from(".collection-slot", {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: {
            trigger: ".collection-bar",
            start: "top 90%"
        }
    });

    // Generate Super Saiyan Sparks dynamically
    const sparksContainer = document.getElementById('sparks-container');
    const MAX_SPARKS = 15;  // reduced from 30

    for (let i = 0; i < MAX_SPARKS; i++) {
        let spark = document.createElement('div');
        spark.classList.add('spark');
        // randomized starting positions and durations
        let left = Math.random() * 100;
        let duration = Math.random() * 2 + 1; // 1s to 3s
        let delay = Math.random() * 3;
        
        spark.style.left = `${left}%`;
        spark.style.animationDuration = `${duration}s`;
        spark.style.animationDelay = `${delay}s`;
        
        sparksContainer.appendChild(spark);
    }

    // Navbar Blur Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 12, 0.85)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '1rem 4rem';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(10,10,12,0.9), transparent)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 4rem';
        }
    });
};

// ─── Character Roster ────────────────────────────────────────────────────────
let allCharacters = [];

const buildCard = (char, index) => {
    const auras = ['ki-orange', 'ki-blue', 'ki-yellow'];
    const aura = auras[index % 3];
    const affiliation = char.affiliation || 'Unknown';
    const shortDesc = char.description
        ? char.description.substring(0, 120).replace(/"/g, "'") + '...'
        : 'A legendary warrior in the Dragon Ball universe.';
    return `
    <div class="warrior-card ki-aura ${aura}" data-affiliation="${affiliation}">
        <div class="card-inner">
            <div class="card-front">
                <img src="${char.image}" alt="${char.name}" class="card-char-img" loading="lazy">
                <h3>${char.name}</h3>
            </div>
            <div class="card-back" style="background: #0a1628; padding: 1.2rem; overflow-y: auto; justify-content: flex-start; align-items: flex-start; text-align: left;">
                <h4 style="-webkit-text-stroke: 0; font-size: 1.1rem; transform:none; font-style:normal; color: var(--primary-cyan); margin-bottom: 0.5rem;">${char.name}</h4>
                <p style="font-size: 0.72rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem; font-family: 'JetBrains Mono', monospace;">${char.race} · ${affiliation}</p>
                <p style="font-size: 0.78rem; line-height: 1.4; text-transform: none; color: #ddd;">${shortDesc}</p>
                <p style="margin-top: 0.75rem; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--accent-green);">MAX KI: ${char.maxKi}</p>
            </div>
        </div>
    </div>`;
};

const renderCharacters = (filter = 'all') => {
    const wrapper = document.getElementById('dynamic-characters');
    if (!wrapper) return;
    const filtered = filter === 'all'
        ? allCharacters
        : allCharacters.filter(c => (c.affiliation || '').toLowerCase().includes(filter.toLowerCase()));
    wrapper.innerHTML = filtered.length
        ? filtered.map((c, i) => buildCard(c, i)).join('')
        : `<p style="color: var(--primary-cyan); font-family: 'JetBrains Mono', monospace; min-width:300px;">No characters found for this category.</p>`;
};

const loadCharacters = async () => {
    const wrapper = document.getElementById('dynamic-characters');

    // Use sessionStorage cache to avoid re-fetching on every page visit
    const CACHE_KEY = 'dbz_characters_v1';
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
        allCharacters = JSON.parse(cached);
        renderCharacters('all');
        attachCardInteractions(wrapper);
        setTimeout(initAnimations, 200);
        return;
    }

    try {
        // Fetch all pages in parallel instead of sequentially
        const [page1, page2, page3] = await Promise.all([
            fetch('https://dragonball-api.com/api/characters?limit=20&page=1').then(r => r.json()),
            fetch('https://dragonball-api.com/api/characters?limit=20&page=2').then(r => r.json()),
            fetch('https://dragonball-api.com/api/characters?limit=20&page=3').then(r => r.json()),
        ]);

        allCharacters = [...page1.items, ...page2.items, ...page3.items];
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(allCharacters));
        renderCharacters('all');
        attachCardInteractions(wrapper);
        setTimeout(() => {
            initAnimations();
            ScrollTrigger.refresh();
        }, 200);
    } catch (e) {
        console.error('Failed to load characters:', e);
        if (wrapper) wrapper.innerHTML = `<p style="color:red; min-width:300px;">Failed to load characters. Check connection.</p>`;
        setTimeout(initAnimations, 100);
    }
};

const attachCardInteractions = (wrapper) => {
    if (!wrapper) return;
    // Drag-to-scroll
    let isDown = false, startX, scrollLeft;
    wrapper.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - wrapper.offsetLeft; scrollLeft = wrapper.scrollLeft; });
    wrapper.addEventListener('mouseleave', () => isDown = false);
    wrapper.addEventListener('mouseup', () => isDown = false);
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        wrapper.scrollLeft = scrollLeft - (x - startX);
    });

    // Category filter chip buttons
    document.querySelectorAll('.char-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.char-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderCharacters(chip.dataset.filter);
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
    initHero();
    initRadar();

    // Mark each jp-char as landed after its drop-in animation ends
    document.querySelectorAll('.jp-char').forEach(el => {
        el.addEventListener('animationend', () => {
            if (!el.classList.contains('landed')) el.classList.add('landed');
        }, { once: true });
    });
});

// Loader logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 400);
    }
});

// ---------------------------------------
// ?? SOUND ENGINE (Web Audio API - no files needed)
// ---------------------------------------
let audioCtx;
const getAudioCtx = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
};

const playKiCharge = () => {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
};

const playScouter = () => {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square'; osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
};

const playShenronRoar = () => {
    try {
        const ctx = getAudioCtx();
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth'; osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(80 + i * 40, ctx.currentTime + i * 0.3);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + i * 0.3 + 0.5);
            gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.5);
            osc.start(ctx.currentTime + i * 0.3); osc.stop(ctx.currentTime + i * 0.3 + 0.5);
        }
    } catch(e) {}
};

// Add sounds to nav links
document.querySelectorAll('.nav-links a, .char-chip, .scanner-btn').forEach(el => {
    el.addEventListener('mouseenter', playScouter);
});

// ---------------------------------------
// ---------------------------------------
// 🛰️ LIVE DRAGON RADAR SYSTEM
// ---------------------------------------
let collectedBalls = 0;
let radarBalls = [];

// Sonar sound synthesis
const playRadarPing = () => {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
};

const playFoundSound = () => {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
};

const initRadar = () => {
    const blipsContainer = document.getElementById('radar-blips');
    if (!blipsContainer) return;

    // Place blips inside the radar circle — max dist 36% from center (leaves room for 30px ball)
    radarBalls = Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        // distPct is distance from center as % of the element's half-width
        // Safe max = 38 so ball edge (ball is 30px, radar-glass ~400px → ball = 7.5%) stays inside
        const distPct = 15 + Math.random() * 23; // 15–38% from center

        const x = 50 + Math.cos(angle) * distPct;
        const y = 50 + Math.sin(angle) * distPct;

        const blip = document.createElement('div');
        blip.className = 'dragon-blip';
        blip.style.left = `${x}%`;
        blip.style.top  = `${y}%`;

        let stars = '';
        for (let s = 0; s <= i; s++) stars += '★';
        blip.innerHTML = `<span style="font-size:${i < 3 ? 8 : 6}px;line-height:1;">${stars}</span>`;

        blip.style.animation = `blip-float ${3 + Math.random() * 2}s ease-in-out infinite`;
        blip.style.animationDelay = `${Math.random() * 2}s`;

        const angleDeg = (angle * 180 / Math.PI + 360) % 360;
        blip.dataset.index = i;
        blip.dataset.angle = angleDeg;
        blip.dataset.dist  = Math.round(distPct * 5);

        blip.onclick = (e) => {
            e.stopPropagation();
            collectRadarBall(i, blip);
        };

        blipsContainer.appendChild(blip);
        return {
            element: blip,
            angle: angleDeg,
            distPct,
            stars: i + 1,
            collected: false,
            detected: false
        };
    });

    animateRadar();
};

const animateRadar = () => {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    // Wait one frame so CSS has laid out the element
    requestAnimationFrame(() => {
        const size = canvas.offsetWidth;
        canvas.width  = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;
        const R  = size / 2;

        let sweepAngle = -Math.PI / 2; // start pointing up
        const SWEEP_SPEED = (2 * Math.PI) / (4 * 60); // 4s per rotation at 60fps

        const drawFrame = () => {
            ctx.clearRect(0, 0, size, size);

            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.clip();

            // Concentric range rings
            ctx.lineWidth = 1;
            [0.25, 0.5, 0.75, 1.0].forEach(frac => {
                ctx.beginPath();
                ctx.arc(cx, cy, R * frac, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(57,255,20,${frac === 1.0 ? 0.15 : 0.2})`;
                ctx.stroke();
            });

            // Sweep trail — filled sector fading behind the line
            const trailLen = Math.PI * 0.5; // ~90 degrees
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, R, sweepAngle - trailLen, sweepAngle, false);
            ctx.closePath();
            // Use a radial gradient so it fades from center outward AND angularly
            const trailGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
            trailGrad.addColorStop(0,   'rgba(57,255,20,0.0)');
            trailGrad.addColorStop(0.3, 'rgba(57,255,20,0.08)');
            trailGrad.addColorStop(1,   'rgba(57,255,20,0.18)');
            ctx.fillStyle = trailGrad;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.restore();

            // Sweep line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(sweepAngle) * R, cy + Math.sin(sweepAngle) * R);
            ctx.strokeStyle = 'rgba(57,255,20,1)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#39ff14';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.restore();

            // Center dot
            ctx.beginPath();
            ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(57,255,20,1)';
            ctx.fill();

            ctx.restore(); // end clip

            // Advance
            sweepAngle += SWEEP_SPEED;
            if (sweepAngle > Math.PI * 2 - Math.PI / 2) sweepAngle -= Math.PI * 2;

            // Detection check
            const sweepDeg = (sweepAngle * 180 / Math.PI + 360) % 360;
            radarBalls.forEach(ball => {
                if (ball.collected) return;
                const diff = Math.abs(sweepDeg - ball.angle);
                const wrapDiff = 360 - diff;
                if ((diff < 8 || wrapDiff < 8) && !ball.detected) {
                    ball.detected = true;
                    ball.element.classList.add('detected');
                    document.getElementById('radar-status').innerText =
                        `SIGNAL DETECTED: DB-${ball.stars} (${ball.element.dataset.dist}km)`;
                    playRadarPing();
                    setTimeout(() => {
                        ball.element.classList.remove('detected');
                        ball.detected = false;
                    }, 1000);
                }
            });

            requestAnimationFrame(drawFrame);
        };

        requestAnimationFrame(drawFrame);
    });
};


const collectRadarBall = (index, el) => {
    if (radarBalls[index].collected) return;
    
    radarBalls[index].collected = true;
    el.style.animation = 'none'; // stop float animation
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.transform = 'translate(-50%, -50%) scale(2.5)';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';

    collectedBalls++;
    document.getElementById('radar-count').textContent = collectedBalls;
    
    const slot = document.querySelector(`.collection-slot[data-slot="${collectedBalls}"]`);
    if (slot) slot.classList.add('filled');

    playFoundSound();
    playKiCharge();

    if (collectedBalls === 7) {
        document.getElementById('radar-status').innerText = "ALL BALLS COLLECTED! SUMMONING...";
        setTimeout(() => summonShenron(), 1500);
    } else {
        document.getElementById('radar-status').innerText = `REMAINING: ${7 - collectedBalls} SIGNALS...`;
    }
};




// ---------------------------------------
// 🐉 CINEMATIC SHENRON SUMMON
// ---------------------------------------

// Lightning canvas
const lCanvas = document.getElementById('lightning-canvas');
const lCtx = lCanvas ? lCanvas.getContext('2d') : null;
let lightningActive = false;

const resizeLightning = () => {
    if (!lCanvas) return;
    lCanvas.width = window.innerWidth;
    lCanvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeLightning);
resizeLightning();

const drawBolt = (x1, y1, x2, y2, spread, ctx) => {
    if (spread < 4) return;
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread;
    drawBolt(x1, y1, mx, my, spread / 2, ctx);
    drawBolt(mx, my, x2, y2, spread / 2, ctx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(mx, my);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(100,255,150,${Math.random() * 0.8 + 0.2})`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 12;
    ctx.stroke();
};

const flashLightning = () => {
    if (!lCtx || !lightningActive) return;
    lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    const strikes = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < strikes; i++) {
        const sx = Math.random() * lCanvas.width;
        drawBolt(sx, 0, sx + (Math.random() - 0.5) * 300, lCanvas.height * 0.6, 120, lCtx);
    }
    setTimeout(() => {
        if (lCtx) lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    }, 80);
};

const playThunder = () => {
    try {
        const ctx = getAudioCtx();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
        }
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 200;
        src.buffer = buf;
        src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        src.start();
    } catch(e) {}
};

const playShenronRise = () => {
    try {
        const ctx = getAudioCtx();
        for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(ctx.destination);
            const t = ctx.currentTime + i * 0.25;
            osc.frequency.setValueAtTime(60 + i * 25, t);
            osc.frequency.exponentialRampToValueAtTime(25, t + 0.7);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
            osc.start(t); osc.stop(t + 0.7);
        }
    } catch(e) {}
};

// Wish response map — expanded with more variety
const wishResponses = [
    { keywords: ['ultra instinct', 'ui', 'migatte'],    response: '"YOUR WISH IS GRANTED. ULTRA INSTINCT AWAKENS WITHIN YOU."',       type: 'epic' },
    { keywords: ['immortal', 'immortality', 'eternal'], response: '"IMMORTALITY... A DANGEROUS WISH. SO BE IT. GRANTED."',             type: 'dark' },
    { keywords: ['saiyan', 'super saiyan', 'ssj'],      response: '"THE POWER OF A SUPER SAIYAN NOW FLOWS THROUGH YOUR VEINS."',       type: 'epic' },
    { keywords: ['strong', 'power', 'strength', 'unlimited power', 'beyond all gods'], response: '"YOUR POWER LEVEL IS NOW... OVER 9,000,000."', type: 'epic' },
    { keywords: ['wish', 'anything', 'everything'],     response: '"SUCH AMBITION. YOUR WISH SHALL BE GRANTED."',                     type: 'neutral' },
    { keywords: ['goku', 'vegeta', 'gohan', 'piccolo'], response: '"THE LEGENDARY WARRIOR ANSWERS YOUR CALL."',                       type: 'epic' },
    { keywords: ['dragon ball', 'dragonball'],          response: '"THE DRAGON BALLS RESPOND TO YOUR DESIRE."',                       type: 'neutral' },
    { keywords: ['money', 'rich', 'wealth', 'riches'],  response: '"...SHENRON DOES NOT DEAL IN EARTHLY COIN. SEEK POWER INSTEAD."', type: 'reject' },
    { keywords: ['love', 'heart', 'fall in love'],      response: '"EVEN I CANNOT FORCE THE HEART OF ANOTHER. THIS WISH IS BEYOND ME."', type: 'reject' },
    { keywords: ['save', 'earth', 'protect', 'evil'],   response: '"YOUR NOBLE HEART IS WORTHY. THE EARTH SHALL BE PROTECTED."',     type: 'epic' },
    { keywords: ['wisdom', 'knowledge', 'smart'],       response: '"WISDOM GRANTED. USE IT AS WISELY AS MASTER ROSHI... HOPEFULLY."', type: 'funny' },
    { keywords: ['confidence', 'brave', 'courage'],     response: '"YOUR SPIRIT SHALL RIVAL THE PRIDE OF VEGETA HIMSELF."',          type: 'epic' },
    { keywords: ['super shenron', 'planet', 'universe'],'response': '"THAT WISH EXCEEDS MY POWER. SEEK THE SUPER DRAGON BALLS."',    type: 'reject' },
    { keywords: ['revive', 'bring back', 'resurrect'],  response: '"THE DEAD SHALL WALK AGAIN. YOUR WISH IS GRANTED."',              type: 'epic' },
    { keywords: ['yamcha'],                             response: '"...EVEN I CANNOT MAKE YAMCHA RELEVANT. SOME THINGS ARE IMPOSSIBLE."', type: 'funny' },
    { keywords: ['krillin'],                            response: '"KRILLIN\'S POWER LEVEL HAS BEEN RAISED TO... 1,001. YOU\'RE WELCOME."', type: 'funny' },
];

const getShenronResponse = (wish) => {
    const lower = wish.toLowerCase();
    for (const entry of wishResponses) {
        if (entry.keywords.some(k => lower.includes(k))) return entry;
    }
    return { response: '"SO BE IT. YOUR WISH... IS GRANTED."', type: 'neutral' };
};

const summonShenron = () => {
    const overlay = document.getElementById('shenron-overlay');
    const shenronBody = document.getElementById('shenron-body');
    const content = document.getElementById('shenron-content');
    const wishBox = document.getElementById('wish-box');
    const responseEl = document.getElementById('shenron-response');
    const wishInput = document.getElementById('wish-input');
    const grantedOverlay = document.getElementById('wish-granted-overlay');
    const grantedText = document.getElementById('wish-granted-text');
    const grantedSub = document.getElementById('wish-granted-sub');

    // Reset state
    overlay.classList.add('active');
    shenronBody.classList.remove('risen');
    content.classList.remove('visible');
    wishBox.classList.remove('shown');
    wishBox.textContent = '';
    if (responseEl) responseEl.textContent = '';
    if (wishInput) wishInput.value = '';
    if (grantedOverlay) grantedOverlay.classList.remove('active');
    document.getElementById('wish-energy-fill').style.width = '0%';

    // Step 1: sky darkens (instant via CSS)
    // Step 2: lightning phase
    lightningActive = true;
    playThunder();
    let flashCount = 0;
    const lightningInterval = setInterval(() => {
        flashLightning();
        playThunder();
        flashCount++;
        if (flashCount >= 6) {
            clearInterval(lightningInterval);
            lightningActive = false;
            if (lCtx) lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);

            // Step 3: Shenron rises
            playShenronRise();
            playShenronRoar();
            shenronBody.classList.add('risen');

            // Step 4: wish content appears
            setTimeout(() => {
                content.classList.add('visible');
                initWishSparks();
            }, 900);
        }
    }, 220);

    // Category quick-pick buttons
    document.querySelectorAll('.wish-cat-btn').forEach(btn => {
        btn.onclick = () => {
            if (wishInput) {
                wishInput.value = btn.dataset.wish;
                wishInput.dispatchEvent(new Event('input'));
                wishInput.focus();
                playScouter();
            }
        };
    });

    // Wish input energy bar + spark typing
    if (wishInput) {
        wishInput.addEventListener('input', () => {
            const pct = Math.min(100, (wishInput.value.length / 60) * 100);
            document.getElementById('wish-energy-fill').style.width = pct + '%';
            spawnWishSparks(wishInput);
            playScouter();
        });
    }

    // Wish grant button
    const grantBtn = document.getElementById('wish-grant-btn');
    if (grantBtn) {
        grantBtn.onclick = () => {
            const wish = wishInput ? wishInput.value.trim() : '';
            if (!wish) {
                wishInput.style.borderColor = 'rgba(255,50,50,0.8)';
                setTimeout(() => { wishInput.style.borderColor = ''; }, 800);
                return;
            }
            triggerGrantWishCinematic(wish, responseEl, wishBox, grantedOverlay, grantedText, grantedSub);
        };
    }

    // Close button
    document.getElementById('wish-close').onclick = () => {
        closeShenron();
    };
};

const triggerGrantWishCinematic = (wish, responseEl, wishBox, grantedOverlay, grantedText, grantedSub) => {
    const entry = getShenronResponse(wish);
    const isReject = entry.type === 'reject';

    // 1. Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 600);

    // 2. Lightning burst
    lightningActive = true;
    let burstCount = 0;
    const burstInterval = setInterval(() => {
        flashLightning();
        playThunder();
        burstCount++;
        if (burstCount >= 4) {
            clearInterval(burstInterval);
            lightningActive = false;
            if (lCtx) lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
        }
    }, 120);

    // 3. Eyes glow brighter
    const eyes = document.querySelectorAll('.shenron-eye');
    eyes.forEach(e => {
        e.style.boxShadow = '0 0 40px #ff2200, 0 0 100px rgba(255,34,0,1), 0 0 200px rgba(255,0,0,0.8)';
        e.style.width = '20px';
        e.style.height = '12px';
    });
    setTimeout(() => {
        eyes.forEach(e => { e.style.boxShadow = ''; e.style.width = ''; e.style.height = ''; });
    }, 1500);

    // 4. Ki charge sound
    playKiCharge();
    playShenronRoar();

    // 5. Show granted overlay
    setTimeout(() => {
        if (isReject) {
            grantedText.textContent = 'THIS WISH CANNOT BE GRANTED';
            grantedText.style.color = '#ff4444';
            grantedText.style.textShadow = '0 0 40px #ff4444, 0 0 80px red';
            grantedSub.textContent = entry.response.replace(/"/g, '');
        } else {
            grantedText.textContent = 'YOUR WISH HAS BEEN GRANTED';
            grantedText.style.color = '';
            grantedText.style.textShadow = '';
            grantedSub.textContent = entry.response.replace(/"/g, '');
        }
        grantedOverlay.classList.add('active');

        // Flash the whole overlay
        const overlay = document.getElementById('shenron-overlay');
        overlay.style.filter = 'brightness(3)';
        setTimeout(() => { overlay.style.filter = ''; }, 150);

        // 6. After cinematic, show response in panel
        setTimeout(() => {
            grantedOverlay.classList.remove('active');
            if (responseEl) {
                responseEl.textContent = entry.response;
                responseEl.style.color = isReject ? 'rgba(255,100,100,0.9)' : 'rgba(0,255,120,0.9)';
                responseEl.style.opacity = '0';
                setTimeout(() => { responseEl.style.opacity = '1'; }, 50);
            }
            wishBox.textContent = `"${wish}"`;
            wishBox.classList.add('shown');

            // 7. If granted (not rejected), trigger scatter after delay
            if (!isReject) {
                setTimeout(() => scatterDragonBalls(), 2000);
            }
        }, 2200);
    }, 500);
};

const scatterDragonBalls = () => {
    const container = document.getElementById('db-scatter-container');
    if (!container) return;
    container.innerHTML = '';

    const starCounts = ['★', '★★', '★★★', '★★★★', '★★★★★', '★★★★★★', '★★★★★★★'];
    const balls = [];

    for (let i = 0; i < 7; i++) {
        const ball = document.createElement('div');
        ball.className = 'scatter-ball';
        ball.textContent = starCounts[i];
        container.appendChild(ball);
        balls.push(ball);
    }

    // Animate each ball flying outward
    balls.forEach((ball, i) => {
        const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const dist = 40 + Math.random() * 30; // vw
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        setTimeout(() => {
            ball.style.opacity = '1';
            ball.style.transition = `transform 1.8s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease`;
            ball.style.transform = `translate(calc(-50% + ${tx}vw), calc(-50% + ${ty}vh)) scale(1.5)`;
            playFoundSound();
        }, i * 80);

        // Fade out and fly to stars
        setTimeout(() => {
            ball.style.transition = `transform 1.2s ease-in, opacity 0.8s ease`;
            ball.style.transform = `translate(calc(-50% + ${tx * 3}vw), calc(-50% + ${ty * 3 - 50}vh)) scale(0.2)`;
            ball.style.opacity = '0';
        }, i * 80 + 1800);
    });

    // Show "collect again" message then close
    setTimeout(() => {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position:absolute; inset:0; display:flex; flex-direction:column;
            align-items:center; justify-content:center; z-index:70;
            font-family:'JetBrains Mono',monospace; text-align:center;
            animation: wish-box-appear 0.8s ease forwards;
        `;
        msg.innerHTML = `
            <div style="font-size:clamp(1rem,3vw,1.8rem);font-weight:900;color:var(--primary-gold);
                text-shadow:0 0 30px var(--primary-gold);letter-spacing:3px;margin-bottom:1rem;">
                THE DRAGON BALLS HAVE SCATTERED...
            </div>
            <div style="font-size:0.8rem;color:rgba(0,255,120,0.7);letter-spacing:2px;">
                Collect them again in one year...
            </div>
        `;
        container.appendChild(msg);

        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.8s ease';
            setTimeout(() => closeShenron(), 1000);
        }, 3000);
    }, 3500);
};

const closeShenron = () => {
    const overlay = document.getElementById('shenron-overlay');
    overlay.classList.remove('active');
    lightningActive = false;
    if (lCtx) lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    // Reset balls
    collectedBalls = 0;
    document.getElementById('radar-count').textContent = 0;
    document.querySelectorAll('.collection-slot').forEach(s => s.classList.remove('filled'));
    radarBalls.forEach(b => {
        b.collected = false;
        b.element.style.opacity = '1';
        b.element.style.transform = 'translate(-50%, -50%)';
        b.element.style.pointerEvents = '';
    });
    document.getElementById('db-scatter-container').innerHTML = '';
};

// ── Wish sparks canvas system ──
let wishSparksCtx = null;
let wishSparksRAF = null;
const wishSparksList = [];

const initWishSparks = () => {
    const canvas = document.getElementById('wish-sparks-canvas');
    if (!canvas) return;
    const panel = document.getElementById('shenron-content');
    canvas.width = panel.offsetWidth;
    canvas.height = panel.offsetHeight;
    wishSparksCtx = canvas.getContext('2d');
    animateWishSparks();
};

const spawnWishSparks = (inputEl) => {
    if (!wishSparksCtx) return;
    const canvas = document.getElementById('wish-sparks-canvas');
    const panel = document.getElementById('shenron-content');
    const inputRect = inputEl.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const x = inputRect.left - panelRect.left + inputRect.width * 0.5;
    const y = inputRect.top - panelRect.top;

    for (let i = 0; i < 4; i++) {
        wishSparksList.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: -(Math.random() * 3 + 1),
            r: Math.random() * 3 + 1,
            a: 1,
            col: Math.random() > 0.5 ? '0,255,100' : '255,210,0',
        });
    }
};

const animateWishSparks = () => {
    if (!wishSparksCtx) return;
    const canvas = document.getElementById('wish-sparks-canvas');
    wishSparksCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = wishSparksList.length - 1; i >= 0; i--) {
        const s = wishSparksList[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.08; s.a -= 0.03;
        if (s.a <= 0) { wishSparksList.splice(i, 1); continue; }
        wishSparksCtx.beginPath();
        wishSparksCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        wishSparksCtx.fillStyle = `rgba(${s.col},${s.a})`;
        wishSparksCtx.fill();
    }
    wishSparksRAF = requestAnimationFrame(animateWishSparks);
};

// ---------------------------------------
// ? POWER LEVEL SCANNER
// ---------------------------------------
const ranks = [
    { min: 0,         max: 999,       rank: 'Earthling',       quote: '"Your power level... is negligible."' },
    { min: 1000,      max: 9999,      rank: 'Z Fighter Trainee', quote: '"Keep training. Roshi sees potential."' },
    { min: 10000,     max: 99999,     rank: 'Elite Warrior',   quote: '"A solid power. The Ginyu Force takes notice."' },
    { min: 100000,    max: 999999,    rank: 'Super Saiyan',    quote: '"This is... impossible! A Super Saiyan?!"' },
    { min: 1000000,   max: 9999999,   rank: 'Super Saiyan Blue', quote: '"The power of a god flows through you."' },
    { min: 10000000,  max: Infinity,  rank: 'ULTRA INSTINCT',  quote: '"IT\'S OVER 9,000,000!! ULTRA INSTINCT ACHIEVED!"' },
];

window.scanPower = () => {
    const name = document.getElementById('scanner-input').value.trim();
    if (!name) return;
    playKiCharge();

    // Deterministic but fun power level from name
    let power = 0;
    for (let i = 0; i < name.length; i++) power += name.charCodeAt(i) * (i + 1) * 137;
    power = Math.abs(power % 15000000) + 1000;

    const result = document.getElementById('scanner-result');
    const valueEl = document.getElementById('scan-value');
    const rankEl = document.getElementById('scan-rank');
    const quoteEl = document.getElementById('scan-quote');

    result.classList.remove('visible');
    valueEl.textContent = '---';

    setTimeout(() => {
        result.classList.add('visible');
        // Count up animation
        let current = 0;
        const step = Math.ceil(power / 60);
        const interval = setInterval(() => {
            current = Math.min(current + step, power);
            valueEl.textContent = current.toLocaleString();
            playScouter();
            if (current >= power) {
                clearInterval(interval);
                const tier = ranks.find(r => power >= r.min && power <= r.max);
                rankEl.textContent = tier ? tier.rank : 'Legend';
                quoteEl.textContent = tier ? tier.quote : '';
                playKiCharge();
            }
        }, 25);
    }, 200);
};

// ---------------------------------------
// ?? SAGA TIMELINE drag scroll
// ---------------------------------------
const sagaEl = document.querySelector('.saga-timeline');
if (sagaEl) {
    let isDown = false, startX, scrollLeft;
    sagaEl.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - sagaEl.offsetLeft; scrollLeft = sagaEl.scrollLeft; });
    sagaEl.addEventListener('mouseleave', () => isDown = false);
    sagaEl.addEventListener('mouseup', () => isDown = false);
    sagaEl.addEventListener('mousemove', (e) => {
        if (!isDown) return; e.preventDefault();
        sagaEl.scrollLeft = scrollLeft - (e.pageX - sagaEl.offsetLeft - startX);
    });
}

// ═══════════════════════════════════════════════════════════
// 🔥 CINEMATIC HERO — FULL CANVAS POWER AWAKENING v2
// ═══════════════════════════════════════════════════════════
const initHero = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('home');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Smooth noise helpers (layered sine — good enough for organic turbulence)
    const noise1 = (x, t) => Math.sin(x * 2.1 + t * 1.3) * 0.5 +
                             Math.sin(x * 3.7 - t * 2.1) * 0.3 +
                             Math.sin(x * 7.3 + t * 0.9) * 0.2;
    const noise2 = (x, t) => Math.sin(x * 1.4 - t * 0.8) * 0.5 +
                             Math.sin(x * 4.1 + t * 1.7) * 0.3 +
                             Math.sin(x * 9.1 - t * 1.1) * 0.2;

    let t = 0;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 0 — COSMIC BACKGROUND + NEBULA
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const STAR_COUNT = 150;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.6 + 0.2,
        a: Math.random() * 0.7 + 0.15,
        tw: Math.random() * Math.PI * 2,
        spd: Math.random() * 0.012 + 0.003,
    }));

    // ── Offscreen canvas for the static background (redrawn every 4 frames)
    const bgCanvas = document.createElement('canvas');
    const bgCtx    = bgCanvas.getContext('2d');
    let bgFrame = 0;
    const syncBg = () => { bgCanvas.width = W(); bgCanvas.height = H(); };
    syncBg();
    window.addEventListener('resize', syncBg);

    const drawBackground = () => {
        bgFrame++;
        // Redraw static bg only every 4 frames — saves ~75% of gradient work
        if (bgFrame % 4 === 0) {
            const cx = W() / 2, cy = H() * 0.6;
            const bg = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W(), H()));
            bg.addColorStop(0,    'rgba(22,5,48,1)');
            bg.addColorStop(0.35, 'rgba(10,2,22,1)');
            bg.addColorStop(1,    'rgba(0,0,4,1)');
            bgCtx.fillStyle = bg;
            bgCtx.fillRect(0, 0, W(), H());

            // Nebula veins — static alpha, no per-frame pulse (saves 3 gradient creates)
            [
                [0.15, 0.28, 0.38, 80, 0, 160, 0.10],
                [0.82, 0.35, 0.32, 0, 80, 150, 0.07],
                [0.50, 0.80, 0.50, 200, 100, 10, 0.16],
            ].forEach(([nx, ny, nr, r, g, b, a]) => {
                const px = W() * nx, py = H() * ny, rad = Math.max(W(), H()) * nr;
                const n = bgCtx.createRadialGradient(px, py, 0, px, py, rad);
                n.addColorStop(0, `rgba(${r},${g},${b},${a})`);
                n.addColorStop(1, 'rgba(0,0,0,0)');
                bgCtx.fillStyle = n;
                bgCtx.fillRect(0, 0, W(), H());
            });

            // Stars onto bg canvas
            for (const s of stars) {
                s.tw += s.spd * 4; // advance 4 frames worth
                const a = s.a * (0.45 + 0.55 * Math.sin(s.tw));
                bgCtx.beginPath();
                bgCtx.arc(s.x * W(), s.y * H(), s.r, 0, Math.PI * 2);
                bgCtx.fillStyle = `rgba(210,225,255,${a})`;
                bgCtx.fill();
            }
        }
        // Blit cached bg — single drawImage call instead of 4+ gradient fills
        ctx.drawImage(bgCanvas, 0, 0);
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 1 — GOD RAYS (volumetric crepuscular light)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const RAY_COUNT = 14;  // reduced from 24
    const rays = Array.from({ length: RAY_COUNT }, (_, i) => ({
        angle:  (i / RAY_COUNT) * Math.PI * 2,
        width:  Math.random() * 0.04 + 0.008, // angular width
        alpha:  Math.random() * 0.18 + 0.04,
        len:    Math.random() * 0.55 + 0.35,  // fraction of screen diagonal
        phase:  Math.random() * Math.PI * 2,
        spd:    (Math.random() - 0.5) * 0.003,
    }));

    const drawGodRays = () => {
        const cx = W() / 2, cy = H() * 0.6;
        const diag = Math.sqrt(W() * W() + H() * H());

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (const r of rays) {
            r.phase += r.spd;
            const breath = 0.7 + 0.3 * Math.sin(r.phase);
            const alpha  = r.alpha * breath;
            const len    = r.len * diag;
            const halfW  = r.width;

            // Ray as a tapered triangle from center outward
            const ax = cx + Math.cos(r.angle - halfW) * 12;
            const ay = cy + Math.sin(r.angle - halfW) * 12;
            const bx = cx + Math.cos(r.angle + halfW) * 12;
            const by = cy + Math.sin(r.angle + halfW) * 12;
            const tip = { x: cx + Math.cos(r.angle) * len, y: cy + Math.sin(r.angle) * len };

            const grad = ctx.createLinearGradient(cx, cy, tip.x, tip.y);
            grad.addColorStop(0,   `rgba(255,210,80,${alpha})`);
            grad.addColorStop(0.4, `rgba(255,170,40,${alpha * 0.5})`);
            grad.addColorStop(1,   'rgba(255,120,0,0)');

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(tip.x, tip.y);
            ctx.lineTo(bx, by);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }
        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 2 — REAL FIRE TONGUES (Bézier + turbulence)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Each tongue is a quadratic bézier curve from base → tip,
    // with control point displaced by layered sine noise.
    const TONGUE_COUNT = 22;  // reduced from 40
    const tongues = Array.from({ length: TONGUE_COUNT }, (_, i) => ({
        id:     i,
        xBase:  (Math.random() - 0.5) * 320, // offset from center-bottom
        xSpread:Math.random() * 80 + 20,
        height: Math.random() * 0.52 + 0.22, // fraction of H
        phase:  Math.random() * Math.PI * 2,
        spd:    Math.random() * 0.055 + 0.025,
        alpha:  Math.random() * 0.55 + 0.3,
        hue:    Math.random() * 45 + 18,     // 18=deep orange … 63=gold
        isSub:  i > TONGUE_COUNT * 0.6,      // inner sub-flames are brighter
    }));

    const drawFire = () => {
        const cx = W() / 2;
        const groundY = H();           // fire base at very bottom
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (const f of tongues) {
            f.phase += f.spd;

            // Turbulence-driven sway using layered noise
            const sway1 = noise1(f.id * 0.4, t) * 60;
            const sway2 = noise2(f.id * 0.7, t) * 30;
            const totalSway = sway1 + sway2;

            const baseX = cx + f.xBase;
            const tipH  = f.height * H() * (0.78 + 0.22 * Math.abs(Math.sin(f.phase)));
            const tipX  = baseX + totalSway * 0.8;
            const tipY  = groundY - tipH;

            // Control point (bends toward tip)
            const cpX = baseX + totalSway * 1.4 + Math.sin(f.phase * 1.7) * 20;
            const cpY = groundY - tipH * 0.55;

            // Width at the base
            const halfW = f.xSpread * (0.6 + 0.4 * Math.abs(Math.sin(f.phase * 0.5)));

            // Left and right base points
            const lx = baseX - halfW, ly = groundY;
            const rx = baseX + halfW, ry = groundY;

            // Fire colour: white-hot core → yellow → orange → deep red → transparent
            const grad = ctx.createLinearGradient(baseX, groundY, tipX, tipY);
            if (f.isSub) {
                grad.addColorStop(0,    `hsla(${f.hue + 30}, 100%, 95%, ${f.alpha})`);
                grad.addColorStop(0.25, `hsla(${f.hue + 10}, 100%, 75%, ${f.alpha * 0.85})`);
                grad.addColorStop(0.6,  `hsla(${f.hue},      100%, 55%, ${f.alpha * 0.55})`);
                grad.addColorStop(1,    `hsla(${f.hue - 15}, 90%,  25%, 0)`);
            } else {
                grad.addColorStop(0,    `hsla(${f.hue + 15}, 100%, 80%, ${f.alpha * 0.8})`);
                grad.addColorStop(0.35, `hsla(${f.hue},      100%, 55%, ${f.alpha * 0.6})`);
                grad.addColorStop(0.7,  `hsla(${f.hue - 10}, 90%,  35%, ${f.alpha * 0.3})`);
                grad.addColorStop(1,    `hsla(20,            80%,  15%, 0)`);
            }

            // Build flame silhouette: two bezier curves sharing the tip
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.quadraticCurveTo(cpX - halfW * 0.5, cpY, tipX, tipY);
            ctx.quadraticCurveTo(cpX + halfW * 0.5, cpY, rx, ry);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }
        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 3 — GROUND ENERGY POOL (heat crater)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const drawGroundPool = () => {
        const cx = W() / 2;
        const poolW = W() * 0.55;
        const beat = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.6));

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Simple layered fills — no gradient creation, no random shimmer lines
        ctx.fillStyle = `rgba(255,230,100,${0.18 * beat})`;
        ctx.beginPath(); ctx.ellipse(cx, H(), poolW * 0.4, H() * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,160,20,${0.10 * beat})`;
        ctx.beginPath(); ctx.ellipse(cx, H(), poolW * 0.7, H() * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220,60,0,${0.05 * beat})`;
        ctx.beginPath(); ctx.ellipse(cx, H(), poolW, H() * 0.10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 4 — SHOCKWAVE RINGS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const shockwaves = [];
    let shockInterval = 0;

    const spawnShockwave = (big = false) => {
        shockwaves.push({
            r: 20,
            maxR: Math.min(W(), H()) * (big ? 0.80 : 0.45 + Math.random() * 0.2),
            alpha: big ? 1.0 : 0.75,
            color: Math.random() > 0.4 ? '255,215,60' : '0,240,255',
            thick: big ? 5 : Math.random() * 3 + 1.5,
            speed: big ? 7 : Math.random() * 5 + 3,
            twin:  Math.random() > 0.5, // second ring 15px behind first
        });
    };

    for (let i = 0; i < 3; i++) setTimeout(() => spawnShockwave(i === 0), i * 350);

    const drawShockwaves = () => {
        shockInterval++;
        if (shockInterval > 100 + Math.random() * 100) {
            spawnShockwave();
            shockInterval = 0;
        }

        const cx = W() / 2, cy = H() * 0.6;

        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const s = shockwaves[i];
            s.r += s.speed;
            s.alpha *= 0.97;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';

            // Main ring — no shadowBlur, use lineWidth for visual weight
            ctx.beginPath();
            ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${s.color},${Math.max(0, s.alpha)})`;
            ctx.lineWidth   = s.thick;
            ctx.stroke();

            // Soft outer glow ring (wider, more transparent — fakes bloom without shadowBlur)
            ctx.beginPath();
            ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${s.color},${Math.max(0, s.alpha * 0.25)})`;
            ctx.lineWidth   = s.thick * 4;
            ctx.stroke();

            if (s.twin && s.r > 12) {
                ctx.beginPath();
                ctx.arc(cx, cy, s.r - 12, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${s.color},${Math.max(0, s.alpha * 0.3)})`;
                ctx.lineWidth   = s.thick * 0.5;
                ctx.stroke();
            }
            ctx.restore();

            if (s.r >= s.maxR || s.alpha < 0.004) shockwaves.splice(i, 1);
        }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 5 — KI ENERGY STREAMS (spiral inward)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const KI_COUNT = 70;  // reduced from 140
    const kiParticles = [];

    const spawnKi = () => {
        const angle = Math.random() * Math.PI * 2;
        const dist  = Math.random() * Math.max(W(), H()) * 0.55 + 100;
        const colList = ['255,230,60','255,160,10','0,230,255','255,255,140','180,80,255'];
        const col   = colList[Math.floor(Math.random() * colList.length)];
        return {
            x:  W()/2 + Math.cos(angle) * dist,
            y:  H()*0.6 + Math.sin(angle) * dist * 0.5,
            tx: W()/2, ty: H()*0.6,
            vx: 0, vy: 0,
            color: col,
            r:    Math.random() * 2.5 + 1,
            a:    Math.random() * 0.85 + 0.15,
            spd:  Math.random() * 2.5 + 1,
            trail:[],
            maxT: Math.floor(Math.random() * 18 + 8),
        };
    };

    for (let i = 0; i < KI_COUNT; i++) kiParticles.push(spawnKi());

    const drawKiStreams = () => {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        // No shadowBlur — use simple alpha fade for glow effect (much faster)
        ctx.shadowBlur = 0;

        for (let i = 0; i < kiParticles.length; i++) {
            const p = kiParticles[i];
            const dx = p.tx - p.x, dy = p.ty - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 20) { kiParticles[i] = spawnKi(); continue; }

            const perpX = -dy / dist, perpY = dx / dist;
            const spiralStr = Math.max(0.1, dist / 180);
            p.vx = p.vx * 0.93 + (dx / dist) * p.spd * 0.13 + perpX * spiralStr * 0.65;
            p.vy = p.vy * 0.93 + (dy / dist) * p.spd * 0.13 + perpY * spiralStr * 0.65;

            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > p.maxT) p.trail.shift();

            // Draw trail as a single polyline — one beginPath per particle, not per segment
            if (p.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j].x, p.trail[j].y);
                ctx.strokeStyle = `rgba(${p.color},${p.a * 0.5})`;
                ctx.lineWidth   = p.r * 1.5;
                ctx.stroke();
            }

            // Head dot — simple filled circle, no radialGradient
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.a})`;
            ctx.fill();

            p.x += p.vx; p.y += p.vy;
        }
        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 6 — CENTRAL POWER ORB + ORBITAL RINGS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const ORBITALS = [
        { r: 140, spd: 0.008, tilt: 0.3, color: '255,220,60',  a: 0.5, width: 2.5 },
        { r: 195, spd:-0.005, tilt: 0.6, color: '0,240,255',   a: 0.35, width: 1.5 },
        { r: 260, spd: 0.003, tilt: 0.9, color: '255,120,0',   a: 0.25, width: 1 },
    ];
    let orbRot = 0;

    const drawCoreOrb = () => {
        const cx = W() / 2, cy = H() * 0.6;
        const beat = 0.5 + 0.5 * Math.sin(t * 2.2);
        const radius = 62 + beat * 26;
        orbRot += 0.008;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // ── Far outer atmospheric haze
        [350, 250, 160, 100].forEach((r, i) => {
            const alphas = [0.04, 0.09, 0.18, 0.32];
            const cols   = ['255,180,30','255,200,50','255,220,80','255,240,120'];
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, `rgba(${cols[i]},${alphas[i] * (0.8 + 0.2 * beat)})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
        });

        // ── Orbital plasma rings — no shadowBlur, use layered strokes for glow
        for (const orb of ORBITALS) {
            orb.spd !== 0 && (orb._angle = (orb._angle || 0) + orb.spd);
            const ang = orb._angle || 0;
            const scaleY = Math.abs(Math.sin(orb.tilt + orbRot * 0.3));
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(ang);
            ctx.scale(1, Math.max(0.12, scaleY));
            const orbAlpha = orb.a * (0.7 + 0.3 * beat);
            // Glow layer (wide, faint)
            ctx.beginPath(); ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${orb.color},${orbAlpha * 0.3})`;
            ctx.lineWidth   = orb.width * 6;
            ctx.stroke();
            // Core layer (thin, bright)
            ctx.beginPath(); ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${orb.color},${orbAlpha})`;
            ctx.lineWidth   = orb.width;
            ctx.stroke();
            // Spark dot
            ctx.beginPath(); ctx.arc(orb.r, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${orb.color},1)`;
            ctx.fill();
            ctx.restore();
        }

        // ── Core sphere (3-layer: white hot → gold → orange fade)
        const core = ctx.createRadialGradient(cx - radius*0.25, cy - radius*0.25, 0, cx, cy, radius);
        core.addColorStop(0,    `rgba(255,255,230,1)`);
        core.addColorStop(0.18, `rgba(255,240,120,0.95)`);
        core.addColorStop(0.45, `rgba(255,180,20,0.8)`);
        core.addColorStop(0.75, `rgba(255,90,5,0.5)`);
        core.addColorStop(1,    'rgba(180,30,0,0)');
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = core; ctx.fill();

        // ── Pure white innermost point
        const hot = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.38);
        hot.addColorStop(0, 'rgba(255,255,255,1)');
        hot.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(cx, cy, radius * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = hot; ctx.fill();

        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 7 — LIGHTNING ARCS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const arcs = [];
    let arcTimer = 0;

    // Recursive fractal lightning — no shadowBlur, depth capped at 2
    const drawBranch = (x1, y1, x2, y2, depth, alpha, col) => {
        if (depth <= 0 || alpha < 0.05) return;
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 60;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 60;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(mx, my); ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${col},${alpha})`;
        ctx.lineWidth = Math.max(0.5, depth * 0.7);
        ctx.stroke();
        if (Math.random() > 0.6) {
            const bx = mx + Math.cos(Math.random() * Math.PI * 2) * 60;
            const by = my + Math.sin(Math.random() * Math.PI * 2) * 60;
            drawBranch(mx, my, bx, by, depth - 1, alpha * 0.5, col);
        }
        drawBranch(x1, y1, mx, my, depth - 1, alpha * 0.65, col);
        drawBranch(mx, my, x2, y2, depth - 1, alpha * 0.65, col);
    };

    const spawnArc = () => {
        const cx = W()/2, cy = H()*0.6;
        const angle = Math.random() * Math.PI * 2;
        const len   = Math.random() * 320 + 100;
        arcs.push({
            x1: cx, y1: cy,
            x2: cx + Math.cos(angle) * len,
            y2: cy + Math.sin(angle) * len * 0.55,
            life: 1, decay: 0.12 + Math.random() * 0.1,
            color: ['255,230,60','0,240,255','255,255,255','255,140,10'][Math.floor(Math.random()*4)],
        });
    };

    const drawArcs = () => {
        arcTimer++;
        if (arcTimer > 18 + Math.random() * 20) {  // spawn less often
            spawnArc();
            arcTimer = 0;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = arcs.length - 1; i >= 0; i--) {
            const a = arcs[i];
            drawBranch(a.x1, a.y1, a.x2, a.y2, 2, a.life * 0.85, a.color);  // depth 2 not 3
            a.life -= a.decay;
            if (a.life <= 0) arcs.splice(i, 1);
        }
        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LAYER 8 — FLOATING EMBERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const EMBER_COUNT = 40;  // reduced from 80
    const embers = Array.from({ length: EMBER_COUNT }, () => {
        const xFrac = Math.random();
        return {
            x: xFrac, y: 0.8 + Math.random() * 0.2, // start near bottom
            vx: (Math.random() - 0.5) * 0.0025,
            vy: -(Math.random() * 0.005 + 0.001),
            r:  Math.random() * 3.5 + 0.8,
            a:  Math.random() * 0.7 + 0.15,
            col:['255,210,60','255,140,20','255,240,120'][Math.floor(Math.random()*3)],
        };
    });

    const drawEmbers = () => {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowBlur = 0;
        for (const e of embers) {
            e.x += e.vx + noise1(e.y * 10, t) * 0.001;
            e.y += e.vy;
            if (e.y < -0.05) { e.y = 0.95 + Math.random() * 0.05; e.x = 0.3 + Math.random() * 0.4; }
            if (e.x < 0 || e.x > 1) e.vx *= -1;
            const ex = e.x * W(), ey = e.y * H();
            // Outer soft glow (large, faint circle — no gradient needed)
            ctx.beginPath(); ctx.arc(ex, ey, e.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${e.col},${e.a * 0.25})`;
            ctx.fill();
            // Bright core
            ctx.beginPath(); ctx.arc(ex, ey, e.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${e.col},${e.a})`;
            ctx.fill();
        }
        ctx.restore();
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MAIN RENDER LOOP — pauses when hero is off-screen
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let heroVisible = true;
    let rafId = null;

    const observer = new IntersectionObserver(
        ([entry]) => { heroVisible = entry.isIntersecting; if (heroVisible && !rafId) loop(); },
        { threshold: 0.01 }
    );
    observer.observe(hero);

    const loop = () => {
        if (!heroVisible) { rafId = null; return; }
        t += 0.016;
        drawBackground();
        drawGodRays();
        drawFire();
        drawGroundPool();
        drawShockwaves();
        drawKiStreams();
        drawEmbers();
        drawCoreOrb();
        drawArcs();
        rafId = requestAnimationFrame(loop);
    };
    loop();

    // Mouse parallax tilt on hero-content
    const tiltEl = document.getElementById('hero-tilt');
    const inner  = tiltEl ? tiltEl.querySelector('.tilt-inner') : null;
    if (hero && inner) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const dx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
            const dy = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
            inner.style.transform = `perspective(800px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale(1.03)`;
        });
        hero.addEventListener('mouseleave', () => {
            inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }
};

// ═══════════════════════════════════════════════════════════
// 📖 SAGA MODAL DATA + LOGIC
// ═══════════════════════════════════════════════════════════
const sagaData = {
    saiyan: {
        num: '01', color: '#FF6600', title: 'SAIYAN SAGA', year: 'Age 761',
        villain: 'Raditz · Nappa · Vegeta',
        summary: 'Goku learns he is a Saiyan warrior sent to conquer Earth. After sacrificing himself to defeat Raditz, he trains in the afterlife under King Kai. The Z Fighters battle Nappa and Vegeta in a desperate fight that costs Yamcha, Tien, Chiaotzu, and Piccolo their lives.',
        fight: 'Goku vs Vegeta — the first true Saiyan clash. Goku pushes to Kaioken x4, Vegeta transforms into a Great Ape. Yajirobe cuts the tail. Gohan\'s hidden power emerges.',
        transforms: ['Kaioken', 'Kaioken x4', 'Great Ape (Vegeta)', 'Great Ape (Gohan)'],
        iconic: 'Goku uses the Spirit Bomb against Vegeta, but it\'s Gohan\'s Great Ape transformation and Krillin\'s mercy that ultimately end the battle — setting up Vegeta\'s redemption arc.',
        quote: '"Kakarot... you are the mightiest Saiyan of all." — Vegeta',
        powers: [
            { label: 'Goku (Kaioken)', pct: 38 },
            { label: 'Vegeta (Base)', pct: 52 },
            { label: 'Vegeta (Ape)', pct: 85 },
            { label: 'Gohan (Ape)', pct: 70 },
        ]
    },
    namek: {
        num: '02', color: '#9B59B6', title: 'NAMEK SAGA', year: 'Age 762',
        villain: 'Frieza · Ginyu Force',
        summary: 'Gohan, Krillin, and Bulma travel to Planet Namek to revive their fallen friends. Frieza, the galactic tyrant, seeks the Namekian Dragon Balls for immortality. The Ginyu Force arrives. Goku heals in a medical pod and arrives just in time.',
        fight: 'Goku SSJ vs Frieza 100% — the most iconic fight in anime history. Namek\'s core explodes. Goku\'s rage at Krillin\'s death triggers the first Super Saiyan transformation in 1,000 years.',
        transforms: ['Super Saiyan (Goku)', 'Frieza Final Form', 'Frieza 100%', 'Ginyu Force Poses'],
        iconic: 'Krillin is killed by Frieza. Goku\'s grief and rage ignite a golden aura — the legendary Super Saiyan awakens for the first time in a millennium. The ground shakes. The sky turns gold.',
        quote: '"I am the hope of the universe. I am the answer to all living things that cry out for peace." — Goku SSJ',
        powers: [
            { label: 'Frieza (Final)', pct: 90 },
            { label: 'Goku (Base)', pct: 45 },
            { label: 'Goku (SSJ)', pct: 95 },
            { label: 'Frieza (100%)', pct: 88 },
        ]
    },
    cell: {
        num: '03', color: '#27AE60', title: 'CELL SAGA', year: 'Age 767',
        villain: 'Cell · Dr. Gero · Androids',
        summary: 'Androids 17 and 18 are activated. A bio-android named Cell arrives from the future, absorbing humans to grow stronger. After absorbing both androids, Cell reaches his Perfect Form and hosts the Cell Games — a tournament where he fights Earth\'s greatest warriors.',
        fight: 'SSJ2 Gohan vs Perfect Cell — Gohan\'s rage unlocks Super Saiyan 2 for the first time. The Father-Son Kamehameha, with Goku\'s spirit guiding from the afterlife, destroys Cell.',
        transforms: ['Super Saiyan 2 (Gohan)', 'Perfect Cell', 'Semi-Perfect Cell', 'Cell Jr.'],
        iconic: 'Android 16\'s head is crushed by Cell. Gohan\'s suppressed rage finally explodes — his hair stands fully upright, electricity crackles around him. SSJ2 is born. Cell is terrified.',
        quote: '"I\'m not the same Gohan I was before. I\'m going to end this." — SSJ2 Gohan',
        powers: [
            { label: 'Perfect Cell', pct: 80 },
            { label: 'Gohan (SSJ)', pct: 72 },
            { label: 'Gohan (SSJ2)', pct: 98 },
            { label: 'Goku (SSJ)', pct: 75 },
        ]
    },
    buu: {
        num: '04', color: '#E91E63', title: 'BUU SAGA', year: 'Age 774',
        villain: 'Majin Buu · Babidi · Dabura',
        summary: 'The wizard Babidi resurrects Majin Buu, an ancient evil that once destroyed galaxies. Buu absorbs Gotenks, Piccolo, and Gohan. Vegito is formed to fight Super Buu. Goku\'s Super Spirit Bomb finally destroys Kid Buu after a desperate battle on the Sacred World of the Kais.',
        fight: 'Vegito vs Super Buu — the most powerful fusion ever created. Goku vs Kid Buu on the Sacred World — raw Saiyan spirit vs pure evil, ending with the Spirit Bomb.',
        transforms: ['SSJ3 (Goku)', 'Majin Vegeta', 'Super Buu', 'Kid Buu', 'Vegito SSJ', 'Gotenks SSJ3'],
        iconic: 'Vegeta destroys his own halo to give Goku energy for the Spirit Bomb. "I\'m sorry, Kakarot. This is the only thing I can do." — the most emotional Vegeta moment in the series.',
        quote: '"I\'m sorry, Kakarot. This is the only thing I can do." — Vegeta',
        powers: [
            { label: 'Kid Buu', pct: 85 },
            { label: 'Goku (SSJ3)', pct: 80 },
            { label: 'Vegito (SSJ)', pct: 99 },
            { label: 'Super Buu', pct: 92 },
        ]
    },
    top: {
        num: '05', color: '#00BCD4', title: 'TOURNAMENT OF POWER', year: 'Age 780',
        villain: 'Jiren · Universe 11',
        summary: 'The Omni-Kings host a tournament of 8 universes. The losing universes are erased. Universe 7 assembles its 10 strongest fighters. Goku pushes beyond his limits against Jiren, awakening Ultra Instinct — a state even the Gods of Destruction cannot master.',
        fight: 'Mastered Ultra Instinct Goku vs Jiren — the pinnacle of Dragon Ball Super. Goku\'s silver-eyed form overwhelms Jiren until Jiren\'s full power breaks through. Android 17\'s sacrifice. Frieza and Goku\'s final combo.',
        transforms: ['Ultra Instinct Sign', 'Mastered Ultra Instinct', 'Jiren Full Power', 'SSB Kaioken x20', 'Golden Frieza'],
        iconic: 'Goku\'s Ultra Instinct awakens inside the Spirit Bomb. His hair turns silver. Every God in the arena stands in awe. The Grand Priest smiles. "That\'s... Ultra Instinct."',
        quote: '"Ultra Instinct... the state even the Gods cannot master." — Whis',
        powers: [
            { label: 'Jiren (Base)', pct: 88 },
            { label: 'Goku (SSB KKx20)', pct: 82 },
            { label: 'Goku (UI Sign)', pct: 91 },
            { label: 'Goku (MUI)', pct: 99 },
            { label: 'Jiren (Full)', pct: 97 },
        ]
    },
    superhero: {
        num: '06', color: '#F1C40F', title: 'SUPER HERO ARC', year: 'Age 784',
        villain: 'Cell Max · Gamma 1 & 2',
        summary: 'The Red Ribbon Army is revived by Dr. Hedo, who creates the Gamma androids. Piccolo discovers the plot and awakens his Orange form via Shenron. Gohan unlocks Beast form to defeat the incomplete Cell Max — a monster of pure destruction.',
        fight: 'Beast Gohan vs Cell Max — Gohan\'s eyes turn red, his hair goes white-silver. A Final Kamehameha through Cell Max\'s weak point ends the battle in a blinding explosion.',
        transforms: ['Orange Piccolo', 'Beast Gohan', 'Cell Max', 'Gamma 1 & 2'],
        iconic: 'Piccolo watches Gohan get beaten. His rage awakens a new potential — Orange Piccolo. Then Gohan\'s Beast form emerges: white hair, red eyes, power beyond Super Saiyan Blue.',
        quote: '"This is my true power — Beast Gohan has arrived!" — Gohan',
        powers: [
            { label: 'Orange Piccolo', pct: 72 },
            { label: 'Cell Max', pct: 85 },
            { label: 'Beast Gohan', pct: 95 },
            { label: 'Gamma 1 & 2', pct: 60 },
        ]
    },
    daima: {
        num: '07', color: '#FF4444', title: 'DAIMA', year: 'Age 785+',
        villain: 'Demon Realm · Gomah',
        summary: 'A mysterious wish on the Super Dragon Balls shrinks Goku and his allies to child size. They travel to the Demon Realm — a dark mirror of the living world — to undo the wish and uncover the conspiracy behind it.',
        fight: 'Mini Goku vs Gomah — even at child size, Goku\'s Saiyan spirit is undiminished. New transformations and techniques emerge as Goku adapts to his smaller form.',
        transforms: ['Mini Goku', 'Mini SSJ', 'Demon Realm Forms', 'New Transformations'],
        iconic: 'Goku, Vegeta, and Bulma as children again — but with the wisdom and power of gods. The contrast between their small bodies and immense ki creates some of the most visually striking moments in the franchise.',
        quote: '"Even small, the heart of a Saiyan never shrinks." — Goku',
        powers: [
            { label: 'Mini Goku', pct: 70 },
            { label: 'Gomah', pct: 78 },
            { label: 'Mini SSJ Goku', pct: 88 },
            { label: 'Demon Realm Boss', pct: 92 },
        ]
    }
};

window.openSagaModal = (sagaKey) => {
    const data = sagaData[sagaKey];
    if (!data) return;

    const modal = document.getElementById('saga-modal');
    const panel = document.getElementById('saga-modal-panel');

    // Set CSS color variable
    panel.style.setProperty('--modal-color', data.color);
    modal.style.setProperty('--modal-color', data.color);

    // Populate
    document.getElementById('saga-modal-num').textContent = data.num;
    document.getElementById('saga-modal-eyebrow').textContent = `DBZ ARC · ${data.year}`;
    document.getElementById('saga-modal-title').textContent = data.title;
    document.getElementById('saga-modal-villain-tag').textContent = data.villain;
    document.getElementById('saga-modal-summary').textContent = data.summary;
    document.getElementById('saga-modal-fight').textContent = data.fight;
    document.getElementById('saga-modal-iconic').textContent = data.iconic;
    document.getElementById('saga-modal-quote').textContent = data.quote;

    // Transforms
    const transformsEl = document.getElementById('saga-modal-transforms');
    transformsEl.innerHTML = data.transforms.map(t =>
        `<span class="saga-transform-tag">${t}</span>`
    ).join('');

    // Power bars
    const barsEl = document.getElementById('saga-power-bars');
    barsEl.innerHTML = data.powers.map(p =>
        `<div class="saga-power-row">
            <div class="saga-power-label">${p.label}</div>
            <div class="saga-power-track"><div class="saga-power-fill" data-pct="${p.pct}"></div></div>
            <div class="saga-power-val">${p.pct}%</div>
        </div>`
    ).join('');

    // Open modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playScouter();

    // Animate bars after a tick
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            barsEl.querySelectorAll('.saga-power-fill').forEach(bar => {
                bar.style.width = bar.dataset.pct + '%';
            });
        });
    });
};

window.closeSagaModal = () => {
    document.getElementById('saga-modal').classList.remove('open');
    document.body.style.overflow = '';
};

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSagaModal();
});

// ═══════════════════════════════════════════════════════════
// ⚔️ BATTLE SIMULATOR
// ═══════════════════════════════════════════════════════════
const fighters = [
    { name: 'Goku (MUI)',    power: 9_800_000, quote: '"I\'ll push past every limit!"', color: '#C0C0FF' },
    { name: 'Vegeta (UE)',   power: 9_200_000, quote: '"I am the Prince of all Saiyans!"', color: '#4488FF' },
    { name: 'Gohan (Beast)', power: 8_900_000, quote: '"This is my true power!"', color: '#FF8800' },
    { name: 'Jiren',         power: 9_500_000, quote: '"Power is absolute. Nothing surpasses it."', color: '#FF4444' },
    { name: 'Frieza (Black)',power: 8_500_000, quote: '"I am the strongest in the universe!"', color: '#AA44FF' },
    { name: 'Broly (SSJ)',   power: 9_100_000, quote: '"BRRROOOOLY!!!"', color: '#00FF88' },
    { name: 'Beerus',        power: 9_700_000, quote: '"Hakai."', color: '#9B59B6' },
    { name: 'Whis',          power: 9_999_999, quote: '"Oh my. How troublesome."', color: '#FFD700' },
    { name: 'Piccolo (Orange)', power: 7_200_000, quote: '"Makankosappo!"', color: '#27AE60' },
    { name: 'Krillin',       power: 1_000,    quote: '"SOLAR FLARE!"', color: '#FFD700' },
    { name: 'Yamcha',        power: 177,      quote: '"Wolf Fang Fist!"', color: '#FF6600' },
    { name: 'Nappa',         power: 4_000,    quote: '"Vegeta! How many is that?"', color: '#888888' },
];

let selectedFighter = [null, null];

const buildFighterGrids = () => {
    [1, 2].forEach(slot => {
        const grid = document.getElementById(`fighter${slot}-grid`);
        if (!grid) return;
        grid.innerHTML = fighters.map((f, i) =>
            `<button class="fighter-btn" data-slot="${slot}" data-idx="${i}" onclick="selectFighter(${slot},${i})">${f.name}</button>`
        ).join('');
    });
};

window.selectFighter = (slot, idx) => {
    selectedFighter[slot - 1] = idx;
    const f = fighters[idx];

    // Update card
    const nameEl = document.getElementById(`fighter${slot}-name`);
    const powerEl = document.getElementById(`fighter${slot}-power`);
    const card = document.getElementById(`fighter${slot}-card`);
    nameEl.textContent = f.name;
    powerEl.textContent = `PWR: ${f.power.toLocaleString()}`;
    card.classList.add('selected');
    card.style.borderColor = f.color;
    card.style.boxShadow = `0 0 20px ${f.color}44`;

    // Highlight active button
    document.querySelectorAll(`.fighter-btn[data-slot="${slot}"]`).forEach(b => b.classList.remove('active'));
    document.querySelector(`.fighter-btn[data-slot="${slot}"][data-idx="${idx}"]`).classList.add('active');

    playScouter();
};

window.runBattle = () => {
    const [i1, i2] = selectedFighter;
    const resultEl = document.getElementById('battle-result');

    if (i1 === null || i2 === null) {
        resultEl.innerHTML = `<p style="color:#FF4444;font-family:'JetBrains Mono',monospace;font-size:0.85rem;">SELECT BOTH FIGHTERS FIRST</p>`;
        resultEl.classList.add('visible');
        return;
    }
    if (i1 === i2) {
        resultEl.innerHTML = `<p style="color:#FF4444;font-family:'JetBrains Mono',monospace;font-size:0.85rem;">SELECT TWO DIFFERENT FIGHTERS</p>`;
        resultEl.classList.add('visible');
        return;
    }

    const f1 = fighters[i1], f2 = fighters[i2];

    // Determine winner before cinematic
    const roll1 = f1.power * (0.85 + Math.random() * 0.3);
    const roll2 = f2.power * (0.85 + Math.random() * 0.3);
    const winner = roll1 >= roll2 ? f1 : f2;
    const loser  = winner === f1 ? f2 : f1;
    const pct    = Math.round((Math.min(roll1, roll2) / Math.max(roll1, roll2)) * 100);

    let verdict;
    if (pct > 92) verdict = `An incredibly close battle — ${loser.name} pushed ${winner.name} to their absolute limit.`;
    else if (pct > 75) verdict = `${winner.name} wins, but ${loser.name} landed some devastating blows.`;
    else verdict = `${winner.name} dominates. ${loser.name} never stood a chance.`;

    // Launch cinematic
    console.log('Launching battle cinematic:', f1.name, 'vs', f2.name, '| Winner:', winner.name);
    launchBattleCinematic(f1, f2, winner, verdict);
};

const launchBattleCinematic = (f1, f2, winner, verdict) => {
    const cin = document.getElementById('battle-cinematic');
    const f1El = document.getElementById('bcin-f1');
    const f2El = document.getElementById('bcin-f2');
    const vsEl = document.getElementById('bcin-vs');
    const clashEl = document.getElementById('bcin-clash');
    const winnerWrap = document.getElementById('bcin-winner-wrap');
    const winnerName = document.getElementById('bcin-winner-name');
    const winnerQuote = document.getElementById('bcin-winner-quote');

    // Populate fighter 1
    document.getElementById('bcin-name1').textContent = f1.name.toUpperCase();
    document.getElementById('bcin-power1').textContent = `PWR: ${f1.power.toLocaleString()}`;
    document.getElementById('bcin-aura1').style.background = f1.color;
    const sil1 = document.getElementById('bcin-sil1');
    sil1.textContent = f1.name[0];
    sil1.style.color = f1.color;
    sil1.style.borderColor = f1.color;

    // Populate fighter 2
    document.getElementById('bcin-name2').textContent = f2.name.toUpperCase();
    document.getElementById('bcin-power2').textContent = `PWR: ${f2.power.toLocaleString()}`;
    document.getElementById('bcin-aura2').style.background = f2.color;
    const sil2 = document.getElementById('bcin-sil2');
    sil2.textContent = f2.name[0];
    sil2.style.color = f2.color;
    sil2.style.borderColor = f2.color;

    // Reset state
    f1El.className = 'battle-cin-fighter battle-cin-f1';
    f2El.className = 'battle-cin-fighter battle-cin-f2';
    vsEl.className = 'bcin-vs';
    clashEl.className = 'bcin-clash';
    winnerWrap.className = 'bcin-winner-wrap';
    winnerName.style.animation = 'none';
    winnerQuote.style.animation = 'none';
    document.querySelector('.bcin-winner-label').style.animation = 'none';
    document.querySelector('.bcin-close-btn').style.animation = 'none';

    // Show overlay
    cin.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Start canvas particles
    startBattleCanvas();

    // Step 1: Say "Tatakae!" (Fight! in Japanese) via speech
    setTimeout(() => {
        speakBattle('たたかえ！', 'ja-JP', 1.2);
        playKiCharge();
    }, 200);

    // Step 2: Fighters slide in from corners
    setTimeout(() => {
        f1El.classList.add('slide-in');
        f2El.classList.add('slide-in');
        playKiCharge();
    }, 400);

    // Step 3: VS appears
    setTimeout(() => {
        vsEl.classList.add('show');
        playScouter();
    }, 1200);

    // Step 4: VS hides, fighters dash toward center
    setTimeout(() => {
        vsEl.classList.add('hide');
        playKiCharge();
    }, 2000);

    setTimeout(() => {
        f1El.classList.remove('slide-in');
        f2El.classList.remove('slide-in');
        f1El.classList.add('dash');
        f2El.classList.add('dash');
        playThunder();
    }, 2200);

    // Step 5: Clash impact
    setTimeout(() => {
        f1El.classList.remove('dash');
        f2El.classList.remove('dash');
        f1El.classList.add('recoil');
        f2El.classList.add('recoil');
        clashEl.classList.add('active');
        cin.classList.add('flash');
        setTimeout(() => cin.classList.remove('flash'), 200);
        playClashSound();
    }, 2420);

    // Step 6: Show winner + announce name
    setTimeout(() => {
        clashEl.classList.remove('active');
        // Reset animations by forcing reflow
        winnerName.style.animation = 'none';
        winnerQuote.style.animation = 'none';
        document.querySelector('.bcin-winner-label').style.animation = 'none';
        document.querySelector('.bcin-close-btn').style.animation = 'none';
        void winnerName.offsetWidth;

        winnerName.textContent = winner.name.toUpperCase();
        winnerName.style.color = winner.color;
        winnerName.style.textShadow = `0 0 60px ${winner.color}, 0 0 120px ${winner.color}`;
        winnerQuote.textContent = `${winner.quote} — ${verdict}`;

        winnerName.style.animation = '';
        winnerQuote.style.animation = '';
        document.querySelector('.bcin-winner-label').style.animation = '';
        document.querySelector('.bcin-close-btn').style.animation = '';

        winnerWrap.classList.add('show');
        playKiCharge();

        // Announce winner name via speech
        setTimeout(() => {
            speakBattle(`${winner.name} wins!`, 'en-US', 0.9);
        }, 600);

        // Also update the battle-result below for reference
        const resultEl = document.getElementById('battle-result');
        resultEl.innerHTML = `
            <div class="battle-winner" style="color:${winner.color}">${winner.name} WINS</div>
            <div class="battle-verdict">${verdict}</div>
            <div class="battle-quote">${winner.quote}</div>
        `;
        resultEl.classList.add('visible');
    }, 3200);
};

window.closeBattleCinematic = () => {
    const cin = document.getElementById('battle-cinematic');
    cin.classList.remove('active');
    document.body.style.overflow = '';
    stopBattleCanvas();
};

// ── Speech synthesis ──
const speakBattle = (text, lang, rate = 1) => {
    try {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = lang;
        utt.rate = rate;
        utt.pitch = 1.1;
        utt.volume = 0.9;
        window.speechSynthesis.speak(utt);
    } catch(e) {}
};

// ── Clash sound ──
const playClashSound = () => {
    try {
        const ctx = getAudioCtx();
        // Impact thud
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
        }
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 400;
        src.buffer = buf;
        src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(1.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        src.start();

        // High crack on top
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(g2); g2.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        g2.gain.setValueAtTime(0.4, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
};

// ── Battle canvas particles ──
let battleCanvasRAF = null;
const startBattleCanvas = () => {
    const canvas = document.getElementById('battle-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = [];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            r: Math.random() * 3 + 0.5,
            a: Math.random() * 0.6 + 0.2,
            col: ['255,68,68','255,140,0','255,210,0','255,255,255'][Math.floor(Math.random()*4)],
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.col},${p.a})`;
            ctx.fill();
        }
        ctx.restore();
        battleCanvasRAF = requestAnimationFrame(draw);
    };
    draw();
};

const stopBattleCanvas = () => {
    if (battleCanvasRAF) { cancelAnimationFrame(battleCanvasRAF); battleCanvasRAF = null; }
    const canvas = document.getElementById('battle-canvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

document.addEventListener('DOMContentLoaded', () => {
    buildFighterGrids();
});

// ═══════════════════════════════════════════════════════════
// 🔥 TRANSFORMATION TREE
// ═══════════════════════════════════════════════════════════
const transformData = {
    base: {
        title: 'BASE FORM',
        color: '#aaaaaa',
        desc: 'Goku\'s natural state. Deceptively powerful — his base form alone surpasses most warriors in the universe. The foundation from which all transformations grow.',
        stats: ['Power: 10,000', 'Speed: High', 'Ki Control: Perfect', 'Stamina: Unlimited']
    },
    ssj: {
        title: 'SUPER SAIYAN',
        color: '#FFD700',
        desc: 'The legendary transformation achieved once every 1,000 years. Triggered by extreme emotional distress. Hair turns golden, eyes turn teal. Power multiplied 50x. First achieved by Goku on Namek.',
        stats: ['Multiplier: 50x', 'Hair: Golden', 'Eyes: Teal', 'Aura: Gold/Yellow']
    },
    ssj2: {
        title: 'SUPER SAIYAN 2',
        color: '#FFE44D',
        desc: 'The ascended form beyond Super Saiyan. Lightning crackles around the aura. First achieved by Gohan during the Cell Games. Power is 2x that of SSJ. The form that ended Cell.',
        stats: ['Multiplier: 100x', 'Lightning: Yes', 'First: Gohan', 'Aura: Electric Gold']
    },
    ssj3: {
        title: 'SUPER SAIYAN 3',
        color: '#FFEE88',
        desc: 'The ultimate natural Saiyan transformation. Hair grows to the waist, eyebrows disappear. Power is 4x SSJ2 but drains ki rapidly. Goku used it against Majin Buu. Gotenks achieved it in the Hyperbolic Time Chamber.',
        stats: ['Multiplier: 400x', 'Hair: Floor-length', 'Drain: Extreme', 'Duration: Short']
    },
    god: {
        title: 'SUPER SAIYAN GOD',
        color: '#FF4466',
        desc: 'A divine transformation achieved through a ritual of 5 righteous Saiyans. Hair turns red, body becomes leaner. Goku absorbed this power permanently after the battle with Beerus. The first God-level form.',
        stats: ['Level: Divine', 'Hair: Red', 'Origin: Ritual', 'Ki: Godly']
    },
    blue: {
        title: 'SUPER SAIYAN BLUE',
        color: '#00AAFF',
        desc: 'Super Saiyan God combined with Super Saiyan. Perfect ki control channels divine energy through the SSJ form. Hair turns blue, aura shines cyan. The standard form for battles against divine opponents.',
        stats: ['Level: God+SSJ', 'Hair: Blue', 'Ki: Perfect', 'Aura: Cyan']
    },
    ui: {
        title: 'ULTRA INSTINCT',
        color: '#C0C0FF',
        desc: 'The pinnacle of martial arts — the body moves and reacts without the mind\'s interference. Even Gods of Destruction struggle to master it. Silver hair, silver eyes. Goku\'s body becomes a perfect fighting machine that transcends thought.',
        stats: ['Level: Beyond Gods', 'Hair: Silver', 'Eyes: Silver', 'Body: Autonomous']
    }
};

document.querySelectorAll('.transform-node').forEach(node => {
    node.addEventListener('click', () => {
        const form = node.dataset.form;
        const data = transformData[form];
        if (!data) return;

        document.querySelectorAll('.transform-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        const detail = document.getElementById('transform-detail');
        detail.style.borderColor = data.color;
        detail.innerHTML = `
            <div class="transform-detail-title" style="color:${data.color}">${data.title}</div>
            <p class="transform-detail-desc">${data.desc}</p>
            <div class="transform-detail-stats">
                ${data.stats.map(s => `<span class="transform-stat" style="border-color:${data.color}44;color:${data.color}">${s}</span>`).join('')}
            </div>
        `;
        playScouter();
    });
});

// Saga background color shift on scroll
const sagaBgColors = {
    saiyan:    'radial-gradient(ellipse at center, rgba(255,102,0,0.12) 0%, transparent 70%)',
    namek:     'radial-gradient(ellipse at center, rgba(155,89,182,0.12) 0%, transparent 70%)',
    cell:      'radial-gradient(ellipse at center, rgba(39,174,96,0.12) 0%, transparent 70%)',
    buu:       'radial-gradient(ellipse at center, rgba(233,30,99,0.12) 0%, transparent 70%)',
    top:       'radial-gradient(ellipse at center, rgba(0,188,212,0.12) 0%, transparent 70%)',
    superhero: 'radial-gradient(ellipse at center, rgba(241,196,15,0.12) 0%, transparent 70%)',
    daima:     'radial-gradient(ellipse at center, rgba(255,68,68,0.12) 0%, transparent 70%)',
};

const sagaBgOverlay = document.getElementById('saga-bg-overlay');
if (sagaBgOverlay) {
    const sagaCards = document.querySelectorAll('.saga-card');
    const sagaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const key = entry.target.dataset.saga;
                if (sagaBgColors[key]) {
                    sagaBgOverlay.style.background = sagaBgColors[key];
                }
            }
        });
    }, { threshold: 0.5 });
    sagaCards.forEach(c => sagaObserver.observe(c));
}
