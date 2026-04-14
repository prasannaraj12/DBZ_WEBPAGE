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
    const MAX_SPARKS = 30;

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
    try {
        // Fetch all pages (API has 58 characters across 4 pages)
        const page1 = await fetch('https://dragonball-api.com/api/characters?limit=20&page=1').then(r => r.json());
        const page2 = await fetch('https://dragonball-api.com/api/characters?limit=20&page=2').then(r => r.json());
        const page3 = await fetch('https://dragonball-api.com/api/characters?limit=20&page=3').then(r => r.json());

        allCharacters = [...page1.items, ...page2.items, ...page3.items];
        renderCharacters('all');

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

        setTimeout(initAnimations, 200);
    } catch (e) {
        console.error('Failed to load characters:', e);
        if (wrapper) wrapper.innerHTML = `<p style="color:red; min-width:300px;">Failed to load characters. Check connection.</p>`;
        setTimeout(initAnimations, 100);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
});

// Loader logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 1200);
    }
});
