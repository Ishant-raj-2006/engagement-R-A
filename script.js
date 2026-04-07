document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".animate-on-scroll");
    const audio = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicToggle");
    const heartsContainer = document.querySelector(".floating-hearts");
    const countdownEl = document.getElementById("countdown");
    const welcomeOverlay = document.getElementById("welcome-overlay");
    const welcomeButton = document.getElementById("welcome-btn");

    let isPlaying = false;
    let currentMusicPath = "";

    // 1. Music switching logic (Fade effect)
    function playMusic(src) {
        if (currentMusicPath === src) return; 
        
        currentMusicPath = src;
        
        // Fade Out
        let fadeOut = setInterval(() => {
            if (audio.volume > 0.1) {
                audio.volume -= 0.1;
            } else {
                clearInterval(fadeOut);
                audio.src = src;
                audio.load();
                audio.play().then(() => {
                    isPlaying = true;
                    musicBtn.classList.add("playing");
                    musicBtn.innerHTML = '<span class="icon">⏸</span>';
                    // Fade In
                    audio.volume = 0;
                    let fadeIn = setInterval(() => {
                        if (audio.volume < 0.5) {
                            audio.volume += 0.1;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }).catch(e => console.log("Waiting for user interaction"));
            }
        }, 50);
    }

    // 2. IntersectionObserver for Scroll Moments
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                const newMusic = entry.target.getAttribute("data-music");
                if (newMusic && isPlaying) {
                    playMusic(newMusic);
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));

    // 3. Welcome Button Click Trigger
    const startJourney = () => {
        if (!isPlaying) {
            // Fade out the welcome overlay
            welcomeOverlay.classList.add("fade-out");
            
            // Allow scrolling
            document.body.style.overflowY = "auto";
            
            // Start with music1.mp3 (Hero Section)
            const firstMusic = sections[0].getAttribute("data-music");
            playMusic(firstMusic);
            
            // Remove click and scroll listeners after the journey starts
            welcomeButton.removeEventListener("click", startJourney);
        }
    };

    if (welcomeButton) {
        welcomeButton.addEventListener("click", startJourney);
    }

    // Music Button Toggle
    musicBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove("playing");
            musicBtn.innerHTML = '<span class="icon">♪</span>';
        } else {
            audio.play();
            musicBtn.classList.add("playing");
            musicBtn.innerHTML = '<span class="icon">⏸</span>';
        }
        isPlaying = !isPlaying;
    });

    // 4. Floating Hearts Effect
    function createHeart() {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.className = "floating-heart-element";
        heart.style.position = "absolute";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "100vh";
        heart.style.fontSize = Math.random() * 20 + 10 + "px";
        heart.style.opacity = Math.random();
        heart.style.transition = "all 5s linear";
        heart.style.pointerEvents = "none";
        heart.style.zIndex = "1";
        
        if (heartsContainer) {
            heartsContainer.appendChild(heart);
            setTimeout(() => {
                heart.style.top = "-10vh";
                heart.style.transform = `translateX(${Math.random() * 100 - 50}px)`;
            }, 100);
            setTimeout(() => heart.remove(), 6000);
        }
    }

    setInterval(createHeart, 300);

    // 5. Countdown Timer (Set your wedding date here)
    const weddingDate = new Date("2026-12-25T00:00:00").getTime();

    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `
            <div class="countdown-item"><span class="countdown-number">${days}</span><span class="countdown-label">Days</span></div>
            <div class="countdown-item"><span class="countdown-number">${hours}</span><span class="countdown-label">Hrs</span></div>
            <div class="countdown-item"><span class="countdown-number">${minutes}</span><span class="countdown-label">Min</span></div>
            <div class="countdown-item"><span class="countdown-number">${seconds}</span><span class="countdown-label">Sec</span></div>
        `;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. Next & Back Button Navigation
    const navSections = [
        document.querySelector(".hero"),
        ...document.querySelectorAll(".story"),
        document.querySelector(".ending")
    ];

    document.querySelectorAll(".next-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentSection = btn.closest("section");
            const currentIndex = navSections.indexOf(currentSection);
            if (currentIndex < navSections.length - 1) {
                navSections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    document.querySelectorAll(".prev-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentSection = btn.closest("section");
            const currentIndex = navSections.indexOf(currentSection);
            if (currentIndex > 0) {
                navSections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});