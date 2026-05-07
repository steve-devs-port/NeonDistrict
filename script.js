var bootMessages = [
  "> INITIALIZING URBAN_OS v3.1.9...",
  "> SCANNING SECTOR 7 GRID...",
  "> NEON POWER: ONLINE",
  "> LOADING DISTRICT MAP...",
  "> 13 ZONES DETECTED",
  "> WEATHER MODULE: STANDBY",
  "> AMBIENT AUDIO: READY",
  "> POPULATION COUNT: 4,821,047",
  "> WELCOME TO NEON DISTRICT."
];

var bootBox = document.getElementById("bootLogBox");
var bootBar = document.getElementById("bootBarFill");
var bootScreen = document.getElementById("bootScreen");
var currentBootLine = 0;
var totalBootLines = bootMessages.length;

function showNextBootLine() {
  if (currentBootLine >= totalBootLines) return;
  var lineDiv = document.createElement("div");
  lineDiv.textContent = bootMessages[currentBootLine];
  bootBox.appendChild(lineDiv);
  currentBootLine++;
  var progress = (currentBootLine / totalBootLines) * 100;
  bootBar.style.width = progress + "%";
  if (currentBootLine < totalBootLines) {
    setTimeout(showNextBootLine, 320);
  } else {
    setTimeout(function() {
      bootScreen.classList.add("fade-out");
      setTimeout(function() {
        bootScreen.style.display = "none";
      }, 900);
    }, 700);
  }
}
setTimeout(showNextBootLine, 500);


var clockEl = document.getElementById("hudClock");

function tickClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, "0");
  var m = String(now.getMinutes()).padStart(2, "0");
  var s = String(now.getSeconds()).padStart(2, "0");
  clockEl.textContent = h + ":" + m + ":" + s;
}
setInterval(tickClock, 1000);
tickClock();


function makeStars() {
  var container = document.getElementById("starsContainer");
  var numStars = 140;
  for (var i = 0; i < numStars; i++) {
    var star = document.createElement("div");
    star.classList.add("star-dot");
    star.style.left   = (Math.random() * 100) + "%";
    star.style.top    = (Math.random() * 85)  + "%";
    star.style.setProperty("--dur",   (2 + Math.random() * 4) + "s");
    star.style.setProperty("--delay", (-Math.random() * 5)    + "s");
    var bigStar = Math.random() > 0.8;
    star.style.width  = (bigStar ? 3 : 2) + "px";
    star.style.height = star.style.width;
    container.appendChild(star);
  }
}
makeStars();


function buildWindowGrids() {
  var allGrids = document.querySelectorAll(".win-grid");
  allGrids.forEach(function(grid) {
    var rows = parseInt(grid.dataset.r) || 6;
    var cols = parseInt(grid.dataset.c) || 3;
    grid.style.gridTemplateRows    = "repeat(" + rows + ", 1fr)";
    grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    var totalCells = rows * cols;
    for (var i = 0; i < totalCells; i++) {
      var cell = document.createElement("div");
      cell.classList.add("win-cell");
      var roll = Math.random();
      if (roll < 0.40)      cell.classList.add("w-on");
      else if (roll < 0.55) cell.classList.add("w-dim");
      else if (roll < 0.62) cell.classList.add("w-cyan");
      else if (roll < 0.67) cell.classList.add("w-pink");
      else                  cell.classList.add("w-off");
      grid.appendChild(cell);
    }
  });
}
buildWindowGrids();

function flickerRandomWindow() {
  var allCells = document.querySelectorAll(".win-cell");
  if (allCells.length === 0) return;
  var pick = allCells[Math.floor(Math.random() * allCells.length)];
  var wasOn = pick.classList.contains("w-on");
  if (wasOn) {
    pick.classList.remove("w-on");
    pick.classList.add("w-off");
  } else if (pick.classList.contains("w-off")) {
    pick.classList.remove("w-off");
    pick.classList.add("w-on");
  }
  setTimeout(flickerRandomWindow, 100 + Math.random() * 700);
}
setTimeout(flickerRandomWindow, 1200);


var tooltip    = document.getElementById("zoneTooltip");
var tipLabel   = document.getElementById("ztLabel");
var tipDesc    = document.getElementById("ztDesc");
var hudZone    = document.getElementById("hudZoneLabel");
var allBuildings = document.querySelectorAll(".building");

allBuildings.forEach(function(bld) {
  bld.addEventListener("mouseenter", function() {
    tipLabel.textContent = bld.dataset.label || bld.dataset.zone;
    tipDesc.textContent  = bld.dataset.desc  || "";
    tooltip.classList.add("show");
    hudZone.textContent  = "SECTOR 7 — " + (bld.dataset.zone || "???");
  });
  bld.addEventListener("mouseleave", function() {
    tooltip.classList.remove("show");
    hudZone.textContent = "SECTOR 7 — OVERVIEW";
  });
  bld.addEventListener("mousemove", function(e) {
    var gap = 16;
    var tx  = e.clientX + gap;
    var ty  = e.clientY + gap;
    if (tx + 250 > window.innerWidth)  tx = e.clientX - 250 - gap;
    if (ty + 130 > window.innerHeight) ty = e.clientY - 130 - gap;
    tooltip.style.left = tx + "px";
    tooltip.style.top  = ty + "px";
  });
  bld.addEventListener("click", function() {
    openZone(bld);
  });
});


var zoneInfo = {
  ARCADE: {
    icon: "▶",
    color: "#ff2d78",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR A — ARCADE DISTRICT ]</span>

The oldest entertainment block in Neon District. Still running on original hardware from 2041.
Smells like synth-cola and burnt circuits. No one complains.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Cabinet_01: GALACTIC INVADERS — Quarter a play. Or a chip. Whatever.</div>
      <div class="zp-list-item">Cabinet_02: NEON RACER 3D — Top score held by unknown user "????" since 2078.</div>
      <div class="zp-list-item">Cabinet_03: STREET BRAWLER EX — The joystick is held on with tape.</div>
      <div class="zp-list-item">Cabinet_04: DIGITAL FORTUNE TELLER — Says the same thing to everyone.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-pink">OPEN 24/7</span>
        <span class="zp-tag tag-cyan">CASH ONLY</span>
        <span class="zp-tag tag-yellow">NO MINORS AFTER 23:00</span>
      </div>
    `
  },
  HOTEL: {
    icon: "◈",
    color: "#b8b8ff",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR B — GRAND MERIDIAN HOTEL ]</span>

50 floors. 312 rooms. One permanently locked: Room 404.
Front desk doesn't ask questions. Neither do the elevators.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Floor 1–10: Standard rooms. Functional. Slightly damp.</div>
      <div class="zp-list-item">Floor 11–30: Executive suites. Minibar included. Contents unknown.</div>
      <div class="zp-list-item">Floor 31–49: VIP only. Access requires a key card no one remembers issuing.</div>
      <div class="zp-list-item">Floor 50: The penthouse. Listed as "under renovation" since 2059.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-violet">CHECK-IN: ANYTIME</span>
        <span class="zp-tag tag-cyan">CHECK-OUT: ???</span>
        <span class="zp-tag tag-pink">NO CAMERAS ON FLOOR 31+</span>
      </div>
    `
  },
  MARKET: {
    icon: "◎",
    color: "#ffe600",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR C — BLACK MARKET PLAZA ]</span>

If it exists, it's here. If it doesn't exist yet, someone is working on it.
Payment accepted in credits, chips, or favors. No refunds. No receipts.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Stall_01: Modded tech. Don't ask where it came from.</div>
      <div class="zp-list-item">Stall_02: Expired rations. Still technically food.</div>
      <div class="zp-list-item">Stall_03: Counterfeit ID. Very convincing, allegedly.</div>
      <div class="zp-list-item">Stall_04: Information broker. She knows everything. Prices vary.</div>
      <div class="zp-list-item">Stall_05: Mystery crates. Contents: a surprise. Usually bad.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-yellow">OPEN 25/8</span>
        <span class="zp-tag tag-pink">NO CORP AGENTS</span>
        <span class="zp-tag tag-cyan">BARTER WELCOME</span>
      </div>
    `
  },
  DINER: {
    icon: "◇",
    color: "#ff6a00",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR D — CHROME DINER ]</span>

Best synth-coffee in the district. Established 2049.
The pie is real. At least that's what the sign says.
Jukebox in the corner plays the same 12 songs. Nobody touches it.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Menu Item: Neon Noodles — Glowing broth. Safe to consume.</div>
      <div class="zp-list-item">Menu Item: Synth Burger — 40% real protein. The rest? Don't ask.</div>
      <div class="zp-list-item">Menu Item: Chrome Coffee — Keeps you awake for 14–18 hours guaranteed.</div>
      <div class="zp-list-item">Menu Item: Sector 7 Pie — Real fruit. Real crust. Probably.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-orange">OPEN 06:00–03:00</span>
        <span class="zp-tag tag-yellow">FREE REFILLS</span>
        <span class="zp-tag tag-cyan">NO FIGHTING INSIDE</span>
      </div>
    `
  },
  CORP: {
    icon: "⬡",
    color: "#00f0ff",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR E — OMNI CORP TOWER ]</span>

They built the grid. They maintain the rain schedule.
Floor 1–98: Standard corporate operations.
Floor 99: Classified. The elevator button for it doesn't exist.

Employees are asked to smile at all times.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Division: NeonGrid Infrastructure — Powers the whole district.</div>
      <div class="zp-list-item">Division: WeatherSys Corp — They literally control the weather. Yes.</div>
      <div class="zp-list-item">Division: DataHarvest Unit — Collects everything. Stores it somewhere.</div>
      <div class="zp-list-item">Division: Public Relations — "We care about Sector 7." — OmniCorp, 2087</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-cyan">MON–SUN: ALWAYS OPEN</span>
        <span class="zp-tag tag-pink">VISITORS: RESTRICTED</span>
        <span class="zp-tag tag-violet">FLOOR 99: DO NOT ATTEMPT</span>
      </div>
    `
  },
  CLUB: {
    icon: "◉",
    color: "#b400ff",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR F — ULTRAVIOLET CLUB ]</span>

Three floors. Bass so heavy it messes with your neural implants.
No cameras allowed inside. The management is very serious about this.
Dress code: glow or go home.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Floor 1: Main dance floor. Capacity 400. Usually 600 inside.</div>
      <div class="zp-list-item">Floor 2: VIP lounge. Requires an invitation. Or the right name.</div>
      <div class="zp-list-item">Floor 3: DJ booth and private rooms. Unknown what happens up there.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-violet">OPEN 22:00–05:00</span>
        <span class="zp-tag tag-pink">NO CORP SECURITY</span>
        <span class="zp-tag tag-cyan">IMPLANTS CHECKED AT DOOR</span>
      </div>
    `
  },
  CLINIC: {
    icon: "✚",
    color: "#00ff99",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR G — DR. SYNTH CLINIC ]</span>

Cybernetic upgrades. Neural patches. Emergency repairs.
Dr. Synth has been operating since 2061. No one has seen her face.
She does good work. The waiting room has old magazines from 2045.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Service: Neural Patch v7 — Fixes lag in your brain. Usually.</div>
      <div class="zp-list-item">Service: Optic Upgrade — See in the dark. Or see too much.</div>
      <div class="zp-list-item">Service: Limb Replacement — Faster, stronger, under warranty (30 days).</div>
      <div class="zp-list-item">Service: Memory Backup — Stores your memories offsite. T&Cs apply.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-green">OPEN 08:00–22:00</span>
        <span class="zp-tag tag-cyan">WALK-INS OK</span>
        <span class="zp-tag tag-yellow">PAYMENT PLANS AVAILABLE</span>
      </div>
    `
  },
  RADIO: {
    icon: "◎",
    color: "#ff2d78",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR H — DISTRICT RADIO // FM 88.7 ]</span>

Broadcasting 24/7. Weather updates, city news, propaganda, and late-night jazz.
The host only goes by "V". She's been on air since 2071 without a single day off.
Some say she's not human. The station has no comment.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">00:00–06:00: Late Night Jazz with V. Smooth. Unsettling.</div>
      <div class="zp-list-item">06:00–10:00: Morning Grid Report. Traffic, weather, incident logs.</div>
      <div class="zp-list-item">10:00–18:00: Sector 7 Today. Community news and announcements.</div>
      <div class="zp-list-item">18:00–00:00: The Signal. Music and transmissions from outside the district.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-pink">LIVE 24/7</span>
        <span class="zp-tag tag-cyan">FM 88.7</span>
        <span class="zp-tag tag-violet">SUBMISSIONS OPEN</span>
      </div>
    `
  },
  BANK: {
    icon: "◈",
    color: "#ffd700",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR I — NEON DISTRICT BANK ]</span>

Your credits are safe here. Probably.
The vault hasn't been audited since 2074. The manager says that's fine.
Nobody has verified this claim.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Service: Credit Storage — Standard accounts. Insured up to 50,000 credits.</div>
      <div class="zp-list-item">Service: Wire Transfer — To anywhere. We don't ask where.</div>
      <div class="zp-list-item">Service: Vault Rental — Private storage. Biometric lock. We lost the spare key. Allegedly.</div>
      <div class="zp-list-item">Service: Loans — Variable rate. Collector visits are described as "friendly."</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-yellow">MON–SAT: 09:00–18:00</span>
        <span class="zp-tag tag-gold">INSURED*</span>
        <span class="zp-tag tag-cyan">*TERMS APPLY</span>
      </div>
    `
  },
  PAWN: {
    icon: "◇",
    color: "#ff9900",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR J — CHROME PAWN & TRADE ]</span>

Been here since 2048. Owner goes by "Rex". Might be a robot. Hasn't blinked in 3 years.
Buy. Sell. Trade. Don't ask about the back room.
Cash only after dark. Rex is very serious about this.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Item: Modded Optics (used) — One previous owner. They don't need them anymore.</div>
      <div class="zp-list-item">Item: Vintage Synth — 2055 model. Still works. Smells like something.</div>
      <div class="zp-list-item">Item: Neural Drive (locked) — Contents unknown. Rex won't say where he got it.</div>
      <div class="zp-list-item">Item: District Patrol Badge — Expired 2081. "Decorative purposes only."</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-orange">OPEN WHENEVER</span>
        <span class="zp-tag tag-yellow">CASH ONLY AFTER DARK</span>
        <span class="zp-tag tag-pink">NO QUESTIONS ASKED</span>
      </div>
    `
  },
  GYM: {
    icon: "◉",
    color: "#ff4444",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR K — IRON DISTRICT GYM ]</span>

Open all night. Chrome weights. Mirrors that show a slightly better version of you.
About half the members have implants. The other half wish they did.
The protein shakes are synthetic. They work though.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Zone: Free Weights — Classic iron. No chrome substitutes allowed in here.</div>
      <div class="zp-list-item">Zone: Augment Training Bay — For those with implants. Calibration sessions available.</div>
      <div class="zp-list-item">Zone: Combat Sim Room — VR sparring. Difficulty: "District Realistic."</div>
      <div class="zp-list-item">Zone: Recovery Pod — Sleep while your muscles rebuild. 40-minute sessions.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-pink">OPEN 24/7</span>
        <span class="zp-tag tag-orange">NO SHIRT NO SERVICE</span>
        <span class="zp-tag tag-cyan">IMPLANTS ALLOWED</span>
      </div>
    `
  },
  LAUNDRY: {
    icon: "◎",
    color: "#44ddff",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR L — ALL-NITE LAUNDROMAT ]</span>

24-hour wash and fold. Best place in the district to overhear gossip.
Machine 7 has been "out of order" since 2083. It still works. Everyone knows. Nobody says anything.
There is a cat that lives here. Nobody owns it. Nobody questions this.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Machines 1–6: Standard wash. 3 credits per cycle. Soap sold separately.</div>
      <div class="zp-list-item">Machine 7: Out of order. Works fine. 1 credit. Don't tell the owner.</div>
      <div class="zp-list-item">Dryers: Hot, medium, cold. The cold one just spins. Still 2 credits.</div>
      <div class="zp-list-item">Corner Seat: Taken. Always. Same old man since 2071. He doesn't do laundry.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-cyan">OPEN 24/7</span>
        <span class="zp-tag tag-violet">CAT ON PREMISES</span>
        <span class="zp-tag tag-yellow">EXACT CHANGE APPRECIATED</span>
      </div>
    `
  },
  TEMPLE: {
    icon: "✦",
    color: "#c084fc",
    html: `
      <p class="zp-content-text"><span class="zp-accent">[ SECTOR M — TEMPLE OF THE GRID ]</span>

The oldest structure in Neon District. Pre-neon. Pre-grid. Pre-everything.
Nobody knows who built it. Nobody knows why it still has power.
The lights inside have not flickered once since 2031. The rest of the district flickers constantly.</p>
      <hr class="zp-divider">
      <div class="zp-list-item">Hall of Signal: Main chamber. The hum here is different. Lower. Older.</div>
      <div class="zp-list-item">Archive Room: Data tablets going back before the district. Unreadable.</div>
      <div class="zp-list-item">The Void Room: Back of the temple. Door always open. Nobody goes in twice.</div>
      <div class="zp-list-item">Keeper's Post: Staffed by someone in a gray robe. Name unknown. Always smiling.</div>
      <hr class="zp-divider">
      <div>
        <span class="zp-tag tag-violet">ALWAYS OPEN</span>
        <span class="zp-tag tag-cyan">NO TECH INSIDE</span>
        <span class="zp-tag tag-pink">SILENCE REQUESTED</span>
      </div>
    `
  }
};


var zoneOverlay = document.getElementById("zoneOverlay");
var zpTitle     = document.getElementById("zpTitle");
var zpIcon      = document.getElementById("zpIcon");
var zpBody      = document.getElementById("zpBody");
var zpFooter    = document.getElementById("zpFooterTxt");

function openZone(bld) {
  var zoneName = bld.dataset.zone;
  var data = zoneInfo[zoneName];
  if (!data) return;
  zpTitle.textContent = zoneName;
  zpIcon.textContent  = data.icon;
  zpIcon.style.color  = data.color;
  zpTitle.style.color = data.color;
  zpTitle.style.textShadow = "0 0 12px " + data.color;
  zpBody.innerHTML    = data.html;
  zpFooter.textContent = "NEON DISTRICT // " + (bld.dataset.label || zoneName);
  doGlitchFlash();
  zoneOverlay.classList.add("show");
  tooltip.classList.remove("show");
}

document.getElementById("zpCloseBtn").addEventListener("click", function() {
  zoneOverlay.classList.remove("show");
});

zoneOverlay.addEventListener("click", function(e) {
  if (e.target === zoneOverlay) {
    zoneOverlay.classList.remove("show");
  }
});


var glitchEl = document.getElementById("glitchFlash");

function doGlitchFlash() {
  glitchEl.style.opacity = "1";
  setTimeout(function() { glitchEl.style.opacity = "0";   }, 60);
  setTimeout(function() { glitchEl.style.opacity = "0.5"; }, 110);
  setTimeout(function() { glitchEl.style.opacity = "0";   }, 160);
}

function scheduleRandomGlitch() {
  var waitTime = 9000 + Math.random() * 14000;
  setTimeout(function() {
    doGlitchFlash();
    scheduleRandomGlitch();
  }, waitTime);
}
scheduleRandomGlitch();


var isDay = false;
var btnDayNight = document.getElementById("btnDayNight");

btnDayNight.addEventListener("click", function() {
  isDay = !isDay;
  document.body.classList.toggle("is-day", isDay);
  btnDayNight.textContent = isDay ? "☽ NIGHT" : "☀ DAY";
  updateOvercastState();
  toggleBirds(isDay);
});


var rainOn    = false;
var rainLayer = document.getElementById("rainLayer");
var btnRain   = document.getElementById("btnRain");

function spawnRaindrops() {
  rainLayer.innerHTML = "";
  var numDrops = 130;
  for (var i = 0; i < numDrops; i++) {
    var drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left              = (Math.random() * 100) + "%";
    drop.style.height            = (10 + Math.random() * 20) + "px";
    drop.style.animationDuration = (0.4 + Math.random() * 0.7) + "s";
    drop.style.animationDelay   = (-Math.random() * 1.5) + "s";
    drop.style.opacity           = (0.2 + Math.random() * 0.5) + "";
    rainLayer.appendChild(drop);
  }
}

function updateOvercastState() {
  if (rainOn && isDay) {
    document.body.classList.add("is-overcast");
  } else {
    document.body.classList.remove("is-overcast");
  }
}

btnRain.addEventListener("click", function() {
  rainOn = !rainOn;
  if (rainOn) {
    spawnRaindrops();
    rainLayer.classList.add("active");
    rainLayer.style.display = "block";
    btnRain.textContent = "🌧 RAIN: ON";
    scheduleThunder();
  } else {
    rainLayer.classList.remove("active");
    rainLayer.style.display = "none";
    btnRain.textContent = "🌧 RAIN: OFF";
    thunderTimerID = null;
  }
  updateOvercastState();
});


var bgMusic     = null;
var musicIsOn   = false;
var btnSound    = document.getElementById("btnSound");

btnSound.addEventListener("click", function() {
  if (!bgMusic) {
    bgMusic = document.createElement("audio");
    bgMusic.src    = "music/ambient.mp3";
    bgMusic.loop   = true;
    bgMusic.volume = 0.45;
  }
  if (!musicIsOn) {
    bgMusic.play().catch(function() {});
    musicIsOn = true;
    btnSound.textContent = "♪ SFX: ON";
  } else {
    bgMusic.pause();
    musicIsOn = false;
    btnSound.textContent = "♪ SFX: OFF";
  }
});


function blinkRandomSign() {
  var allSigns = document.querySelectorAll(".neon-sign-big");
  var pick = allSigns[Math.floor(Math.random() * allSigns.length)];
  if (!pick) return;
  pick.style.opacity = "0.05";
  setTimeout(function() { pick.style.opacity = "1";   }, 70);
  setTimeout(function() { pick.style.opacity = "0.3"; }, 120);
  setTimeout(function() { pick.style.opacity = "1";   }, 190);
  setTimeout(blinkRandomSign, 1800 + Math.random() * 3500);
}
setTimeout(blinkRandomSign, 2500);


var statusPool = [
  "SCANNING DISTRICT...",
  "SIGNAL: STRONG",
  "NO THREATS DETECTED",
  "NEON GRID: STABLE",
  "UPTIME: 99.7%",
  "CITY NOISE: NOMINAL",
  "RAIN PROBABILITY: 62%",
  "OMNICORP WATCHING",
  "SECTOR 7: OPERATIONAL",
  "FM 88.7: TRANSMITTING",
  "POPULATION ACTIVE"
];

function updateStatusTicker() {
  if (hudZone.textContent.startsWith("SECTOR 7 — OVERVIEW")) {
    var msg = statusPool[Math.floor(Math.random() * statusPool.length)];
    hudZone.textContent = msg;
    setTimeout(function() {
      hudZone.textContent = "SECTOR 7 — OVERVIEW";
    }, 2200);
  }
  setTimeout(updateStatusTicker, 8000 + Math.random() * 7000);
}
setTimeout(updateStatusTicker, 6000);


document.addEventListener("mousemove", function(e) {
  var dot = document.createElement("div");
  dot.style.cssText = [
    "position:fixed",
    "left:" + e.clientX + "px",
    "top:" + e.clientY + "px",
    "width:5px",
    "height:5px",
    "background:rgba(0,240,255,0.55)",
    "border-radius:50%",
    "pointer-events:none",
    "z-index:9999",
    "transform:translate(-50%,-50%) scale(1)",
    "transition:opacity 0.4s,transform 0.4s",
    "box-shadow:0 0 6px #00f0ff"
  ].join(";");
  document.body.appendChild(dot);
  requestAnimationFrame(function() {
    dot.style.opacity   = "0";
    dot.style.transform = "translate(-50%,-50%) scale(0)";
  });
  setTimeout(function() {
    if (dot.parentNode) dot.parentNode.removeChild(dot);
  }, 420);
});


var konamiSequence = [
  "ArrowUp","ArrowUp",
  "ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight",
  "ArrowLeft","ArrowRight",
  "b","a"
];
var konamiProgress = 0;

document.addEventListener("keydown", function(e) {
  if (e.key === konamiSequence[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === konamiSequence.length) {
      konamiProgress = 0;
      activateKonamiMode();
    }
  } else {
    konamiProgress = 0;
  }
});

function activateKonamiMode() {
  var signs     = document.querySelectorAll(".neon-sign-big");
  var colorList = ["#ff2d78","#00f0ff","#ffe600","#b400ff","#ff6a00","#00ff99","#ffffff"];
  var cycleStep = 0;
  var colorInterval = setInterval(function() {
    signs.forEach(function(sign, idx) {
      var c = colorList[(idx + cycleStep) % colorList.length];
      sign.style.setProperty("--nc", c);
      sign.style.color      = c;
      sign.style.textShadow = "0 0 10px " + c + ", 0 0 30px " + c;
    });
    cycleStep++;
  }, 140);
  doGlitchFlash();
  setTimeout(function() {
    clearInterval(colorInterval);
    signs.forEach(function(sign) {
      sign.style.color      = "";
      sign.style.textShadow = "";
    });
  }, 6000);
}


var thunderTimerID = null;

function doThunderFlash() {
  if (!rainOn) return;
  glitchEl.style.background = "rgba(255,255,255,0.18)";
  glitchEl.style.opacity    = "1";
  setTimeout(function() { glitchEl.style.opacity = "0";   }, 80);
  setTimeout(function() { glitchEl.style.opacity = "0.6"; }, 130);
  setTimeout(function() { glitchEl.style.opacity = "0";   }, 200);
  setTimeout(function() {
    glitchEl.style.background = "rgba(0,240,255,0.08)";
  }, 250);
  scheduleThunder();
}

function scheduleThunder() {
  if (!rainOn) return;
  var waitMS = 8000 + Math.random() * 20000;
  thunderTimerID = setTimeout(doThunderFlash, waitMS);
}


var birdContainer = null;

function spawnBird() {
  if (!isDay) return;
  var bird = document.createElement("div");
  bird.classList.add("bird-obj");
  var birdTop      = 10 + Math.random() * 35;
  var birdDuration = 12 + Math.random() * 18;
  var birdDelay    = Math.random() * -10;
  bird.style.top               = birdTop + "%";
  bird.style.animationDuration = birdDuration + "s";
  bird.style.animationDelay    = birdDelay + "s";
  bird.textContent = Math.random() > 0.5 ? "🐦" : "〜";
  birdContainer.appendChild(bird);
  setTimeout(function() {
    if (bird.parentNode) bird.parentNode.removeChild(bird);
  }, (birdDuration + 2) * 1000);
}

function startBirdLoop() {
  if (!isDay) return;
  spawnBird();
  setTimeout(startBirdLoop, 3000 + Math.random() * 5000);
}

function toggleBirds(dayIsOn) {
  if (!birdContainer) return;
  if (dayIsOn) {
    birdContainer.style.display = "block";
    startBirdLoop();
  } else {
    birdContainer.style.display = "none";
    birdContainer.innerHTML = "";
  }
}

(function setupBirds() {
  birdContainer = document.createElement("div");
  birdContainer.id = "birdContainer";
  birdContainer.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    "display:none",
    "overflow:hidden",
    "z-index:2"
  ].join(";");
  var skyEl = document.querySelector(".sky-layer");
  if (skyEl) skyEl.appendChild(birdContainer);
})();


var puddleContainer = null;

function makeSplash() {
  if (!rainOn) return;
  var splash = document.createElement("div");
  splash.classList.add("puddle-splash");
  splash.style.left = (5 + Math.random() * 90) + "%";
  puddleContainer.appendChild(splash);
  setTimeout(function() {
    if (splash.parentNode) splash.parentNode.removeChild(splash);
  }, 700);
}

(function setupPuddles() {
  puddleContainer = document.createElement("div");
  puddleContainer.id = "puddleContainer";
  puddleContainer.style.cssText = [
    "position:absolute",
    "bottom:0",
    "left:0",
    "width:100%",
    "height:100%",
    "pointer-events:none",
    "overflow:hidden",
    "z-index:6"
  ].join(";");
  var roadEl = document.querySelector(".road-strip");
  if (roadEl) roadEl.appendChild(puddleContainer);
})();

setInterval(function() {
  if (rainOn && puddleContainer && puddleContainer.children.length < 6) {
    makeSplash();
  }
}, 120);


console.log("%c NEON DISTRICT ", "background:#00f0ff;color:#000;font-weight:bold;font-size:16px;padding:4px 10px;border-radius:2px;");
console.log("%c City Explorer // Sector 7 // Year 2087 ", "color:#b400ff;font-size:12px;");
console.log("%c Built with HTML, CSS & vanilla JS. No frameworks. ", "color:#666;font-size:11px;");
console.log("%c Easter egg: try the Konami code → ↑↑↓↓←→←→BA ", "color:#ff2d78;font-size:11px;");
