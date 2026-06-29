// Rotina de Nutrição personalizada gerada a partir de `db.json` local
let rotinaNutricao = [];

// Fallback embutido para quando fetch local falhar (útil ao abrir via file://)
const rotinaPadraoFallback = [
    { "horario": "07:00", "atividade": "Café da Manhã", "desc": "Preparo com foco em carbo complexo e proteínas limpas." },
    { "horario": "08:30", "atividade": "Hidratação I", "desc": "Ingestão de 500ml de água e acompanhamento de metas diárias." },
    { "horario": "12:00", "atividade": "Almoço Planejado", "desc": "Alimento pesado na balança conforme plano de macros." },
    { "horario": "15:30", "atividade": "Lanche da Tarde", "desc": "Mix de castanhas e fonte proteica rápida." },
    { "horario": "18:00", "atividade": "Treino Diário", "desc": "Foco na queima calórica estipulada no painel principal." },
    { "horario": "20:00", "atividade": "Jantar Leve", "desc": "Refeição de fácil digestão focada na recuperação muscular." }
];

async function fetchUser(id) {
    try {
        const res = await fetch('./db.json');
        if (!res.ok) throw new Error(`Falha ao carregar db.json: ${res.status}`);
        const db = await res.json();
        const users = db.usuarios || [];
        return users.find(u => u.id === id) || null;
    } catch (err) {
        console.error('Erro ao carregar usuário de db.json:', err);
        return null;
    }
}

function buildPersonalizedRotina(user) {
    if (!user) return [];
    const nivel = user['nível de atividade física'] || 1;
    const activityMap = {
        1: { tipo: 'Caminhada leve', descricao: 'Caminhada de baixa intensidade', tempo: 30 },
        2: { tipo: 'Caminhada', descricao: 'Caminhada de intensidade moderada', tempo: 40 },
        3: { tipo: 'Corrida leve', descricao: 'Corrida ou atividade aeróbica', tempo: 45 },
        4: { tipo: 'Musculação', descricao: 'Treino de força (musculação)', tempo: 60 }
    };

    const activity = activityMap[nivel] || activityMap[1];

    // Distribuição aproximada de calorias por refeição com base no GET do usuário
    const get = user.get || 2000;
    const breakfastCal = Math.round(get * 0.25);
    const lunchCal = Math.round(get * 0.30);
    const snackCal = Math.round(get * 0.10);
    const dinnerCal = Math.round(get * 0.20);

    return [
        { horario: '07:00', atividade: `Café da Manhã — ${breakfastCal} kcal`, desc: `Refeição principal inicial para ${user.nome}. Priorize carboidratos complexos e proteínas.` },
        { horario: '08:30', atividade: 'Hidratação', desc: 'Ingestão de 500ml de água e reposição eletrolítica leve.' },
        { horario: '12:00', atividade: `Almoço — ${lunchCal} kcal`, desc: 'Refeição balanceada: carboidratos, proteína magra e vegetais.' },
        { horario: '15:30', atividade: `Lanche da Tarde — ${snackCal} kcal`, desc: 'Opção prática: mix de castanhas e fonte rápida de proteína.' },
        { horario: '18:00', atividade: `${activity.tipo} — ${activity.tempo} min`, desc: `${activity.descricao} para nível ${nivel} de atividade.` },
        { horario: '20:00', atividade: `Jantar — ${dinnerCal} kcal`, desc: 'Refeição leve focada em recuperação e proteína para reparo muscular.' }
    ];
}

document.addEventListener("DOMContentLoaded", () => {
    const btnVerRotina = document.getElementById("btn-ver-rotina");
    const btnVoltar = document.getElementById("btn-voltar");
    const secaoPainel = document.getElementById("secao-painel");
    const secaoRotina = document.getElementById("secao-rotina");
    const gradeRotina = document.getElementById("grade-rotina");

    // 1. Evento para trocar de tela e carregar a rotina personalizada (usa persona id=5)
    btnVerRotina.addEventListener("click", async () => {
        try {
            const user = await fetchUser(5);
            if (user) {
                rotinaNutricao = buildPersonalizedRotina(user);
            } else {
                // Fallback: tenta carregar do db.json, se falhar usa rotinaPadraoFallback
                console.warn('Usuário não encontrado. Tentando carregar rotina padrão de db.json.');
                try {
                    const res = await fetch('./db.json');
                    if (res.ok) {
                        const db = await res.json();
                        rotinaNutricao = db.rotinaNutricao || rotinaPadraoFallback;
                    } else {
                        rotinaNutricao = rotinaPadraoFallback;
                    }
                } catch (e) {
                    console.warn('Falha ao buscar db.json, usando rotina padrao embutida.', e);
                    rotinaNutricao = rotinaPadraoFallback;
                }
            }
            secaoPainel.classList.add("escondido");
            secaoRotina.classList.remove("escondido");
            renderizarRotina();
        } catch (err) {
            console.error('Erro ao carregar rotina:', err);
            gradeRotina.innerHTML = '<p class="erro-rotina">Erro ao carregar rotina. Veja o console para detalhes.</p>';
            secaoPainel.classList.add("escondido");
            secaoRotina.classList.remove("escondido");
        }
    });

    // 2. Evento para voltar ao painel de calorias
    btnVoltar.addEventListener("click", () => {
        secaoRotina.classList.add("escondido");
        secaoPainel.classList.remove("escondido");
    });

    // 3. Função que desenha a rotina na tela
    function renderizarRotina() {
        gradeRotina.innerHTML = ""; // Reseta conteúdo
        
        rotinaNutricao.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-horario";
            card.innerHTML = `
                <div class="hora-bloco">${item.horario}</div>
                <div class="detalhes-bloco">
                    <h3>${item.atividade}</h3>
                    <p>${item.desc}</p>
                </div>
            `;
            gradeRotina.appendChild(card);
        });
    }
});