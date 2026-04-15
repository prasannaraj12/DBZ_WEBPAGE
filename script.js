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
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: ".lore-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
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
        setTimeout(initAnimations, 200);
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
// ?? DRAGON BALL COLLECTION
// ---------------------------------------
let collectedBalls = 0;

window.collectBall = (el) => {
    if (el.classList.contains('collected')) return;
    el.classList.add('collected');
    collectedBalls++;
    document.getElementById('db-count').textContent = collectedBalls;
    playKiCharge();
    if (collectedBalls === 7) {
        setTimeout(() => summonShenron(), 800);
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

// Wish response map
const wishResponses = [
    { keywords: ['ultra instinct', 'ui', 'migatte'],   response: '"YOUR WISH IS GRANTED. ULTRA INSTINCT AWAKENS."' },
    { keywords: ['immortal', 'immortality', 'eternal'], response: '"IMMORTALITY... A DANGEROUS WISH. GRANTED."' },
    { keywords: ['saiyan', 'super saiyan', 'ssj'],      response: '"THE POWER OF A SUPER SAIYAN FLOWS THROUGH YOU."' },
    { keywords: ['strong', 'power', 'strength'],        response: '"YOUR POWER LEVEL IS NOW... OVER 9,000."' },
    { keywords: ['wish', 'anything', 'everything'],     response: '"SUCH AMBITION. YOUR WISH SHALL BE GRANTED."' },
    { keywords: ['goku', 'vegeta', 'gohan', 'piccolo'], response: '"THE LEGENDARY WARRIOR ANSWERS YOUR CALL."' },
    { keywords: ['dragon ball', 'dragonball'],          response: '"THE DRAGON BALLS RESPOND TO YOUR DESIRE."' },
    { keywords: ['money', 'rich', 'wealth'],            response: '"...SHENRON DOES NOT DEAL IN EARTHLY COIN."' },
    { keywords: ['love', 'heart'],                      response: '"EVEN I CANNOT FORCE THE HEART OF ANOTHER."' },
];

const getShenronResponse = (wish) => {
    const lower = wish.toLowerCase();
    for (const entry of wishResponses) {
        if (entry.keywords.some(k => lower.includes(k))) return entry.response;
    }
    return '"SO BE IT. YOUR WISH... IS GRANTED."';
};

const summonShenron = () => {
    const overlay = document.getElementById('shenron-overlay');
    const shenronBody = document.getElementById('shenron-body');
    const content = document.getElementById('shenron-content');
    const wishBox = document.getElementById('wish-box');
    const responseEl = document.getElementById('shenron-response');
    const wishInput = document.getElementById('wish-input');

    // Reset state
    overlay.classList.add('active');
    shenronBody.classList.remove('risen');
    content.classList.remove('visible');
    wishBox.classList.remove('shown');
    wishBox.textContent = '';
    if (responseEl) responseEl.textContent = '';
    if (wishInput) wishInput.value = '';

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
            }, 900);
        }
    }, 220);

    // Wish grant button
    const grantBtn = document.getElementById('wish-grant-btn');
    if (grantBtn) {
        grantBtn.onclick = () => {
            const wish = wishInput ? wishInput.value.trim() : '';
            if (!wish) return;
            playKiCharge();
            const resp = getShenronResponse(wish);
            if (responseEl) {
                responseEl.textContent = resp;
                responseEl.style.opacity = '0';
                setTimeout(() => { responseEl.style.opacity = '1'; }, 50);
            }
            wishBox.textContent = `"${wish}"`;
            wishBox.classList.add('shown');
        };
    }

    // Close button
    document.getElementById('wish-close').onclick = () => {
        overlay.classList.remove('active');
        lightningActive = false;
        if (lCtx) lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
        // Reset balls
        collectedBalls = 0;
        document.getElementById('db-count').textContent = 0;
        document.querySelectorAll('.db-ball').forEach(b => b.classList.remove('collected'));
    };
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
    const STAR_COUNT = 150;  // reduced from 300
    const stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.6 + 0.2,
        a: Math.random() * 0.7 + 0.15,
        tw: Math.random() * Math.PI * 2,
        spd: Math.random() * 0.012 + 0.003,
    }));

    const drawBackground = () => {
        // Base dark radial gradient centred on energy source
        const cx = W() / 2, cy = H() * 0.6;
        const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W(), H()));
        bg.addColorStop(0,   'rgba(22,5,48,1)');
        bg.addColorStop(0.35,'rgba(10,2,22,1)');
        bg.addColorStop(1,   'rgba(0,0,4,1)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W(), H());

        // Slowly drifting nebula veins
        [
            [0.15, 0.28, 0.38, 80, 0, 160, 0.13, 0.4],
            [0.82, 0.35, 0.32, 0, 80, 150, 0.09, 0.35],
            [0.50, 0.80, 0.50, 200, 100, 10, 0.20, 0.7],
        ].forEach(([nx, ny, nr, r, g, b, a, tmod]) => {
            const px = W() * nx, py = H() * ny, rad = Math.max(W(), H()) * nr;
            const pulse = a * (0.8 + 0.2 * Math.sin(t * tmod));
            const n = ctx.createRadialGradient(px, py, 0, px, py, rad);
            n.addColorStop(0,   `rgba(${r},${g},${b},${pulse})`);
            n.addColorStop(1,    'rgba(0,0,0,0)');
            ctx.fillStyle = n;
            ctx.fillRect(0, 0, W(), H());
        });

        // Stars
        for (const s of stars) {
            s.tw += s.spd;
            const a = s.a * (0.45 + 0.55 * Math.sin(s.tw));
            ctx.beginPath();
            ctx.arc(s.x * W(), s.y * H(), s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(210,225,255,${a})`;
            ctx.fill();
        }
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
        const poolH = H() * 0.06;
        const py = H() - poolH * 0.5;
        const beat = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.6));

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Oval glow pool on the "ground"
        const pool = ctx.createRadialGradient(cx, H(), 0, cx, H(), poolW);
        pool.addColorStop(0,   `rgba(255,230,100,${0.55 * beat})`);
        pool.addColorStop(0.2, `rgba(255,160,20,${0.35 * beat})`);
        pool.addColorStop(0.5, `rgba(220,60,0,${0.18 * beat})`);
        pool.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = pool;
        ctx.fillRect(0, H() * 0.85, W(), H() * 0.15);

        // Heat shimmer lines inside the pool
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
            const lx = cx + (Math.random() - 0.5) * poolW * 1.4;
            const la = (0.08 + 0.08 * beat) * Math.random();
            ctx.beginPath();
            ctx.moveTo(lx, H());
            ctx.lineTo(lx + (Math.random() - 0.5) * 30, H() - poolH * (0.5 + Math.random() * 0.5));
            ctx.strokeStyle = `rgba(255,240,180,${la})`;
            ctx.stroke();
        }
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

            // Main ring
            ctx.beginPath();
            ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${s.color},${Math.max(0, s.alpha)})`;
            ctx.lineWidth   = s.thick;
            ctx.shadowColor = `rgba(${s.color},0.9)`;
            ctx.shadowBlur  = 30;
            ctx.stroke();

            // Twin faint secondary ring 12px behind
            if (s.twin && s.r > 12) {
                ctx.beginPath();
                ctx.arc(cx, cy, s.r - 12, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${s.color},${Math.max(0, s.alpha * 0.35)})`;
                ctx.lineWidth   = s.thick * 0.5;
                ctx.shadowBlur  = 12;
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

            // Thick glowing trail that fades
            for (let j = 0; j < p.trail.length - 1; j++) {
                const ta = (j / p.trail.length) * p.a * 0.7;
                const lw = p.r * (j / p.trail.length) * 2.5;
                ctx.beginPath();
                ctx.moveTo(p.trail[j].x, p.trail[j].y);
                ctx.lineTo(p.trail[j+1].x, p.trail[j+1].y);
                ctx.strokeStyle = `rgba(${p.color},${ta})`;
                ctx.lineWidth   = lw;
                ctx.shadowColor = `rgba(${p.color},0.6)`;
                ctx.shadowBlur  = 8;
                ctx.stroke();
            }

            // Bright head glow
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
            g.addColorStop(0, `rgba(${p.color},${p.a})`);
            g.addColorStop(1, `rgba(${p.color},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = g;
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

        // ── Orbital plasma rings (tilted ellipses to fake 3D)
        for (const orb of ORBITALS) {
            orb.spd !== 0 && (orb._angle = (orb._angle || 0) + orb.spd);
            const ang = orb._angle || 0;
            const scaleY = Math.abs(Math.sin(orb.tilt + orbRot * 0.3));
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(ang);
            ctx.scale(1, Math.max(0.12, scaleY));
            ctx.beginPath();
            ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${orb.color},${orb.a * (0.7 + 0.3 * beat)})`;
            ctx.lineWidth   = orb.width;
            ctx.shadowColor = `rgba(${orb.color},0.8)`;
            ctx.shadowBlur  = 22;
            ctx.stroke();

            // Bright spark on the ring
            const sx = orb.r, sy = 0;
            const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
            sg.addColorStop(0, `rgba(${orb.color},1)`);
            sg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2);
            ctx.fillStyle = sg; ctx.fill();
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

    // Recursive fractal lightning branch
    const drawBranch = (x1, y1, x2, y2, depth, alpha, col) => {
        if (depth <= 0 || alpha < 0.04) return;
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 60;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 60;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(${col},${alpha})`;
        ctx.lineWidth = depth * 0.8;
        ctx.shadowColor = `rgba(${col},1)`; ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(x2, y2);
        ctx.stroke();
        // Random branches
        if (Math.random() > 0.5) {
            const bx = mx + Math.cos(Math.random() * Math.PI * 2) * 80;
            const by = my + Math.sin(Math.random() * Math.PI * 2) * 80;
            drawBranch(mx, my, bx, by, depth - 1, alpha * 0.55, col);
        }
        drawBranch(x1, y1, mx, my, depth - 1, alpha * 0.7, col);
        drawBranch(mx, my, x2, y2, depth - 1, alpha * 0.7, col);
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
        if (arcTimer > 6 + Math.random() * 10) {
            spawnArc();
            if (Math.random() > 0.5) spawnArc();
            arcTimer = 0;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = arcs.length - 1; i >= 0; i--) {
            const a = arcs[i];
            ctx.shadowBlur = 0;
            drawBranch(a.x1, a.y1, a.x2, a.y2, 3, a.life * 0.85, a.color);
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
        for (const e of embers) {
            e.x += e.vx + noise1(e.y * 10, t) * 0.001;
            e.y += e.vy;
            if (e.y < -0.05) { e.y = 0.95 + Math.random() * 0.05; e.x = 0.3 + Math.random() * 0.4; }
            if (e.x < 0 || e.x > 1) e.vx *= -1;
            const g = ctx.createRadialGradient(e.x*W(), e.y*H(), 0, e.x*W(), e.y*H(), e.r * 2.5);
            g.addColorStop(0, `rgba(${e.col},${e.a})`);
            g.addColorStop(1, `rgba(${e.col},0)`);
            ctx.beginPath(); ctx.arc(e.x*W(), e.y*H(), e.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = g; ctx.fill();
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
