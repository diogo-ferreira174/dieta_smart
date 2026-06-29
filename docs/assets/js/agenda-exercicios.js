document.addEventListener('DOMContentLoaded', () => {
    const camposExercicios = [
        { id: 'agendaExe1', label: 'Exercício 1' },
        { id: 'agendaExe2', label: 'Exercício 2' },
        { id: 'agendaExe3', label: 'Exercício 3' },
        { id: 'agendaExe4', label: 'Exercício 4' },
        { id: 'agendaExe5', label: 'Exercício 5' }
    ];
    const resultadoExercicios = document.getElementById('resultadoExercicios');
    const salvarBtn = document.getElementById('salvarExerciciosBtn');
    const limparBtn = document.getElementById('limparExerciciosBtn');

    function formatarHorario(valor) {
        return valor ? valor : 'Não definido';
    }

    function montarResultado(dados, mensagem) {
        const linhas = camposExercicios.map(item => {
            return `<div><strong>${item.label}:</strong> ${formatarHorario(dados[item.id])}</div>`;
        }).join('');

        resultadoExercicios.innerHTML = `
            <h3>Horários Registrados</h3>
            <p class="info">${mensagem}</p>
            <div class="resultado-grid">
                ${linhas}
            </div>
        `;
    }

    const API_URL = 'http://localhost:3000/agendaExercicios/1';

    async function salvarHorarios() {
        const dados = { id: 1 };
        camposExercicios.forEach(item => {
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

            montarResultado(dados, 'Horários de exercícios salvos.');
        } catch (error) {
            resultadoExercicios.innerHTML = '<p class="info">Erro ao salvar no servidor local. Inicie o JSON Server em http://localhost:3000.</p>';
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
            camposExercicios.forEach(item => {
                const input = document.getElementById(item.id);
                if (input && dados[item.id]) {
                    input.value = dados[item.id];
                }
            });

            montarResultado(dados, 'Horários de exercícios carregados.');
        } catch (error) {
            resultadoExercicios.innerHTML = '<p class="info">Não foi possível conectar ao servidor local. Inicie o JSON Server em http://localhost:3000.</p>';
            console.error(error);
        }
    }

    async function limparHorarios() {
        document.getElementById('agendaExerciciosForm')?.reset();
        try {
            const payload = { id: 1 };
            camposExercicios.forEach(item => {
                payload[item.id] = '';
            });

            await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.warn('Não foi possível limpar no servidor local.', error);
        }

        resultadoExercicios.innerHTML = '<p>Agenda de exercícios limpa. Preencha novos horários e clique em "Salvar Horários".</p>';
    }

    salvarBtn?.addEventListener('click', salvarHorarios);
    limparBtn?.addEventListener('click', limparHorarios);
    carregarHorarios();
});
