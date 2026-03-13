// Sistema ROTINACRAFT - Versão Simples e Funcional
class MinecraftRoutineSystem {
    constructor() {
        this.participants = [];
        this.tasks = [];
        this.worldLevel = 1;
        this.worldExperience = 0;
        this.init();
    }

    init() {
        console.log('🧱 ROTINACRAFT - Iniciando sistema...');
        this.loadData();
        this.setupEventListeners();
        this.setupTabNavigation();
        this.renderAll();
        console.log('🧱 ROTINACRAFT - Sistema iniciado com sucesso!');
    }

    loadData() {
        try {
            this.participants = JSON.parse(localStorage.getItem('rotinacraft_participants')) || [];
            this.tasks = JSON.parse(localStorage.getItem('rotinacraft_tasks')) || [];
            this.worldLevel = parseInt(localStorage.getItem('rotinacraft_worldLevel')) || 1;
            this.worldExperience = parseInt(localStorage.getItem('rotinacraft_worldExperience')) || 0;
            console.log('📊 Dados carregados:', { participants: this.participants.length, tasks: this.tasks.length });
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('rotinacraft_participants', JSON.stringify(this.participants));
            localStorage.setItem('rotinacraft_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('rotinacraft_worldLevel', JSON.stringify(this.worldLevel));
            localStorage.setItem('rotinacraft_worldExperience', JSON.stringify(this.worldExperience));
            console.log('💾 Dados salvos com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }

    setupEventListeners() {
        console.log('🔗 Configurando event listeners...');
        
        // Formulário de participante
        const addParticipantForm = document.getElementById('add-participant-form');
        if (addParticipantForm) {
            addParticipantForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addParticipant();
            });
            console.log('✅ Formulário de participante configurado');
        } else {
            console.error('❌ Formulário de participante não encontrado');
        }

        // Formulário de tarefa
        const addTaskForm = document.getElementById('add-task-form');
        if (addTaskForm) {
            addTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
            console.log('✅ Formulário de tarefa configurado');
        } else {
            console.error('❌ Formulário de tarefa não encontrado');
        }

        // Event delegation para botões
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-participant')) {
                const index = parseInt(e.target.dataset.index);
                this.deleteParticipant(index);
            }
            if (e.target.classList.contains('delete-task')) {
                const index = parseInt(e.target.dataset.index);
                this.deleteTask(index);
            }
            if (e.target.classList.contains('complete-task')) {
                const index = parseInt(e.target.dataset.index);
                this.completeTask(index);
            }
        });

        console.log('✅ Event listeners configurados');
    }

    setupTabNavigation() {
        console.log('📑 Configurando navegação por tabs...');
        
        const tabs = document.querySelectorAll('.nav-tab');
        console.log('📑 Tabs encontradas:', tabs.length);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                console.log('🔄 Clicou na tab:', tabName);
                this.switchTab(tabName);
            });
        });

        // Inicializar com dashboard
        this.switchTab('dashboard');
        console.log('✅ Navegação por tabs configurada');
    }

    switchTab(tabName) {
        console.log(`🔄 Mudando para tab: ${tabName}`);
        
        // Remover classe ativa de todas as tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Esconder todo conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Ativar tab selecionada
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Mostrar conteúdo da tab
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
            tabContent.style.display = 'block';
        }
        
        // Atualizar conteúdo específico
        this.updateTabContent(tabName);
    }

    updateTabContent(tabName) {
        console.log(`📝 Atualizando conteúdo da tab: ${tabName}`);
        switch(tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'tasks':
                this.updateTasks();
                break;
            case 'achievements':
                this.updateAchievements();
                break;
            case 'crafting':
                this.updateCrafting();
                break;
            case 'settings':
                this.updateSettings();
                break;
        }
    }

    updateDashboard() {
        this.renderParticipants();
        this.updateWorldProgress();
    }

    updateTasks() {
        this.updateAssigneeDropdown();
        this.renderTasks();
    }

    updateAssigneeDropdown() {
        const select = document.getElementById('task-assignee');
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sem atribuição</option>' +
            this.participants.map(p =>
                `<option value="${p.id}">${p.name}</option>`
            ).join('');
        if (currentValue && this.participants.find(p => p.id === parseInt(currentValue))) {
            select.value = currentValue;
        }
    }

    updateAchievements() {
        this.renderAchievements();
    }

    updateCrafting() {
        this.renderCrafting();
    }

    updateSettings() {
        this.renderSettings();
    }

    addParticipant() {
        console.log('👤 Adicionando participante...');
        
        const nameInput = document.getElementById('participant-name');
        const avatarSelect = document.getElementById('participant-avatar');
        
        if (!nameInput || !avatarSelect) {
            console.error('❌ Elementos do formulário não encontrados');
            alert('Erro: Elementos do formulário não encontrados!');
            return;
        }

        const name = nameInput.value.trim();
        const avatar = avatarSelect.value;
        
        if (!name) {
            alert('Por favor, digite um nome!');
            return;
        }
        
        const participant = {
            id: Date.now(),
            name: name,
            avatar: avatar,
            level: 1,
            experience: 0,
            score: 0,
            completedTasks: 0,
            joinDate: new Date().toISOString()
        };
        
        this.participants.push(participant);
        this.saveData();
        this.renderParticipants();
        this.updateWorldProgress();
        this.updateAssigneeDropdown();

        // Limpar formulário
        nameInput.value = '';
        avatarSelect.value = 'stive70';
        
        this.showNotification('Participante adicionado com sucesso! 🎉');
        console.log('✅ Participante adicionado:', participant);
    }

    deleteParticipant(index) {
        if (confirm('Tem certeza que deseja remover este participante?')) {
            this.participants.splice(index, 1);
            this.saveData();
            this.renderParticipants();
            this.updateWorldProgress();
            this.updateAssigneeDropdown();
            this.showNotification('Participante removido! 🗑️');
            console.log('✅ Participante removido no índice:', index);
        }
    }

    addTask() {
        console.log('📝 Adicionando tarefa...');

        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        const pointsInput = document.getElementById('task-points');
        const assigneeSelect = document.getElementById('task-assignee');

        if (!titleInput || !descriptionInput || !pointsInput) {
            console.error('❌ Elementos do formulário de tarefa não encontrados');
            alert('Erro: Elementos do formulário não encontrados!');
            return;
        }

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const points = parseInt(pointsInput.value) || 10;
        const assigneeId = assigneeSelect ? assigneeSelect.value : '';

        if (!title) {
            alert('Por favor, digite um título para a tarefa!');
            return;
        }

        const task = {
            id: Date.now(),
            title: title,
            description: description,
            points: points,
            assigneeId: assigneeId ? parseInt(assigneeId) : null,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveData();
        this.renderTasks();

        // Limpar formulário
        titleInput.value = '';
        descriptionInput.value = '';
        pointsInput.value = '10';
        if (assigneeSelect) assigneeSelect.value = '';

        this.showNotification('Tarefa criada com sucesso! 📝');
        console.log('✅ Tarefa criada:', task);
    }

    deleteTask(index) {
        if (confirm('Tem certeza que deseja remover esta tarefa?')) {
            this.tasks.splice(index, 1);
            this.saveData();
            this.renderTasks();
            this.showNotification('Tarefa removida! 🗑️');
            console.log('✅ Tarefa removida no índice:', index);
        }
    }

    completeTask(index) {
        const task = this.tasks[index];
        if (task && !task.completed) {
            task.completed = true;
            task.completedAt = new Date().toISOString();

            // Award XP and score to assigned participant
            if (task.assigneeId) {
                const participant = this.participants.find(p => p.id === task.assigneeId);
                if (participant) {
                    participant.score += task.points;
                    participant.experience += task.points;
                    participant.completedTasks += 1;

                    // Level up participant every 100 XP
                    const newLevel = Math.floor(participant.experience / 100) + 1;
                    if (newLevel > participant.level) {
                        participant.level = newLevel;
                        this.showNotification(`${participant.name} subiu para o nível ${newLevel}! 🎉`);
                    }
                }
            }

            // Add to world experience and check world level
            this.worldExperience += task.points;
            const nextLevelExp = this.worldLevel * 1000;
            while (this.worldExperience >= nextLevelExp) {
                this.worldExperience -= this.worldLevel * 1000;
                this.worldLevel += 1;
                this.showNotification(`Mundo subiu para o nível ${this.worldLevel}! 🌍`);
            }

            this.saveData();
            this.renderTasks();
            this.renderParticipants();
            this.updateWorldProgress();
            this.showNotification('Tarefa completada! 🎯');
            console.log('✅ Tarefa completada:', task);
        }
    }

    renderAll() {
        console.log('🎨 Renderizando tudo...');
        this.renderParticipants();
        this.renderTasks();
        this.renderAchievements();
        this.renderCrafting();
        this.renderSettings();
        this.updateWorldProgress();
    }

    renderParticipants() {
        console.log('👥 Renderizando participantes...');
        const container = document.getElementById('participants-container');
        if (!container) {
            console.error('❌ Container de participantes não encontrado');
            return;
        }
        
        if (this.participants.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <p>Nenhum participante ainda. Adicione o primeiro! 🎮</p>
                    <div class="steve-placeholder">🧍‍♂️</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.participants.map((participant, index) => `
            <div class="participant-card">
                <div class="participant-avatar">
                    <img src="minecraft-emoji-e3560/assets/minecraft/textures/font/custom/${participant.avatar}.png" alt="${participant.avatar}" class="avatar-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjODg4Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkE8L3RleHQ+Cjwvc3ZnPgo='">
                </div>
                <div class="participant-info">
                    <h3>${participant.name}</h3>
                    <div class="participant-level">
                        <span class="level-badge">Nível ${participant.level}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(participant.experience % 100)}%"></div>
                        </div>
                    </div>
                    <p>Pontos: ${participant.score} | Tarefas: ${participant.completedTasks}</p>
                </div>
                <div class="participant-actions">
                    <button class="minecraft-button danger delete-participant" data-index="${index}">
                        Remover
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Participantes renderizados:', this.participants.length);
    }

    renderTasks() {
        console.log('📝 Renderizando tarefas...');
        const container = document.getElementById('tasks-container');
        if (!container) {
            console.error('❌ Container de tarefas não encontrado');
            return;
        }
        
        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <p>Nenhuma tarefa ainda. Crie a primeira! 📝</p>
                    <div class="block-placeholder">🧱</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.tasks.map((task, index) => {
            const assignee = task.assigneeId ? this.participants.find(p => p.id === task.assigneeId) : null;
            return `
            <div class="task-card ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span class="task-points">${task.points} pontos</span>
                </div>
                <p>${task.description}</p>
                ${assignee ? `<p class="task-assignee">👤 ${assignee.name}</p>` : ''}
                <div class="task-footer">
                    <span class="task-status ${task.completed ? 'completed' : 'pending'}">
                        ${task.completed ? '✅ Concluída' : '⏳ Pendente'}
                    </span>
                    <div class="task-actions">
                        ${!task.completed ? `
                            <button class="minecraft-button primary complete-task" data-index="${index}">
                                Completar
                            </button>
                        ` : ''}
                        <button class="minecraft-button danger delete-task" data-index="${index}">
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `;}).join('');
        
        console.log('✅ Tarefas renderizadas:', this.tasks.length);
    }

    renderAchievements() {
        console.log('🏆 Renderizando conquistas...');
        const container = document.getElementById('achievements-container');
        if (!container) {
            console.error('❌ Container de conquistas não encontrado');
            return;
        }
        
        container.innerHTML = `
            <div class="minecraft-panel">
                <div class="panel-header">
                    <h2>🏆 Conquistas</h2>
                </div>
                <div class="panel-content">
                    <p>Conquistas serão desbloqueadas conforme o progresso!</p>
                    <div class="achievement-stats">
                        <p>🎯 Participantes: ${this.participants.length}</p>
                        <p>📝 Tarefas: ${this.tasks.length}</p>
                        <p>✅ Completadas: ${this.tasks.filter(t => t.completed).length}</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderCrafting() {
        console.log('⚒️ Renderizando crafting...');
        const container = document.getElementById('crafting-container');
        if (!container) {
            console.error('❌ Container de crafting não encontrado');
            return;
        }
        
        container.innerHTML = `
            <div class="minecraft-panel">
                <div class="panel-header">
                    <h2>⚒️ Sistema de Crafting</h2>
                </div>
                <div class="panel-content">
                    <p>Sistema de crafting será implementado em breve!</p>
                    <div class="crafting-preview">
                        <div class="crafting-grid">
                            <div class="crafting-slot">1</div>
                            <div class="crafting-slot">2</div>
                            <div class="crafting-slot">3</div>
                            <div class="crafting-slot">4</div>
                            <div class="crafting-slot">5</div>
                            <div class="crafting-slot">6</div>
                            <div class="crafting-slot">7</div>
                            <div class="crafting-slot">8</div>
                            <div class="crafting-slot">9</div>
                        </div>
                        <div class="crafting-result">
                            <div class="result-slot">?</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSettings() {
        console.log('⚙️ Renderizando configurações...');
        const container = document.getElementById('settings-container');
        if (!container) {
            console.error('❌ Container de configurações não encontrado');
            return;
        }
        
        container.innerHTML = `
            <div class="minecraft-panel">
                <div class="panel-header">
                    <h2>⚙️ Configurações</h2>
                </div>
                <div class="panel-content">
                    <div class="setting-group">
                        <h3>💾 Dados</h3>
                        <button class="minecraft-button primary" onclick="window.rotinacraftSystem.exportData()">📤 Exportar Dados</button>
                        <button class="minecraft-button secondary" onclick="window.rotinacraftSystem.importData()">📥 Importar Dados</button>
                        <button class="minecraft-button danger" onclick="window.rotinacraftSystem.resetData()">🗑️ Resetar Tudo</button>
                    </div>
                    <div class="setting-group">
                        <h3>📊 Estatísticas</h3>
                        <p>Total de Participantes: ${this.participants.length}</p>
                        <p>Total de Tarefas: ${this.tasks.length}</p>
                        <p>Nível do Mundo: ${this.worldLevel}</p>
                        <p>Experiência Total: ${this.worldExperience}</p>
                    </div>
                </div>
            </div>
        `;
    }

    updateWorldProgress() {
        console.log('🌍 Atualizando progresso do mundo...');

        // Atualizar interface
        const worldLevelElement = document.getElementById('world-level');
        const worldExperienceElement = document.getElementById('world-experience');

        if (worldLevelElement) {
            worldLevelElement.textContent = this.worldLevel;
        }

        if (worldExperienceElement) {
            const nextLevelExp = this.worldLevel * 1000;
            const progress = Math.min((this.worldExperience / nextLevelExp) * 100, 100);
            worldExperienceElement.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span>${this.worldExperience} / ${nextLevelExp} XP</span>
            `;
        }

        this.saveData();
    }

    showNotification(message) {
        console.log('🔔 Mostrando notificação:', message);
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    exportData() {
        const data = {
            participants: this.participants,
            tasks: this.tasks,
            worldLevel: this.worldLevel,
            worldExperience: this.worldExperience
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `rotinacraft_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Dados exportados com sucesso! 📤');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (data.participants && data.tasks) {
                            this.participants = data.participants;
                            this.tasks = data.tasks;
                            this.worldLevel = data.worldLevel || 1;
                            this.worldExperience = data.worldExperience || 0;
                            
                            this.saveData();
                            this.renderAll();
                            this.showNotification('Dados importados com sucesso! 📥');
                        } else {
                            this.showNotification('Arquivo inválido! ❌');
                        }
                    } catch (error) {
                        this.showNotification('Erro ao importar dados! ❌');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    resetData() {
        if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita!')) {
            localStorage.removeItem('rotinacraft_participants');
            localStorage.removeItem('rotinacraft_tasks');
            localStorage.removeItem('rotinacraft_worldLevel');
            localStorage.removeItem('rotinacraft_worldExperience');
            this.participants = [];
            this.tasks = [];
            this.worldLevel = 1;
            this.worldExperience = 0;

            this.saveData();
            this.renderAll();
            this.showNotification('Dados resetados com sucesso! 🔄');
        }
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧱 ROTINACRAFT - DOM carregado, iniciando sistema...');
    try {
        window.rotinacraftSystem = new MinecraftRoutineSystem();
        console.log('🧱 ROTINACRAFT - Sistema inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema:', error);
        alert('Erro ao inicializar o sistema: ' + error.message);
    }
});

// Adicionar estilos CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-data {
        text-align: center;
        color: #888;
        font-style: italic;
        padding: 20px;
    }
    
    .steve-placeholder,
    .block-placeholder {
        font-size: 4rem;
        margin: 2rem 0;
    }
    
    .participant-card, .task-card {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
    }
    
    .minecraft-button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
    }
    
    .minecraft-button:hover {
        background: #45a049;
    }
    
    .minecraft-button.primary {
        background: #2196F3;
    }
    
    .minecraft-button.primary:hover {
        background: #1976D2;
    }
    
    .minecraft-button.danger {
        background: #f44336;
    }
    
    .minecraft-button.danger:hover {
        background: #d32f2f;
    }
    
    .minecraft-button.secondary {
        background: #9E9E9E;
    }
    
    .minecraft-button.secondary:hover {
        background: #757575;
    }
    
    .progress-bar {
        background: #ddd;
        height: 20px;
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .progress-fill {
        background: #4CAF50;
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .level-badge {
        background: #FFD700;
        color: #333;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .avatar-img {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        border: 2px solid #ddd;
    }
    
    .crafting-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        margin: 1rem 0;
    }
    
    .crafting-slot {
        width: 50px;
        height: 50px;
        background: #ddd;
        border: 2px solid #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .crafting-result {
        margin-left: 2rem;
    }
    
    .result-slot {
        width: 60px;
        height: 60px;
        background: #FFD700;
        border: 3px solid #FFA500;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .setting-group {
        margin: 2rem 0;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }
    
    .setting-group h3 {
        color: #FFD700;
        margin-bottom: 1rem;
    }

    .task-card.completed {
        opacity: 0.7;
        border-left: 4px solid #4CAF50;
    }

    .task-assignee {
        font-size: 0.9rem;
        color: #666;
        margin: 5px 0;
    }

    .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .task-points {
        background: #FFD700;
        color: #333;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: bold;
    }

    .task-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }

    .task-actions {
        display: flex;
        gap: 5px;
    }

    .participant-card {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .participant-info {
        flex: 1;
    }

    .achievement-stats p {
        margin: 5px 0;
    }

    .crafting-preview {
        display: flex;
        align-items: center;
    }
`;
document.head.appendChild(style);
