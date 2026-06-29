const API_URL = 'http://localhost:3000/agenda/1';
const campos = [
    { id: 'ref1', label: 'Refeição 1' },
    { id: 'ref2', label: 'Refeição 2' },
    { id: 'ref3', label: 'Refeição 3' },
    { id: 'exe1', label: 'Exercício 1' },
    { id: 'exe2', label: 'Exercício 2' },
    { id: 'exe3', label: 'Exercício 3' }
];

const resultadoElement = document.getElementById('resultado');
const salvarBtn = document.getElementById('salvarBtn');
const limparBtn = document.getElementById('limparBtn');

function formatarHorario(valor) {
    return valor ? valor : 'Não definido';
}

function montarResultado(dados, mensagem) {
    const linhas = campos.map(item => {
        return `<div><strong>${item.label}:</strong> ${formatarHorario(dados[item.id])}</div>`;
    }).join('');

    resultadoElement.innerHTML = `
        <h3>Horários Registrados</h3>
        <p class="info">${mensagem}</p>
        <div class="resultado-grid">
            ${linhas}
        </div>
    `;
}

async function salvarHorarios() {
    const dados = {};

    campos.forEach(item => {
        dados[item.id] = document.getElementById(item.id).value.trim();
    });

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Não foi possível salvar no servidor.');
        }

        montarResultado(dados, 'Horários salvos com sucesso.');
    } catch (error) {
        montarResultado(dados, 'Não foi possível salvar no servidor. Verifique se o JSON Server está rodando.');
        console.error(error);
    }
}

async function carregarHorarios() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('JSON Server não respondeu.');
        }

        const dados = await response.json();

        campos.forEach(item => {
            const input = document.getElementById(item.id);
            if (input && dados[item.id]) {
                input.value = dados[item.id];
            }
        });

        montarResultado(dados, 'Horários carregados do JSON Server.');
    } catch (error) {
        resultadoElement.innerHTML = '<p class="info">Não foi possível conectar ao JSON Server. Inicie o servidor em <code>npm start</code>.</p>';
        console.error(error);
    }
}

function limparHorarios() {
    document.getElementById('agendaForm').reset();
    fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 1, ref1: '', ref2: '', ref3: '', exe1: '', exe2: '', exe3: '' })
    }).catch(() => {
        console.warn('Não foi possível limpar no JSON Server.');
    });

    resultadoElement.innerHTML = '<p>Agenda limpa. Preencha novos horários e clique em "Salvar Horários".</p>';
}

salvarBtn.addEventListener('click', salvarHorarios);
limparBtn.addEventListener('click', limparHorarios);
window.addEventListener('DOMContentLoaded', carregarHorarios);
