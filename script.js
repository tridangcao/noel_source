// Flag to control heart rain
let enableHeartRain = false;

// Khởi tạo ánh sáng noel
function createChristmasLights() {
  const container = document.getElementById('lightsContainer');
  const colors = ['#c41e3a', '#ffd700', '#00ff00', '#0099ff'];

  for (let i = 0; i < 40; i++) {
    const light = document.createElement('div');
    light.className = 'light';
    light.style.left = Math.random() * 100 + '%';
    light.style.top = Math.random() * 100 + '%';
    light.style.color = colors[Math.floor(Math.random() * colors.length)];
    light.style.animationDelay = (Math.random() * 1.5) + 's';
    container.appendChild(light);
  }
}

// Tạo tuyết & trái tim rơi (chỉ rơi tuyết lúc đầu, trái tim sau khi mở)
function createFallingElement() {
  const element = document.createElement("div");
  element.className = "snowflake"; // Use base animation class

  // Logic: Only show hearts if enabled, otherwise just snow
  let isHeart = false;

  if (enableHeartRain) {
    // If enabled, 70% chance of heart
    isHeart = Math.random() < 0.7;
  }

  if (isHeart) {
    element.textContent = "❤️";
  } else {
    element.textContent = "❄";
  }

  element.style.left = Math.random() * window.innerWidth + "px";
  element.style.fontSize = (Math.random() * 15 + 10) + "px";
  element.style.animationDuration = (Math.random() * 3 + 4) + "s";
  document.body.appendChild(element);

  setTimeout(() => element.remove(), 8000);
}

// Init
createChristmasLights();
setInterval(createFallingElement, 150);

// Main Interaction Logic
(function () {
  const wrapper = document.getElementById('giftBtn');
  const surprise = document.getElementById('surprise-section');

  // Video elements
  const videoOverlay = document.getElementById('video-overlay');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('skipBtn');

  let opened = false;

  function createConfetti() {
    // Confetti logic reuse
    const colors = ['#ff0000', '#ff4d4d', '#ff9999', '#ffcc00', '#ff66b2']; // Red/Pink focused
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.textContent = '🌹'; // Falling Heart
      // Randomize start position slightly around center
      conf.style.left = (cx + (Math.random() - 0.5) * 50) + 'px';
      conf.style.top = (cy + (Math.random() - 0.5) * 50) + 'px';
      // Randomize specific heart visuals if needed, e.g. scale
      conf.style.fontSize = (Math.random() * 20 + 15) + 'px';
      conf.style.color = colors[Math.floor(Math.random() * colors.length)];

      const dur = (Math.random() * 1.5 + 1.5).toFixed(2) + 's';
      conf.style.animationDuration = dur;

      // Add some horizontal drift to falling
      const randomDrift = (Math.random() * 100 - 50) + 'px';
      conf.style.setProperty('--drift', randomDrift);

      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 3000);
    }
  }

  function playSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
    // Simple success chime
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  }

  // Actual Gift Opening Animation Sequence
  function startGiftOpening() {
    // Prevent double trigger just in case
    // opened check is already done before calling this, but safe to keep

    wrapper.classList.add('opening');

    // Change text
    const subtitle = document.getElementById('subtitleText');
    if (subtitle) subtitle.textContent = "My love, I love you so much ❤️❤️❤️";

    // Enable heart rain in background
    enableHeartRain = true;

    // Sequence
    // 1. Hands appear (Step 1)
    wrapper.classList.add('step-1');

    setTimeout(() => {
      // 2. Hands pull (Step 2)
      wrapper.classList.add('step-2');
      playSound(); // Sound of untying?
    }, 800);

    setTimeout(() => {
      // 3. Hands fade (Step 3) - Ribbon gone
      wrapper.classList.add('step-3');
    }, 1600);

    setTimeout(() => {
      // 4. Lid opens & Reveal (Step 4)
      wrapper.classList.add('step-4');
      createConfetti();
    }, 2000);

    setTimeout(() => {
      // Show lower section
      surprise.style.display = 'block';
      window.scrollTo({ top: surprise.offsetTop, behavior: 'smooth' });
    }, 2800);
  }

  function finishVideo() {
    introVideo.pause();
    videoOverlay.classList.add('hidden');
    // Start the gift opening sequence
    startGiftOpening();
  }

  wrapper.addEventListener('click', function () {
    if (opened) return;
    opened = true;

    // Show video overlay
    videoOverlay.classList.remove('hidden');

    // Play video
    introVideo.play().catch(e => {
      console.log("Auto-play failed, user might need to interact first", e);
    });
  });

  // Handle Video End
  introVideo.addEventListener('ended', function () {
    finishVideo();
  });

  // Handle Skip Button
  skipBtn.addEventListener('click', function () {
    finishVideo();
  });

  // Background Music Logic
  const bgMusic = document.getElementById('bgMusic');
  // Try autoplay
  bgMusic.volume = 0.5; // Set volume to 50%
  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Autoplay started!
    }).catch(error => {
      // Autoplay was prevented.
      // Show play button or just play on first interaction
      const startMusic = () => {
        bgMusic.play();
        document.removeEventListener('click', startMusic);
      };
      document.addEventListener('click', startMusic);
    });
  }

})();
