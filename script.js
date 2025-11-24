function injectFloatingAnimations() {
    const style = document.createElement('style');
    style.type = 'text/css';

    // Keyframes for horizontal continuous floating animation for characters (doodle snakes)
    const doodleFloatLeft = `
    @keyframes doodleFloatLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-20px); }
    }`;

    const doodleFloatRight = `
    @keyframes doodleFloatRight {
        0% { transform: translateX(0); }
        100% { transform: translateX(20px); }
    }`;

    // FIXED: Keyframes for hearts floating up
    const heartFloat = `
    @keyframes heartFloatUp {
        0% { 
            opacity: 0; 
            transform: translateY(0) scale(0.8); 
        }
        30% { 
            opacity: 1; 
            transform: translateY(-30px) scale(1.05); 
        }
        100% { 
            opacity: 0; 
            transform: translateY(-120px) scale(1); 
        }
    }`;

    style.innerHTML = doodleFloatLeft + doodleFloatRight + heartFloat;
    document.head.appendChild(style);
}

// Generate Background Nailong Characters with smooth floating back-and-forth animation
function generateBackgroundSnakes() {
    const container = document.getElementById('doodle-snakes') || document.getElementById('background-snakes');
    if (!container) return;
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

    const doodleImgs = [
        'karakter 1.jpeg',
        'karakter 2.jpeg',
        'karakter 3.jpeg'
    ];

    const fixedPositions = [
        { top: '20%' },   // karakter 1 - top
        { top: '50%' },   // karakter 2 - middle
        { top: '80%' }    // karakter 3 - bottom
    ];

    const mobilePositions = [
        { top: '8%' },
        { top: '20%' },
        { top: '88%' }
    ];

    // Clear existing doodles if any (to avoid duplicates)
    container.innerHTML = '';

    for (let i = 0; i < doodleImgs.length; i++) {
        const imgSrc = doodleImgs[i];
        const pos = isMobile ? mobilePositions[i % mobilePositions.length] : fixedPositions[i % fixedPositions.length];

        const doodleWrapper = document.createElement('div');
        doodleWrapper.className = 'doodle-snake ' + (i % 2 === 0 ? 'left' : 'right');
        doodleWrapper.style.position = 'absolute';
        doodleWrapper.style.top = pos.top;
        doodleWrapper.style.width = isMobile ? '100px' : '150px';
        doodleWrapper.style.height = isMobile ? '100px' : '150px';
        doodleWrapper.style.maxWidth = '100%';
        doodleWrapper.style.overflow = 'visible';
        doodleWrapper.style.zIndex = '0';

        // FIXED: REMOVE "animation = 'none'" - Let CSS class handle the animation
        // doodleWrapper.style.animation = 'none'; // <-- INI DIHAPUS!

        const img = document.createElement('img');
        img.className = 'doodle-img';
        img.src = imgSrc;
        img.alt = `doodle-${i+1}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'cover';
        img.style.pointerEvents = 'none';

        doodleWrapper.appendChild(img);
        container.appendChild(doodleWrapper);
    }
}

// Generate Floating Elements (daun + sparkles) tersebar merata
function generateFloatingElements() {
    const container = document.getElementById('floating-elements') || document.getElementById('floating-leaves') || document.getElementById('particles');
    if (!container) return;
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const leafCount = isMobile ? 3 : 10;
    const sparkleCount = isMobile ? 4 : 12;

    const leafTypes = ['🍃', '🌿', '🍂', '🌱'];
    const sparkleTypes = ['✨', '⭐', '🎉', '💫'];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function makeFloating(text, cls, size) {
        const el = document.createElement('div');
        el.className = cls;
        el.textContent = text;
        el.style.position = 'absolute';
        el.style.left = `${rand(2, 92)}%`;
        el.style.top = `${rand(3, 92)}%`;
        el.style.fontSize = `${size}px`;
        el.style.opacity = String(rand(0.35, 0.9));
        el.style.pointerEvents = 'none';
        el.style.animationDelay = `${rand(0, 6)}s`;
        return el;
    }

    for (let i = 0; i < leafCount; i++) {
        const leaf = makeFloating(leafTypes[i % leafTypes.length], 'leaf', rand(18, 30));
        container.appendChild(leaf);
    }

    for (let i = 0; i < sparkleCount; i++) {
        const sp = makeFloating(sparkleTypes[i % sparkleTypes.length], 'particle', rand(16, 28));
        container.appendChild(sp);
    }
}

// Emit Sparkles Effect
function emitSparkles(count, spread, lifetimeSec) {
    let container = document.querySelector('.gift-sparkles');
    if (!container) {
        container = document.createElement('div');
        container.className = 'gift-sparkles';
        const giftBody = document.querySelector('.envelope') || document.body;
        if (giftBody) giftBody.appendChild(container);
    }
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        const left = 12 + Math.random() * 76;
        s.style.left = `${left}%`;
        s.style.top = `${40 + Math.random() * 30}%`;
        const dur = 700 + Math.floor(Math.random() * 900);
        s.style.animation = `sparkleRise ${dur}ms cubic-bezier(.2,.9,.2,1)`;
        s.style.animationDelay = `${Math.floor(Math.random() * 220)}ms`;
        container.appendChild(s);
        setTimeout(() => { if (s.parentNode) s.parentNode.removeChild(s); }, (lifetimeSec * 1000) + dur + 800);
    }
    setTimeout(() => { if (container?.parentNode) container.parentNode.removeChild(container); }, (lifetimeSec * 1000) + 3000);
}

// DOMContentLoaded Initialization and Event Handlers
let audioPlayer; // Global audio player

// FIXED: Spawn heart with proper positioning and animation
function spawnHeart(xPercent = 50, yPercent) {
    const container = document.querySelector('.heart-float') || (() => {
        const c = document.createElement('div');
        c.className = 'heart-float';
        c.style.position = 'fixed';
        c.style.top = '0';
        c.style.left = '0';
        c.style.width = '100%';
        c.style.height = '100%';
        c.style.pointerEvents = 'none';
        c.style.zIndex = '5';
        c.style.overflow = 'hidden';
        document.body.appendChild(c);
        return c;
    })();

    const h = document.createElement('div');
    h.className = 'heart';  
    h.className = 'heart up';
    h.textContent = '💖';
    h.style.left = `${Math.random() * 90 + 5}%`;
    h.style.position = 'absolute';
    h.style.fontSize = '36px';
    h.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))';
    
    // FIXED: Set horizontal position (left/right based on xPercent)
    h.style.left = `${xPercent}%`;
    
    // FIXED: Start from bottom of screen
    h.style.bottom = '-50px';
    h.style.top = 'auto';
    
    // FIXED: Apply floating up animation
    h.style.animation = 'heartFloatUp 4s ease-out forwards';
    
    container.appendChild(h);
    
    // Remove after animation completes 
        setTimeout(() => h.remove(), 6000); 

}
document.querySelectorAll('.typing').forEach(el => {
  const textLength = el.textContent.length;
  let duration = 4;
  if (window.innerWidth <= 768) duration = 6;
  if (window.innerWidth <= 480) duration = 8;

  // steps sesuai jumlah huruf → per huruf
  el.style.animation = `typing ${duration}s steps(${textLength}, end), blink 0.75s step-end infinite`;
});

document.addEventListener('DOMContentLoaded', () => {
    injectFloatingAnimations();
    generateBackgroundSnakes();
    generateFloatingElements();

    // FIXED: Spawn hearts at random horizontal positions
    setInterval(() => {
        const randomX = Math.random() * 90 + 5; // 5% to 95% to avoid edges
        spawnHeart(randomX);
    }, 1000);

    // Confetti launch function
    function launchConfetti(count = 40) {
        const colors = ['#ff595e', '#1982c4', '#6a4c93', '#ffffff'];
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti');

        for (let i = 0; i < count; i++) {
            const confettiPiece = document.createElement('div');
            confettiPiece.classList.add('piece');
            confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiPiece.style.left = Math.random() * 100 + '%';
            confettiPiece.style.top = Math.random() * 100 + '%';
            confettiPiece.style.width = 8 + Math.random() * 6 + 'px';
            confettiPiece.style.height = 8 + Math.random() * 6 + 'px';
            confettiPiece.style.opacity = Math.random() + 0.5;
            confettiPiece.style.transform = `rotate(${Math.random() * 360}deg) rotateX(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confettiPiece);

            // Animate each confettiPiece
            const animationDuration = 2000 + Math.random() * 3000;
            confettiPiece.animate([
                { transform: confettiPiece.style.transform, opacity: confettiPiece.style.opacity, offset: 0 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg) rotateX(${Math.random() * 360}deg)`, opacity: 0, offset: 1 }
            ], {
                duration: animationDuration,
                easing: 'ease-out',
                delay: Math.random() * 1000,
                fill: 'forwards'
            });
        }

        document.body.appendChild(confettiContainer);

        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    }

// Setup audio
audioPlayer = new Audio('sound.mp3');
audioPlayer.loop = true;

// Set volume awal mengikuti slider (atau default 100%)
const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
  // Jika slider punya value preset, pakai itu
  if (volumeSlider.value) {
    audioPlayer.volume = volumeSlider.value / 100;
  } else {
    audioPlayer.volume = 1.0; // default penuh
    volumeSlider.value = 100;
  }
} else {
  audioPlayer.volume = 1.0;
}

// Autoplay attempt
const playAudio = () => {
  audioPlayer.play().catch(() => {
    const userPlayHandler = () => {
      audioPlayer.play().catch(() => {});
      window.removeEventListener('click', userPlayHandler);
      window.removeEventListener('keydown', userPlayHandler);
    };
    window.addEventListener('click', userPlayHandler, { once: true });
    window.addEventListener('keydown', userPlayHandler, { once: true });
  });
};
playAudio();

// Volume slider sync
if (volumeSlider && audioPlayer) {
  // Update slider saat volume berubah internal
  audioPlayer.addEventListener('volumechange', () => {
    volumeSlider.value = (audioPlayer.volume * 100).toFixed(0);
  });

  // Update audio saat slider digeser
  volumeSlider.addEventListener('input', e => {
    audioPlayer.volume = e.target.value / 100;
  });
}

    const closedGift = document.querySelector('.kawaii-gift-box');
    const openGift = document.getElementById('kawaii-gift-open');
    const smallLetter = document.getElementById('small-letter');
    const instruction = document.getElementById('instruction');
    const homepage = document.getElementById('homepage');
    const letterPage = document.getElementById('letter-page');
    const letterContent = document.querySelector('.letter-content');

    // Initial state setup
    closedGift.style.display = 'block';
    closedGift.classList.remove('opening');
    openGift.style.display = 'none';
    openGift.classList.remove('show');

    // Reset lid animations
    openGift.querySelectorAll('.open-lid.left, .open-lid.right').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth; // Trigger reflow
        el.style.animation = '';
    });

    smallLetter.style.display = 'none';
    smallLetter.classList.remove('visible', 'rise');
    smallLetter.classList.add('hidden');

    instruction.textContent = 'Klik kotak kado!';
    instruction.classList.remove('hidden');

    // Closed gift click event to open gift with animation
    closedGift.addEventListener('click', () => {
        closedGift.classList.add('opening');
        closedGift.addEventListener('animationend', () => {
            closedGift.style.display = 'none';
            closedGift.classList.remove('opening');

            openGift.style.display = 'block';
            openGift.classList.add('show');

            // Launch confetti when envelope opens
            launchConfetti();

            // Lid open animation
            const leftLid = openGift.querySelector('.open-lid.left');
            const rightLid = openGift.querySelector('.open-lid.right');
            if (leftLid) leftLid.style.animation = 'lidOpen 0.8s ease-out forwards';
            if (rightLid) rightLid.style.animation = 'lidOpenRight 0.8s ease-out forwards';

            // Show letter after delay
            setTimeout(() => {
                smallLetter.classList.remove('hidden');
                smallLetter.classList.add('visible', 'rise');
                smallLetter.style.display = 'block';
                instruction.textContent = 'Klik suratnya ditengah ^^';
            }, 500);
        }, { once: true });
    });

    // Small letter click event to reveal letter page
    smallLetter.addEventListener('click', () => {
        closedGift.style.display = 'none';
        openGift.style.display = 'none';
        smallLetter.style.display = 'none';
        instruction.classList.add('hidden');
        document.body.classList.add('letter-active');
        homepage.style.opacity = '0';

        // Launch confetti when small letter clicked
        launchConfetti();

        setTimeout(() => {
            homepage.style.display = 'none';
            letterPage.classList.remove('hidden');
            letterPage.classList.add('show-content');
            letterContent.classList.add('active', 'reveal-letter', 'unfold');
            // Add sparkle class to photo-placeholder for sparkle effect
            const photoPlaceholder = document.querySelector('.photo-placeholder');
            if (photoPlaceholder) {
                photoPlaceholder.classList.add('sparkle');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    });

    // Click outside letter container to close letter page and return
    letterPage.addEventListener('click', (e) => {
        const letterContainer = letterPage.querySelector('.letter-container');
        if (!letterContainer) return;
        if (letterContainer.contains(e.target) || e.target.closest('.no-close')) return;

        // Remove letter active states and show homepage
        document.body.classList.remove('letter-active');
        letterPage.classList.add('hidden');
        letterPage.classList.remove('show-content');
        letterContent.classList.remove('active', 'reveal-letter', 'unfold');

        homepage.style.display = 'flex';
        homepage.style.opacity = '1';

        smallLetter.classList.add('hidden');
        smallLetter.classList.remove('visible', 'rise');

        openGift.style.display = 'none';
        openGift.classList.remove('show');

        closedGift.style.display = 'block';
        instruction.classList.remove('hidden');
        instruction.textContent = 'Klik kotak kado!';
    });

    // Add play/pause button and volume slider event handlers
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (playPauseBtn) {
        // Initialize button text/icon
        playPauseBtn.textContent = '⏸️';

        playPauseBtn.addEventListener('click', () => {
            if (!audioPlayer) return;
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.textContent = '⏸️';
            } else {
                audioPlayer.pause();
                playPauseBtn.textContent = '▶️';
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (!audioPlayer) return;
            const volumeValue = e.target.value;
            // Volume slider value is 0-1, so use directly
            audioPlayer.volume = volumeValue;
        });
    }
});