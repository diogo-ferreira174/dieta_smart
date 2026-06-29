// 1. Execute no terminal: npx json-server --watch db.json --port 3000
// 2. Abra o index.html via LiveServer e clique no botão "Atualizar lista" no topo da página para carregar a lista de alimentos.

const API_URL = 'http://localhost:3000/refeições';
let alimentosCarregados = [];

const container = document.getElementById('alimentos-container');
const mensagemEl = document.getElementById('mensagem');
const refreshButton = document.getElementById('refreshButton');
const filterSelect = document.getElementById('filterSelect');

function ehRecomendavel(alimento) {
    const gordura = alimento.nutricional?.gorduras ?? 0;
    const calorias = alimento.calorias ?? 0;
    const proteinas = alimento.nutricional?.proteinas ?? 0;

    return calorias <= 500 && gordura <= 25 && proteinas >= 10;
}

function criarCartaoAlimento(alimento) {
    const recomendavel = ehRecomendavel(alimento);
    const cartao = document.createElement('article');
    cartao.className = 'alimento-card';
    if (recomendavel) {
        cartao.classList.add('recomendavel');
    } else {
        cartao.classList.add('nao-recomendavel');
    }

    cartao.innerHTML = `
        <div class="card-head">
            <h2>${alimento.nome}</h2>
            <span class="tag ${recomendavel ? 'tag-green' : 'tag-red'}">${recomendavel ? 'Recomendável' : 'Não recomendável'}</span>
        </div>
        <p><strong>Peso:</strong> ${alimento.peso} g</p>
        <p><strong>Calorias:</strong> ${alimento.calorias} kcal</p>
        // <div class="nutrients">
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

function carregarTela() {
    mensagemEl.textContent = 'Carregando alimentos...';
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar alimentos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alimentosCarregados = data;
            renderAlimentos(alimentosCarregados, filterSelect.value);
        })
        .catch(error => {
            mensagemEl.textContent = 'Não foi possível carregar os alimentos. Verifique se o json-server está rodando em http://localhost:3000.';
            console.error(error);
        });
}

function aplicarFiltro() {
    renderAlimentos(alimentosCarregados, filterSelect.value);
}

window.addEventListener('load', () => {
    refreshButton.addEventListener('click', carregarTela);
    filterSelect.addEventListener('change', aplicarFiltro);
    carregarTela();
});
