/* ==========================================================================
   PUJA SHRESTHA - 21ST BIRTHDAY INTERACTIVE CINEMATIC WEBSITE
   Complete Script Architecture & Scene Controller
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURATION OBJECT
   -------------------------------------------------------------------------- */
const birthdayConfig = {
    name: "Puja Shrestha",
    age: 21,
    birthday: "05/29/2062",
    birthdayNepali: "5th Bhadra 2062",

    music: "song/birthday-song.mp3",
    specialVideo: "videos/puja-memory.mp4",

    memories: [
        {
            image: "photos/photo 1.png",
            caption: "Beautiful beyond every word."
        },
        {
            image: "photos/photo 2.png",
            caption: "Still effortlessly beautiful, Puja."
        },
        {
            image: "photos/photo 3.png",
            caption: "Sari ma jhanai sundar."
        },
        {
            image: "photos/photo 4.png",
            caption: "Simply beautiful in every way"
        },
        {
            image: "photos/photo 5.png",
            caption: "Aama chori, beauty overloaded"
        },
        {
            image: "photos/photo 6.png",
            caption: "Two smiles, one beautiful moment"
        },
        {
            image: "photos/photo 7.png",
            caption: "Still admiring from afar"
        },
        {
            image: "photos/photo 8.png",
            caption: "Beautiful beyond every word"
        },
        {
            image: "photos/photo 9.png",
            caption: "Eyes that steal attention"
        },
        {
            image: "photos/photo 10.png",
            caption: "Pure innocence, timeless beauty"
        },
        {
            image: "photos/photo 11.png",
            caption: "Your smile still shines."
        },
        {
            image: "photos/photo 12.png",
            caption: "Red sarima.. goddess in red"
        },
        {
            image: "photos/photo 13.png",
            caption: "Some beauty never fades"
        },
        {
            image: "photos/photo 14.png",
            caption: "Innocent face.."
        }
    ]
};

/* --------------------------------------------------------------------------
   2. PERSONAL BIRTHDAY LETTER TEXT
   -------------------------------------------------------------------------- */
const birthdayLetter = `Happy Birthday, Puja ❤️

21 looks beautiful on you.

I wish you everything beautiful in life — happiness, peace, success, and all the little things that make you smile.

It's been a long time since we've been apart, and life has taken us in different directions. But some stories don't really end just because people walk different paths.

You are still my incomplete story.

And maybe I don't know how our story is supposed to end, but I know one thing — I will never put a full stop to it.

I still find myself admiring you from a distance, even through your TikTok videos. So keep posting them. Keep smiling. Keep being the person you are. Somewhere out here, someone is still quietly happy to see you happy.

And whenever life feels heavy, whenever you feel sad or sorrowful, I hope you remember that you don't have to face everything alone.

I'll always be somewhere here, wishing the best for you.

I know I want to get you back, but maybe we won't be together again. Maybe life has chosen different paths for both of us.

But even if we don't end up together, I want you to know that I'll always be there for you.

I don't expect anything from you.

I just want you to be happy.

And whenever life gets difficult, I hope you remember that somewhere, there is someone who still cares about you and wishes the very best for you.

Maybe we won't be together. Maybe one day we'll become nothing more than a memory in each other's lives.

But that doesn't mean you'll ever be erased from me.

Some people leave your life, but they don't leave your heart completely. And no matter where life takes us, you'll always have a place in my story — a place that time and distance can't simply erase.

Today, forget everything else.

Just smile.

Enjoy your day.

Celebrate yourself.

Because you deserve happiness.

Happy 21st Birthday, Puja. 🎂❤️

Keep smiling. Keep being happy. Keep shining.

And maybe, somewhere between all the memories and all the distance...

our story isn't finished yet.
.`;

/* --------------------------------------------------------------------------
   3. GLOBAL STATE & SYSTEM VARS
   -------------------------------------------------------------------------- */
let audioInstance = null;
let isAudioPlaying = false;
let audioContext = null;
let micAnalyser = null;
let micStream = null;
let micCheckInterval = null;

let currentLightboxIndex = 0;
let poppedBalloonsCount = 0;
let poppedBalloonsSet = new Set();
let confettiActive = false;
let confettiParticles = [];

/* --------------------------------------------------------------------------
   4. INITIALIZATION & EVENT LISTENERS
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    setupEventListeners();
    startScene1Animation();
    createCake();
    createMemoryGallery();
});

function setupEventListeners() {
    // Scene 1 Start button
    const unlockStartBtn = document.getElementById("unlockStartBtn");
    if (unlockStartBtn) {
        unlockStartBtn.addEventListener("click", () => {
            switchScene("scene-opening", "scene-lock");
        });
    }

    // Scene 2 Unlock Form
    const lockForm = document.getElementById("lockForm");
    if (lockForm) {
        lockForm.addEventListener("submit", (e) => {
            e.preventDefault();
            unlockBirthday();
        });
    }

    // Scene 3 Intro Next
    const introNextBtn = document.getElementById("introNextBtn");
    if (introNextBtn) {
        introNextBtn.addEventListener("click", () => {
            switchScene("scene-intro", "scene-cake");
        });
    }

    // Scene 4 Cake Controls
    const micBlowBtn = document.getElementById("micBlowBtn");
    if (micBlowBtn) micBlowBtn.addEventListener("click", startBlowDetection);

    const tapBlowBtn = document.getElementById("tapBlowBtn");
    if (tapBlowBtn) tapBlowBtn.addEventListener("click", blowCandles);

    const cakeNextBtn = document.getElementById("cakeNextBtn");
    if (cakeNextBtn) {
        cakeNextBtn.addEventListener("click", () => {
            switchScene("scene-cake", "scene-balloons");
            createBalloons();
        });
    }

    // Scene 5 Balloons Next & Pop Next Controls
    const balloonsNextBtn = document.getElementById("balloonsNextBtn");
    if (balloonsNextBtn) {
        balloonsNextBtn.addEventListener("click", () => {
            switchScene("scene-balloons", "scene-gallery");
        });
    }

    const popNextBalloonBtn = document.getElementById("popNextBalloonBtn");
    if (popNextBalloonBtn) {
        popNextBalloonBtn.addEventListener("click", popNextBalloon);
    }

    const closeBalloonPhotoBtn = document.getElementById("closeBalloonPhotoBtn");
    if (closeBalloonPhotoBtn) {
        closeBalloonPhotoBtn.addEventListener("click", () => {
            const modal = document.getElementById("balloonPhotoModal");
            if (modal) modal.classList.add("hidden-element");
        });
    }

    // Scene 6 Gallery Next
    const galleryNextBtn = document.getElementById("galleryNextBtn");
    if (galleryNextBtn) {
        galleryNextBtn.addEventListener("click", playSpecialVideo);
    }

    // Lightbox Controls
    const lightboxClose = document.getElementById("lightboxCloseBtn");
    const lightboxPrev = document.getElementById("lightboxPrevBtn");
    const lightboxNext = document.getElementById("lightboxNextBtn");
    const lightbox = document.getElementById("lightbox");

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => navigateLightbox(1));

    document.addEventListener("keydown", (e) => {
        if (!lightbox || lightbox.classList.contains("hidden-element")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateLightbox(-1);
        if (e.key === "ArrowRight") navigateLightbox(1);
    });

    // Scene 8 Letter Next
    const letterNextBtn = document.getElementById("letterNextBtn");
    if (letterNextBtn) {
        letterNextBtn.addEventListener("click", showMysteriousMessage);
    }

    // Scene 11 Replay
    const replayBtn = document.getElementById("replayBtn");
    if (replayBtn) replayBtn.addEventListener("click", resetExperience);

    // Audio Widget Controls
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener("click", toggleMusicPlay);
    }

    const volumeSlider = document.getElementById("volumeSlider");
    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            if (audioInstance) audioInstance.volume = e.target.value;
        });
    }

    const muteBtn = document.getElementById("muteBtn");
    if (muteBtn) {
        muteBtn.addEventListener("click", () => {
            if (!audioInstance) return;
            audioInstance.muted = !audioInstance.muted;
            muteBtn.textContent = audioInstance.muted ? "🔇" : "🔊";
        });
    }
}

/* --------------------------------------------------------------------------
   5. AUDIO SYSTEM CONTROLLER (startMusic)
   -------------------------------------------------------------------------- */
function startMusic() {
    if (!audioInstance) {
        audioInstance = new Audio(birthdayConfig.music);
        audioInstance.loop = true;
        audioInstance.volume = 0.7;

        audioInstance.addEventListener("error", () => {
            showMicOrAudioError("The music couldn't be loaded, but the surprise can still continue. ❤️");
        });
    }

    audioInstance.play().then(() => {
        isAudioPlaying = true;
        updateAudioWidgetUI();
    }).catch(err => {
        console.log("Autoplay prevented or audio blocked: ", err);
    });

    const widget = document.getElementById("audioWidget");
    if (widget) widget.classList.remove("hidden");
}

function toggleMusicPlay() {
    if (!audioInstance) {
        startMusic();
        return;
    }
    if (isAudioPlaying) {
        audioInstance.pause();
        isAudioPlaying = false;
    } else {
        audioInstance.play();
        isAudioPlaying = true;
    }
    updateAudioWidgetUI();
}

function updateAudioWidgetUI() {
    const visualizer = document.getElementById("visualizer");
    const musicIcon = document.getElementById("musicIcon");
    if (isAudioPlaying) {
        if (visualizer) visualizer.classList.add("playing");
        if (musicIcon) musicIcon.textContent = "🎵";
    } else {
        if (visualizer) visualizer.classList.remove("playing");
        if (musicIcon) musicIcon.textContent = "🔇";
    }
}

function showMicOrAudioError(msg) {
    const statusText = document.getElementById("micStatusText");
    if (statusText) {
        statusText.textContent = msg;
    }
}

/* --------------------------------------------------------------------------
   6. SCENE TRANSITION UTILITY
   -------------------------------------------------------------------------- */
function switchScene(fromSceneId, toSceneId) {
    const fromEl = document.getElementById(fromSceneId);
    const toEl = document.getElementById(toSceneId);

    if (fromEl) {
        gsap.to(fromEl, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => {
                fromEl.classList.remove("active-scene");
                fromEl.classList.add("hidden-scene");

                if (toEl) {
                    toEl.classList.remove("hidden-scene");
                    toEl.classList.add("active-scene");
                    gsap.fromTo(toEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
                }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   7. SCENE 1 ANIMATION
   -------------------------------------------------------------------------- */
function startScene1Animation() {
    const line1 = document.getElementById("openingLine1");
    const line2 = document.getElementById("openingLine2");
    const btnWrapper = document.getElementById("openingBtnWrapper");

    if (line1) gsap.fromTo(line1, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, delay: 0.3 });

    setTimeout(() => {
        if (line2) {
            line2.classList.remove("hidden-element");
            gsap.fromTo(line2, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 });
        }
    }, 2000);

    setTimeout(() => {
        if (btnWrapper) {
            btnWrapper.classList.remove("hidden-element");
            gsap.fromTo(btnWrapper, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 });
        }
    }, 3800);
}

/* --------------------------------------------------------------------------
   8. SCENE 2: BIRTHDAY LOCK (unlockBirthday)
   -------------------------------------------------------------------------- */
function unlockBirthday() {
    const m = document.getElementById("dateMonth")?.value.trim();
    const d = document.getElementById("dateDay")?.value.trim();
    const y = document.getElementById("dateYear")?.value.trim();
    const feedback = document.getElementById("lockFeedback");
    const lockIcon = document.getElementById("lockIcon");

    // Formats accepted: "05/29/2062" or "5/29/2062"
    const isValidMonth = (m === "05" || m === "5");
    const isValidDay = (d === "29");
    const isValidYear = (y === "2062");

    if (isValidMonth && isValidDay && isValidYear) {
        // SUCCESS
        if (feedback) {
            feedback.className = "lock-feedback-msg success-msg";
            feedback.textContent = "I knew you'd remember. ❤️";
        }
        if (lockIcon) {
            lockIcon.textContent = "🔓";
            lockIcon.classList.add("shake");
        }

        createConfetti();

        // Start background music immediately after successful lock unlock
        startMusic();

        setTimeout(() => {
            showBirthdayIntro();
        }, 1600);
    } else {
        // INCORRECT
        if (feedback) {
            feedback.className = "lock-feedback-msg error-msg";
            feedback.textContent = "Hmm... that's not the date I'm looking for. ❤️";
        }
        const form = document.getElementById("lockForm");
        if (form) {
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 500);
        }
    }
}

/* --------------------------------------------------------------------------
   9. SCENE 3: BIRTHDAY INTRO (showBirthdayIntro)
   -------------------------------------------------------------------------- */
function showBirthdayIntro() {
    switchScene("scene-lock", "scene-intro");

    const sub1 = document.getElementById("introSub1");
    const mainTitle = document.getElementById("introMainTitle");
    const sub2 = document.getElementById("introSub2");
    const continueWrapper = document.getElementById("introContinueWrapper");

    if (sub1) gsap.fromTo(sub1, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 });

    setTimeout(() => {
        if (mainTitle) {
            mainTitle.classList.remove("hidden-element");
            gsap.fromTo(mainTitle, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.4 });
        }
    }, 1200);

    setTimeout(() => {
        if (sub2) {
            sub2.classList.remove("hidden-element");
            gsap.fromTo(sub2, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 });
        }
    }, 2600);

    setTimeout(() => {
        if (continueWrapper) {
            continueWrapper.classList.remove("hidden-element");
            gsap.fromTo(continueWrapper, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 });
        }
    }, 3800);
}

/* --------------------------------------------------------------------------
   10. SCENE 4: BIRTHDAY CAKE & CANDLES (createCake, startBlowDetection, blowCandles)
   -------------------------------------------------------------------------- */
function createCake() {
    const candlesWrapper = document.getElementById("candlesWrapper");
    if (!candlesWrapper) return;
    candlesWrapper.innerHTML = "";

    // Render exactly 21 Candles
    for (let i = 1; i <= 21; i++) {
        const candle = document.createElement("div");
        candle.className = "candle-item";
        candle.id = `candle-${i}`;

        const wick = document.createElement("div");
        wick.className = "candle-wick";

        const flame = document.createElement("div");
        flame.className = "candle-flame";

        const smoke = document.createElement("div");
        smoke.className = "candle-smoke";

        candle.appendChild(wick);
        candle.appendChild(flame);
        candle.appendChild(smoke);
        candlesWrapper.appendChild(candle);
    }
}

function startBlowDetection() {
    const statusText = document.getElementById("micStatusText");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMicOrAudioError("No microphone? That's okay. Tap to blow the candles. 🎂");
        return;
    }

    if (statusText) statusText.textContent = "Listening... Blow into your microphone! 🌬️";

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        micStream = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        micAnalyser = audioContext.createAnalyser();
        micAnalyser.fftSize = 256;
        source.connect(micAnalyser);

        const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

        micCheckInterval = setInterval(() => {
            micAnalyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            let average = sum / dataArray.length;

            if (average > 38) { // Blow threshold detected
                clearInterval(micCheckInterval);
                if (micStream) micStream.getTracks().forEach(t => t.stop());
                blowCandles();
            }
        }, 100);
    }).catch(err => {
        console.warn("Microphone access denied or unbacked: ", err);
        showMicOrAudioError("No microphone? That's okay. Tap to blow the candles. 🎂");
    });
}

function blowCandles() {
    if (micCheckInterval) clearInterval(micCheckInterval);
    if (micStream) micStream.getTracks().forEach(t => t.stop());

    const candles = document.querySelectorAll(".candle-item");
    candles.forEach((c, idx) => {
        setTimeout(() => {
            c.classList.add("extinguished");
        }, idx * 30);
    });

    const statusText = document.getElementById("micStatusText");
    if (statusText) statusText.textContent = "Candles blown! ✨";

    setTimeout(() => {
        const banner = document.getElementById("glowing21Banner");
        if (banner) {
            banner.classList.remove("hidden-element");
            gsap.fromTo(banner, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" });
        }

        createConfetti();

        const cakeNextWrapper = document.getElementById("cakeNextWrapper");
        if (cakeNextWrapper) {
            cakeNextWrapper.classList.remove("hidden-element");
            gsap.fromTo(cakeNextWrapper, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 });
        }
    }, 800);
}

/* --------------------------------------------------------------------------
   11. SCENE 5: BALLOONS & PHOTO REVEAL (createBalloons, popBalloon, revealPhoto)
   -------------------------------------------------------------------------- */
function createBalloons() {
    const stage = document.getElementById("balloonsStage");
    if (!stage) return;
    stage.innerHTML = "";

    const balloonColors = [
        "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
        "linear-gradient(135deg, #ffd685 0%, #ffaa44 100%)",
        "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
        "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
        "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
    ];

    birthdayConfig.memories.forEach((mem, index) => {
        const b = document.createElement("div");
        b.className = "balloon-item";
        b.id = `balloon-${index}`;

        const color = balloonColors[index % balloonColors.length];
        b.style.background = color;

        const shine = document.createElement("div");
        shine.className = "balloon-shine";
        b.appendChild(shine);

        // Random positioning across stage
        const leftPercent = 8 + (index * 6.5) % 84;
        b.style.left = `${leftPercent}%`;

        stage.appendChild(b);

        // Float animation
        const floatDuration = 6 + (index % 4) * 1.5;
        gsap.to(b, {
            y: -500,
            x: "+=20",
            rotation: "+=15",
            duration: floatDuration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: (index % 5) * 0.4
        });

        b.addEventListener("click", () => popBalloon(index));
    });
}

function popBalloon(index) {
    if (poppedBalloonsSet.has(index)) return;
    poppedBalloonsSet.add(index);

    const b = document.getElementById(`balloon-${index}`);
    if (b) {
        gsap.to(b, {
            scale: 1.4,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                b.style.display = "none";
                revealPhoto(index);
            }
        });
    }

    poppedBalloonsCount = poppedBalloonsSet.size;
    const poppedCountEl = document.getElementById("poppedCount");
    if (poppedCountEl) poppedCountEl.textContent = poppedBalloonsCount;

    const remainingCountEl = document.getElementById("remainingCount");
    if (remainingCountEl) remainingCountEl.textContent = birthdayConfig.memories.length - poppedBalloonsCount;

    if (poppedBalloonsCount >= 1) {
        const balloonsNextWrapper = document.getElementById("balloonsNextWrapper");
        if (balloonsNextWrapper) balloonsNextWrapper.classList.remove("hidden-element");
    }

    const popNextBtn = document.getElementById("popNextBalloonBtn");
    if (popNextBtn) {
        if (poppedBalloonsCount >= birthdayConfig.memories.length) {
            popNextBtn.textContent = "Open Memory Gallery 🖼️";
        } else {
            popNextBtn.textContent = "Blast Next Balloon 💥";
        }
    }
}

function popNextBalloon() {
    let nextIndex = -1;
    for (let i = 0; i < birthdayConfig.memories.length; i++) {
        if (!poppedBalloonsSet.has(i)) {
            nextIndex = i;
            break;
        }
    }

    if (nextIndex !== -1) {
        popBalloon(nextIndex);
    } else {
        const modal = document.getElementById("balloonPhotoModal");
        if (modal) modal.classList.add("hidden-element");
        switchScene("scene-balloons", "scene-gallery");
    }
}

function revealPhoto(index) {
    const memory = birthdayConfig.memories[index];
    if (!memory) return;

    const modal = document.getElementById("balloonPhotoModal");
    const img = document.getElementById("balloonModalImg");
    const caption = document.getElementById("balloonModalCaption");

    if (img) img.src = memory.image;
    if (caption) caption.textContent = memory.caption;

    if (modal) {
        modal.classList.remove("hidden-element");
        gsap.fromTo(modal.querySelector(".polaroid-card"),
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: -1.5, duration: 0.6, ease: "back.out(1.5)" }
        );
    }
}

/* --------------------------------------------------------------------------
   12. SCENE 6: MEMORY GALLERY & LIGHTBOX (createMemoryGallery, openLightbox)
   -------------------------------------------------------------------------- */
function createMemoryGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    birthdayConfig.memories.forEach((mem, index) => {
        const item = document.createElement("div");
        item.className = "gallery-item";

        item.innerHTML = `
            <div class="polaroid-card">
                <div class="polaroid-img-wrapper">
                    <img src="${mem.image}" alt="${mem.caption}" loading="lazy">
                </div>
                <p class="polaroid-caption">${mem.caption}</p>
            </div>
        `;

        item.addEventListener("click", () => openLightbox(index));
        grid.appendChild(item);
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();

    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.classList.remove("hidden-element");
        lightbox.setAttribute("aria-hidden", "false");
        gsap.fromTo(lightbox.querySelector(".lightbox-content"), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
    }
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.classList.add("hidden-element");
        lightbox.setAttribute("aria-hidden", "true");
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = birthdayConfig.memories.length - 1;
    if (currentLightboxIndex >= birthdayConfig.memories.length) currentLightboxIndex = 0;
    updateLightboxContent();
}

function updateLightboxContent() {
    const mem = birthdayConfig.memories[currentLightboxIndex];
    if (!mem) return;

    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    const counter = document.getElementById("lightboxCounter");

    if (img) img.src = mem.image;
    if (caption) caption.textContent = mem.caption;
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${birthdayConfig.memories.length}`;
}

/* --------------------------------------------------------------------------
   13. SCENE 7: SPECIAL 10-SECOND VIDEO (playSpecialVideo)
   -------------------------------------------------------------------------- */
function playSpecialVideo() {
    switchScene("scene-gallery", "scene-video");

    const introText = document.getElementById("videoIntroText");
    const frame = document.getElementById("videoPlayerFrame");
    const video = document.getElementById("specialVideoPlayer");

    if (introText) {
        gsap.fromTo(introText.querySelector("h2"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 });
    }

    setTimeout(() => {
        if (frame) {
            frame.classList.remove("hidden-element");
            gsap.fromTo(frame, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 });
        }

        if (video) {
            video.src = birthdayConfig.specialVideo;
            video.play().catch(err => {
                console.warn("Video playback error fallback: ", err);
                setTimeout(showBirthdayLetter, 3000);
            });

            // Play once (not looped), transition when ended
            video.onended = () => {
                gsap.to(frame, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        setTimeout(showBirthdayLetter, 1000);
                    }
                });
            };
        }
    }, 2200);
}

/* --------------------------------------------------------------------------
   14. SCENE 8: PERSONAL BIRTHDAY LETTER (showBirthdayLetter)
   -------------------------------------------------------------------------- */
function showBirthdayLetter() {
    switchScene("scene-video", "scene-letter");

    if (audioInstance) {
        audioInstance.volume = 0.35; // Lower music volume slightly for letter reading
    }

    const container = document.getElementById("letterContent");
    if (!container) return;
    container.innerHTML = "";

    const paragraphs = birthdayLetter.split("\n\n");

    paragraphs.forEach((pText, pIdx) => {
        const p = document.createElement("p");
        p.className = "letter-paragraph";
        p.innerHTML = pText.replace(/\n/g, "<br>");
        container.appendChild(p);

        setTimeout(() => {
            p.classList.add("revealed");
            p.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, pIdx * 1800 + 500);
    });

    const totalDelay = paragraphs.length * 1800 + 1000;
    setTimeout(() => {
        const letterContinueWrapper = document.getElementById("letterContinueWrapper");
        if (letterContinueWrapper) {
            letterContinueWrapper.classList.remove("hidden-element");
            gsap.fromTo(letterContinueWrapper, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1 });
        }
    }, totalDelay);
}

/* --------------------------------------------------------------------------
   15. SCENE 9: MYSTERIOUS ENDING (showMysteriousMessage)
   -------------------------------------------------------------------------- */
function showMysteriousMessage() {
    switchScene("scene-letter", "scene-mysterious");

    const line1 = document.getElementById("mysteriousLine1");
    const line2 = document.getElementById("mysteriousLine2");
    const line3 = document.getElementById("mysteriousLine3");

    if (line1) gsap.fromTo(line1, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.5, delay: 0.5 });

    setTimeout(() => {
        if (line2) {
            line2.classList.remove("hidden-element");
            gsap.fromTo(line2, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.5 });
        }
    }, 3200);

    setTimeout(() => {
        if (line3) {
            line3.classList.remove("hidden-element");
            gsap.fromTo(line3, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.5 });
        }
    }, 6000);

    setTimeout(() => {
        showFinalScene();
    }, 9500);
}

/* --------------------------------------------------------------------------
   16. SCENE 10: FINAL BIRTHDAY SCENE (showFinalScene)
   -------------------------------------------------------------------------- */
function showFinalScene() {
    switchScene("scene-mysterious", "scene-final");

    if (audioInstance) {
        audioInstance.volume = 0.7; // Restore volume
    }

    createConfetti();

    const wishes = [
        document.getElementById("wish1"),
        document.getElementById("wish2"),
        document.getElementById("wish3"),
        document.getElementById("wish4"),
        document.getElementById("wish5"),
        document.getElementById("wish6")
    ];

    wishes.forEach((w, idx) => {
        if (w) {
            setTimeout(() => {
                gsap.fromTo(w, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.2 });
            }, idx * 1800 + 800);
        }
    });
}

/* --------------------------------------------------------------------------
   17. SCENE 11: REPLAY EXPERIENCE (resetExperience)
   -------------------------------------------------------------------------- */
function resetExperience() {
    poppedBalloonsCount = 0;
    poppedBalloonsSet.clear();

    const poppedCountEl = document.getElementById("poppedCount");
    if (poppedCountEl) poppedCountEl.textContent = "0";

    const remainingCountEl = document.getElementById("remainingCount");
    if (remainingCountEl) remainingCountEl.textContent = birthdayConfig.memories.length;

    const banner = document.getElementById("glowing21Banner");
    if (banner) banner.classList.add("hidden-element");

    createCake(); // reset candles

    if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
        isAudioPlaying = false;
        updateAudioWidgetUI();
    }
    const widget = document.getElementById("audioWidget");
    if (widget) widget.classList.add("hidden");

    switchScene("scene-final", "scene-opening");
    startScene1Animation();
}

/* --------------------------------------------------------------------------
   18. CANVAS ANIMATION SYSTEM (Stars, Floating Lights & Confetti)
   -------------------------------------------------------------------------- */
function initCanvas() {
    const bgCanvas = document.getElementById("bgCanvas");
    const confettiCanvas = document.getElementById("confettiCanvas");

    if (!bgCanvas || !confettiCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const confCtx = confettiCanvas.getContext("2d");

    let width = bgCanvas.width = confettiCanvas.width = window.innerWidth;
    let height = bgCanvas.height = confettiCanvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = bgCanvas.width = confettiCanvas.width = window.innerWidth;
        height = bgCanvas.height = confettiCanvas.height = window.innerHeight;
    });

    // Stars & Particles
    const stars = [];
    for (let i = 0; i < 90; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }

    function renderBg() {
        bgCtx.clearRect(0, 0, width, height);

        stars.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;

            bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
            bgCtx.beginPath();
            bgCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            bgCtx.fill();
        });

        requestAnimationFrame(renderBg);
    }
    renderBg();

    // Confetti System
    function renderConfetti() {
        confCtx.clearRect(0, 0, width, height);

        if (confettiActive) {
            confettiParticles.forEach((p, idx) => {
                p.y += p.speedY;
                p.x += Math.sin(p.tilt) * 2;
                p.tilt += p.tiltAngle;

                confCtx.fillStyle = p.color;
                confCtx.beginPath();
                confCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                confCtx.fill();

                if (p.y > height) {
                    confettiParticles[idx].y = -10;
                    confettiParticles[idx].x = Math.random() * width;
                }
            });
        }

        requestAnimationFrame(renderConfetti);
    }
    renderConfetti();
}

function createConfetti() {
    confettiActive = true;
    confettiParticles = [];
    const colors = ["#ffd685", "#f7a8b8", "#ffffff", "#e0c3fc", "#8ec5fc"];

    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight - window.innerHeight,
            r: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            tilt: Math.random() * 10,
            tiltAngle: Math.random() * 0.05 + 0.02
        });
    }

    setTimeout(() => {
        confettiActive = false;
    }, 6000);
}
