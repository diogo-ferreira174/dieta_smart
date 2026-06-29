const API_URL = 'http://localhost:3000/refeicoes';
let alimentosCarregados = [];

const container = document.getElementById('alimentos-container');
const mensagemEl = document.getElementById('mensagem');
const refreshButton = document.getElementById('refreshButton');
const filterSelect = document.getElementById('filterSelect');

function ehRecomendavel(alimento) {
    const gordura = Number(alimento?.nutricional?.gorduras ?? 0);
    const calorias = Number(alimento?.calorias ?? 0);
    const proteinas = Number(alimento?.nutricional?.proteinas ?? 0);

    return calorias <= 500 && gordura <= 25 && proteinas >= 10;
}

function criarCartaoAlimento(alimento) {
    const recomendavel = ehRecomendavel(alimento);
    const cartao = document.createElement('article');
    cartao.className = `alimento-card ${recomendavel ? 'recomendavel' : 'nao-recomendavel'}`;

    cartao.innerHTML = `
        <div class="card-head">
            <h2>${alimento.nome}</h2>
            <span class="tag ${recomendavel ? 'tag-green' : 'tag-red'}">${recomendavel ? 'Recomendável' : 'Não recomendável'}</span>
        </div>
        <p><strong>Peso:</strong> ${alimento.peso ?? '-'} g</p>
        <p><strong>Calorias:</strong> ${alimento.calorias ?? '-'} kcal</p>
        <div class="nutrients">
            <div class="nutrient-item">
                <strong>Carboidratos</strong>
                <span>${alimento.nutricional?.carboidratos ?? '-'} g</span>
            </div>
            <div class="nutrient-item">
                <strong>Proteínas</strong>
                <span>${alimento.nutricional?.proteinas ?? '-'} g</span>
            </div>
            <div class="nutrient-item">
                <strong>Gorduras</strong>
                <span>${alimento.nutricional?.gorduras ?? '-'} g</span>
            </div>
        </div>
    `;

    return cartao;
}

function renderAlimentos(alimentos, filtro = 'all') {
    if (!container || !mensagemEl) return;

    container.innerHTML = '';
    mensagemEl.textContent = '';

    const listaFiltrada = alimentos.filter(alimento => {
        if (filtro === 'recommended') {
            return ehRecomendavel(alimento);
        }
        if (filtro === 'not-recommended') {
            return !ehRecomendavel(alimento);
        }
        return true;
    });

    if (listaFiltrada.length === 0) {
        mensagemEl.textContent = 'Nenhum alimento encontrado para o filtro selecionado.';
        return;
    }

    listaFiltrada.forEach(alimento => {
        container.appendChild(criarCartaoAlimento(alimento));
    });
}

async function carregarTela() {
    if (!container || !mensagemEl) return;

    mensagemEl.textContent = 'Carregando alimentos...';

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar alimentos: ${resposta.status}`);
        }

        const dados = await resposta.json();
        alimentosCarregados = Array.isArray(dados) ? dados : [];
        renderAlimentos(alimentosCarregados, filterSelect?.value || 'all');
    } catch (erro) {
        mensagemEl.textContent = 'Não foi possível carregar os alimentos. Verifique se o servidor local está rodando.';
        console.error(erro);
    }
}

function aplicarFiltro() {
    renderAlimentos(alimentosCarregados, filterSelect?.value || 'all');
}

window.addEventListener('load', () => {
    if (refreshButton) {
        refreshButton.addEventListener('click', carregarTela);
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', aplicarFiltro);
    }

    carregarTela();
});
