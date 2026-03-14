// ROTINACRAFT - Mini-Jogos e Demonstracoes
// Depende de: script.js (state, save, toast, checkAchs, openModal, closeModals, EMOJI, today)

// ===== MAPA DO MUNDO =====
var MAP_AREAS = [
    {id:'village', name:'Vila', desc:'Escovar os Dentes', icon:'villager1', unlockLv:1, color:'var(--grass)', game:'brushing', emoji:'🦷'},
    {id:'forest', name:'Floresta', desc:'Vestir-se para o Dia', icon:'oak_tree', unlockLv:3, color:'#2E7D32', game:'dressing', emoji:'👕'},
    {id:'cave', name:'Caverna', desc:'Alimentacao Saudavel', icon:'diamond_ore', unlockLv:5, color:'var(--stone-dark)', game:'eating', emoji:'🍎'},
    {id:'desert', name:'Templo do Deserto', desc:'Rotina de Dormir', icon:'sand', unlockLv:8, color:'var(--gold)', game:'bedtime', emoji:'😴'},
    {id:'nether', name:'Portal do Nether', desc:'Lavar as Maos', icon:'crying_obsidian', unlockLv:10, color:'#8B0000', game:'handwash', emoji:'🧼'},
];

function renderMap() {
    var c = document.getElementById('map-world');
    if (!c) return;
    var h = '';
    // Render from top (hardest) to bottom (easiest)
    for (var i = MAP_AREAS.length - 1; i >= 0; i--) {
        var a = MAP_AREAS[i];
        var unlocked = state.lv >= a.unlockLv;
        var stateKey = 'mg_' + a.game + '_bestStars';
        var stars = state[stateKey] || 0;

        h += '<div class="map-node' + (unlocked ? '' : ' locked') + '" data-area="' + a.id + '" data-biome="' + a.id + '">';
        h += '<div class="map-icon"><img src="' + EMOJI + a.icon + '.png" alt="' + a.name + '"></div>';
        h += '<div class="map-node-info">';
        h += '<div class="map-node-name">' + a.emoji + ' ' + a.name + '</div>';
        h += '<div class="map-node-desc">' + a.desc + '</div>';
        if (unlocked) {
            h += '<div class="map-node-unlock">Desbloqueado!</div>';
        } else {
            h += '<div class="map-node-unlock">Nivel ' + a.unlockLv + ' para desbloquear</div>';
        }
        h += '</div>';
        h += '<div class="map-node-stars">';
        for (var s = 1; s <= 3; s++) h += (s <= stars ? '⭐' : '☆');
        h += '</div>';
        h += '</div>';
        if (i > 0) {
            var nextUnlocked = state.lv >= MAP_AREAS[i - 1].unlockLv;
            h += '<div class="map-path' + (nextUnlocked ? ' unlocked' : '') + '"></div>';
        }
    }
    c.innerHTML = h;
}

// ===== MINIJOGO ENGINE =====
var mgState = null; // Current mini-game state
var mgTimerInterval = null;
var mgHoldInterval = null;

function closeMiniGame() {
    if (mgTimerInterval) { clearInterval(mgTimerInterval); mgTimerInterval = null; }
    if (mgHoldInterval) { clearInterval(mgHoldInterval); mgHoldInterval = null; }
    mgState = null;
    closeModals();
}

function openMiniGame(areaId) {
    var area = null;
    for (var i = 0; i < MAP_AREAS.length; i++) {
        if (MAP_AREAS[i].id === areaId) { area = MAP_AREAS[i]; break; }
    }
    if (!area || state.lv < area.unlockLv) { toast('Area trancada! Precisa nivel ' + area.unlockLv); return; }

    var games = {
        brushing: startBrushingGame,
        eating: startEatingGame,
        bedtime: startBedtimeGame,
        handwash: startHandwashGame,
        dressing: startDressingGame,
    };
    if (games[area.game]) {
        openModal('modal-minigame');
        games[area.game]();
    }
}

function finishMiniGame(gameKey, stars) {
    var xpReward = stars * 15;
    var coinReward = stars * 5;
    state.xp += xpReward;
    state.coins += coinReward;
    state['mg_' + gameKey + '_played']++;
    state['mg_' + gameKey + '_bestStars'] = Math.max(state['mg_' + gameKey + '_bestStars'], stars);
    state['mg_' + gameKey + '_lastPlayed'] = today();

    // Level up check (same as completeQuest)
    while (state.xp >= state.xpNext) {
        state.xp -= state.xpNext;
        state.lv++;
        state.xpNext = Math.floor(100 * Math.pow(1.2, state.lv - 1));
        if (state.maxHp < 10) { state.maxHp++; state.hp = state.maxHp; }
    }
    checkAchs();
    save();

    // Show result
    showMiniGameResult(stars, xpReward, coinReward);
    if (typeof updateAll === 'function') updateAll();
}

function showMiniGameResult(stars, xp, coins) {
    if (mgTimerInterval) { clearInterval(mgTimerInterval); mgTimerInterval = null; }
    if (mgHoldInterval) { clearInterval(mgHoldInterval); mgHoldInterval = null; }

    var body = document.getElementById('mg-body');
    var starsHtml = '';
    for (var i = 1; i <= 3; i++) {
        starsHtml += '<span>' + (i <= stars ? '⭐' : '☆') + '</span>';
    }
    var msgs = ['Precisa melhorar...', 'Muito bom!', 'Excelente!', 'PERFEITO!'];
    body.innerHTML =
        '<div class="mg-result">' +
        '<div class="mg-result-stars">' + starsHtml + '</div>' +
        '<div class="mg-result-text">' + msgs[stars] + '</div>' +
        '<div class="mg-result-rewards">+' + xp + ' XP | +' + coins + ' 💎</div>' +
        '<button class="mc-btn" id="mg-result-ok">Incrivel!</button>' +
        '</div>';

    document.getElementById('mg-step-text').textContent = '';
    document.getElementById('mg-timer').textContent = '';
}

// ===== ESCOVACAO (BRUSHING) =====
var BRUSH_STEPS = [
    {id:'paste', text:'Colocar pasta na escova', tip:'A pasta de dente tem fluor que protege seus dentes!', duration:3, type:'tap', icon:'🪥'},
    {id:'front', text:'Escovar dentes da frente', tip:'Movimentos circulares no angulo de 45 graus!', duration:30, type:'hold-quad', icon:'😁'},
    {id:'inner', text:'Escovar parte de dentro', tip:'Use movimentos de varredura de cima para baixo!', duration:30, type:'hold-quad', icon:'🦷'},
    {id:'chewing', text:'Escovar superficie de mastigar', tip:'Vai e volta nas partes de cima dos dentes!', duration:30, type:'hold-quad', icon:'🍽️'},
    {id:'tongue', text:'Escovar a lingua', tip:'Escove a lingua suavemente para tirar bacterias!', duration:15, type:'tap-multi', icon:'👅'},
    {id:'rinse', text:'Enxaguar a boca', tip:'Cuspa a pasta e enxague com agua!', duration:5, type:'tap', icon:'💧'},
];

var BRUSH_MSGS = ['Muito bem!', 'Continue assim!', 'Dentes brilhando!', 'Steve esta orgulhoso!', 'Fantastico!', 'Que limpeza!', 'Perfeito!', 'Heroi da escovacao!', 'Incrivel!'];

function startBrushingGame() {
    document.getElementById('mg-title').textContent = 'Escovar os Dentes';
    mgState = {
        game: 'brushing',
        step: 0,
        quadIndex: 0,
        quadTimes: [0, 0, 0, 0],
        totalTime: 120,
        elapsed: 0,
        tapCount: 0,
        holding: false,
    };
    renderBrushStep();
    startGameTimer();
}

function startGameTimer() {
    if (mgTimerInterval) clearInterval(mgTimerInterval);
    mgTimerInterval = setInterval(function () {
        if (!mgState) return;
        mgState.elapsed++;
        var remaining = mgState.totalTime - mgState.elapsed;
        if (remaining <= 0) {
            // Time's up
            var stars = calcBrushStars();
            finishMiniGame('brushing', Math.max(1, stars));
            return;
        }
        var min = Math.floor(remaining / 60);
        var sec = remaining % 60;
        document.getElementById('mg-timer').textContent = min + ':' + (sec < 10 ? '0' : '') + sec;
        document.getElementById('mg-progress-fill').style.width = (mgState.elapsed / mgState.totalTime * 100) + '%';
    }, 1000);
}

function renderBrushStep() {
    if (!mgState || mgState.step >= BRUSH_STEPS.length) {
        var stars = calcBrushStars();
        finishMiniGame('brushing', stars);
        return;
    }
    var step = BRUSH_STEPS[mgState.step];
    var body = document.getElementById('mg-body');
    document.getElementById('mg-step-text').textContent = 'Passo ' + (mgState.step + 1) + ' de ' + BRUSH_STEPS.length;

    var h = '<div class="brush-game">';
    h += '<div class="brush-steve">';
    h += '<img src="' + EMOJI + state.char + '.png" id="brush-steve-img">';
    h += '<div class="brush-bubble" id="brush-bubble">' + step.text + '</div>';
    h += '</div>';

    if (step.type === 'tap') {
        h += '<div class="brush-tap-target" id="brush-tap">' + step.icon + '</div>';
    } else if (step.type === 'hold-quad') {
        mgState.quadIndex = 0;
        mgState.quadTimes = [0, 0, 0, 0];
        h += '<div class="brush-mouth" id="brush-mouth">';
        h += '<div class="teeth-row top">';
        h += '<div class="tooth-quad active" data-quad="0">Superior<br>Esquerdo<div class="quad-fill"></div></div>';
        h += '<div class="tooth-quad" data-quad="1">Superior<br>Direito<div class="quad-fill"></div></div>';
        h += '</div>';
        h += '<div class="teeth-row bottom">';
        h += '<div class="tooth-quad" data-quad="2">Inferior<br>Esquerdo<div class="quad-fill"></div></div>';
        h += '<div class="tooth-quad" data-quad="3">Inferior<br>Direito<div class="quad-fill"></div></div>';
        h += '</div>';
        h += '</div>';
    } else if (step.type === 'tap-multi') {
        mgState.tapCount = 0;
        h += '<div class="brush-tap-target" id="brush-tap">' + step.icon + '</div>';
        h += '<div class="brush-tap-counter" id="brush-counter">0 / 10</div>';
    }

    h += '<div class="brush-instruction">' + step.text + '</div>';
    h += '<div class="brush-tip">' + step.tip + '</div>';
    h += '</div>';
    body.innerHTML = h;

    // Setup events
    if (step.type === 'tap') {
        setupTapStep();
    } else if (step.type === 'hold-quad') {
        setupHoldQuadStep();
    } else if (step.type === 'tap-multi') {
        setupTapMultiStep();
    }
}

function setupTapStep() {
    var btn = document.getElementById('brush-tap');
    if (!btn) return;
    btn.addEventListener('click', function () {
        showBrushMsg();
        mgState.step++;
        setTimeout(renderBrushStep, 600);
    });
}

function setupTapMultiStep() {
    var btn = document.getElementById('brush-tap');
    if (!btn) return;
    btn.addEventListener('click', function () {
        if (!mgState) return;
        mgState.tapCount++;
        var counter = document.getElementById('brush-counter');
        if (counter) counter.textContent = mgState.tapCount + ' / 10';
        if (mgState.tapCount >= 10) {
            showBrushMsg();
            mgState.step++;
            setTimeout(renderBrushStep, 600);
        }
    });
}

function setupHoldQuadStep() {
    var quads = document.querySelectorAll('.tooth-quad');
    var targetPerQuad = 7500; // 7.5 seconds in ms

    for (var i = 0; i < quads.length; i++) {
        (function (quad) {
            var onStart = function (e) {
                e.preventDefault();
                if (!mgState || mgState.holding) return;
                var qi = parseInt(quad.dataset.quad);
                if (qi !== mgState.quadIndex) return;
                mgState.holding = true;
                if (mgHoldInterval) clearInterval(mgHoldInterval);
                mgHoldInterval = setInterval(function () {
                    if (!mgState || !mgState.holding) return;
                    mgState.quadTimes[qi] += 100;
                    var pct = Math.min((mgState.quadTimes[qi] / targetPerQuad) * 100, 100);
                    var fill = quad.querySelector('.quad-fill');
                    if (fill) fill.style.height = pct + '%';
                    if (mgState.quadTimes[qi] >= targetPerQuad) {
                        mgState.holding = false;
                        clearInterval(mgHoldInterval);
                        mgHoldInterval = null;
                        quad.classList.remove('active');
                        quad.classList.add('clean');
                        showBrushMsg();
                        mgState.quadIndex++;
                        if (mgState.quadIndex >= 4) {
                            mgState.step++;
                            setTimeout(renderBrushStep, 800);
                        } else {
                            var next = document.querySelector('.tooth-quad[data-quad="' + mgState.quadIndex + '"]');
                            if (next) next.classList.add('active');
                        }
                    }
                }, 100);
            };
            var onEnd = function () {
                if (!mgState) return;
                mgState.holding = false;
                if (mgHoldInterval) { clearInterval(mgHoldInterval); mgHoldInterval = null; }
            };
            quad.addEventListener('touchstart', onStart, {passive: false});
            quad.addEventListener('touchend', onEnd);
            quad.addEventListener('mousedown', onStart);
            quad.addEventListener('mouseup', onEnd);
            quad.addEventListener('mouseleave', onEnd);
        })(quads[i]);
    }
}

function calcBrushStars() {
    if (!mgState) return 1;
    var stepsCompleted = mgState.step;
    if (stepsCompleted >= BRUSH_STEPS.length) return 3;
    if (stepsCompleted >= 4) return 2;
    return 1;
}

function showBrushMsg() {
    var bubble = document.getElementById('brush-bubble');
    if (bubble) {
        bubble.textContent = BRUSH_MSGS[Math.floor(Math.random() * BRUSH_MSGS.length)];
        bubble.style.animation = 'none';
        bubble.offsetHeight; // force reflow
        bubble.style.animation = 'bubble-in 0.4s ease-out';
    }
}

// ===== EATING GAME =====
var FOODS = [
    {name:'Maca', img:'apple', healthy:true, why:'Frutas sao ricas em vitaminas!'},
    {name:'Pao', img:'bread', healthy:true, why:'Carboidratos dao energia!'},
    {name:'Bolo', img:'cake', healthy:false, why:'Muito acucar faz mal aos dentes!'},
    {name:'Biscoito', img:'cookie', healthy:false, why:'Biscoitos tem muito acucar!'},
    {name:'Melancia', img:'melon', healthy:true, why:'Frutas hidratam o corpo!'},
    {name:'Peixe', img:'cooked_fish', healthy:true, why:'Peixe e rico em omega 3!'},
    {name:'Carne', img:'cooked_porkchop', healthy:true, why:'Proteinas ajudam a crescer!'},
    {name:'Carne Podre', img:'rotten_flesh', healthy:false, why:'Comida estragada faz muito mal!'},
    {name:'Ensopado', img:'stew_mushroom', healthy:true, why:'Sopas sao nutritivas!'},
    {name:'Maca Dourada', img:'gold_apple', healthy:true, why:'Super alimento poderoso!'},
];

function startEatingGame() {
    document.getElementById('mg-title').textContent = 'Alimentacao Saudavel';
    var shuffled = FOODS.slice().sort(function () { return Math.random() - 0.5; });
    mgState = {
        game: 'eating',
        foods: shuffled.slice(0, 8),
        current: 0,
        correct: 0,
        total: 8,
        totalTime: 60,
        elapsed: 0,
    };
    renderEatingStep();
    startEatingTimer();
}

function startEatingTimer() {
    if (mgTimerInterval) clearInterval(mgTimerInterval);
    mgTimerInterval = setInterval(function () {
        if (!mgState) return;
        mgState.elapsed++;
        var remaining = mgState.totalTime - mgState.elapsed;
        if (remaining <= 0) {
            var stars = mgState.correct >= 7 ? 3 : (mgState.correct >= 5 ? 2 : 1);
            finishMiniGame('eating', stars);
            return;
        }
        var sec = remaining;
        document.getElementById('mg-timer').textContent = '0:' + (sec < 10 ? '0' : '') + sec;
        document.getElementById('mg-progress-fill').style.width = (mgState.current / mgState.total * 100) + '%';
    }, 1000);
}

function renderEatingStep() {
    if (!mgState || mgState.current >= mgState.total) {
        var stars = mgState.correct >= 7 ? 3 : (mgState.correct >= 5 ? 2 : 1);
        finishMiniGame('eating', stars);
        return;
    }
    var food = mgState.foods[mgState.current];
    var body = document.getElementById('mg-body');
    document.getElementById('mg-step-text').textContent = (mgState.current + 1) + ' de ' + mgState.total + ' | Acertos: ' + mgState.correct;

    var h = '<div class="eating-game">';
    h += '<div class="brush-steve"><img src="' + EMOJI + state.char + '.png" id="brush-steve-img">';
    h += '<div class="brush-bubble" id="brush-bubble">Isso e saudavel?</div></div>';
    h += '<div class="eating-food"><img src="' + EMOJI + food.img + '.png"></div>';
    h += '<div class="eating-food-name">' + food.name + '</div>';
    h += '<div class="eating-chests">';
    h += '<div class="eating-chest healthy" data-choice="healthy"><div style="font-size:24px">✅</div><div class="eating-chest-label">Saudavel</div></div>';
    h += '<div class="eating-chest unhealthy" data-choice="unhealthy"><div style="font-size:24px">❌</div><div class="eating-chest-label">Nao Saudavel</div></div>';
    h += '</div>';
    h += '<div id="eating-feedback" class="eating-feedback"></div>';
    h += '</div>';
    body.innerHTML = h;
}

// ===== BEDTIME ORDERING =====
var BEDTIME_STEPS = [
    {text:'Tomar banho', icon:'🚿'},
    {text:'Vestir pijama', icon:'👕'},
    {text:'Escovar os dentes', icon:'🦷'},
    {text:'Ler uma historia', icon:'📖'},
    {text:'Apagar a luz', icon:'🔦'},
    {text:'Dormir', icon:'😴'},
];

function startBedtimeGame() {
    document.getElementById('mg-title').textContent = 'Rotina de Dormir';
    var shuffled = BEDTIME_STEPS.slice().sort(function () { return Math.random() - 0.5; });
    mgState = {
        game: 'bedtime',
        steps: shuffled,
        correctOrder: BEDTIME_STEPS.slice(),
        nextCorrect: 0,
        errors: 0,
        totalTime: 60,
        elapsed: 0,
    };
    renderBedtimeGame();
    startBedtimeTimer();
}

function startBedtimeTimer() {
    if (mgTimerInterval) clearInterval(mgTimerInterval);
    mgTimerInterval = setInterval(function () {
        if (!mgState) return;
        mgState.elapsed++;
        var remaining = mgState.totalTime - mgState.elapsed;
        if (remaining <= 0) {
            var stars = mgState.nextCorrect >= 5 ? 2 : 1;
            finishMiniGame('bedtime', stars);
            return;
        }
        document.getElementById('mg-timer').textContent = '0:' + (remaining < 10 ? '0' : '') + remaining;
        document.getElementById('mg-progress-fill').style.width = (mgState.nextCorrect / BEDTIME_STEPS.length * 100) + '%';
    }, 1000);
}

function renderBedtimeGame() {
    if (!mgState) return;
    var body = document.getElementById('mg-body');
    document.getElementById('mg-step-text').textContent = 'Coloque na ordem correta!';

    var h = '<div class="bedtime-game">';
    h += '<div class="brush-steve"><img src="' + EMOJI + state.char + '.png">';
    h += '<div class="brush-bubble" id="brush-bubble">Qual e o proximo passo?</div></div>';

    for (var i = 0; i < mgState.steps.length; i++) {
        var s = mgState.steps[i];
        var correctIdx = -1;
        for (var j = 0; j < mgState.correctOrder.length; j++) {
            if (mgState.correctOrder[j].text === s.text) { correctIdx = j; break; }
        }
        var isLocked = correctIdx < mgState.nextCorrect;
        h += '<div class="bedtime-card' + (isLocked ? ' locked' : '') + '" data-step="' + i + '">';
        h += '<div class="bedtime-card-num">' + (isLocked ? (correctIdx + 1) : '?') + '</div>';
        h += '<div class="bedtime-card-icon">' + s.icon + '</div>';
        h += '<div class="bedtime-card-text">' + s.text + '</div>';
        h += '</div>';
    }
    h += '</div>';
    body.innerHTML = h;
}

// ===== HANDWASH GAME =====
var HANDWASH_STEPS = [
    {id:'wet', text:'Molhar as maos', tip:'Use agua limpa!', type:'tap', icon:'💧'},
    {id:'soap', text:'Passar sabonete', tip:'Sabonete mata os germes!', type:'tap', icon:'🧴'},
    {id:'palms', text:'Esfregar palma com palma', tip:'Movimentos circulares!', duration:5000, type:'hold-zone', zones:['Palma Esquerda','Palma Direita']},
    {id:'fingers', text:'Entre os dedos', tip:'Nao esqueca entre os dedos!', duration:5000, type:'hold-zone', zones:['Dedos Esquerda','Dedos Direita']},
    {id:'backs', text:'Costas das maos', tip:'Esfregue bem as costas!', duration:5000, type:'hold-zone', zones:['Costa Esquerda','Costa Direita']},
    {id:'thumbs', text:'Polegares', tip:'Gire os polegares!', type:'tap-multi', icon:'👍'},
    {id:'rinse', text:'Enxaguar com agua', tip:'Tire todo o sabonete!', type:'tap', icon:'💧'},
];

function startHandwashGame() {
    document.getElementById('mg-title').textContent = 'Lavar as Maos';
    mgState = {
        game: 'handwash',
        step: 0,
        zoneIndex: 0,
        zoneTimes: [0, 0],
        totalTime: 60,
        elapsed: 0,
        tapCount: 0,
        holding: false,
    };
    renderHandwashStep();
    startHandwashTimer();
}

function startHandwashTimer() {
    if (mgTimerInterval) clearInterval(mgTimerInterval);
    mgTimerInterval = setInterval(function () {
        if (!mgState) return;
        mgState.elapsed++;
        var remaining = mgState.totalTime - mgState.elapsed;
        if (remaining <= 0) {
            var stars = mgState.step >= 6 ? 2 : 1;
            finishMiniGame('handwash', stars);
            return;
        }
        document.getElementById('mg-timer').textContent = '0:' + (remaining < 10 ? '0' : '') + remaining;
        document.getElementById('mg-progress-fill').style.width = (mgState.step / HANDWASH_STEPS.length * 100) + '%';
    }, 1000);
}

function renderHandwashStep() {
    if (!mgState || mgState.step >= HANDWASH_STEPS.length) {
        var stars = mgState.step >= HANDWASH_STEPS.length ? 3 : (mgState.step >= 5 ? 2 : 1);
        finishMiniGame('handwash', stars);
        return;
    }
    var step = HANDWASH_STEPS[mgState.step];
    var body = document.getElementById('mg-body');
    document.getElementById('mg-step-text').textContent = 'Passo ' + (mgState.step + 1) + ' de ' + HANDWASH_STEPS.length;

    var h = '<div class="handwash-game">';
    h += '<div class="brush-steve"><img src="' + EMOJI + state.char + '.png">';
    h += '<div class="brush-bubble" id="brush-bubble">' + step.text + '</div></div>';

    if (step.type === 'tap') {
        h += '<div class="brush-tap-target" id="brush-tap">' + step.icon + '</div>';
    } else if (step.type === 'hold-zone') {
        mgState.zoneIndex = 0;
        mgState.zoneTimes = [0, 0];
        h += '<div class="hand-diagram" id="hand-diagram">';
        for (var z = 0; z < step.zones.length; z++) {
            h += '<div class="hand-zone' + (z === 0 ? ' active' : '') + '" data-zone="' + z + '">' + step.zones[z] + '<div class="quad-fill"></div></div>';
        }
        h += '</div>';
    } else if (step.type === 'tap-multi') {
        mgState.tapCount = 0;
        h += '<div class="brush-tap-target" id="brush-tap">' + step.icon + '</div>';
        h += '<div class="brush-tap-counter" id="brush-counter">0 / 8</div>';
    }

    h += '<div class="brush-instruction">' + step.text + '</div>';
    h += '<div class="brush-tip">' + step.tip + '</div>';
    h += '</div>';
    body.innerHTML = h;

    if (step.type === 'tap') {
        var btn = document.getElementById('brush-tap');
        if (btn) btn.addEventListener('click', function () {
            showBrushMsg();
            mgState.step++;
            setTimeout(renderHandwashStep, 600);
        });
    } else if (step.type === 'hold-zone') {
        setupHandwashHoldZones(step);
    } else if (step.type === 'tap-multi') {
        var btn2 = document.getElementById('brush-tap');
        if (btn2) btn2.addEventListener('click', function () {
            if (!mgState) return;
            mgState.tapCount++;
            var counter = document.getElementById('brush-counter');
            if (counter) counter.textContent = mgState.tapCount + ' / 8';
            if (mgState.tapCount >= 8) {
                showBrushMsg();
                mgState.step++;
                setTimeout(renderHandwashStep, 600);
            }
        });
    }
}

function setupHandwashHoldZones(step) {
    var zones = document.querySelectorAll('.hand-zone');
    var targetPerZone = step.duration || 5000;

    for (var i = 0; i < zones.length; i++) {
        (function (zone) {
            var onStart = function (e) {
                e.preventDefault();
                if (!mgState || mgState.holding) return;
                var zi = parseInt(zone.dataset.zone);
                if (zi !== mgState.zoneIndex) return;
                mgState.holding = true;
                if (mgHoldInterval) clearInterval(mgHoldInterval);
                mgHoldInterval = setInterval(function () {
                    if (!mgState || !mgState.holding) return;
                    mgState.zoneTimes[zi] += 100;
                    var pct = Math.min((mgState.zoneTimes[zi] / targetPerZone) * 100, 100);
                    var fill = zone.querySelector('.quad-fill');
                    if (fill) fill.style.height = pct + '%';
                    if (mgState.zoneTimes[zi] >= targetPerZone) {
                        mgState.holding = false;
                        clearInterval(mgHoldInterval);
                        mgHoldInterval = null;
                        zone.classList.remove('active');
                        zone.classList.add('clean');
                        showBrushMsg();
                        mgState.zoneIndex++;
                        if (mgState.zoneIndex >= zones.length) {
                            mgState.step++;
                            setTimeout(renderHandwashStep, 800);
                        } else {
                            var next = document.querySelector('.hand-zone[data-zone="' + mgState.zoneIndex + '"]');
                            if (next) next.classList.add('active');
                        }
                    }
                }, 100);
            };
            var onEnd = function () {
                if (!mgState) return;
                mgState.holding = false;
                if (mgHoldInterval) { clearInterval(mgHoldInterval); mgHoldInterval = null; }
            };
            zone.addEventListener('touchstart', onStart, {passive: false});
            zone.addEventListener('touchend', onEnd);
            zone.addEventListener('mousedown', onStart);
            zone.addEventListener('mouseup', onEnd);
            zone.addEventListener('mouseleave', onEnd);
        })(zones[i]);
    }
}

// ===== DRESSING GAME =====
var WEATHER_TYPES = [
    {type:'sunny', name:'Dia de Sol ☀️', items:['Camiseta', 'Shorts', 'Tenis', 'Bone', 'Oculos de sol']},
    {type:'rainy', name:'Dia de Chuva 🌧️', items:['Capa de chuva', 'Botas', 'Guarda-chuva', 'Calca', 'Blusa']},
    {type:'cold', name:'Dia Frio ❄️', items:['Casaco', 'Cachecol', 'Luvas', 'Gorro', 'Botas']},
];

var ALL_CLOTHES = [
    {name:'Camiseta', icon:'👕', weather:['sunny']},
    {name:'Shorts', icon:'🩳', weather:['sunny']},
    {name:'Tenis', icon:'👟', weather:['sunny', 'rainy']},
    {name:'Bone', icon:'🧢', weather:['sunny']},
    {name:'Oculos de sol', icon:'🕶️', weather:['sunny']},
    {name:'Capa de chuva', icon:'🧥', weather:['rainy']},
    {name:'Botas', icon:'👢', weather:['rainy', 'cold']},
    {name:'Guarda-chuva', icon:'☂️', weather:['rainy']},
    {name:'Calca', icon:'👖', weather:['rainy', 'cold']},
    {name:'Blusa', icon:'👔', weather:['rainy']},
    {name:'Casaco', icon:'🧥', weather:['cold']},
    {name:'Cachecol', icon:'🧣', weather:['cold']},
    {name:'Luvas', icon:'🧤', weather:['cold']},
    {name:'Gorro', icon:'🎩', weather:['cold']},
    {name:'Chinelo', icon:'🩴', weather:[]},
    {name:'Sunga', icon:'🩱', weather:[]},
];

function startDressingGame() {
    document.getElementById('mg-title').textContent = 'Vestir-se para o Dia';
    var weather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    // Pick 9 items: 4-5 correct + rest wrong, shuffled
    var correct = ALL_CLOTHES.filter(function (c) { return c.weather.indexOf(weather.type) >= 0; });
    var wrong = ALL_CLOTHES.filter(function (c) { return c.weather.indexOf(weather.type) < 0; });
    wrong.sort(function () { return Math.random() - 0.5; });
    var items = correct.concat(wrong.slice(0, 9 - correct.length));
    items.sort(function () { return Math.random() - 0.5; });

    mgState = {
        game: 'dressing',
        weather: weather,
        items: items,
        selected: [],
        correctItems: correct.map(function (c) { return c.name; }),
        totalTime: 45,
        elapsed: 0,
    };
    renderDressingGame();
    startDressingTimer();
}

function startDressingTimer() {
    if (mgTimerInterval) clearInterval(mgTimerInterval);
    mgTimerInterval = setInterval(function () {
        if (!mgState) return;
        mgState.elapsed++;
        var remaining = mgState.totalTime - mgState.elapsed;
        if (remaining <= 0) {
            finishDressing();
            return;
        }
        document.getElementById('mg-timer').textContent = '0:' + (remaining < 10 ? '0' : '') + remaining;
    }, 1000);
}

function renderDressingGame() {
    if (!mgState) return;
    var body = document.getElementById('mg-body');
    document.getElementById('mg-step-text').textContent = 'Escolha as roupas certas para o clima!';
    document.getElementById('mg-progress-fill').style.width = (mgState.selected.length / mgState.correctItems.length * 100) + '%';

    var h = '<div class="dressing-game">';
    h += '<div class="brush-steve"><img src="' + EMOJI + state.char + '.png">';
    h += '<div class="brush-bubble" id="brush-bubble">Vista o Steve!</div></div>';
    h += '<div class="dressing-weather">' + mgState.weather.name + '</div>';
    h += '<div class="dressing-items">';
    for (var i = 0; i < mgState.items.length; i++) {
        var item = mgState.items[i];
        var sel = mgState.selected.indexOf(item.name) >= 0;
        h += '<div class="dressing-item' + (sel ? ' selected' : '') + '" data-cloth="' + item.name + '">';
        h += '<div class="dressing-item-icon">' + item.icon + '</div>';
        h += '<div class="dressing-item-name">' + item.name + '</div>';
        h += '</div>';
    }
    h += '</div>';
    h += '<button class="mc-btn mc-btn-sm" id="dressing-confirm">Pronto!</button>';
    h += '</div>';
    body.innerHTML = h;
}

function finishDressing() {
    if (!mgState) return;
    var correctCount = 0;
    for (var i = 0; i < mgState.selected.length; i++) {
        if (mgState.correctItems.indexOf(mgState.selected[i]) >= 0) correctCount++;
    }
    var wrongCount = mgState.selected.length - correctCount;
    var pct = mgState.correctItems.length > 0 ? correctCount / mgState.correctItems.length : 0;
    var stars = (pct >= 0.8 && wrongCount === 0) ? 3 : (pct >= 0.6 ? 2 : 1);
    finishMiniGame('dressing', stars);
}

// ===== DEMONSTRACOES (COMO FAZER) =====
var DEMOS = {
    'Escovar os dentes': [
        {icon:'🪥', text:'Pegue a escova de dentes e coloque um pouquinho de pasta (tamanho de uma ervilha)'},
        {icon:'😁', text:'Escove os dentes da frente com movimentos circulares, no angulo de 45 graus'},
        {icon:'🦷', text:'Escove a parte de dentro dos dentes com movimentos de varredura'},
        {icon:'👅', text:'Escove a lingua suavemente para tirar as bacterias'},
        {icon:'💧', text:'Enxague a boca com agua e cuspa a pasta'},
    ],
    'Escovar os dentes (noite)': [
        {icon:'🌙', text:'Antes de dormir, e muito importante escovar os dentes!'},
        {icon:'🪥', text:'Coloque pasta na escova e escove todos os dentes'},
        {icon:'😁', text:'Movimentos circulares na frente, varredura por dentro'},
        {icon:'👅', text:'Nao esqueca de escovar a lingua!'},
        {icon:'💧', text:'Enxague e pronto! Seus dentes estao protegidos a noite toda!'},
    ],
    'Tomar cafe da manha': [
        {icon:'🪑', text:'Sente-se a mesa com calma, sem pressa'},
        {icon:'🥣', text:'Coma cereais, frutas ou pao com leite'},
        {icon:'🍎', text:'Sempre inclua uma fruta no cafe da manha!'},
        {icon:'🥛', text:'Beba leite ou suco natural para ficar forte'},
    ],
    'Arrumar a cama': [
        {icon:'🛏️', text:'Puxe o lencol e estique bem, sem rugas'},
        {icon:'🔲', text:'Alise o lencol com as maos para ficar bonito'},
        {icon:'🛌', text:'Coloque o travesseiro no lugar certo'},
        {icon:'✨', text:'Arrume a coberta por cima e pronto! Quarto organizado!'},
    ],
    'Trocar de roupa': [
        {icon:'👕', text:'Escolha roupas limpas e adequadas para o dia'},
        {icon:'☀️', text:'Se esta quente, use roupas leves. Se esta frio, agasalhe-se!'},
        {icon:'👟', text:'Coloque meias e calcados limpos'},
        {icon:'🪞', text:'Olhe no espelho e veja se esta tudo certo!'},
    ],
    'Almocar': [
        {icon:'🧼', text:'Lave as maos antes de comer!'},
        {icon:'🪑', text:'Sente-se a mesa com a familia'},
        {icon:'🥗', text:'Coma salada, legumes, arroz e feijao'},
        {icon:'🍽️', text:'Mastigue devagar e aproveite a refeicao'},
    ],
    'Fazer licao de casa': [
        {icon:'📚', text:'Separe o material escolar e os cadernos'},
        {icon:'🪑', text:'Sente-se com a postura reta em um lugar tranquilo'},
        {icon:'✏️', text:'Faca as tarefas com atencao e capricho'},
        {icon:'📦', text:'Quando terminar, guarde tudo no lugar certo'},
    ],
    'Brincar / Jogar': [
        {icon:'⏰', text:'Combine o tempo de brincadeira com seus pais'},
        {icon:'🎮', text:'Jogue ou brinque, se divertindo com respeito'},
        {icon:'🧸', text:'Quando acabar, guarde todos os brinquedos'},
        {icon:'🧼', text:'Lave as maos depois de brincar!'},
    ],
    'Tomar banho': [
        {icon:'🚿', text:'Ligue o chuveiro e molhe todo o corpo'},
        {icon:'🧴', text:'Passe sabonete e esfregue bem: bracos, pernas, barriga, costas'},
        {icon:'💆', text:'Lave o cabelo com shampoo, massageando o couro cabeludo'},
        {icon:'🧻', text:'Enxague tudo, feche o chuveiro e seque-se com a toalha'},
    ],
    'Jantar': [
        {icon:'🧼', text:'Lave as maos antes do jantar'},
        {icon:'👨‍👩‍👧', text:'Sente-se com a familia e converse sobre o dia'},
        {icon:'🍽️', text:'Coma de tudo um pouquinho, alimentos variados'},
        {icon:'🙏', text:'Agradeca pela refeicao e ajude a tirar a mesa'},
    ],
    'Ler um livro': [
        {icon:'📚', text:'Escolha um livro que voce goste'},
        {icon:'🛋️', text:'Sente-se confortavel em um lugar tranquilo'},
        {icon:'👀', text:'Leia com atencao, uma pagina de cada vez'},
        {icon:'💭', text:'Imagine a historia na sua cabeca, como um filme!'},
    ],
    'Dormir cedo': [
        {icon:'📱', text:'Desligue telas (celular, TV, tablet) 30 minutos antes'},
        {icon:'🛏️', text:'Deite-se na cama e fique confortavel'},
        {icon:'🌬️', text:'Respire fundo: inspire pelo nariz, solte pela boca'},
        {icon:'🌙', text:'Feche os olhos e tenha bons sonhos!'},
    ],
};

var demoState = null;

function openDemo(questTitle) {
    var steps = DEMOS[questTitle];
    if (!steps) {
        toast('Demonstracao nao disponivel');
        return;
    }
    demoState = {title: questTitle, steps: steps, current: 0};
    document.getElementById('demo-title').textContent = questTitle;
    renderDemoStep();
    openModal('modal-demo');
}

function renderDemoStep() {
    if (!demoState) return;
    var step = demoState.steps[demoState.current];
    var body = document.getElementById('demo-body');

    var h = '';
    h += '<img class="demo-char" src="' + EMOJI + state.char + '.png">';
    h += '<div class="demo-step-icon">' + step.icon + '</div>';
    h += '<div class="demo-step-text">' + step.text + '</div>';
    body.innerHTML = h;

    document.getElementById('demo-step-num').textContent = (demoState.current + 1) + '/' + demoState.steps.length;
    document.getElementById('demo-prev').disabled = demoState.current === 0;

    var nextBtn = document.getElementById('demo-next');
    if (demoState.current >= demoState.steps.length - 1) {
        nextBtn.textContent = 'Concluir';
    } else {
        nextBtn.textContent = 'Proximo';
    }
}

function closeDemo() {
    if (demoState) {
        // Give bonus XP for first time viewing
        var key = demoState.title;
        if (state.mg_demos_seen.indexOf(key) === -1) {
            state.mg_demos_seen.push(key);
            state.xp += 5;
            state.coins += 2;
            // Level up check
            while (state.xp >= state.xpNext) {
                state.xp -= state.xpNext;
                state.lv++;
                state.xpNext = Math.floor(100 * Math.pow(1.2, state.lv - 1));
                if (state.maxHp < 10) { state.maxHp++; state.hp = state.maxHp; }
            }
            save();
            toast('+5 XP por aprender ' + key + '!');
            if (typeof updateAll === 'function') updateAll();
        }
    }
    demoState = null;
    closeModals();
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function () {
    // Global delegated click handler for mini-game elements
    document.addEventListener('click', function (e) {
        // Map node click
        var node = e.target.closest('.map-node');
        if (node && node.dataset.area) {
            openMiniGame(node.dataset.area);
            return;
        }

        // Mini-game result OK
        if (e.target.id === 'mg-result-ok') {
            closeMiniGame();
            return;
        }

        // Mini-game back button
        if (e.target.id === 'mg-back') {
            closeMiniGame();
            return;
        }

        // Eating game chest click
        var chest = e.target.closest('.eating-chest');
        if (chest && chest.dataset.choice && mgState && mgState.game === 'eating') {
            var food = mgState.foods[mgState.current];
            var chose = chest.dataset.choice;
            var isCorrect = (chose === 'healthy' && food.healthy) || (chose === 'unhealthy' && !food.healthy);
            var fb = document.getElementById('eating-feedback');
            if (isCorrect) {
                mgState.correct++;
                if (fb) { fb.textContent = 'Certo! ' + food.why; fb.className = 'eating-feedback correct'; }
                var bubble = document.getElementById('brush-bubble');
                if (bubble) bubble.textContent = 'Muito bem!';
            } else {
                if (fb) { fb.textContent = 'Errado! ' + food.why; fb.className = 'eating-feedback wrong'; }
                var bubble2 = document.getElementById('brush-bubble');
                if (bubble2) bubble2.textContent = 'Hmm, tente de novo!';
            }
            mgState.current++;
            setTimeout(renderEatingStep, 1200);
            return;
        }

        // Bedtime card click
        var bedCard = e.target.closest('.bedtime-card');
        if (bedCard && bedCard.dataset.step && mgState && mgState.game === 'bedtime') {
            var stepIdx = parseInt(bedCard.dataset.step);
            var clickedStep = mgState.steps[stepIdx];
            var expected = mgState.correctOrder[mgState.nextCorrect];
            if (bedCard.classList.contains('locked')) return;

            if (clickedStep.text === expected.text) {
                mgState.nextCorrect++;
                var bubble3 = document.getElementById('brush-bubble');
                if (bubble3) bubble3.textContent = 'Isso mesmo! ' + clickedStep.text + '!';
                if (mgState.nextCorrect >= BEDTIME_STEPS.length) {
                    var stars = mgState.errors === 0 ? 3 : (mgState.errors <= 2 ? 2 : 1);
                    setTimeout(function () { finishMiniGame('bedtime', stars); }, 800);
                } else {
                    renderBedtimeGame();
                }
            } else {
                mgState.errors++;
                bedCard.classList.add('wrong');
                var bubble4 = document.getElementById('brush-bubble');
                if (bubble4) bubble4.textContent = 'Hmm, tente outra!';
                setTimeout(function () { bedCard.classList.remove('wrong'); }, 500);
            }
            return;
        }

        // Dressing item click
        var clothItem = e.target.closest('.dressing-item');
        if (clothItem && clothItem.dataset.cloth && mgState && mgState.game === 'dressing') {
            var clothName = clothItem.dataset.cloth;
            var idx = mgState.selected.indexOf(clothName);
            if (idx >= 0) {
                mgState.selected.splice(idx, 1);
            } else {
                mgState.selected.push(clothName);
            }
            renderDressingGame();
            return;
        }

        // Dressing confirm
        if (e.target.id === 'dressing-confirm' && mgState && mgState.game === 'dressing') {
            finishDressing();
            return;
        }

        // Demo navigation
        if (e.target.id === 'demo-prev' && demoState) {
            if (demoState.current > 0) {
                demoState.current--;
                renderDemoStep();
            }
            return;
        }
        if (e.target.id === 'demo-next' && demoState) {
            if (demoState.current < demoState.steps.length - 1) {
                demoState.current++;
                renderDemoStep();
            } else {
                closeDemo();
            }
            return;
        }
        if (e.target.id === 'demo-close') {
            closeDemo();
            return;
        }
    });
});
