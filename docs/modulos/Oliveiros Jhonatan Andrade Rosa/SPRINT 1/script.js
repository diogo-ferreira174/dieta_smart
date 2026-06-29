async function carregarGrafico() {
    try {
        const resposta = await fetch('dados.json');
        const dados = await resposta.json();
        
        // Pega a primeira posição da lista [0] ou o objeto direto
        const usuario = Array.isArray(dados) ? dados[0] : dados; 
        
        if (usuario) {
            const metaGet = usuario.get; 
            const consumido = usuario.calorias_consumidas || 1721.87;
            
            // Injeta os dados de texto principais
            document.getElementById('titulo-grafico').innerText = `Calorias Diárias - ${usuario.nome}`;
            document.getElementById('valor-consumidas').innerText = `${consumido} kcal`;
            document.getElementById('valor-queimadas').innerText = `${metaGet} kcal`;

            // Calcula a porcentagem real (ex: 50%)
            const porcentagemReal = (consumido / metaGet) * 100;
            
            // Arredonda o valor para não ficar com muitas casas decimais na tela (ex: 50.33% vira 50%)
            const porcentagemArredondada = Math.round(porcentagemReal);

            // Injeta o texto da porcentagem no meio da barra verde
            document.getElementById('porcentagem-consumidas').innerText = `${porcentagemArredondada}%`;

            // Limita visualmente a barra em 100% se o usuário estourar a meta de comida
            let larguraBarraVerde = porcentagemReal;
            if (larguraBarraVerde > 100) {
                larguraBarraVerde = 100;
            }

            // Aplica o movimento das barras com animação
            setTimeout(() => {
                document.getElementById('barra-consumidas').style.width = `${larguraBarraVerde}%`;
                document.getElementById('barra-queimadas').style.width = '100%';
            }, 200);
        }
    } catch (erro) {
        console.error("Erro crítico ao carregar ou processar o gráfico:", erro);
    }
}

window.onload = carregarGrafico;