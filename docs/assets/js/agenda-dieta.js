document.addEventListener('DOMContentLoaded', () => {
    const camposDieta = [
        { id: 'agendaRef1', label: 'Refeição 1' },
        { id: 'agendaRef2', label: 'Refeição 2' },
        { id: 'agendaRef3', label: 'Refeição 3' },
        { id: 'agendaRef4', label: 'Refeição 4' }
    ];
    const resultadoDieta = document.getElementById('resultadoDieta');
    const salvarBtn = document.getElementById('salvarDietaBtn');
    const limparBtn = document.getElementById('limparDietaBtn');

    function formatarHorario(valor) {
        return valor ? valor : 'Não definido';
    }

    function montarResultado(dados, mensagem) {
        const linhas = camposDieta.map(item => {
            return `<div><strong>${item.label}:</strong> ${formatarHorario(dados[item.id])}</div>`;
        }).join('');

        resultadoDieta.innerHTML = `
            <h3>Horários Registrados</h3>
            <p class="info">${mensagem}</p>
            <div class="resultado-grid">
                ${linhas}
            </div>
        `;
    }

    const API_URL = 'http://localhost:3000/agendaDieta/1';

    async function salvarHorarios() {
        const dados = { id: 1 };
        camposDieta.forEach(item => {
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
                throw new Error('Não foi possível salvar.');
            }

            montarResultado(dados, 'Horários de dieta salvos.');
        } catch (error) {
            resultadoDieta.innerHTML = '<p class="info">Erro ao salvar no servidor local. Verifique se o JSON Server está rodando em http://localhost:3000.</p>';
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
            camposDieta.forEach(item => {
                const input = document.getElementById(item.id);
                if (input && dados[item.id]) {
                    input.value = dados[item.id];
                }
            });

            montarResultado(dados, 'Horários de dieta carregados.');
        } catch (error) {
            resultadoDieta.innerHTML = '<p class="info">Não foi possível conectar ao servidor local. Inicie o JSON Server em http://localhost:3000.</p>';
            console.error(error);
        }
    }

    async function limparHorarios() {
        document.getElementById('agendaDietaForm')?.reset();
        try {
            await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: 1, agendaRef1: '', agendaRef2: '', agendaRef3: '', agendaRef4: '' })
            });
        } catch (error) {
            console.warn('Não foi possível limpar no servidor local.', error);
        }

        resultadoDieta.innerHTML = '<p>Agenda de dieta limpa. Preencha novos horários e clique em "Salvar Horários".</p>';
    }

    salvarBtn?.addEventListener('click', salvarHorarios);
    limparBtn?.addEventListener('click', limparHorarios);
    carregarHorarios();
});
