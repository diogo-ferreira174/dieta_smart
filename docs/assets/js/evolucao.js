document.getElementById('iconMenu').addEventListener('click', (event) => {
    document.getElementById('menuLateral').style.display = 'block';
    event.stopPropagation();
})

document.addEventListener('click', (event) => {
    if(!document.getElementById('menuLateral').contains(event.target) && document.getElementById('menuLateral').style.display == 'block')
    {
        document.getElementById('menuLateral').style.display = 'none'
    }
})

async function fetchUltimoRegistro(url) {
    const resposta = await fetch(url);
    if (!resposta.ok) {
        throw new Error(`Falha ao carregar ${url}`);
    }
    const lista = await resposta.json();
    if (!Array.isArray(lista) || lista.length === 0) {
        return null;
    }
    return lista[lista.length - 1];
}

async function carregarGrafico() {
    try {
        const idProcurado = localStorage.getItem('idProcurado');
        let usuario = null;

        if (idProcurado) {
            const resposta = await fetch(`http://localhost:3000/usuarios/${idProcurado}`);
            if (resposta.ok) {
                usuario = await resposta.json();
            }
        }

        const ultimaDieta = await fetchUltimoRegistro('http://localhost:3000/dietas');
        const ultimaRotina = await fetchUltimoRegistro('http://localhost:3000/rotina');

        const consumido = ultimaDieta?.calorias ?? 0;
        const queimadas = ultimaRotina?.calorias ?? 0;
        const titulo = usuario?.nome ? `Calorias Diárias - ${usuario.nome}` : 'Relação de Calorias';

        document.getElementById('valor-consumidas').innerText = `${consumido} kcal`;
        document.getElementById('valor-queimadas').innerText = `${queimadas} kcal`;

        // A barra com o MAIOR valor entre consumidas e queimadas vira a referência (100%).
        // A outra barra é calculada proporcionalmente a essa referência.
        const valorMaior = Math.max(consumido, queimadas);

        const porcentagemConsumidas = valorMaior ? (consumido / valorMaior) * 100 : 0;
        const porcentagemQueimadas = valorMaior ? (queimadas / valorMaior) * 100 : 0;

        document.getElementById('porcentagem-consumidas').innerText = `${Math.round(porcentagemConsumidas)}%`;
        document.getElementById('porcentagem-queimadas').innerText = `${Math.round(porcentagemQueimadas)}%`;

        setTimeout(() => {
            document.getElementById('barra-consumidas').style.width = `${porcentagemConsumidas}%`;
            document.getElementById('barra-queimadas').style.width = `${porcentagemQueimadas}%`;
        }, 200);

    } catch (erro) {
        console.error('Erro crítico ao carregar ou processar o gráfico:', erro);
        document.getElementById('titulo-grafico').innerText = 'Erro ao carregar dados';
    }
}

window.onload = carregarGrafico;