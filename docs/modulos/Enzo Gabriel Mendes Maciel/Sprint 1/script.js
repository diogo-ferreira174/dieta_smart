const STORAGE_KEY = 'biosmart:sprint1:perfil';

const defaultData = {
    user: {
        nome: 'Enzo Gabriel Mendes Maciel',
        email: 'enzo.maciel@email.com',
        idade: '19 anos',
        sexo: 'Masculino'
    },
    physical: {
        pesoAtual: '82.5 kg',
        altura: '1.78 m',
        imc: '26.0',
        classificacaoImc: 'Sobrepeso',
        condicaoFisicaGeral: 'Excelente saúde cardiovascular, sem lesões'
    },
    goals: {
        objetivo: 'Ganhar Massa Muscular',
        nivelAtividade: 'Moderadamente Ativo (Treino 3-5x/semana)',
        aguaDiaria: '2.9 Litros / dia',
        metaCalorias: '2.850 kcal / dia'
    },
    history: [
        {
            data: '24/05/2026 (Atual)',
            peso: '82.5 kg',
            evolucao: 'Atual',
            statusClass: 'stable'
        },
        {
            data: '10/04/2026',
            peso: '81.2 kg',
            evolucao: '+ 1.3 kg',
            statusClass: 'up'
        },
        {
            data: '05/03/2026',
            peso: '79.8 kg',
            evolucao: '+ 1.4 kg',
            statusClass: 'up'
        },
        {
            data: '15/01/2026',
            peso: '78.5 kg',
            evolucao: 'Início do plano',
            statusClass: 'start'
        }
    ]
};

function cloneDefaultData() {
    return JSON.parse(JSON.stringify(defaultData));
}

function readStoredData() {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        if (!rawData) {
            return null;
        }

        const parsedData = JSON.parse(rawData);
        if (!parsedData || typeof parsedData !== 'object') {
            return null;
        }

        return parsedData;
    } catch (error) {
        console.warn('Nao foi possivel ler os dados salvos do Sprint 1.', error);
        return null;
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function extractDataFromPage() {
    const infoValues = document.querySelectorAll('.card .info-value');
    const historyRows = document.querySelectorAll('.history-table tbody tr');

    return {
        user: {
            nome: infoValues[0]?.value ?? '',
            email: infoValues[1]?.value ?? '',
            idade: infoValues[2]?.value ?? '',
            sexo: infoValues[3]?.value ?? ''
        },
        physical: {
            pesoAtual: infoValues[4]?.value ?? '',
            altura: infoValues[5]?.value ?? '',
            imc: infoValues[6]?.value ?? '',
            classificacaoImc: infoValues[7]?.value ?? '',
            condicaoFisicaGeral: infoValues[8]?.value ?? ''
        },
        goals: {
            objetivo: infoValues[9]?.value ?? '',
            nivelAtividade: infoValues[10]?.value ?? '',
            aguaDiaria: infoValues[11]?.value ?? '',
            metaCalorias: infoValues[12]?.value ?? ''
        },
        history: Array.from(historyRows).map(row => {
            const cells = row.querySelectorAll('td');

            return {
                data: cells[0]?.textContent?.trim() ?? '',
                peso: cells[1]?.textContent?.trim() ?? '',
                evolucao: cells[2]?.textContent?.trim() ?? '',
                statusClass: cells[2]?.className ?? 'stable'
            };
        })
    };
}

function applyDataToPage(data) {
    const infoValues = document.querySelectorAll('.card .info-value');
    const historyBody = document.querySelector('.history-table tbody');

    const values = [
        data.user.nome,
        data.user.email,
        data.user.idade,
        data.user.sexo,
        data.physical.pesoAtual,
        data.physical.altura,
        data.physical.imc,
        data.physical.classificacaoImc,
        data.physical.condicaoFisicaGeral,
        data.goals.objetivo,
        data.goals.nivelAtividade,
        data.goals.aguaDiaria,
        data.goals.metaCalorias
    ];

    infoValues.forEach((input, index) => {
        if (values[index] !== undefined) {
            input.value = values[index];
        }
    });

    if (historyBody) {
        historyBody.innerHTML = data.history.map(item => `
            <tr>
                <td>${item.data}</td>
                <td>${item.peso}</td>
                <td class="${item.statusClass}">${item.evolucao}</td>
            </tr>
        `).join('');
    }
}

function initSprint1Persistence() {
    const storedData = readStoredData();
    const dataToUse = storedData ?? extractDataFromPage() ?? cloneDefaultData();

    applyDataToPage(dataToUse);
    saveData(dataToUse);

    window.BioSmartSprint1 = {
        storageKey: STORAGE_KEY,
        getData: () => readStoredData() ?? extractDataFromPage(),
        saveData,
        clearData: () => localStorage.removeItem(STORAGE_KEY)
    };
}

window.addEventListener('DOMContentLoaded', initSprint1Persistence);