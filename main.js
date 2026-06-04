/* ==========================================================================
   NEELIMA DI'S TEDDY WORLD - CORE LOGIC & INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollToPlugin
    gsap.registerPlugin(ScrollToPlugin);

    // Shuffle and randomize Section 3 party slideshow images (using img1.png to img6.png)
    const slideImages = [
        "assets/img1.png",
        "assets/img2.png",
        "assets/img3.png",
        "assets/img4.png",
        "assets/img5.png",
        "assets/img6.png"
    ];
    // Fisher-Yates Shuffle
    for (let i = slideImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slideImages[i], slideImages[j]] = [slideImages[j], slideImages[i]];
    }
    const slideImgElements = document.querySelectorAll('.party-slide img');
    slideImgElements.forEach((img, idx) => {
        if (img && slideImages[idx]) {
            img.src = slideImages[idx];
        }
    });
    
    // Core States
    let isMusicPlaying = false;
    let musicStarted = false;
    let audioContext = null;
    let synthIntervalId = null;
    
    // Pages / Book states
    let currentBookPage = 1;
    const totalBookPages = 7;
    let foundTeddies = new Set();
    
    // Envelope & Diary states
    let isEnvelopeOpen = false;
    let currentDiaryPage = 0;
    const diaryNotes = [
        "Hiiiii 🌸💖\n\nSabse pehle...\n🎂 Happiest Birthday to youuuu!! 🎂",
        "Honestly, mujhe samajh nahi aa raha tha ki birthday gift mein kya doon...\n\nPhir ek chhote se teddy ne idea diya ✨",
        "Usne bola,\n\"Why not make a tiny teddy world for Neelima Di?\"\n\nAur bas phir ye poora teddy adventure shuru ho gaya 😌🎀",
        "Main bas itna kehna chahti hoon ki...\n\nThank you for all the smiles, random conversations, funny moments, aur memories jo face pe automatically smile le aati hain 😭💖",
        "Aaj aapka special day hai, toh officially permission hai:\n🍰 Extra cake khane ki\n✨ Extra boba peene ki\n🛍️ Extra shopping karne ki\n😌 Aur poore din queen ki tarah treat hone ki\n\nKyuki birthday girl rules don't need explanations 👑✨",
        "Aur haan...\n\nAgar aaj kisi bhi moment pe aap smile karo,\nToh samajh lena ki is website ka mission successful ho gaya 🎯",
        "Bas hamesha aise hi khush rehna,\nHaste rehna,\nAur apni cute si smile kabhi mat lose karna 🌸💕",
        "From,\nYour Tiny Teddy 💖\n\nwho secretly hopes this website made you smile at least once ✨🎂🌷"
    ];
    
    // Slideshow state
    let currentPartySlide = 0;
    let slideshowTimer = null;
    
    // Game state
    let isGameRunning = false;
    let gameScore = 0;
    let gameLoopId = null;
    let fallingTeddiesArray = [];
    const gameMilestones = {
        10: { icon: "🧸", title: "Super Catcher!", text: "You caught 10 teddy bears! Keep it up! 🌸" },
        20: { icon: "🐻", title: "Plushie Master!", text: "20 teddies caught! They all love you! ✨" },
        30: { icon: "🏆", title: "Teddy Champion!", text: "30 teddies caught! You unlocked the ultimate teddy award! 💖" }
    };
    
    // Gacha machine state
    let isGachaSpinning = false;
    const gachaWishes = [
        "May your days be full of smiles. 🌸",
        "May every dream find its way to you. 🍓",
        "May your teddy army always protect you. 🧸",
        "May your heart be light and filled with cozy warmth. 💖",
        "Wishing you a year as sweet as strawberry cupcakes. 🧁",
        "May you always find reasons to laugh out loud. 😂",
        "May your life be painted in soft pastel rainbows. 🌈",
        "May cozy nights and happy mornings greet you. ☕",
        "Sending you a giant teddy bear hug today! 🐻",
        "May your path always be sprinkled with stardust. ✨",
        "May you be surrounded by endless love and kindness. ❤️",
        "Wishing you sweet boba tea and warm cookies. 🧋",
        "May your worries melt away like cotton candy. ☁️",
        "May you always feel special, today and forever. 🌟",
        "Wishing you a sky full of happy possibilities. ☁️",
        "May your smile never lose its magic. 🌸",
        "May you always be warm and comfy in your own world. 🧸",
        "Wishing you gentle breezes and beautiful flowers. 🌺",
        "May your coffee always be sweet and your day cozy. 🥞",
        "May you always have a soft pillow and sweet dreams. 🌙",
        "Sending you a little basket of berries and hugs! 🍓",
        "May you shine brighter than a birthday sparkler! 💖",
        "May your heart always feel like a warm hug. 🧸",
        "Wishing you peaceful moments and happy songs. 🎵",
        "May your favorite teddy bear keep you safe. 🐻",
        "May your day be as sweet as honey. 🍯",
        "May your birthday bring sweet surprises. 🎁",
        "May you always have a pocketful of sunshine. ☀️",
        "Wishing you sweet strawberries and cream. 🍓",
        "May your heart dance with fluffy pink clouds. ☁️",
        "May you find happiness in the smallest things. 🌸",
        "Wishing you a magical world of plushies and love. 🧸",
        "May your path be lined with soft flower petals. 🌹",
        "May your laughter ring out sweet and clear. 🔔",
        "May today be the start of your happiest chapter. 📖",
        "Wishing you sweet cupcakes and chocolate buttons. 🧁",
        "May you always know how much you are cherished. 💖",
        "May your soul stay as pure as a fluffy bunny. 🐰",
        "Wishing you lazy Sunday afternoons and soft music. 🎻",
        "May you always stay as adorable and kind as you are. 🌸",
        "May you have a jar full of magical wishes. 🏺",
        "Wishing you sweet dreams and cozy pajamas. 🛌",
        "May your life be filled with sweet pastel stickers. 🎀",
        "May you get the biggest, fluffiest slice of cake! 🍰",
        "May your days be sweet like marshmallow fluff. 🍡",
        "Sending you a sky full of pastel balloons. 🎈",
        "May your heart always beat to a happy rhythm. 💓",
        "May your teddy always whisper sweet dreams to you. 🐻",
        "May your world be filled with sparkles and bows. 🎀",
        "May this birthday be the most special one yet! 🎂"
    ];

    // Mic blowout state
    let micStream = null;
    let micAnalyser = null;
    let micAudioContext = null;
    let isCandleBlownOut = false;
    let micAnalysisInterval = null;

    // Elements Cache
    const loader = document.getElementById('loader');
    const loadProgress = document.getElementById('load-progress');
    const heartIndicator = document.getElementById('heart-indicator');
    const mainContent = document.getElementById('main-content');
    const audioPrompt = document.getElementById('audio-prompt');
    const bgMusic = document.getElementById('bg-music');
    const musicPlayBtn = document.getElementById('music-play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const unmuteBtn = document.getElementById('unmute-btn');
    const skipAudioBtn = document.getElementById('skip-audio-btn');

    let bgMusicVolumeRatio = 1.0;
    
    // Typewriter sound setup (supports assets/type_sound.mp4 and assets/type_dot_type_sound.mp4)
    const typeSound = new Audio("assets/type_sound.mp4");
    typeSound.addEventListener('error', () => {
        if (typeSound.src.indexOf("type_dot_type_sound.mp4") === -1) {
            typeSound.src = "assets/type_dot_type_sound.mp4";
        }
    });

    function playTypeSound() {
        typeSound.currentTime = 0;
        typeSound.play().catch(e => console.log("Typewriter sound play deferred/failed:", e));
    }

    function updateAllBackgroundVolumes() {
        const baseVol = parseFloat(volumeSlider.value) || 0.5;
        const targetVol = baseVol * bgMusicVolumeRatio;
        
        bgMusic.volume = targetVol;
        
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo) {
            bgVideo.volume = targetVol;
        }
    }
    
    // Canvas & cursor
    const customCursor = document.getElementById('custom-cursor');
    const customCursorDot = document.getElementById('custom-cursor-dot');
    const cursorCanvas = document.getElementById('cursor-canvas');
    const particlesCanvas = document.getElementById('particles-canvas');

    // Section triggers
    const heroSection = document.getElementById('hero');
    const startAdventureBtn = document.getElementById('start-adventure-btn');
    const navigationSection = document.getElementById('navigation-section');

    /* ==========================================================================
       1. LOADING SCREEN TIMER
       ========================================================================== */
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                // Animate loader fade out
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                        loader.style.display = 'none';
                        // Show audio authorization modal
                        audioPrompt.classList.add('active');
                    }
                });
            }, 600);
        }
        loadProgress.style.width = progress + '%';
        heartIndicator.style.left = progress + '%';
    }, 80);


    /* ==========================================================================
       2. COZY HARP MUSIC SYNTHESIZER FALLBACK
       ========================================================================== */
    // A sweet arpeggiated music box chime in case music.mp3 fails to load
    function startSynthesizedMusic() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContextClass();
            
            // Sweet Happy Birthday lullaby notes (freq in Hz)
            const melody = [
                293.66, 293.66, 329.63, 293.66, 392.00, 369.99, // Happy birthday to you
                293.66, 293.66, 329.63, 293.66, 440.00, 392.00, // Happy birthday to you
                293.66, 293.66, 587.33, 493.88, 392.00, 369.99, 329.63, // Happy birthday dear Neelima
                523.25, 523.25, 493.88, 392.00, 440.00, 392.00  // Happy birthday to you
            ];
            
            const beats = [
                0.75, 0.25, 1, 1, 1, 2,
                0.75, 0.25, 1, 1, 1, 2,
                0.75, 0.25, 1, 1, 1, 1, 2,
                0.75, 0.25, 1, 1, 1, 3
            ];

            let noteIdx = 0;
            const tempo = 130; // BPM (Cozy & Slow)

            function playChime(freq, duration) {
                if (!audioContext) return;
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                // Triangle wave for smooth music-box flute sound
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                
                // Soft filter to remove sharp edges
                const filter = audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 1200;

                // Music Box volume envelope (plucked)
                gain.gain.setValueAtTime(0, audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(volumeSlider.value * 0.15 * bgMusicVolumeRatio, audioContext.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration - 0.05);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.start();
                osc.stop(audioContext.currentTime + duration);
            }

            function scheduleNote() {
                if (!isMusicPlaying) return;
                
                const beatDuration = (60 / tempo) * beats[noteIdx];
                playChime(melody[noteIdx], beatDuration);
                
                noteIdx = (noteIdx + 1) % melody.length;
                synthIntervalId = setTimeout(scheduleNote, beatDuration * 1000);
            }

            scheduleNote();
        } catch (e) {
            console.warn('Synth playback error:', e);
        }
    }

    function stopSynthesizedMusic() {
        if (synthIntervalId) {
            clearTimeout(synthIntervalId);
            synthIntervalId = null;
        }
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
    }

    function startBackgroundMusic() {
        if (musicStarted) return;
        musicStarted = true;
        isMusicPlaying = true;
        
        // Handle background video sound
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo) {
            bgVideo.muted = false;
            bgVideo.play().catch(e => console.log('Video audio play deferred:', e));
        }

        // Native volume setting via helper
        updateAllBackgroundVolumes();
        bgMusic.play()
            .then(() => {
                console.log('Audio file playback started.');
            })
            .catch(err => {
                console.log('Native audio failed, starting cute lullaby box synthesizer instead:', err);
                startSynthesizedMusic();
            });

        // Toggle visibility of floating player
        document.getElementById('music-player-container').style.transform = 'scale(1)';
        musicPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function toggleMusic() {
        const bgVideo = document.getElementById('bg-video');
        if (isMusicPlaying) {
            bgMusic.pause();
            if (bgVideo) bgVideo.muted = true;
            stopSynthesizedMusic();
            musicPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            isMusicPlaying = false;
        } else {
            isMusicPlaying = true;
            musicPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (bgVideo) {
                bgVideo.muted = false;
                bgVideo.play().catch(e => console.log(e));
            }
            updateAllBackgroundVolumes();
            bgMusic.play()
                .catch(() => {
                    startSynthesizedMusic();
                });
        }
    }

    // Audio Prompt hooks
    unmuteBtn.addEventListener('click', () => {
        audioPrompt.classList.remove('active');
        // Fade in main page
        gsap.to(mainContent, { opacity: 1, duration: 1 });
        startBackgroundMusic();
        setTimeout(triggerTeddyEntrance, 1200);
    });

    skipAudioBtn.addEventListener('click', () => {
        audioPrompt.classList.remove('active');
        // Fade in main page
        gsap.to(mainContent, { opacity: 1, duration: 1 });
        // Enable volume display but muted
        document.getElementById('music-player-container').style.transform = 'scale(1)';
        musicPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        isMusicPlaying = false;
        
        // Ensure background video is explicitly muted
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo) bgVideo.muted = true;
        setTimeout(triggerTeddyEntrance, 1200);
    });

    musicPlayBtn.addEventListener('click', toggleMusic);
    
    volumeSlider.addEventListener('input', (e) => {
        updateAllBackgroundVolumes();
    });


    /* ==========================================================================
       3. CUSTOM MOUSE CURSOR & CANVAS TRAIL SPARKLES
       ========================================================================= */
    const cursorCtx = cursorCanvas.getContext('2d');
    const sparkles = [];
    
    function resizeCursorCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    resizeCursorCanvas();
    window.addEventListener('resize', resizeCursorCanvas);

    let mouseCoords = { x: -100, y: -100, currentX: -100, currentY: -100 };

    window.addEventListener('mousemove', (e) => {
        mouseCoords.currentX = e.clientX;
        mouseCoords.currentY = e.clientY;
        
        customCursorDot.style.left = e.clientX + 'px';
        customCursorDot.style.top = e.clientY + 'px';

        // Spawn trailing sparkles
        if (Math.random() < 0.28) {
            sparkles.push(new SparkleParticle(e.clientX, e.clientY));
        }
    });

    class SparkleParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 3;
            this.speedX = (Math.random() - 0.5) * 2.5;
            this.speedY = Math.random() * 1.5 + 0.5; // drift downwards slightly
            this.opacity = 1;
            // Warm pastel glow: Pink, Gold, Lavender
            const colors = ['#FFD5E5', '#FFF5C3', '#E8D7FF', '#FFDAC1'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 6;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.02;
            this.rotation += this.rotSpeed;
            if (this.size > 0.1) this.size -= 0.08;
        }

        draw() {
            cursorCtx.save();
            cursorCtx.translate(this.x, this.y);
            cursorCtx.rotate((this.rotation * Math.PI) / 180);
            cursorCtx.globalAlpha = this.opacity;
            cursorCtx.fillStyle = this.color;
            
            // Draw a cute star-like shape (4-point sparkle)
            cursorCtx.beginPath();
            for (let i = 0; i < 4; i++) {
                cursorCtx.lineTo(0, -this.size);
                cursorCtx.lineTo(this.size * 0.3, -this.size * 0.3);
                cursorCtx.rotate(Math.PI / 2);
            }
            cursorCtx.closePath();
            cursorCtx.fill();
            cursorCtx.restore();
        }
    }

    // Cursor tracking ease loop
    function updateCursorAnimation() {
        const dx = mouseCoords.currentX - mouseCoords.x;
        const dy = mouseCoords.currentY - mouseCoords.y;
        mouseCoords.x += dx * 0.16;
        mouseCoords.y += dy * 0.16;

        customCursor.style.left = mouseCoords.x + 'px';
        customCursor.style.top = mouseCoords.y + 'px';

        // Redraw sparkle trail
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        for (let i = sparkles.length - 1; i >= 0; i--) {
            sparkles[i].update();
            if (sparkles[i].opacity <= 0 || sparkles[i].size <= 0.1) {
                sparkles.splice(i, 1);
            } else {
                sparkles[i].draw();
            }
        }
        requestAnimationFrame(updateCursorAnimation);
    }
    updateCursorAnimation();

    // Hook cursor hovers
    function bindCursorHovers() {
        const clickables = document.querySelectorAll('button, a, .plush-nav-btn, .hidden-teddy, .cafe-card, .gacha-knob-wrapper, .live-flame, .live-candle, .polaroid-card');
        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => document.body.classList.add('hovering-interactive'));
            item.addEventListener('mouseleave', () => document.body.classList.remove('hovering-interactive'));
        });
    }
    bindCursorHovers();


    /* ==========================================================================
       4. AMBIENT BACKGROUND PARTICLES (TEDDIES, PAWS, HEARTS, CLOUDS)
       ========================================================================== */
    const bgCtx = particlesCanvas.getContext('2d');
    const bgParticles = [];

    function resizeBgCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();
    window.addEventListener('resize', resizeBgCanvas);

    class BackgroundParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * window.innerHeight; // initial spray
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = window.innerHeight + 40;
            this.size = Math.random() * 22 + 14;
            this.speedY = -(Math.random() * 0.7 + 0.3); // moving up
            this.driftX = (Math.random() - 0.5) * 0.5;
            this.type = Math.floor(Math.random() * 3); // 0 = Teddy face, 1 = Paw, 2 = Heart
            this.opacity = Math.random() * 0.3 + 0.25;
            this.rotation = Math.random() * 20 - 10;
            this.rotSpeed = (Math.random() - 0.5) * 0.2;

            // Cozy warm pastel colors
            const colors = [
                `rgba(255, 213, 229, ${this.opacity})`, // Pink
                `rgba(232, 215, 255, ${this.opacity})`, // Lavender
                `rgba(255, 218, 193, ${this.opacity})`, // Peach
                `rgba(255, 245, 195, ${this.opacity})`  // Butter Yellow
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.driftX;
            this.rotation += this.rotSpeed;

            // Recycle if particle escapes top
            if (this.y < -40 || this.x < -40 || this.x > window.innerWidth + 40) {
                this.reset();
            }
        }

        draw() {
            bgCtx.save();
            bgCtx.translate(this.x, this.y);
            bgCtx.rotate((this.rotation * Math.PI) / 180);
            bgCtx.fillStyle = this.color;
            bgCtx.globalAlpha = this.opacity;

            if (this.type === 0) {
                // --- Cute Teddy Head drawing ---
                // Head
                bgCtx.beginPath();
                bgCtx.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
                bgCtx.fill();
                
                // Ears
                bgCtx.beginPath();
                bgCtx.arc(-this.size * 0.35, -this.size * 0.35, this.size * 0.18, 0, Math.PI * 2);
                bgCtx.arc(this.size * 0.35, -this.size * 0.35, this.size * 0.18, 0, Math.PI * 2);
                bgCtx.fill();
                
                // Muzzle (white overlay)
                bgCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.9})`;
                bgCtx.beginPath();
                bgCtx.arc(0, this.size * 0.08, this.size * 0.15, 0, Math.PI * 2);
                bgCtx.fill();
                
                // Nose (brown)
                bgCtx.fillStyle = `rgba(86, 64, 48, ${this.opacity * 0.9})`;
                bgCtx.beginPath();
                bgCtx.arc(0, this.size * 0.03, this.size * 0.04, 0, Math.PI * 2);
                bgCtx.fill();
            } else if (this.type === 1) {
                // --- Plush Paw Print ---
                // Center pad
                bgCtx.beginPath();
                bgCtx.arc(0, this.size * 0.08, this.size * 0.24, 0, Math.PI * 2);
                bgCtx.fill();
                // 4 Toes
                bgCtx.beginPath();
                bgCtx.arc(-this.size * 0.22, -this.size * 0.12, this.size * 0.09, 0, Math.PI * 2);
                bgCtx.arc(-this.size * 0.08, -this.size * 0.24, this.size * 0.09, 0, Math.PI * 2);
                bgCtx.arc(this.size * 0.08, -this.size * 0.24, this.size * 0.09, 0, Math.PI * 2);
                bgCtx.arc(this.size * 0.22, -this.size * 0.12, this.size * 0.09, 0, Math.PI * 2);
                bgCtx.fill();
            } else {
                // --- Fluffy Heart ---
                bgCtx.beginPath();
                bgCtx.moveTo(0, this.size / 4);
                bgCtx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/4, 0, this.size);
                bgCtx.bezierCurveTo(this.size, this.size/4, this.size/2, -this.size/2, 0, this.size/4);
                bgCtx.closePath();
                bgCtx.fill();
            }

            bgCtx.restore();
        }
    }

    // Populate particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
        bgParticles.push(new BackgroundParticle());
    }

    function renderBgParticles() {
        bgCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        bgParticles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(renderBgParticles);
    }
    renderBgParticles();


    // Robust smooth scroll helper with native fallback
    function smoothScrollTo(targetEl, offset = 20, duration = 1.2) {
        if (targetEl) {
            if (window.gsap && window.ScrollToPlugin) {
                gsap.to(window, {
                    scrollTo: { y: targetEl, offsetY: offset },
                    duration: duration,
                    ease: "power2.inOut"
                });
            } else {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    startAdventureBtn.addEventListener('click', () => {
        // Scroll smoothly to navigation section
        smoothScrollTo(navigationSection, 40, 1.2);
    });

    window.openSection = function(sectionName) {
        // Class name mapping for cards
        const btnClasses = {
            memories: 'memory-btn',
            mail: 'mail-btn',
            party: 'party-btn'
        };

        // Highlight selected card by giving a black border
        const plushBtns = document.querySelectorAll('.plush-nav-btn');
        plushBtns.forEach(btn => btn.classList.remove('selected-card'));

        const targetBtn = document.querySelector(`.${btnClasses[sectionName]}`);
        if (targetBtn) {
            targetBtn.classList.add('selected-card');
        }

        // Hide all active sections first
        const sections = ['memories', 'mail', 'party'];
        sections.forEach(s => {
            const el = document.getElementById(`${s}-section`);
            if (el) el.style.display = 'none';
        });

        // Show target section
        const targetEl = document.getElementById(`${sectionName}-section`);
        if (targetEl) {
            targetEl.style.display = 'block';
            bindCursorHovers();
            
            // Scroll to the section smoothly with fallback
            smoothScrollTo(targetEl, 20, 1.2);
        }

        // Section specific initializers
        if (sectionName === 'memories') {
            resetBook();
        } else if (sectionName === 'mail') {
            resetEnvelope();
        } else if (sectionName === 'party') {
            triggerPartyCountdown();
        }
    };

    window.scrollToNav = function() {
        smoothScrollTo(navigationSection, 40, 1.2);
    };


    /* ==========================================================================
       6. SECTION 1: MEMORY LAND (STORYBOOK PAGE SWAP & HIDDEN TEDDY)
       ========================================================================== */
    function resetBook() {
        currentBookPage = 1;
        updateBookPagesView();
    }

    window.animateBookOpen = function() {
        const bookIcon = document.getElementById('welcome-book-icon');
        if (!bookIcon || bookIcon.classList.contains('opening')) return;
        
        bookIcon.classList.add('opening');
        
        // CSS or GSAP animation on the book icon
        if (window.gsap) {
            // Animate closed book scaling, rotating, and swapping to open book
            const tl = gsap.timeline({
                onComplete: () => {
                    // Switch page after animation completes
                    changeBookPage(1);
                    // Reset class for future replay
                    bookIcon.classList.remove('opening');
                    // Reset to closed book emoji for next welcome view
                    bookIcon.innerText = '📔'; 
                    gsap.set(bookIcon, { rotateY: 0, scale: 1, opacity: 1 });
                }
            });
            
            tl.to(bookIcon, {
                rotateY: -90,
                scale: 1.25,
                duration: 0.45,
                ease: "power2.in"
            })
            .call(() => {
                bookIcon.innerText = '📖'; // Swap to open book emoji at midpoint
            })
            .to(bookIcon, {
                rotateY: -180,
                scale: 1.5,
                opacity: 0,
                duration: 0.45,
                ease: "power2.out"
            });
        } else {
            // Native fallback
            bookIcon.innerText = '📖';
            setTimeout(() => {
                changeBookPage(1);
                bookIcon.innerText = '📔';
                bookIcon.classList.remove('opening');
            }, 600);
        }
    };

    window.changeBookPage = function(direction) {
        currentBookPage += direction;
        if (currentBookPage < 1) currentBookPage = 1;
        if (currentBookPage > totalBookPages) currentBookPage = totalBookPages;
        
        updateBookPagesView();
    };

    function updateBookPagesView() {
        // Toggle page visibility classes
        for (let i = 1; i <= totalBookPages; i++) {
            const pageEl = document.getElementById(`book-page-${i}`);
            if (i === currentBookPage) {
                pageEl.classList.remove('page-hidden');
                pageEl.classList.add('page-active');
            } else {
                pageEl.classList.remove('page-active');
                pageEl.classList.add('page-hidden');
            }
        }
    }

    // Hidden Teddies popup triggers
    const teddyMessages = {
        1: "I was waiting for you to find me! 🧸",
        2: "You unlocked a secret teddy! Hugs! 🐻",
        3: "This memory deserved extra sparkle! ✨",
        4: "Hi Neelima Di! Wishing you sweet strawberry boba! 🧋",
        5: "You found another one! You're an expert teddy catcher! 🏆",
        6: "Keep smiling! You make the world so much softer! 🌸"
    };

    window.revealHiddenTeddy = function(id, btnEl) {
        if (foundTeddies.has(id)) return; // Already clicked
        foundTeddies.add(id);

        btnEl.classList.add('found');
        btnEl.innerHTML = '<i class="fas fa-heart"></i>';

        // Confetti burst on the button click
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { 
                x: btnEl.getBoundingClientRect().left / window.innerWidth,
                y: btnEl.getBoundingClientRect().top / window.innerHeight
            },
            colors: ['#FFD5E5', '#FFF5C3', '#E8D7FF']
        });

        // Show secret modal
        const modal = document.getElementById('teddy-secret-modal');
        const modalText = document.getElementById('secret-teddy-text');
        modalText.innerText = teddyMessages[id] || "You found a secret teddy! 🧸";
        modal.classList.add('active');
    };

    window.closeSecretModal = function() {
        const modal = document.getElementById('teddy-secret-modal');
        modal.classList.remove('active');
    };


    /* ==========================================================================
       7. SECTION 2: TEDDY MAIL (ENVELOPE DIARY READER)
       ========================================================================== */
    function resetEnvelope() {
        isEnvelopeOpen = false;
        currentDiaryPage = 0;
        
        const outer = document.getElementById('envelope-outer');
        if (outer) {
            outer.classList.remove('open');
            outer.classList.remove('reading');
        }
        document.getElementById('envelope-hint').style.display = 'block';
        document.getElementById('diary-text-area').innerHTML = '';

        // Restore background music volume to full
        bgMusicVolumeRatio = 1.0;
        updateAllBackgroundVolumes();
    }

    window.closeEnvelope = function() {
        if (!isEnvelopeOpen) return;
        
        const outer = document.getElementById('envelope-outer');
        if (outer) {
            outer.classList.remove('reading');
            setTimeout(() => {
                outer.classList.remove('open');
                resetEnvelope();
            }, 600);
        }
    };

    window.toggleEnvelope = function() {
        if (isEnvelopeOpen) return; // Don't close on click, use controls
        isEnvelopeOpen = true;

        const outer = document.getElementById('envelope-outer');
        outer.classList.add('open');
        document.getElementById('envelope-hint').style.display = 'none';

        // Wait for envelope flap to lift before entering reading mode
        setTimeout(() => {
            outer.classList.add('reading');
            loadDiaryPage();
        }, 800);
    };

    function loadDiaryPage() {
        const txtArea = document.getElementById('diary-text-area');
        txtArea.innerHTML = ''; // Reset
        
        const note = diaryNotes[currentDiaryPage];
        let idx = 0;
        
        // Disable nav buttons during typing
        document.getElementById('diary-prev-btn').style.pointerEvents = 'none';
        document.getElementById('diary-next-btn').style.pointerEvents = 'none';

        function type() {
            if (idx < note.length) {
                txtArea.innerHTML += note.charAt(idx);
                idx++;
                setTimeout(type, 45);
            } else {
                // Enable nav buttons
                document.getElementById('diary-prev-btn').style.pointerEvents = 'all';
                document.getElementById('diary-next-btn').style.pointerEvents = 'all';
            }
        }
        
        // Delay typewriter start slightly for smooth layout transition
        setTimeout(type, 300);
    }

    window.nextDiaryPage = function(event) {
        event.stopPropagation(); // Stop envelope toggle trigger
        
        // Play typewriter sound
        playTypeSound();
        
        // Lower background music volume
        bgMusicVolumeRatio = 0.15;
        updateAllBackgroundVolumes();

        if (currentDiaryPage < diaryNotes.length - 1) {
            currentDiaryPage++;
            loadDiaryPage();
        } else {
            // End of note card, close envelope
            window.closeEnvelope();
        }
    };

    window.prevDiaryPage = function(event) {
        event.stopPropagation();
        if (currentDiaryPage > 0) {
            currentDiaryPage--;
            loadDiaryPage();
        }
    };

    // Close envelope when clicking outside of envelope-outer
    document.addEventListener('click', (event) => {
        const envelope = document.getElementById('envelope-outer');
        if (isEnvelopeOpen && envelope) {
            if (!envelope.contains(event.target)) {
                window.closeEnvelope();
            }
        }
    });


    /* ==========================================================================
       8. SECTION 3: BIRTHDAY PARTY (COUNTDOWN & CELEBRATION SHOWER)
       ========================================================================== */
    function triggerPartyCountdown() {
        const overlay = document.getElementById('party-countdown');
        const numEl = document.getElementById('party-countdown-num');
        overlay.style.display = 'flex';
        
        let seconds = 3;
        numEl.innerText = "🐻 3";

        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                numEl.innerText = "🐻 " + seconds;
                // Pop animation
                gsap.fromTo(numEl, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
            } else {
                clearInterval(interval);
                overlay.style.display = 'none';
                
                // Burst heavy confetti
                triggerConfettiShower();
                // Initialize slideshow auto rotators
                startSlideshowTimer();
            }
        }, 1100);
    }

    function triggerConfettiShower() {
        // Double diagonal spray
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ['#FFD5E5', '#FFF5C3', '#E8D7FF', '#BFF0FF']
        });
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ['#FFD5E5', '#FFF5C3', '#E8D7FF', '#BFF0FF']
        });
    }

    // Slideshow navigation
    window.navigatePartySlides = function(direction) {
        const slides = document.querySelectorAll('.party-slide');
        slides[currentPartySlide].classList.remove('slide-active');
        
        currentPartySlide += direction;
        if (currentPartySlide >= slides.length) currentPartySlide = 0;
        if (currentPartySlide < 0) currentPartySlide = slides.length - 1;

        slides[currentPartySlide].classList.add('slide-active');
        startSlideshowTimer(); // Reset timer
    };

    function startSlideshowTimer() {
        if (slideshowTimer) clearInterval(slideshowTimer);
        slideshowTimer = setInterval(() => {
            navigatePartySlides(1);
        }, 4000);
    }


    /* ==========================================================================
       9. NEW FEATURE: INTERACTIVE TEDDY GUIDE & STARS HUNT LOGIC
       ========================================================================== */
    let collectedStars = new Set();
    const totalRequiredStars = 10;
    
    // TTS disabled per user request
    function playTeddyVoiceSpeech(textLine, toneType = 'neutral') {
        // No operation – TTS removed
    }

    // Dialogue script lines mapping
    const dialogueLines = [
        "Hiiiii Neelima Diiii! 🧸💕",
        "Today is a very special day...",
        "Because it's your birthdayyyy!! 🎂✨",
        "I made a tiny teddy world just for you.",
        "But before we start...",
        "Will you go on a birthday adventure with me?"
    ];

    window.triggerTeddyEntrance = function() {
        const container = document.getElementById('teddy-guide-container');
        const character = document.getElementById('teddy-guide-character');
        const bubbleText = document.getElementById('teddy-speech-text');
        const choices = document.getElementById('teddy-choices');
        
        if (!container || !character) return;
        
        // Initial setup
        container.style.display = 'flex';
        container.style.left = '-150px';
        character.classList.add('walking');
        
        // Walk in from left
        gsap.to(container, {
            left: '20px',
            duration: 2.2,
            ease: "power2.out",
            onComplete: () => {
                character.classList.remove('walking');
                character.classList.add('waving');
                startDialogueSequence();
            }
        });
    };

    let dialogueIdx = 0;
    function startDialogueSequence() {
        const bubbleText = document.getElementById('teddy-speech-text');
        const choices = document.getElementById('teddy-choices');
        const character = document.getElementById('teddy-guide-character');
        
        function nextLine() {
            if (dialogueIdx < dialogueLines.length) {
                const text = dialogueLines[dialogueIdx];
                // Set speech text
                bubbleText.innerHTML = text;
                dialogueIdx++;
                
                // Speak the text
                playTeddyVoiceSpeech(text, 'neutral');
                
                // Dialog events chimes/action matches
                if (dialogueIdx === 3) { // birthday confetti
                    confetti({
                        particleCount: 15,
                        spread: 35,
                        colors: ['#FFD5E5', '#FFF5C3']
                    });
                    character.classList.remove('waving');
                    character.classList.add('happy-dance');
                    setTimeout(() => character.classList.remove('happy-dance'), 1200);
                }
                
                // Continue script loop with custom wait delays
                let delay = 1800;
                if (dialogueIdx === 1 || dialogueIdx === 5) delay = 1000;
                if (dialogueIdx === dialogueLines.length) {
                    // Show YES/MAYBE choices
                    setTimeout(() => {
                        choices.style.display = 'flex';
                    }, 800);
                } else {
                    setTimeout(nextLine, delay);
                }
            }
        }
        
        nextLine();
    }

    window.chooseTeddyOption = function(option) {
        const choices = document.getElementById('teddy-choices');
        const bubbleText = document.getElementById('teddy-speech-text');
        const character = document.getElementById('teddy-guide-character');
        const noBtn = document.getElementById('choice-no-btn');
        
        if (option === 'maybe') {
            const msg = "Awwww... But I worked really hard on it... Pleaseeeee? 🥺";
            character.className = 'teddy-guide-character sad';
            bubbleText.innerHTML = "Awwww... <br>But I worked really hard on it... <br>Pleaseeeee? 🥺";
            playTeddyVoiceSpeech(msg, 'sad');
            
            // Shake button to draw focus
            noBtn.classList.add('button-shake');
            
            setTimeout(() => {
                // Fade out/remove Maybe Later button, leaving only Yes
                noBtn.style.transition = 'opacity 0.6s, transform 0.6s';
                noBtn.style.opacity = '0';
                noBtn.style.pointerEvents = 'none';
            }, 2500);
            
        } else if (option === 'yes') {
            // Yes option! Start birthday star hunt
            choices.style.display = 'none';
            const msg = "YAYYYYYYY!!! Let's gooooo! ⭐🧸✨";
            character.className = 'teddy-guide-character happy-dance';
            bubbleText.innerHTML = "YAYYYYYYY!!! <br>Let's gooooo! ⭐🧸✨";
            playTeddyVoiceSpeech(msg, 'happy');
            
            // Confetti explosion
            confetti({
                particleCount: 70,
                spread: 80,
                origin: { y: 0.85 }
            });
            
            setTimeout(() => {
                character.className = 'teddy-guide-character';
                triggerStarHuntMission();
            }, 2200);
        }
    };

    function triggerStarHuntMission() {
        const bubbleText = document.getElementById('teddy-speech-text');
        const character = document.getElementById('teddy-guide-character');
        const container = document.getElementById('teddy-guide-container');
        
        const msg = "OH NOOOOOOO! I lost all my Birthday Stars! Can you help me find them?";
        bubbleText.innerHTML = "OH NOOOOOOO! 😭<br>I lost all my Birthday Stars!<br>Can you help me find them?";
        playTeddyVoiceSpeech(msg, 'neutral');
        
        setTimeout(() => {
            // Display Floating star counter
            const counter = document.getElementById('star-counter-container');
            if (counter) {
                counter.style.display = 'flex';
                gsap.from(counter, { scale: 0, rotation: -20, duration: 0.5, ease: "back.out" });
            }
            
            const msg = "Look around the sections. Pick all 10 stars to unlock your birthday surprise!";
            bubbleText.innerHTML = "Look around the sections. Pick all ⭐ 10 stars to unlock your birthday surprise! 🎁";
            playTeddyVoiceSpeech(msg, 'neutral');
            
            // Pop guide out for a moment to clear the screen space
            setTimeout(() => {
                gsap.to(container, {
                    bottom: '-250px',
                    duration: 0.8,
                    ease: "power2.in",
                    onComplete: () => {
                        container.style.display = 'none';
                    }
                });
            }, 4500);
        }, 3200);
    }

    // Star collection handler
    window.collectStar = function(starId, event) {
        event.stopPropagation();
        if (collectedStars.has(starId)) return;
        collectedStars.add(starId);
        
        const starEl = document.getElementById(starId);
        if (!starEl) return;
        
        // Play sparkle sound/synth
        playTeddyVoiceSpeech(starId.replace('star-', 'Star '), 'happy');
        
        // Confetti poof right at the star coords
        const rect = starEl.getBoundingClientRect();
        confetti({
            particleCount: 15,
            spread: 30,
            origin: {
                x: rect.left / window.innerWidth,
                y: rect.top / window.innerHeight
            },
            colors: ['#FFF5C3', '#FFD5E5']
        });
        
        // Fly star animation path towards the top-left star counter
        const counterEl = document.getElementById('star-counter-container');
        const counterRect = counterEl.getBoundingClientRect();
        
        starEl.classList.add('collected');
        
        gsap.to(starEl, {
            x: counterRect.left - rect.left,
            y: counterRect.top - rect.top,
            scale: 0.4,
            rotation: 180,
            duration: 0.9,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                starEl.style.display = 'none';
                updateStarCountDisplay();
            }
        });
    };

    function updateStarCountDisplay() {
        const count = collectedStars.size;
        document.getElementById('stars-found-num').innerText = count;
        
        // React immediately via guide popup alerts on finding stars
        const popupText = [
            "You found one!! ⭐",
            "Yayyyy!! ✨",
            "You're really good at this!",
            "Only a few more!",
            "You're helping so much! 💖"
        ];
        
        const randomQuote = popupText[Math.floor(Math.random() * popupText.length)];
        
        // Check Milestones first
        if (count === 3) {
            triggerGuidePopupReaction("Wowww! You're amazing at this! ⭐");
        } else if (count === 5) {
            triggerGuidePopupReaction("Halfway there!! 🎀");
        } else if (count === 8) {
            triggerGuidePopupReaction("The surprise is getting excited!! 🧸✨");
        } else if (count === totalRequiredStars) {
            triggerUltimateSurpriseReveal();
        } else {
            // General cute popup reaction occasionally
            if (Math.random() < 0.75) {
                triggerGuidePopupReaction(randomQuote);
            }
        }
    }

    function triggerGuidePopupReaction(textMessage) {
        const container = document.getElementById('teddy-guide-container');
        const bubbleText = document.getElementById('teddy-speech-text');
        const character = document.getElementById('teddy-guide-character');
        
        if (!container || !bubbleText) return;
        
        // Reset styles and actions
        character.className = 'teddy-guide-character waving';
        bubbleText.innerHTML = textMessage;
        playTeddyVoiceSpeech(textMessage, 'neutral');
        
        container.style.display = 'flex';
        gsap.to(container, {
            bottom: '20px',
            duration: 0.6,
            ease: "back.out"
        });
        
        // Hide again after a short delay
        setTimeout(() => {
            gsap.to(container, {
                bottom: '-250px',
                duration: 0.6,
                ease: "power2.in",
                onComplete: () => {
                    container.style.display = 'none';
                    character.className = 'teddy-guide-character';
                }
            });
        }, 3200);
    }

    function triggerUltimateSurpriseReveal() {
        const container = document.getElementById('teddy-guide-container');
        const bubbleText = document.getElementById('teddy-speech-text');
        const character = document.getElementById('teddy-guide-character');
        
        if (!container || !bubbleText) return;
        
        character.className = 'teddy-guide-character happy-dance';
        bubbleText.innerHTML = "YOU FOUND THEM ALLLLLL!!! 🎉🎂⭐";
        playTeddyVoiceSpeech("YOU FOUND THEM ALLLLLL!!!", 'happy');
        
        // Big heavy confetti
        triggerConfettiShower();
        
        container.style.display = 'flex';
        gsap.to(container, {
            bottom: '20px',
            duration: 0.6,
            ease: "back.out"
        });
        
        setTimeout(() => {
            // Unlock wish section
            const wishSec = document.getElementById('wish-moment-section');
            if (wishSec) {
                wishSec.style.display = 'block';
                wishSec.classList.remove('locked-section');
                
                // Scroll down to the unlocked wish section
                smoothScrollTo(wishSec, 20, 1.5);
            }
            
            // Pop out guide bear
            setTimeout(() => {
                gsap.to(container, {
                    bottom: '-250px',
                    duration: 0.6,
                    ease: "power2.in",
                    onComplete: () => {
                        container.style.display = 'none';
                    }
                });
            }, 3500);
        }, 2200);
    }

    // Occasional comments popped up when browsing sections
    const cornerPrompts = [
        "This is one of my favorite parts! 🧸",
        "Did you find any stars yet? ⭐",
        "Keep exploring! 🎀",
        "You're doing great! 💖"
    ];

    setInterval(() => {
        // If stars hunt is active and not fully completed yet, occasionally prompt
        if (collectedStars.size > 0 && collectedStars.size < totalRequiredStars) {
            const randomMsg = cornerPrompts[Math.floor(Math.random() * cornerPrompts.length)];
            triggerGuidePopupReaction(randomMsg);
        }
    }, 28000);


    /* ==========================================================================
       10. TEDDY CAFE INTERACTIVE SPEECH BUBBLES
       ========================================================================== */
    const cafeItemsMessages = {
        milk: [
            "Made with teddy love. 🍓",
            "Super sweet strawberry bubble cream! 🥛",
            "Sip and smile! 🌸"
        ],
        boba: [
            "Extra sweetness for today's birthday girl. 🧋",
            "Boba pearls shaped like tiny bear faces! 🧸",
            "Sweet boba for a sweet Di. 💖"
        ],
        cupcake: [
            "A little bite of happiness. 🧁",
            "Sprinkles of joy for you! ✨",
            "Creamy cupcake love! 💖"
        ],
        cake: [
            "May your day be filled with cake! 🍰",
            "Baked with fluffy teddy bear hugs! 🐻",
            "Yummiest birthday slice ever! 🎉"
        ]
    };

    window.tapCafeItem = function(itemType, cardEl) {
        const bubble = document.getElementById(`cafe-bubble-${itemType}`);
        const quotes = cafeItemsMessages[itemType];
        
        // Random message selection
        const randomMsg = quotes[Math.floor(Math.random() * quotes.length)];
        bubble.innerText = randomMsg;

        // Toggle pop class
        cardEl.classList.add('popped');
        
        // Click burst
        confetti({
            particleCount: 10,
            spread: 30,
            origin: { 
                x: cardEl.getBoundingClientRect().left / window.innerWidth,
                y: cardEl.getBoundingClientRect().top / window.innerHeight
            },
            colors: ['#FFD5E5', '#FFF5C3']
        });

        // Hide bubble after 2.5s
        setTimeout(() => {
            cardEl.classList.remove('popped');
        }, 2500);
    };


    /* ==========================================================================
       11. MINI GAME: CATCH THE TEDDY CLICKER
       ========================================================================== */
    window.startGame = function() {
        if (isGameRunning) return;
        isGameRunning = true;
        gameScore = 0;
        document.getElementById('game-score').innerText = "0";
        document.getElementById('start-game-btn').innerText = "Running...";
        document.getElementById('start-game-btn').style.pointerEvents = 'none';

        fallingTeddiesArray = [];
        
        // Main game interval loop (spawn bears)
        let gameTime = 0;
        gameLoopId = setInterval(() => {
            gameTime += 100;
            // Spawn a bear every 700ms
            if (gameTime % 700 === 0) {
                spawnFallingBear();
            }
            
            // Move bears down
            updateFallingBears();
            
            // Game limit: 30 seconds
            if (gameTime >= 30000) {
                endGame();
            }
        }, 100);
    };

    function spawnFallingBear() {
        const canvasArea = document.getElementById('game-canvas-area');
        const bear = document.createElement('div');
        bear.className = 'falling-bear';
        
        // Random horizontal start
        const maxX = canvasArea.clientWidth - 50;
        bear.style.left = Math.floor(Math.random() * maxX) + 'px';
        bear.style.top = '-50px';

        // Select a cute emoji or symbol
        const bearSymbols = ["🧸", "🐰", "🐱", "🦊", "🍓", "🧁"];
        bear.innerText = bearSymbols[Math.floor(Math.random() * bearSymbols.length)];

        // Append to box
        canvasArea.appendChild(bear);

        const bearObj = {
            element: bear,
            x: parseFloat(bear.style.left),
            y: -50,
            speed: Math.random() * 6 + 4
        };

        bear.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            catchBear(bearObj);
        });

        bear.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            catchBear(bearObj);
        });

        fallingTeddiesArray.push(bearObj);
    }

    function updateFallingBears() {
        const canvasArea = document.getElementById('game-canvas-area');
        const heightLimit = canvasArea.clientHeight;

        for (let i = fallingTeddiesArray.length - 1; i >= 0; i--) {
            const bear = fallingTeddiesArray[i];
            bear.y += bear.speed;
            bear.element.style.top = bear.y + 'px';

            // Remove if escapes bottom
            if (bear.y > heightLimit) {
                bear.element.remove();
                fallingTeddiesArray.splice(i, 1);
            }
        }
    }

    function catchBear(bearObj) {
        // Confetti pop on target click coordinates
        confetti({
            particleCount: 8,
            spread: 30,
            origin: { 
                x: bearObj.element.getBoundingClientRect().left / window.innerWidth,
                y: bearObj.element.getBoundingClientRect().top / window.innerHeight
            },
            colors: ['#FFD5E5', '#FFF5C3']
        });

        bearObj.element.remove();
        
        // Remove from tracking array
        const index = fallingTeddiesArray.indexOf(bearObj);
        if (index > -1) {
            fallingTeddiesArray.splice(index, 1);
        }

        // Increment score
        gameScore++;
        document.getElementById('game-score').innerText = gameScore;

        // Check milestones
        if (gameMilestones[gameScore]) {
            triggerGameReward(gameScore);
        }
    }

    function triggerGameReward(score) {
        const milestone = gameMilestones[score];
        const modal = document.getElementById('game-reward-modal');
        document.getElementById('reward-icon').innerText = milestone.icon;
        document.getElementById('reward-title').innerText = milestone.title;
        document.getElementById('reward-text').innerText = milestone.text;
        
        modal.classList.add('active');
        
        // Double burst for rewards
        triggerConfettiShower();
    }

    window.closeGameReward = function() {
        document.getElementById('game-reward-modal').classList.remove('active');
    };

    function endGame() {
        clearInterval(gameLoopId);
        isGameRunning = false;
        document.getElementById('start-game-btn').innerText = "Play Again";
        document.getElementById('start-game-btn').style.pointerEvents = 'all';

        // Clear remaining elements
        fallingTeddiesArray.forEach(b => b.element.remove());
        fallingTeddiesArray = [];
    }


    /* ==========================================================================
       12. TEDDY WISH MACHINE (GACHA MECHANICAL HANDLES)
       ========================================================================== */
    window.dispenseWishCapsule = function() {
        if (isGachaSpinning) return;
        isGachaSpinning = true;

        const knob = document.getElementById('gacha-knob');
        const slot = document.getElementById('gacha-slot');

        // Spin knob animation
        gsap.to(knob, {
            rotation: 360,
            duration: 0.6,
            ease: "power1.inOut",
            onComplete: () => {
                knob.style.transform = 'rotate(0deg)'; // reset rotation
                
                // Spawn a capsule drop element in slot
                const capsuleEl = document.createElement('div');
                capsuleEl.className = 'dispensed-capsule-element';
                
                // Random pastel capsule colors
                const colors = ['#FFD5E5', '#BFF0FF', '#E8D7FF', '#FFF5C3', '#FFDAC1'];
                capsuleEl.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                slot.appendChild(capsuleEl);
                
                // Capsule click event to open and reveal wish
                capsuleEl.addEventListener('click', () => {
                    revealGachaWish(capsuleEl);
                });
            }
        });
    };

    function revealGachaWish(capsuleEl) {
        // Remove capsule from dispenser slot
        capsuleEl.remove();
        
        // Set random wish
        const textEl = document.getElementById('gacha-wish-text');
        const randomWish = gachaWishes[Math.floor(Math.random() * gachaWishes.length)];
        textEl.innerText = randomWish;

        // Display reveal wrapper
        const revealWrapper = document.getElementById('gacha-reveal');
        revealWrapper.style.display = 'flex';
        
        // Wait 100ms then apply open splits
        setTimeout(() => {
            revealWrapper.classList.add('open');
        }, 100);
    }

    window.closeGachaReveal = function() {
        const revealWrapper = document.getElementById('gacha-reveal');
        revealWrapper.classList.remove('open');
        
        setTimeout(() => {
            revealWrapper.style.display = 'none';
            isGachaSpinning = false;
        }, 600);
    };


    /* ==========================================================================
       13. WISH MOMENT: MICROPHONE STREAM & ANALYZER CANDLE BLOWOUT
       ========================================================================== */
    window.startMicBlowAnalysis = function() {
        const promptLabel = document.getElementById('candle-prompt-label');
        const micWidget = document.getElementById('mic-widget');
        const fallbackBtn = document.getElementById('fallback-blow-btn');
        const wishBtn = document.getElementById('wish-btn');

        wishBtn.style.display = 'none';
        micWidget.style.display = 'flex';
        
        // Show fallback after 4s if mic permission lags
        const permissionTimeout = setTimeout(() => {
            fallbackBtn.style.display = 'block';
        }, 4000);

        // Fetch User Microphone stream
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                clearTimeout(permissionTimeout);
                micStream = stream;
                
                // Audio analyser
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                micAudioContext = new AudioCtx();
                const source = micAudioContext.createMediaStreamSource(stream);
                micAnalyser = micAudioContext.createAnalyser();
                
                micAnalyser.fftSize = 512;
                source.connect(micAnalyser);
                
                // Start listening analyzer loop
                analyzeBlowing();
            })
            .catch(err => {
                console.warn('Microphone permission denied or unsupported:', err);
                clearTimeout(permissionTimeout);
                fallbackBtn.style.display = 'block';
                document.getElementById('listening-subtext').innerText = "Mic blocked. No worries! Tap below to blow out the candle! 🎂";
            });
    };

    function analyzeBlowing() {
        const bufferLength = micAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let consecutiveBlowFrames = 0;
        const flame = document.getElementById('live-flame');

        function checkFrame() {
            if (isCandleBlownOut) return;

            micAnalyser.getByteFrequencyData(dataArray);

            // Breath blows = low-frequency high-amplitude noise (bins 1-12)
            let lowFreqSum = 0;
            const lowBinsCount = 12;
            for (let i = 1; i <= lowBinsCount; i++) {
                lowFreqSum += dataArray[i];
            }
            const averageAmplitude = lowFreqSum / lowBinsCount;

            // Lower threshold: 35 — easy to trigger by blowing near the mic
            if (averageAmplitude > 35) {
                consecutiveBlowFrames++;
                // Give live visual feedback — flame flickers harder as blow builds
                if (flame && consecutiveBlowFrames <= 3) {
                    const intensity = consecutiveBlowFrames / 3;
                    flame.style.transform = `scaleX(${1 + intensity * 0.6}) rotate(${intensity * 25}deg)`;
                    flame.style.opacity = `${1 - intensity * 0.4}`;
                    flame.style.transition = 'transform 0.08s ease, opacity 0.08s ease';
                }
            } else {
                // Decay — reset flame on silence
                consecutiveBlowFrames = Math.max(0, consecutiveBlowFrames - 1);
                if (flame && consecutiveBlowFrames === 0) {
                    flame.style.transform = '';
                    flame.style.opacity = '1';
                }
            }

            // Need 3 sustained blow frames (~60ms) to blow out
            if (consecutiveBlowFrames >= 3) {
                triggerConfettiBlowout();
            } else {
                requestAnimationFrame(checkFrame);
            }
        }

        checkFrame();
    }

    window.triggerConfettiBlowout = function() {
        if (isCandleBlownOut) return;
        isCandleBlownOut = true;

        // Stop mic streams
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
        }
        if (micAudioContext) {
            micAudioContext.close();
        }

        const flame = document.getElementById('live-flame');
        const smoke = document.getElementById('candle-smoke');

        // Step 1: Flame blows sideways dramatically
        if (flame) {
            flame.style.transition = 'transform 0.15s ease, opacity 0.3s ease';
            flame.style.transform = 'scaleX(2.5) rotate(40deg) translateX(8px)';
            flame.style.opacity = '0.3';
        }

        // Step 2: Flame vanishes, smoke appears
        setTimeout(() => {
            if (flame) flame.style.display = 'none';
            if (smoke) {
                smoke.style.display = 'block';
                smoke.style.animation = 'drift-smoke 1.5s ease forwards';
            }
        }, 300);

        // Hide mic widgets
        document.getElementById('mic-widget').style.display = 'none';
        document.getElementById('candle-prompt-label').style.display = 'none';

        // Confetti burst 🎉
        confetti({
            particleCount: 180,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD5E5', '#FFF5C3', '#E8D7FF', '#BFF0FF', '#FFDAC1']
        });

        // Continuous celebration confetti
        const celebrationTimer = setInterval(() => {
            confetti({
                particleCount: 45,
                angle: Math.random() * 60 + 60,
                spread: 65,
                origin: { x: Math.random() },
                colors: ['#FFD5E5', '#FFF5C3', '#E8D7FF', '#BFF0FF']
            });
        }, 600);

        setTimeout(() => { clearInterval(celebrationTimer); }, 4500);

        // Reveal final message
        setTimeout(() => {
            const finalBox = document.getElementById('final-message-box');
            if (finalBox) {
                finalBox.style.display = 'block';
                smoothScrollTo(finalBox, 20, 1.2);
            }
        }, 1800);
    };

    window.replayTeddyWorld = function() {
        // Reset states
        isCandleBlownOut = false;
        document.getElementById('live-flame').style.display = 'block';
        document.getElementById('candle-smoke').style.display = 'none';
        document.getElementById('final-message-box').style.display = 'none';
        document.getElementById('wish-btn').style.display = 'inline-flex';
        document.getElementById('candle-prompt-label').style.display = 'block';
        
        // Reset Star Hunt
        collectedStars.clear();
        document.getElementById('stars-found-num').innerText = '0';
        document.getElementById('star-counter-container').style.display = 'none';
        
        // Re-lock finale
        const wishSec = document.getElementById('wish-moment-section');
        if (wishSec) {
            wishSec.style.display = 'none';
            wishSec.classList.add('locked-section');
        }

        // Reset all stars HTML element display for collectability again
        document.querySelectorAll('.birthday-star').forEach(star => {
            star.style.display = 'block';
            star.classList.remove('collected');
            star.style.transform = '';
            star.style.opacity = '1';
            star.style.left = '';
            star.style.top = '';
            star.style.x = '';
            star.style.y = '';
        });

        // Reset dialogue indices and run guide entrance again
        dialogueIdx = 0;
        const noBtn = document.getElementById('choice-no-btn');
        if (noBtn) {
            noBtn.style.opacity = '1';
            noBtn.style.pointerEvents = 'all';
            noBtn.classList.remove('button-shake');
        }
        const choices = document.getElementById('teddy-choices');
        if (choices) choices.style.display = 'none';

        // Scroll back to navigation section
        smoothScrollTo(navigationSection, 40, 1.5);
        setTimeout(triggerTeddyEntrance, 2000);
    };

});
