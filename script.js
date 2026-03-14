// ROTINACRAFT - Jogo RPG de Rotina para Criancas
// Tudo funciona abrindo direto no navegador (sem servidor)

const EMOJI_PATH = 'minecraft-emoji-e3560/assets/minecraft/textures/font/custom/';

// Personagens disponiveis
const CHARACTERS = [
    { id: 'stive70', name: 'Steve' },
    { id: 'alex70', name: 'Alex' },
    { id: 'stive1', name: 'Steve 2' },
    { id: 'alex1', name: 'Alex 2' },
    { id: 'stive30', name: 'Guerreiro' },
    { id: 'alex30', name: 'Guerreira' },
    { id: 'stive50', name: 'Explorador' },
    { id: 'alex50', name: 'Exploradora' },
    { id: 'villager1', name: 'Aldeao' },
    { id: 'villager5', name: 'Fazendeiro' },
    { id: 'axolotl1', name: 'Axolote' },
    { id: 'allay1', name: 'Allay' },
];

// Tarefas padrao de rotina
const DEFAULT_QUESTS = [
    { title: 'Escovar os dentes', icon: '🦷', period: 'morning', xp: 10 },
    { title: 'Tomar cafe da manha', icon: '🥣', period: 'morning', xp: 10 },
    { title: 'Arrumar a cama', icon: '🛏️', period: 'morning', xp: 15 },
    { title: 'Trocar de roupa', icon: '👕', period: 'morning', xp: 10 },
    { title: 'Almocar', icon: '🍽️', period: 'afternoon', xp: 10 },
    { title: 'Fazer licao de casa', icon: '📚', period: 'afternoon', xp: 30 },
    { title: 'Brincar / Jogar', icon: '🎮', period: 'afternoon', xp: 10 },
    { title: 'Tomar banho', icon: '🚿', period: 'night', xp: 15 },
    { title: 'Jantar', icon: '🍕', period: 'night', xp: 10 },
    { title: 'Escovar os dentes (noite)', icon: '🦷', period: 'night', xp: 10 },
    { title: 'Ler um livro', icon: '📖', period: 'night', xp: 20 },
    { title: 'Dormir cedo', icon: '😴', period: 'night', xp: 15 },
];

// Icones para escolher ao criar missao
const QUEST_ICONS = ['🦷','🥣','🛏️','👕','🍽️','📚','🎮','🚿','🍕','📖','😴','🧹','🐕','💪','🎨','🎵','🏃','💧','🍎','✏️','🧸','👟','🪥','🧴'];

// Conquistas
const ACHIEVEMENTS = [
    { id: 'first_quest', name: 'Primeira Missao', desc: 'Complete sua primeira missao', icon: '⭐', check: (s) => s.totalCompleted >= 1 },
    { id: 'five_quests', name: 'Aventureiro', desc: 'Complete 5 missoes', icon: '🗡️', check: (s) => s.totalCompleted >= 5 },
    { id: 'ten_quests', name: 'Heroi', desc: 'Complete 10 missoes', icon: '🛡️', check: (s) => s.totalCompleted >= 10 },
    { id: 'twenty_quests', name: 'Lenda', desc: 'Complete 20 missoes', icon: '👑', check: (s) => s.totalCompleted >= 20 },
    { id: 'fifty_quests', name: 'Mestre da Rotina', desc: 'Complete 50 missoes', icon: '🏆', check: (s) => s.totalCompleted >= 50 },
    { id: 'level5', name: 'Nivel 5', desc: 'Chegue ao nivel 5', icon: '💎', check: (s) => s.level >= 5 },
    { id: 'level10', name: 'Nivel 10', desc: 'Chegue ao nivel 10', icon: '🌟', check: (s) => s.level >= 10 },
    { id: 'morning_master', name: 'Madrugador', desc: 'Complete todas as missoes da manha', icon: '🌅', check: (s) => s.morningStreak >= 3 },
    { id: 'night_master', name: 'Coruja Sabida', desc: 'Complete todas as missoes da noite', icon: '🌙', check: (s) => s.nightStreak >= 3 },
    { id: 'coins100', name: 'Poupador', desc: 'Junte 100 esmeraldas', icon: '💰', check: (s) => s.coins >= 100 },
    { id: 'all_day', name: 'Dia Perfeito', desc: 'Complete todas as missoes de um dia', icon: '🎯', check: (s) => s.perfectDay },
    { id: 'week_streak', name: 'Semana Incrivel', desc: 'Jogue 7 dias seguidos', icon: '🔥', check: (s) => s.dayStreak >= 7 },
];

// Itens da loja
const SHOP_ITEMS = [
    { id: 'sword_diamond', name: 'Espada de Diamante', desc: 'Item decorativo epico!', price: 50, img: 'sword_diamond' },
    { id: 'pickaxe_iron', name: 'Picareta de Ferro', desc: 'Ferramenta poderosa!', price: 30, img: 'pickaxe_iron' },
    { id: 'golden_apple', name: 'Maca Dourada', desc: 'Restaura coracao!', price: 20, img: 'gold_apple' },
    { id: 'diamond', name: 'Diamante', desc: 'Precioso e raro!', price: 40, img: 'diamond' },
    { id: 'bow', name: 'Arco', desc: 'Para atirar longe!', price: 25, img: 'bow' },
    { id: 'cat', name: 'Gato', desc: 'Um amigo peludo!', price: 60, img: 'cat' },
    { id: 'parrot', name: 'Papagaio', desc: 'Companheiro colorido!', price: 45, img: 'parrot' },
    { id: 'horse', name: 'Cavalo', desc: 'Montaria rapida!', price: 80, img: 'horse' },
];

// Mensagens motivacionais
const MESSAGES = {
    morning: [
        'Bom dia! Hora de comecar o dia!',
        'Vamos la, heroi! Missoes te esperam!',
        'Um novo dia, novas aventuras!',
        'Acorda, guerreiro! O mundo precisa de voce!',
    ],
    afternoon: [
        'Boa tarde! Continue firme!',
        'Metade do dia ja foi! Muito bem!',
        'Hora de mais missoes!',
        'Voce esta indo muito bem!',
    ],
    night: [
        'Boa noite! Finalize suas missoes!',
        'Quase na hora de descansar...',
        'Complete as missoes da noite!',
        'Um dia bem vivido! Parabens!',
    ],
    complete: [
        'Incrivel! Missao completa!',
        'Voce e demais!',
        'Heroi de verdade!',
        'Fantastico! Continue assim!',
        'Uau! Muito bem!',
    ],
};

class RotinaCraft {
    constructor() {
        this.state = this.loadState();
        this.selectedCharacter = this.state.character || 'stive70';
        this.selectedIcon = '⭐';
        this.currentFilter = 'all';
        this.init();
    }

    getDefaultState() {
        return {
            character: 'stive70',
            playerName: 'Jogador',
            level: 1,
            xp: 0,
            xpToNext: 100,
            coins: 0,
            hearts: 5,
            maxHearts: 5,
            totalCompleted: 0,
            morningStreak: 0,
            nightStreak: 0,
            perfectDay: false,
            dayStreak: 0,
            lastPlayDate: null,
            quests: [],
            inventory: [],
            unlockedAchievements: [],
            questsInitialized: false,
        };
    }

    loadState() {
        try {
            const saved = localStorage.getItem('rotinacraft_save');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new fields
                return { ...this.getDefaultState(), ...parsed };
            }
        } catch (e) {
            console.error('Erro ao carregar save:', e);
        }
        return this.getDefaultState();
    }

    saveState() {
        try {
            localStorage.setItem('rotinacraft_save', JSON.stringify(this.state));
        } catch (e) {
            console.error('Erro ao salvar:', e);
        }
    }

    init() {
        this.renderCharacterSelect();
        this.renderIconPicker();

        // Se ja tem um jogo salvo, vai direto pro jogo
        if (this.state.questsInitialized && this.state.playerName !== 'Jogador') {
            this.checkDayReset();
            this.showScreen('screen-game');
            this.updateGameUI();
        }
    }

    // ===== TELAS =====
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('active');

        if (screenId === 'screen-game') {
            this.updateGameUI();
        }
    }

    // ===== SELECAO DE PERSONAGEM =====
    renderCharacterSelect() {
        const grid = document.getElementById('character-grid');
        if (!grid) return;

        grid.innerHTML = CHARACTERS.map(c => `
            <div class="char-option ${c.id === this.selectedCharacter ? 'selected' : ''}"
                 onclick="game.selectCharacter('${c.id}')">
                <img src="${EMOJI_PATH}${c.id}.png" alt="${c.name}"
                     onerror="this.style.display='none'">
                <span>${c.name}</span>
            </div>
        `).join('');
    }

    selectCharacter(id) {
        this.selectedCharacter = id;
        this.renderCharacterSelect();
    }

    // ===== INICIAR JOGO =====
    startGame() {
        const nameInput = document.getElementById('player-name');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name) {
            this.showToast('Digite seu nome!');
            return;
        }

        this.state.playerName = name;
        this.state.character = this.selectedCharacter;

        // Inicializar missoes padrao se nao tem nenhuma
        if (!this.state.questsInitialized) {
            this.state.quests = DEFAULT_QUESTS.map((q, i) => ({
                id: Date.now() + i,
                title: q.title,
                icon: q.icon,
                period: q.period,
                xp: q.xp,
                completed: false,
                custom: false,
            }));
            this.state.questsInitialized = true;
        }

        this.state.lastPlayDate = this.getTodayStr();
        this.saveState();
        this.showScreen('screen-game');
        this.updateGameUI();
        this.showToast('Bem-vindo, ' + name + '!');
    }

    // ===== LOGICA DO JOGO =====
    getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    checkDayReset() {
        const today = this.getTodayStr();
        if (this.state.lastPlayDate !== today) {
            // Novo dia: resetar missoes, verificar streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.state.lastPlayDate === yesterdayStr) {
                this.state.dayStreak += 1;
            } else {
                this.state.dayStreak = 1;
            }

            // Resetar status das quests
            this.state.quests.forEach(q => { q.completed = false; });
            this.state.morningStreak = 0;
            this.state.nightStreak = 0;
            this.state.perfectDay = false;
            this.state.lastPlayDate = today;

            // Restaurar coracoes
            this.state.hearts = this.state.maxHearts;

            this.saveState();
            this.showToast('Novo dia! Missoes resetadas!');
        }
    }

    completeQuest(questId) {
        const quest = this.state.quests.find(q => q.id === questId);
        if (!quest || quest.completed) return;

        quest.completed = true;
        this.state.totalCompleted += 1;

        // XP
        const xpGained = quest.xp;
        this.state.xp += xpGained;
        this.state.coins += Math.floor(xpGained / 2);

        // Check level up
        let leveledUp = false;
        while (this.state.xp >= this.state.xpToNext) {
            this.state.xp -= this.state.xpToNext;
            this.state.level += 1;
            this.state.xpToNext = Math.floor(100 * Math.pow(1.2, this.state.level - 1));
            if (this.state.maxHearts < 10) {
                this.state.maxHearts += 1;
                this.state.hearts = this.state.maxHearts;
            }
            leveledUp = true;
        }

        // Check streaks
        const morningQuests = this.state.quests.filter(q => q.period === 'morning');
        const nightQuests = this.state.quests.filter(q => q.period === 'night');
        this.state.morningStreak = morningQuests.filter(q => q.completed).length;
        this.state.nightStreak = nightQuests.filter(q => q.completed).length;

        // Check dia perfeito
        const allCompleted = this.state.quests.every(q => q.completed);
        if (allCompleted) {
            this.state.perfectDay = true;
        }

        // Check conquistas
        this.checkAchievements();

        this.saveState();

        // Mostrar recompensa
        this.showRewardModal(quest, xpGained);

        if (leveledUp) {
            setTimeout(() => this.showLevelUpModal(), 1500);
        }

        this.updateGameUI();
    }

    deleteQuest(questId) {
        this.state.quests = this.state.quests.filter(q => q.id !== questId);
        this.saveState();
        this.renderQuests();
    }

    addCustomTask(e) {
        e.preventDefault();
        const titleInput = document.getElementById('new-task-title');
        const periodInput = document.getElementById('new-task-period');
        const xpInput = document.getElementById('new-task-xp');

        const title = titleInput.value.trim();
        if (!title) return;

        const quest = {
            id: Date.now(),
            title: title,
            icon: this.selectedIcon,
            period: periodInput.value,
            xp: parseInt(xpInput.value),
            completed: false,
            custom: true,
        };

        this.state.quests.push(quest);
        this.saveState();

        titleInput.value = '';
        this.closeModal();
        this.renderQuests();
        this.showToast('Missao criada!');
    }

    buyItem(itemId) {
        const shopItem = SHOP_ITEMS.find(i => i.id === itemId);
        if (!shopItem) return;

        if (this.state.coins < shopItem.price) {
            this.showToast('Esmeraldas insuficientes!');
            return;
        }

        // Check se ja tem
        const existing = this.state.inventory.find(i => i.id === itemId);
        if (existing) {
            existing.count += 1;
        } else {
            this.state.inventory.push({ id: itemId, count: 1 });
        }

        this.state.coins -= shopItem.price;
        this.saveState();
        this.updateGameUI();
        this.showToast('Comprou ' + shopItem.name + '!');
    }

    checkAchievements() {
        ACHIEVEMENTS.forEach(a => {
            if (!this.state.unlockedAchievements.includes(a.id) && a.check(this.state)) {
                this.state.unlockedAchievements.push(a.id);
                this.showToast('Conquista: ' + a.name + '!');
            }
        });
    }

    // ===== UI DO JOGO =====
    updateGameUI() {
        this.updateHUD();
        this.updateWorld();
        this.renderQuests();
        this.renderInventory();
        this.renderAchievements();
        this.renderShop();
        this.renderConfig();
    }

    updateHUD() {
        // Avatar
        const hudAvatar = document.getElementById('hud-avatar');
        if (hudAvatar) {
            hudAvatar.innerHTML = `<img src="${EMOJI_PATH}${this.state.character}.png" alt="avatar">`;
        }

        // Nome e nivel
        const hudName = document.getElementById('hud-name');
        const hudLevel = document.getElementById('hud-level');
        if (hudName) hudName.textContent = this.state.playerName;
        if (hudLevel) hudLevel.textContent = 'Nivel ' + this.state.level;

        // XP bar
        const xpFill = document.getElementById('hud-xp-fill');
        const xpText = document.getElementById('hud-xp-text');
        const xpPercent = Math.min((this.state.xp / this.state.xpToNext) * 100, 100);
        if (xpFill) xpFill.style.width = xpPercent + '%';
        if (xpText) xpText.textContent = this.state.xp + ' / ' + this.state.xpToNext + ' XP';

        // Moedas
        const hudCoins = document.getElementById('hud-coins');
        if (hudCoins) hudCoins.textContent = this.state.coins;

        // Coracoes
        const hudHearts = document.getElementById('hud-hearts');
        if (hudHearts) {
            let heartsHTML = '';
            for (let i = 0; i < this.state.maxHearts && i < 10; i++) {
                heartsHTML += `<div class="heart ${i >= this.state.hearts ? 'empty' : ''}"></div>`;
            }
            hudHearts.innerHTML = heartsHTML;
        }
    }

    updateWorld() {
        // Personagem
        const worldChar = document.getElementById('world-character');
        if (worldChar) {
            worldChar.innerHTML = `<img src="${EMOJI_PATH}${this.state.character}.png" alt="personagem">`;
        }

        // Casa (progresso visual)
        const worldHouse = document.getElementById('world-house');
        if (worldHouse) {
            const completedToday = this.state.quests.filter(q => q.completed).length;
            const total = this.state.quests.length;
            const progress = total > 0 ? completedToday / total : 0;

            // Casa fica mais elaborada com progresso
            let houseHTML = '<div style="text-align:center">';
            if (progress >= 1) {
                houseHTML += '<div style="font-size:40px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5))">🏰</div>';
                houseHTML += '<div style="font-size:6px;color:#FFD700;margin-top:4px">Castelo!</div>';
            } else if (progress >= 0.5) {
                houseHTML += '<div style="font-size:36px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5))">🏠</div>';
                houseHTML += '<div style="font-size:6px;color:#aaa;margin-top:4px">' + Math.round(progress*100) + '%</div>';
            } else {
                houseHTML += '<div style="font-size:32px;filter:drop-shadow(2px 2px 2px rgba(0,0,0,0.5))">🏚️</div>';
                houseHTML += '<div style="font-size:6px;color:#888;margin-top:4px">' + Math.round(progress*100) + '%</div>';
            }
            houseHTML += '</div>';
            worldHouse.innerHTML = houseHTML;
        }

        // Mensagem do dia
        const msgText = document.getElementById('message-text');
        if (msgText) {
            const hour = new Date().getHours();
            let period = 'morning';
            if (hour >= 12 && hour < 18) period = 'afternoon';
            else if (hour >= 18 || hour < 6) period = 'night';

            const msgs = MESSAGES[period];
            msgText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        }

        // Ceu (dia/noite)
        const sky = document.querySelector('.world-sky');
        if (sky) {
            const hour = new Date().getHours();
            if (hour >= 19 || hour < 6) {
                sky.classList.add('night');
            } else {
                sky.classList.remove('night');
            }
        }
    }

    renderQuests() {
        const container = document.getElementById('quests-list');
        if (!container) return;

        let quests = this.state.quests;
        if (this.currentFilter !== 'all') {
            quests = quests.filter(q => q.period === this.currentFilter);
        }

        // Ordenar: pendentes primeiro
        quests = [...quests].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });

        if (quests.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888;font-size:8px;padding:20px">Nenhuma missao nesta categoria</p>';
            return;
        }

        container.innerHTML = quests.map(q => `
            <div class="quest-card ${q.period} ${q.completed ? 'completed' : ''}">
                <div class="quest-icon">${q.icon}</div>
                <div class="quest-info">
                    <div class="quest-title">${q.title}</div>
                    <div class="quest-xp">+${q.xp} XP | +${Math.floor(q.xp/2)} Esmeraldas</div>
                    <div class="quest-period">${this.getPeriodLabel(q.period)}</div>
                </div>
                <div class="quest-actions">
                    ${!q.completed ? `
                        <button class="quest-btn complete" onclick="game.completeQuest(${q.id})" title="Completar">✓</button>
                    ` : ''}
                    ${q.custom ? `
                        <button class="quest-btn delete" onclick="game.deleteQuest(${q.id})" title="Remover">✕</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getPeriodLabel(period) {
        const labels = { morning: 'Manha', afternoon: 'Tarde', night: 'Noite' };
        return labels[period] || period;
    }

    filterQuests(cat) {
        this.currentFilter = cat;
        document.querySelectorAll('.cat-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cat === cat);
        });
        this.renderQuests();
    }

    renderInventory() {
        const container = document.getElementById('inventory-grid');
        if (!container) return;

        if (this.state.inventory.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888;font-size:8px;padding:20px;grid-column:1/-1">Inventario vazio. Compre itens na loja!</p>';
            return;
        }

        let html = '';
        this.state.inventory.forEach(inv => {
            const item = SHOP_ITEMS.find(s => s.id === inv.id);
            if (item) {
                html += `
                    <div class="inv-slot" title="${item.name}">
                        <img src="${EMOJI_PATH}${item.img}.png" alt="${item.name}">
                        ${inv.count > 1 ? `<span class="inv-count">${inv.count}</span>` : ''}
                    </div>
                `;
            }
        });

        // Preencher slots vazios
        const emptySlots = Math.max(0, 9 - this.state.inventory.length);
        for (let i = 0; i < emptySlots; i++) {
            html += '<div class="inv-slot empty"></div>';
        }

        container.innerHTML = html;
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        container.innerHTML = ACHIEVEMENTS.map(a => {
            const unlocked = this.state.unlockedAchievements.includes(a.id);
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${a.name}</div>
                        <div class="achievement-desc">${unlocked ? a.desc : '???'}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderShop() {
        const container = document.getElementById('shop-list');
        if (!container) return;

        container.innerHTML = SHOP_ITEMS.map(item => {
            const canBuy = this.state.coins >= item.price;
            const owned = this.state.inventory.find(i => i.id === item.id);
            return `
                <div class="shop-item">
                    <div class="shop-icon">
                        <img src="${EMOJI_PATH}${item.img}.png" alt="${item.name}">
                    </div>
                    <div class="shop-info">
                        <div class="shop-name">${item.name} ${owned ? '(x' + owned.count + ')' : ''}</div>
                        <div class="shop-desc">${item.desc}</div>
                        <div class="shop-price">${item.price} Esmeraldas</div>
                    </div>
                    <button class="mc-btn mc-btn-small ${canBuy ? 'mc-btn-primary' : ''}"
                            onclick="game.buyItem('${item.id}')"
                            ${!canBuy ? 'disabled style="opacity:0.5"' : ''}>
                        Comprar
                    </button>
                </div>
            `;
        }).join('');
    }

    renderConfig() {
        const container = document.getElementById('config-content');
        if (!container) return;

        container.innerHTML = `
            <div class="config-section">
                <h4>Jogador</h4>
                <p>Nome: ${this.state.playerName}</p>
                <p>Nivel: ${this.state.level}</p>
                <p>XP Total: ${this.state.xp} / ${this.state.xpToNext}</p>
                <p>Esmeraldas: ${this.state.coins}</p>
                <p>Missoes Completas: ${this.state.totalCompleted}</p>
                <p>Dias Seguidos: ${this.state.dayStreak}</p>
                <p>Conquistas: ${this.state.unlockedAchievements.length} / ${ACHIEVEMENTS.length}</p>
            </div>
            <div class="config-section">
                <h4>Dados</h4>
                <div class="config-buttons">
                    <button class="mc-btn mc-btn-small" onclick="game.exportData()">Exportar Dados</button>
                    <button class="mc-btn mc-btn-small" onclick="game.importData()">Importar Dados</button>
                    <button class="mc-btn mc-btn-small mc-btn-danger" onclick="game.resetData()">Resetar Tudo</button>
                </div>
            </div>
            <div class="config-section">
                <h4>Missoes de Hoje</h4>
                <div class="config-buttons">
                    <button class="mc-btn mc-btn-small" onclick="game.resetDayQuests()">Resetar Missoes do Dia</button>
                </div>
            </div>
            <div class="config-section">
                <h4>Trocar Personagem</h4>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
                    ${CHARACTERS.map(c => `
                        <div class="char-option ${c.id === this.state.character ? 'selected' : ''}"
                             onclick="game.changeCharacter('${c.id}')" style="padding:6px">
                            <img src="${EMOJI_PATH}${c.id}.png" alt="${c.name}" style="width:32px;height:32px">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ===== TABS =====
    switchTab(tab) {
        document.querySelectorAll('.hotbar-slot').forEach(s => {
            s.classList.toggle('active', s.dataset.tab === tab);
        });
        document.querySelectorAll('.game-panel').forEach(p => {
            p.classList.remove('active');
        });
        const panel = document.getElementById('panel-' + tab);
        if (panel) panel.classList.add('active');
    }

    // ===== MODAIS =====
    showAddTask() {
        document.getElementById('modal-add-task').classList.add('active');
    }

    showRewardModal(quest, xp) {
        const modal = document.getElementById('modal-complete');
        const details = document.getElementById('reward-details');
        if (details) {
            const msg = MESSAGES.complete[Math.floor(Math.random() * MESSAGES.complete.length)];
            details.innerHTML = `
                <p>${msg}</p>
                <p style="margin-top:10px">+${xp} XP</p>
                <p>+${Math.floor(xp/2)} Esmeraldas</p>
            `;
        }
        modal.classList.add('active');
    }

    showLevelUpModal() {
        const modal = document.getElementById('modal-levelup');
        const text = document.getElementById('levelup-text');
        const reward = document.getElementById('levelup-reward');
        if (text) text.textContent = 'NIVEL ' + this.state.level + '!';
        if (reward) reward.textContent = '+1 Coracao Maximo!';
        modal.classList.add('active');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }

    // ===== ICON PICKER =====
    renderIconPicker() {
        const picker = document.getElementById('icon-picker');
        if (!picker) return;

        picker.innerHTML = QUEST_ICONS.map(icon => `
            <div class="icon-option ${icon === this.selectedIcon ? 'selected' : ''}"
                 onclick="game.selectIcon('${icon}')">
                ${icon}
            </div>
        `).join('');
    }

    selectIcon(icon) {
        this.selectedIcon = icon;
        this.renderIconPicker();
    }

    // ===== UTILIDADES =====
    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    changeCharacter(id) {
        this.state.character = id;
        this.saveState();
        this.updateGameUI();
        this.showToast('Personagem trocado!');
    }

    resetDayQuests() {
        this.state.quests.forEach(q => { q.completed = false; });
        this.saveState();
        this.updateGameUI();
        this.showToast('Missoes resetadas!');
    }

    exportData() {
        const data = JSON.stringify(this.state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rotinacraft_save_' + this.getTodayStr() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Dados exportados!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    this.state = { ...this.getDefaultState(), ...data };
                    this.saveState();
                    this.updateGameUI();
                    this.showToast('Dados importados!');
                } catch (err) {
                    this.showToast('Arquivo invalido!');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    resetData() {
        if (confirm('Resetar todos os dados? Isso nao pode ser desfeito!')) {
            localStorage.removeItem('rotinacraft_save');
            this.state = this.getDefaultState();
            this.showScreen('screen-title');
            this.showToast('Dados resetados!');
        }
    }
}

// Inicializar o jogo
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new RotinaCraft();
});
