const db = {
    "usuarios": [
        { "id": "1", "nome": "José", "pesagens": [{"data": "01.12.2025", "peso": 64.4}, {"data": "10.03.2026", "peso": 67.5}] },
        { "id": "2", "nome": "Samara", "pesagens": [{"data": "22.11.2025", "peso": 73.1}, {"data": "10.12.2025", "peso": 70.5}, {"data": "02.02.2026", "peso": 69.3}] },
        { "id": "3", "nome": "Carlos", "pesagens": [{"data": "09.10.2025", "peso": 70.1}, {"data": "10.12.2025", "peso": 74.2}, {"data": "02.01.2026", "peso": 76.7}, {"data": "04.04.2026", "peso": 79.0}, {"data": "14.06.2026", "peso": 82.5}] },
        { "id": "4", "nome": "Fernanda", "pesagens": [{"data": "07.04.2026", "peso": 56.4}, {"data": "01.06.2026", "peso": 58.2}] },
        { "id": "5", "nome": "Lucas", "pesagens": [{"data": "10.11.2025", "peso": 70.1}, {"data": "21.01.2026", "peso": 71.9}, {"data": "12.04.2026", "peso": 74.1}] },
        { "id": "6", "nome": "Juliana", "pesagens": [{"data": "02.11.2025", "peso": 69.2}, {"data": "09.01.2026", "peso": 66.5}, {"data": "16.03.2026", "peso": 62.0}, {"data": "03.05.2026", "peso": 63.7}] },
        { "id": "7", "nome": "Rafael", "pesagens": [{"data": "19.12.2025", "peso": 81.4}, {"data": "18.03.2026", "peso": 86.2}, {"data": "02.06.2026", "peso": 90.4}] },
        { "id": "8", "nome": "Amanda", "pesagens": [{"data": "09.04.2026", "peso": 51.0}, {"data": "29.05.2026", "peso": 54.8}] },
        { "id": "9", "nome": "Bruno", "pesagens": [{"data": "10.12.2025", "peso": 90.8}, {"data": "13.03.2026", "peso": 98.9}, {"data": "02.05.2026", "peso": 96.2}] },
        { "id": "10", "nome": "Patrícia", "pesagens": [{"data": "14.12.2025", "peso": 69.1}, {"data": "09.03.2026", "peso": 73.3}, {"data": "25.05.2026", "peso": 71.5}] }
    ]
};

const ctx = document.getElementById('graficolinha');

const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Peso (kg)',
            data: [],
            borderWidth: 2,
            tension: 0.2
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Data'
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Peso (kg)'
                }
            }
        }
    }
});

const selectUsuario = document.getElementById('usuario');

db.usuarios.forEach(function(usuario) {
    const option = document.createElement('option');
    option.value = usuario.id;
    option.textContent = usuario.nome;
    selectUsuario.appendChild(option);
});

selectUsuario.value = '3';
atualizarGrafico();

selectUsuario.addEventListener('change', atualizarGrafico);

document
    .getElementById('atualizar')
    .addEventListener('click', atualizarGrafico);

function parsarData(dataStr) {
    const partes = dataStr.split('.');
    return new Date(partes[2], partes[1] - 1, partes[0]);
}

function atualizarGrafico() {
    const idSelecionado = selectUsuario.value;
    const usuario = db.usuarios.find(function(u) { return u.id === idSelecionado; });

    if (!usuario) return;

    const pesagens = usuario.pesagens.slice();

    pesagens.sort(function(a, b) { return parsarData(a.data) - parsarData(b.data); });

    const datas = pesagens.map(function(item) {
        return parsarData(item.data).toLocaleDateString('pt-BR');
    });

    const pesos = pesagens.map(function(item) { return item.peso; });

    grafico.data.labels = datas;
    grafico.data.datasets[0].data = pesos;
    grafico.data.datasets[0].label = 'Peso de ' + usuario.nome + ' (kg)';

    grafico.update();

    const info = document.getElementById('pesagens-info');
    info.innerHTML = pesagens.map(function(item) {
        return '<span>' + item.data + ' — ' + item.peso + ' kg</span>';
    }).join('');
}