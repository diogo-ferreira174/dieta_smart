// ============================================================
//  DietaSmart — rotina.js
//  Só exibe dados se o usuário cadastrou na sessão atual.
//  A ponte entre as páginas é o sessionStorage.
// ============================================================

const API = 'http://localhost:3000';

async function carregarDb() {
    const caminhos = ['./db/db.json', 'db/db.json', '/db/db.json'];
    let ultimoErro = null;

    for (const caminho of caminhos) {
        try {
            const resposta = await fetch(caminho);
            if (!resposta.ok) {
                ultimoErro = new Error(`Falha ao carregar ${caminho}: ${resposta.status}`);
                continue;
            }
            return await resposta.json();
        } catch (erro) {
            ultimoErro = erro;
        }
    }

    throw ultimoErro || new Error('Não foi possível carregar db.json');
}

// Menu lateral
document.getElementById('iconMenu').addEventListener('click', (event) => {
    document.getElementById('menuLateral').style.display = 'block';
    event.stopPropagation();
});
document.addEventListener('click', (event) => {
    const menu = document.getElementById('menuLateral');
    if (!menu.contains(event.target) && menu.style.display === 'block') {
        menu.style.display = 'none';
    }
});

// ------------------------------------------------------------
// Carrega e exibe o cronograma
// ------------------------------------------------------------
async function carregarDados() {
    const grade = document.getElementById('grade-rotina');

    // Lê os IDs salvos pelo dietas.js e exercicios.js no sessionStorage
    const dietaId  = sessionStorage.getItem('dietaIdAtual');
    const rotinaId = sessionStorage.getItem('rotinaIdAtual');

    // Se nenhum dos dois foi cadastrado na sessão, exibe tela vazia
    if (!dietaId && !rotinaId) {
        renderizar([], null, null);
        return;
    }

    try {
        // Tenta a API remota
        let refeicoes = [];
        let dieta = null;
        let rotina = null;

        try {
            const promises = [fetch(`${API}/refeicoes`)];
            if (dietaId)  promises.push(fetch(`${API}/dietas/${dietaId}`));
            if (rotinaId) promises.push(fetch(`${API}/rotina/${rotinaId}`));

            const respostas = await Promise.all(promises);

            refeicoes = respostas[0].ok ? await respostas[0].json() : [];
            dieta     = dietaId  && respostas[1]?.ok ? await respostas[1].json() : null;
            rotina    = rotinaId && respostas[dietaId ? 2 : 1]?.ok
                        ? await respostas[dietaId ? 2 : 1].json()
                        : null;
        } catch (errApi) {
            // Se API remota falhar, tenta carregar db.json local
            const db = await carregarDb();
            refeicoes = Array.isArray(db.refeicoes) ? db.refeicoes : [];
            if (dietaId && Array.isArray(db.dietas)) {
                dieta = db.dietas.find(d => String(d.id) === String(dietaId)) || null;
            }
            if (rotinaId && Array.isArray(db.rotina)) {
                rotina = db.rotina.find(r => String(r.id) === String(rotinaId)) || null;
            }
        }

        const itens = [];
        const nomesRefeicoes = ['Café da Manhã', 'Almoço', 'Lanche', 'Janta'];

        // Refeições da dieta do usuário
        if (dieta?.refeicoes?.length > 0) {
            dieta.refeicoes.forEach((id, index) => {
                const prato = refeicoes.find(r => String(r.id) === String(id));
                if (prato) {
                    itens.push({
                        tipo:      'refeicao',
                        atividade: nomesRefeicoes[index] || `Refeição ${index + 1}`,
                        desc:      `${prato.nome} — ${prato.calorias} kcal`,
                    });
                }
            });
        }

        // Exercícios da rotina do usuário
        if (rotina?.exercicios?.length > 0) {
            rotina.exercicios.forEach((exe, index) => {
                itens.push({
                    tipo:      'exercicio',
                    atividade: `Exercício ${index + 1}: ${exe.tipo}`,
                    desc:      `${exe.tempo} min — ${exe.calorias} kcal queimadas`,
                });
            });
        }

        renderizar(itens, dieta, rotina);

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
        document.getElementById('grade-rotina').innerHTML = `
            <div class="aviso-vazio">
                <p>⚠️ Não foi possível carregar os dados.</p>
                <p>Verifique o console para detalhes.</p>
            </div>
        `;
    }
}

// ------------------------------------------------------------
// Renderiza os cards
// ------------------------------------------------------------
function renderizar(itens, dieta, rotina) {
    const grade = document.getElementById('grade-rotina');
    grade.innerHTML = '';

    const calConsumidas = dieta  ? dieta.calorias  : 0;
    const calQueimadas  = rotina ? rotina.calorias : 0;
    const saldo         = calConsumidas - calQueimadas;

    // Resumo só aparece se tiver algum dado
    if (dieta || rotina) {
        grade.innerHTML = `
            <div class="resumo-calorias">
                <div class="resumo-item">🍽 <strong>${calConsumidas} kcal</strong> consumidas</div>
                <div class="resumo-item">🔥 <strong>${calQueimadas} kcal</strong> queimadas</div>
                <div class="resumo-item saldo-${saldo >= 0 ? 'positivo' : 'negativo'}">
                    ⚖️ Saldo: <strong>${saldo >= 0 ? '+' : ''}${saldo} kcal</strong>
                </div>
            </div>
        `;
    }

    if (itens.length === 0) {
        grade.innerHTML += `
            <div class="aviso-vazio">
                <p>📋 Você ainda não cadastrou nenhuma dieta ou rotina de exercícios.</p>
                <p>
                    Acesse <a href="dieta.html">Dieta</a> ou
                    <a href="exercicios.html">Exercícios</a> para começar.
                </p>
            </div>
        `;
        return;
    }

    const icones = { refeicao: '🍽', exercicio: '💪' };

    itens.forEach(item => {
        const card = document.createElement('div');
        card.className = `card-horario card-${item.tipo}`;
        card.innerHTML = `
            <div class="detalhes-bloco">
                <h3>${icones[item.tipo]} ${item.atividade}</h3>
                <p>${item.desc}</p>
            </div>
        `;
        grade.appendChild(card);
    });
}

carregarDados();