// ROTINACRAFT - Jogo RPG de Rotina para Criancas
// Funciona 100% abrindo index.html no navegador

var EMOJI = 'minecraft-emoji-e3560/assets/minecraft/textures/font/custom/';

var CHARS = [
    {id:'stive70',name:'Steve'},{id:'alex70',name:'Alex'},
    {id:'stive1',name:'Steve 2'},{id:'alex1',name:'Alex 2'},
    {id:'stive30',name:'Guerreiro'},{id:'alex30',name:'Guerreira'},
    {id:'stive50',name:'Explorador'},{id:'alex50',name:'Exploradora'},
    {id:'villager1',name:'Aldeao'},{id:'villager5',name:'Fazendeiro'},
    {id:'axolotl1',name:'Axolote'},{id:'allay1',name:'Allay'},
];

var DEFAULT_QUESTS = [
    {title:'Escovar os dentes',icon:'🦷',period:'morning',xp:10},
    {title:'Tomar cafe da manha',icon:'🥣',period:'morning',xp:10},
    {title:'Arrumar a cama',icon:'🛏️',period:'morning',xp:15},
    {title:'Trocar de roupa',icon:'👕',period:'morning',xp:10},
    {title:'Almocar',icon:'🍽️',period:'afternoon',xp:10},
    {title:'Fazer licao de casa',icon:'📚',period:'afternoon',xp:30},
    {title:'Brincar / Jogar',icon:'🎮',period:'afternoon',xp:10},
    {title:'Tomar banho',icon:'🚿',period:'night',xp:15},
    {title:'Jantar',icon:'🍕',period:'night',xp:10},
    {title:'Escovar os dentes (noite)',icon:'🦷',period:'night',xp:10},
    {title:'Ler um livro',icon:'📖',period:'night',xp:20},
    {title:'Dormir cedo',icon:'😴',period:'night',xp:15},
];

var ICONS = ['🦷','🥣','🛏️','👕','🍽️','📚','🎮','🚿','🍕','📖','😴','🧹','🐕','💪','🎨','🎵','🏃','💧','🍎','✏️','🧸','👟','🪥','🧴'];

var ACHS = [
    {id:'first',name:'Primeira Missao',desc:'Complete 1 missao',icon:'⭐',fn:function(s){return s.done>=1}},
    {id:'five',name:'Aventureiro',desc:'Complete 5 missoes',icon:'🗡️',fn:function(s){return s.done>=5}},
    {id:'ten',name:'Heroi',desc:'Complete 10 missoes',icon:'🛡️',fn:function(s){return s.done>=10}},
    {id:'twenty',name:'Lenda',desc:'Complete 20 missoes',icon:'👑',fn:function(s){return s.done>=20}},
    {id:'fifty',name:'Mestre',desc:'Complete 50 missoes',icon:'🏆',fn:function(s){return s.done>=50}},
    {id:'lv5',name:'Nivel 5',desc:'Chegue ao nivel 5',icon:'💎',fn:function(s){return s.lv>=5}},
    {id:'lv10',name:'Nivel 10',desc:'Chegue ao nivel 10',icon:'🌟',fn:function(s){return s.lv>=10}},
    {id:'coins50',name:'Poupador',desc:'Junte 50 esmeraldas',icon:'💰',fn:function(s){return s.coins>=50}},
    {id:'coins200',name:'Rico',desc:'Junte 200 esmeraldas',icon:'💎',fn:function(s){return s.coins>=200}},
    {id:'streak7',name:'Semana Incrivel',desc:'7 dias seguidos',icon:'🔥',fn:function(s){return s.streak>=7}},
    {id:'items3',name:'Colecionador',desc:'Tenha 3 itens',icon:'📦',fn:function(s){return s.inv.length>=3}},
    {id:'allday',name:'Dia Perfeito',desc:'Complete todas de um dia',icon:'🎯',fn:function(s){return s.perfect}},
    {id:'mg_first',name:'Primeiro Mini-Jogo',desc:'Complete um mini-jogo',icon:'🎮',fn:function(s){return s.mg_brushing_played>=1||s.mg_dressing_played>=1||s.mg_eating_played>=1||s.mg_bedtime_played>=1||s.mg_handwash_played>=1}},
    {id:'mg_3stars',name:'Perfeicao',desc:'3 estrelas em um mini-jogo',icon:'🌟',fn:function(s){return s.mg_brushing_bestStars>=3||s.mg_dressing_bestStars>=3||s.mg_eating_bestStars>=3||s.mg_bedtime_bestStars>=3||s.mg_handwash_bestStars>=3}},
    {id:'mg_all',name:'Explorador Completo',desc:'Jogue todos os 5 mini-jogos',icon:'🗺️',fn:function(s){return s.mg_brushing_played>0&&s.mg_dressing_played>0&&s.mg_eating_played>0&&s.mg_bedtime_played>0&&s.mg_handwash_played>0}},
];

var SHOP = [
    {id:'sword_diamond',name:'Espada Diamante',desc:'Item epico!',price:50,img:'sword_diamond'},
    {id:'pickaxe_iron',name:'Picareta Ferro',desc:'Ferramenta!',price:30,img:'pickaxe_iron'},
    {id:'golden_apple',name:'Maca Dourada',desc:'Restaura vida!',price:20,img:'gold_apple'},
    {id:'diamond2',name:'Diamante',desc:'Precioso!',price:40,img:'diamond2'},
    {id:'bow',name:'Arco',desc:'Atirar longe!',price:25,img:'bow'},
    {id:'cat',name:'Gato',desc:'Amigo peludo!',price:60,img:'cat'},
    {id:'parrot',name:'Papagaio',desc:'Companheiro!',price:45,img:'parrot'},
    {id:'horse',name:'Cavalo',desc:'Montaria!',price:80,img:'horse'},
];

var MSGS = {
    morning:['Bom dia! Hora de comecar!','Vamos la, heroi!','Novo dia, nova aventura!'],
    afternoon:['Boa tarde! Continue firme!','Metade do dia, muito bem!','Mais missoes te esperam!'],
    night:['Boa noite! Finalize suas missoes!','Quase na hora de descansar...','Complete as missoes da noite!'],
    done:['Incrivel!','Voce e demais!','Heroi de verdade!','Fantastico!','Muito bem!'],
};

// ===== ESTADO =====
var state;
var selChar = 'stive70';
var selIcon = '⭐';
var curFilter = 'all';

function defaults() {
    return {
        char:'stive70', name:'Jogador',
        lv:1, xp:0, xpNext:100, coins:0,
        hp:5, maxHp:5, done:0,
        morningDone:0, nightDone:0, perfect:false,
        streak:0, lastDate:null,
        quests:[], inv:[], achs:[],
        started:false,
        // Mini-games state
        mg_brushing_played:0, mg_brushing_bestStars:0, mg_brushing_lastPlayed:null,
        mg_dressing_played:0, mg_dressing_bestStars:0, mg_dressing_lastPlayed:null,
        mg_eating_played:0, mg_eating_bestStars:0, mg_eating_lastPlayed:null,
        mg_bedtime_played:0, mg_bedtime_bestStars:0, mg_bedtime_lastPlayed:null,
        mg_handwash_played:0, mg_handwash_bestStars:0, mg_handwash_lastPlayed:null,
        mg_demos_seen:[],
    };
}

function load() {
    try {
        var s = localStorage.getItem('rc_save');
        if (s) { var p = JSON.parse(s); var d = defaults(); for(var k in d) { if(!(k in p)) p[k]=d[k]; } return p; }
    } catch(e) {}
    return defaults();
}

function save() {
    try { localStorage.setItem('rc_save', JSON.stringify(state)); } catch(e) {}
}

// ===== TELAS =====
function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
    if (id === 'screen-game') updateAll();
}

// ===== PERSONAGEM =====
function renderChars() {
    var g = document.getElementById('char-grid');
    if (!g) return;
    var h = '';
    for (var i = 0; i < CHARS.length; i++) {
        var c = CHARS[i];
        h += '<div class="char-opt' + (c.id===selChar?' sel':'') + '" data-cid="'+c.id+'">';
        h += '<img src="'+EMOJI+c.id+'.png" alt="'+c.name+'">';
        h += '<span>'+c.name+'</span></div>';
    }
    g.innerHTML = h;
}

function renderIcons() {
    var p = document.getElementById('icon-pick');
    if (!p) return;
    var h = '';
    for (var i = 0; i < ICONS.length; i++) {
        h += '<div class="ic-opt'+(ICONS[i]===selIcon?' sel':'')+'" data-icon="'+ICONS[i]+'">'+ICONS[i]+'</div>';
    }
    p.innerHTML = h;
}

// ===== INICIAR JOGO =====
function startGame() {
    var inp = document.getElementById('player-name');
    var nm = inp ? inp.value.trim() : '';
    if (!nm) { toast('Digite seu nome!'); return; }
    state.name = nm;
    state.char = selChar;
    if (!state.started) {
        state.quests = [];
        for (var i = 0; i < DEFAULT_QUESTS.length; i++) {
            var q = DEFAULT_QUESTS[i];
            state.quests.push({id:Date.now()+i, title:q.title, icon:q.icon, period:q.period, xp:q.xp, done:false, custom:false});
        }
        state.started = true;
    }
    state.lastDate = today();
    save();
    showScreen('screen-game');
    toast('Bem-vindo, ' + nm + '!');
}

function today() { return new Date().toISOString().split('T')[0]; }

function checkDay() {
    var t = today();
    if (state.lastDate !== t) {
        var y = new Date(); y.setDate(y.getDate()-1);
        state.streak = (state.lastDate === y.toISOString().split('T')[0]) ? state.streak+1 : 1;
        for (var i=0;i<state.quests.length;i++) state.quests[i].done = false;
        state.morningDone=0; state.nightDone=0; state.perfect=false;
        state.lastDate = t;
        state.hp = state.maxHp;
        save();
        toast('Novo dia! Missoes resetadas!');
    }
}

// ===== COMPLETAR MISSAO =====
function completeQuest(qid) {
    var q = null;
    for (var i=0;i<state.quests.length;i++) { if(state.quests[i].id===qid) { q=state.quests[i]; break; } }
    if (!q || q.done) return;
    q.done = true;
    state.done++;
    state.xp += q.xp;
    state.coins += Math.floor(q.xp/2);

    var lvled = false;
    while (state.xp >= state.xpNext) {
        state.xp -= state.xpNext;
        state.lv++;
        state.xpNext = Math.floor(100 * Math.pow(1.2, state.lv-1));
        if (state.maxHp < 10) { state.maxHp++; state.hp = state.maxHp; }
        lvled = true;
    }

    // Streaks
    var mq = state.quests.filter(function(x){return x.period==='morning'});
    var nq = state.quests.filter(function(x){return x.period==='night'});
    state.morningDone = mq.filter(function(x){return x.done}).length;
    state.nightDone = nq.filter(function(x){return x.done}).length;
    state.perfect = state.quests.every(function(x){return x.done});

    checkAchs();
    save();
    showReward(q);
    if (lvled) setTimeout(function(){ showLevelUp(); }, 1200);
    updateAll();
}

function deleteQuest(qid) {
    state.quests = state.quests.filter(function(x){return x.id!==qid});
    save(); renderQuests();
}

function addQuest(e) {
    e.preventDefault();
    var t = document.getElementById('q-title');
    var p = document.getElementById('q-period');
    var x = document.getElementById('q-xp');
    var nm = t.value.trim();
    if (!nm) return;
    state.quests.push({id:Date.now(), title:nm, icon:selIcon, period:p.value, xp:parseInt(x.value), done:false, custom:true});
    save();
    t.value = '';
    closeModals();
    renderQuests();
    toast('Missao criada!');
}

function buyItem(sid) {
    var item = null;
    for(var i=0;i<SHOP.length;i++){if(SHOP[i].id===sid){item=SHOP[i];break;}}
    if(!item) return;
    if(state.coins < item.price) { toast('Esmeraldas insuficientes!'); return; }
    var ex = null;
    for(var i=0;i<state.inv.length;i++){if(state.inv[i].id===sid){ex=state.inv[i];break;}}
    if(ex) { ex.cnt++; } else { state.inv.push({id:sid,cnt:1}); }
    state.coins -= item.price;
    checkAchs();
    save(); updateAll();
    toast('Comprou ' + item.name + '!');
}

function checkAchs() {
    for(var i=0;i<ACHS.length;i++){
        var a = ACHS[i];
        if(state.achs.indexOf(a.id)===-1 && a.fn(state)) {
            state.achs.push(a.id);
            toast('Conquista: '+a.name+'!');
        }
    }
}

// ===== RENDER =====
function updateAll() {
    updateHud(); updateWorld(); renderQuests(); renderInv(); renderAchs(); renderShop(); renderConfig();
    if(typeof renderMap==='function') renderMap();
}

function updateHud() {
    var av = document.getElementById('hud-avatar');
    if(av) av.innerHTML = '<img src="'+EMOJI+state.char+'.png">';
    var nm = document.getElementById('hud-name');
    if(nm) nm.textContent = state.name;
    var lv = document.getElementById('hud-lvl');
    if(lv) lv.textContent = 'Nivel ' + state.lv;
    var xf = document.getElementById('xp-fill');
    if(xf) xf.style.width = Math.min((state.xp/state.xpNext)*100,100)+'%';
    var xt = document.getElementById('xp-text');
    if(xt) xt.textContent = state.xp+'/'+state.xpNext+' XP';
    var co = document.getElementById('hud-coins');
    if(co) co.textContent = state.coins;
    var ht = document.getElementById('hud-hearts');
    if(ht) {
        var h='';
        for(var i=0;i<state.maxHp&&i<10;i++) h+='<div class="heart'+(i>=state.hp?' empty':'')+'"></div>';
        ht.innerHTML=h;
    }
}

function updateWorld() {
    var ch = document.getElementById('character');
    if(ch) ch.innerHTML = '<img src="'+EMOJI+state.char+'.png">';
    var ho = document.getElementById('house');
    if(ho) {
        var doneN = state.quests.filter(function(x){return x.done}).length;
        var total = state.quests.length;
        var prog = total>0 ? doneN/total : 0;
        if(prog>=1) ho.textContent='🏰';
        else if(prog>=0.5) ho.textContent='🏠';
        else ho.textContent='🏚️';
    }
    var mb = document.getElementById('msg-bubble');
    if(mb) {
        var hr = new Date().getHours();
        var per = hr<12?'morning':(hr<18?'afternoon':'night');
        var ms = MSGS[per];
        mb.textContent = ms[Math.floor(Math.random()*ms.length)];
    }
    var sky = document.getElementById('sky');
    if(sky) {
        var hr = new Date().getHours();
        if(hr>=19||hr<6) sky.classList.add('night'); else sky.classList.remove('night');
    }
}

function renderQuests() {
    var c = document.getElementById('quests-list');
    if(!c) return;
    var qs = state.quests.slice();
    if(curFilter!=='all') qs = qs.filter(function(x){return x.period===curFilter});
    qs.sort(function(a,b){return a.done===b.done?0:(a.done?1:-1)});
    if(!qs.length) { c.innerHTML='<p style="text-align:center;color:#666;font-size:7px;padding:15px">Nenhuma missao</p>'; return; }
    var h='';
    for(var i=0;i<qs.length;i++){
        var q=qs[i];
        var per = q.period==='morning'?'Manha':(q.period==='afternoon'?'Tarde':'Noite');
        h+='<div class="q-card '+q.period+(q.done?' done':'')+'">';
        h+='<div class="q-icon">'+q.icon+'</div>';
        h+='<div class="q-info"><div class="q-name">'+q.title+'</div>';
        h+='<div class="q-xp">+'+q.xp+' XP | +'+Math.floor(q.xp/2)+' 💎</div>';
        h+='<div class="q-per">'+per+'</div></div>';
        h+='<div class="q-btns">';
        if(!q.done) h+='<button class="q-btn do" data-qid="'+q.id+'" title="Completar">✓</button>';
        h+='<button class="q-btn demo" data-demo="'+q.title+'" title="Como fazer?">?</button>';
        if(q.custom) h+='<button class="q-btn del" data-qid="'+q.id+'" title="Remover">✕</button>';
        h+='</div></div>';
    }
    c.innerHTML=h;
}

function renderInv() {
    var c = document.getElementById('inv-grid');
    if(!c) return;
    if(!state.inv.length) { c.innerHTML='<p style="text-align:center;color:#666;font-size:7px;padding:15px;grid-column:1/-1">Compre itens na loja!</p>'; return; }
    var h='';
    for(var i=0;i<state.inv.length;i++){
        var inv=state.inv[i];
        var item=null; for(var j=0;j<SHOP.length;j++){if(SHOP[j].id===inv.id){item=SHOP[j];break;}}
        if(item){
            h+='<div class="inv-slot" title="'+item.name+'">';
            h+='<img src="'+EMOJI+item.img+'.png">';
            if(inv.cnt>1) h+='<span class="inv-cnt">'+inv.cnt+'</span>';
            h+='</div>';
        }
    }
    var empty = Math.max(0, 9-state.inv.length);
    for(var i=0;i<empty;i++) h+='<div class="inv-slot empty"></div>';
    c.innerHTML=h;
}

function renderAchs() {
    var c = document.getElementById('ach-list');
    if(!c) return;
    var h='';
    for(var i=0;i<ACHS.length;i++){
        var a=ACHS[i];
        var on = state.achs.indexOf(a.id)!==-1;
        h+='<div class="ach-card '+(on?'on':'off')+'">';
        h+='<div class="ach-icon">'+(on?a.icon:'🔒')+'</div>';
        h+='<div><div class="ach-name">'+a.name+'</div>';
        h+='<div class="ach-desc">'+(on?a.desc:'???')+'</div></div></div>';
    }
    c.innerHTML=h;
}

function renderShop() {
    var c = document.getElementById('shop-list');
    if(!c) return;
    var h='';
    for(var i=0;i<SHOP.length;i++){
        var s=SHOP[i];
        var can = state.coins>=s.price;
        var own=null; for(var j=0;j<state.inv.length;j++){if(state.inv[j].id===s.id){own=state.inv[j];break;}}
        h+='<div class="sh-item">';
        h+='<div class="sh-icon"><img src="'+EMOJI+s.img+'.png"></div>';
        h+='<div class="sh-info"><div class="sh-name">'+s.name+(own?' (x'+own.cnt+')':'')+'</div>';
        h+='<div class="sh-desc">'+s.desc+'</div>';
        h+='<div class="sh-price">'+s.price+' 💎</div></div>';
        h+='<button class="mc-btn mc-btn-sm'+(can?'':' mc-btn-stone')+'" data-sid="'+s.id+'"'+(can?'':' disabled style="opacity:0.4"')+'>Comprar</button>';
        h+='</div>';
    }
    c.innerHTML=h;
}

function renderConfig() {
    var c = document.getElementById('config-area');
    if(!c) return;
    var h='<div class="cfg-box"><h4>Jogador</h4>';
    h+='<p>Nome: '+state.name+'</p>';
    h+='<p>Nivel: '+state.lv+'</p>';
    h+='<p>XP: '+state.xp+'/'+state.xpNext+'</p>';
    h+='<p>Esmeraldas: '+state.coins+'</p>';
    h+='<p>Missoes: '+state.done+'</p>';
    h+='<p>Dias seguidos: '+state.streak+'</p>';
    h+='<p>Conquistas: '+state.achs.length+'/'+ACHS.length+'</p>';
    h+='</div>';
    h+='<div class="cfg-box"><h4>Dados</h4>';
    h+='<div class="cfg-btns">';
    h+='<button class="mc-btn mc-btn-sm" id="btn-export">Exportar Dados</button>';
    h+='<button class="mc-btn mc-btn-sm mc-btn-stone" id="btn-import">Importar Dados</button>';
    h+='<button class="mc-btn mc-btn-sm mc-btn-danger" id="btn-reset">Resetar Tudo</button>';
    h+='<button class="mc-btn mc-btn-sm mc-btn-stone" id="btn-reset-day">Resetar Missoes do Dia</button>';
    h+='</div></div>';
    h+='<div class="cfg-box"><h4>Trocar Personagem</h4>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">';
    for(var i=0;i<CHARS.length;i++){
        var ch=CHARS[i];
        h+='<div class="char-opt'+(ch.id===state.char?' sel':'')+'" data-cid="'+ch.id+'" style="padding:4px">';
        h+='<img src="'+EMOJI+ch.id+'.png" style="width:28px;height:28px">';
        h+='</div>';
    }
    h+='</div></div>';
    c.innerHTML=h;
}

// ===== MODAIS =====
function closeModals() {
    var ms = document.querySelectorAll('.modal');
    for(var i=0;i<ms.length;i++) ms[i].classList.remove('open');
}
function openModal(id) {
    closeModals();
    var m = document.getElementById(id);
    if(m) m.classList.add('open');
}
function showReward(q) {
    var ri = document.getElementById('reward-info');
    var ms = MSGS.done;
    if(ri) ri.innerHTML = '<p>'+ms[Math.floor(Math.random()*ms.length)]+'</p><p style="margin-top:8px">+'+q.xp+' XP</p><p>+'+Math.floor(q.xp/2)+' 💎</p>';
    openModal('modal-reward');
}
function showLevelUp() {
    var t = document.getElementById('lvlup-text');
    if(t) t.textContent = 'NIVEL '+state.lv+'!';
    var r = document.getElementById('lvlup-reward');
    if(r) r.textContent = '+1 Coracao Maximo!';
    openModal('modal-lvlup');
}
function toast(msg) {
    var t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){t.classList.remove('show')},2500);
}

function exportData() {
    var d = JSON.stringify(state, null, 2);
    var b = new Blob([d], {type:'application/json'});
    var u = URL.createObjectURL(b);
    var a = document.createElement('a');
    a.href=u; a.download='rotinacraft_'+today()+'.json'; a.click();
    URL.revokeObjectURL(u);
    toast('Dados exportados!');
}
function importData() {
    var inp = document.createElement('input');
    inp.type='file'; inp.accept='.json';
    inp.onchange = function(e) {
        var f = e.target.files[0]; if(!f) return;
        var r = new FileReader();
        r.onload = function(ev) {
            try {
                var d = JSON.parse(ev.target.result);
                var def = defaults();
                for(var k in def) { if(!(k in d)) d[k]=def[k]; }
                state = d; save(); updateAll();
                toast('Dados importados!');
            } catch(e) { toast('Arquivo invalido!'); }
        };
        r.readAsText(f);
    };
    inp.click();
}
function resetAll() {
    if(confirm('Resetar todos os dados?')) {
        localStorage.removeItem('rc_save');
        state = defaults();
        showScreen('screen-title');
        toast('Dados resetados!');
    }
}
function resetDay() {
    for(var i=0;i<state.quests.length;i++) state.quests[i].done=false;
    state.morningDone=0; state.nightDone=0; state.perfect=false;
    save(); updateAll();
    toast('Missoes resetadas!');
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    state = load();
    selChar = state.char || 'stive70';
    renderChars();
    renderIcons();

    // Se ja tem jogo salvo, vai direto
    if (state.started && state.name !== 'Jogador') {
        checkDay();
        showScreen('screen-game');
    }

    // Botoes de tela
    document.getElementById('btn-play').addEventListener('click', function(){ showScreen('screen-select'); });
    document.getElementById('btn-about').addEventListener('click', function(){ showScreen('screen-about'); });
    document.getElementById('btn-back-title').addEventListener('click', function(){ showScreen('screen-title'); });
    document.getElementById('btn-back-about').addEventListener('click', function(){ showScreen('screen-title'); });
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-add-quest').addEventListener('click', function(){ openModal('modal-add'); });
    document.getElementById('modal-close-add').addEventListener('click', closeModals);
    document.getElementById('btn-close-reward').addEventListener('click', closeModals);
    document.getElementById('btn-close-lvlup').addEventListener('click', closeModals);
    document.getElementById('form-quest').addEventListener('submit', addQuest);

    // Selecao de personagem (delegacao)
    document.addEventListener('click', function(e) {
        // Selecao de char
        var co = e.target.closest('.char-opt');
        if (co && co.dataset.cid) {
            // Se estamos na tela de config, troca direto
            if (document.getElementById('screen-game').classList.contains('active')) {
                state.char = co.dataset.cid;
                save(); updateAll();
                toast('Personagem trocado!');
            } else {
                selChar = co.dataset.cid;
                renderChars();
            }
            return;
        }

        // Selecao de icone
        var ic = e.target.closest('.ic-opt');
        if (ic && ic.dataset.icon) {
            selIcon = ic.dataset.icon;
            renderIcons();
            return;
        }

        // Completar missao
        var qb = e.target.closest('.q-btn.do');
        if (qb && qb.dataset.qid) {
            completeQuest(parseInt(qb.dataset.qid));
            return;
        }

        // Demo "Como fazer?"
        var dm = e.target.closest('.q-btn.demo');
        if (dm && dm.dataset.demo && typeof openDemo==='function') {
            openDemo(dm.dataset.demo);
            return;
        }

        // Deletar missao
        var db = e.target.closest('.q-btn.del');
        if (db && db.dataset.qid) {
            deleteQuest(parseInt(db.dataset.qid));
            return;
        }

        // Comprar item
        var sb = e.target.closest('[data-sid]');
        if (sb && sb.dataset.sid) {
            buyItem(sb.dataset.sid);
            return;
        }

        // Categorias
        var cat = e.target.closest('.cat');
        if (cat && cat.dataset.cat) {
            curFilter = cat.dataset.cat;
            var cats = document.querySelectorAll('.cat');
            for(var i=0;i<cats.length;i++) cats[i].classList.toggle('active', cats[i].dataset.cat===curFilter);
            renderQuests();
            return;
        }

        // Hotbar tabs
        var hb = e.target.closest('.hb-slot');
        if (hb && hb.dataset.tab) {
            var tab = hb.dataset.tab;
            var slots = document.querySelectorAll('.hb-slot');
            for(var i=0;i<slots.length;i++) slots[i].classList.toggle('active', slots[i].dataset.tab===tab);
            var panels = document.querySelectorAll('.panel');
            for(var i=0;i<panels.length;i++) panels[i].classList.toggle('active', panels[i].id==='panel-'+tab);
            return;
        }

        // Config botoes
        if (e.target.id==='btn-export') { exportData(); return; }
        if (e.target.id==='btn-import') { importData(); return; }
        if (e.target.id==='btn-reset') { resetAll(); return; }
        if (e.target.id==='btn-reset-day') { resetDay(); return; }
    });
});
