/* --- Ensure Modal Starts Hidden Immediately --- */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('notebook-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
});

/* --- 1. MOUSE & TOUCH SPARKLE TRAIL --- */
function createSparkle(x, y) {
  if (Math.random() < 0.35) {
    const sparkle = document.createElement('span');
    sparkle.className = 'cursor-sparkle';
    sparkle.innerHTML = ['✨', '✦', '⭐', '💖', '🌟', '🎉'][Math.floor(Math.random() * 6)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    const dx = (Math.random() - 0.5) * 80;
    const dy = (Math.random() - 0.5) * 80 - 30;
    sparkle.style.setProperty('--dx', `${dx}px`);
    sparkle.style.setProperty('--dy', `${dy}px`);
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

document.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
  if (e.touches[0]) createSparkle(e.touches[0].clientX, e.touches[0].clientY);
});

// Click Burst Effect
document.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'click-burst';
    p.style.backgroundColor = ['#FFD700', '#FF69B4', '#00BFFF', '#00FA9A', '#FF4500'][Math.floor(Math.random() * 5)];
    p.style.left = `${e.clientX}px`;
    p.style.top = `${e.clientY}px`;

    const angle = (Math.PI * 2 / 8) * i;
    const speed = 35 + Math.random() * 25;
    p.style.setProperty('--bx', `${Math.cos(angle) * speed}px`);
    p.style.setProperty('--by', `${Math.sin(angle) * speed}px`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
});

/* --- 2. UNDERTALE OST CONTROLLER --- */
const bgAudio = document.getElementById('bg-audio');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const trackLabel = document.getElementById('current-track-label');

const tracks = [
  { name: "Falling Down", src: "falling down.mpeg" },           // Start Screen
  { name: "Finale", src: "finale.mpeg" },                       // Map Room & Messages
  { name: "Home", src: "Home Music box.mpeg" },                 // Password Vault
  { name: "His Theme", src: "His theme.mpeg" },                 // Final Voice Note page
  { name: "Epic Finale", src: "epic finale.mpeg" }              // Dino Mini Game
];

let isMusicPlaying = false;

function playTrack(index) {
  bgAudio.src = tracks[index].src;
  trackLabel.textContent = `Track: ${tracks[index].name}`;
  bgAudio.play().then(() => {
    isMusicPlaying = true;
    musicToggleBtn.textContent = "🎵";
  }).catch(() => {
    console.log("Audio autoplay waiting for user interaction.");
  });
}

musicToggleBtn.addEventListener('click', () => {
  if (isMusicPlaying) {
    bgAudio.pause();
    isMusicPlaying = false;
    musicToggleBtn.textContent = "🔇";
  } else {
    bgAudio.play();
    isMusicPlaying = true;
    musicToggleBtn.textContent = "🎵";
  }
});

document.body.addEventListener('click', () => {
  if (!isMusicPlaying && bgAudio.paused) {
    playTrack(0);
  }
}, { once: true });

/* --- 3. SECTION NAVIGATION & SEQUENTIAL MAP --- */
const startBtn = document.getElementById('start-btn');
const heroSection = document.getElementById('hero-section');
const mapSection = document.getElementById('map-section');
const vaultSection = document.getElementById('vault-section');
const audioSection = document.getElementById('audio-section');
const dinoSection = document.getElementById('dino-section');

startBtn.addEventListener('click', () => {
  heroSection.classList.add('hidden');
  mapSection.classList.remove('hidden');
  playTrack(1);
  initSequentialMap();
});

const messagesData = [
  { title: "The way you talk #1", text: "I Remember the first time I <span class='highlight-letter'>H</span>eard you talking, all i could think is wow i want to be her!" },
  { title: "The way you are #2", text: "Your grace, the way you hold yourself, your confidence. <span class='highlight-letter'>A</span> walking representation of the best version of what a human could be!" },
  { title: "The way you know #3", text: "From crazy conspiracies to cultural refrences, from theater to anime, from <span class='highlight-letter'>N</span>ovels to fanfics, from crazy science and theory to immersive studies, you can do it all, because you'r simply Amazing!." },
  { title: "The way you smile #4", text: "Every single day with your jokes and kindness is a gift. <span class='highlight-letter'>A</span>lways keep smiling and looking up, because i belive that one day even the curve of your lips will change the fate of a nation" },
  { title: "The way you inspire #5", text: "You inspire everyone around you to dream bigger, you make the hardest tasks look easy, you proved to me that the impossible is possible, because you never give up, you never bow your head to hardship, because the stars in your eyes breaths fire into everyone's soul, thank you... please <span class='highlight-letter'>N</span>ever stop being your wonderful self." },
  { title: "The way you grow #6", text: "Here is to another amazing year filled with success and happiness! <span class='highlight-letter'>E</span>verything is going to be incredible because you are a blessing, that grows with every idea, with every minute, with every second." }
];

let openedMessagesCount = 0;
const checkpointNodes = document.querySelectorAll('.checkpoint-node');
const notebookModal = document.getElementById('notebook-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeModalBtn = document.getElementById('close-modal-btn');
const openedCountSpan = document.getElementById('opened-count');
const toVaultBtn = document.getElementById('to-vault-btn');

function initSequentialMap() {
  checkpointNodes.forEach((node, index) => {
    if (index === 0) {
      node.classList.add('unlocked');
      node.classList.remove('locked');
    } else {
      node.classList.add('locked');
    }

    const btn = node.querySelector('.node-card');
    btn.onclick = (e) => {
      e.stopPropagation();
      if (node.classList.contains('locked')) return;
      openNotebook(index);
    };
  });
}

function openNotebook(index) {
  modalTitle.textContent = messagesData[index].title;
  modalText.innerHTML = messagesData[index].text;
  notebookModal.classList.remove('hidden');
  notebookModal.dataset.currentIndex = index;
}

closeModalBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  notebookModal.classList.add('hidden');
  
  const currentIndex = parseInt(notebookModal.dataset.currentIndex);
  if (isNaN(currentIndex)) return;

  const currentNode = checkpointNodes[currentIndex];
  if (currentNode && !currentNode.classList.contains('completed')) {
    currentNode.classList.add('completed');
    currentNode.classList.remove('unlocked');
    openedMessagesCount++;
    openedCountSpan.textContent = openedMessagesCount;

    if (currentIndex + 1 < checkpointNodes.length) {
      const nextNode = checkpointNodes[currentIndex + 1];
      nextNode.classList.remove('locked');
      nextNode.classList.add('unlocked');
    } else {
      toVaultBtn.disabled = false;
      toVaultBtn.classList.add('unlocked');
    }
  }
});

toVaultBtn.addEventListener('click', () => {
  mapSection.classList.add('hidden');
  vaultSection.classList.remove('hidden');
  playTrack(2);
});

/* --- 4. PASSWORD VAULT LOGIC --- */
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const vaultErrorMsg = document.getElementById('vault-error-msg');

function checkPassword() {
  const userVal = passwordInput.value.trim().toUpperCase();
  if (userVal === "HANANE") {
    vaultSection.classList.add('hidden');
    audioSection.classList.remove('hidden');
    playTrack(3);
  } else {
    passwordInput.classList.add('shake');
    vaultErrorMsg.classList.remove('hidden');
    setTimeout(() => passwordInput.classList.remove('shake'), 400);
  }
}

unlockBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkPassword();
});

/* --- 5. FINAL AUDIO MESSAGE LOGIC --- */
const playFinalAudioBtn = document.getElementById('play-final-audio-btn');
const finalVoiceNote = document.getElementById('final-voice-note');
const gotoDinoBtn = document.getElementById('goto-dino-btn');

playFinalAudioBtn.addEventListener('click', () => {
  if (finalVoiceNote.paused) {
    finalVoiceNote.play();
    bgAudio.volume = 0.25; // Lowers "His Theme" in the background so voice is clear
    playFinalAudioBtn.style.background = '#ff69b4';
    playFinalAudioBtn.querySelector('.play-icon').textContent = '❚❚';
  } else {
    finalVoiceNote.pause();
    bgAudio.volume = 1.0; // Restores volume if paused
    playFinalAudioBtn.style.background = '#00bfff';
    playFinalAudioBtn.querySelector('.play-icon').textContent = '▶';
  }
});

// Bring volume back up automatically when the voice message finishes
finalVoiceNote.addEventListener('ended', () => {
  bgAudio.volume = 1.0;
  playFinalAudioBtn.style.background = '#00bfff';
  playFinalAudioBtn.querySelector('.play-icon').textContent = '▶';
});

gotoDinoBtn.addEventListener('click', () => {
  bgAudio.volume = 1.0; // Reset volume back to normal for the game
  audioSection.classList.add('hidden');
  dinoSection.classList.remove('hidden');
  playTrack(4); // Plays Epic Finale
  initDinoGame();
});

/* --- 6. MOBILE-FRIENDLY DINO RUNNER --- */
function initDinoGame() {
  const canvas = document.getElementById('dino-canvas');
  const ctx = canvas.getContext('2d');
  const scoreSpan = document.getElementById('game-score');
  const restartBtn = document.getElementById('restart-game-btn');

  let dino = { x: 50, y: 210, width: 38, height: 45, vy: 0, gravity: 0.8, jump: -15.5, grounded: true };
  let obstacles = [];
  let score = 0;
  let gameRunning = true;
  let frameCount = 0;

  function resetGame() {
    dino.y = 210;
    dino.vy = 0;
    dino.grounded = true;
    obstacles = [];
    score = 0;
    scoreSpan.textContent = score;
    gameRunning = true;
    restartBtn.classList.add('hidden');
    loop();
  }

  function doJump() {
    if (dino.grounded && gameRunning) {
      dino.vy = dino.jump;
      dino.grounded = false;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') doJump();
  });

  canvas.addEventListener('click', doJump);
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    doJump();
  });

  function loop() {
    if (!gameRunning) return;
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 255, canvas.width, 45);

    // Dino Physics
    dino.vy += dino.gravity;
    dino.y += dino.vy;
    if (dino.y > 210) {
      dino.y = 210;
      dino.vy = 0;
      dino.grounded = true;
    }

    // Draw Dino
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.roundRect(dino.x, dino.y, dino.width, dino.height, [8]);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Spawn Obstacles
    if (frameCount % 90 === 0) {
      obstacles.push({ x: canvas.width, y: 215, width: 28, height: 40, speed: 5.5 });
    }

    // Update Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obs = obstacles[i];
      obs.x -= obs.speed;

      ctx.fillStyle = '#FFB6C1';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      if (
        dino.x < obs.x + obs.width &&
        dino.x + dino.width > obs.x &&
        dino.y < obs.y + obs.height &&
        dino.y + dino.height > obs.y
      ) {
        gameRunning = false;
        restartBtn.classList.remove('hidden');
      }

      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
        score += 10;
        scoreSpan.textContent = score;
      }
    }

    if (gameRunning) requestAnimationFrame(loop);
  }

  restartBtn.onclick = resetGame;
  loop();
}