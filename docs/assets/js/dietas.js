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



async function carregarDbLocal() {
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


let total = 0
let listaRefeicoesEscolhidas = []
let contEscolhas = 0
const prog = document.getElementById("DTprogressao");
prog.style.width = 0 + "%";

async function selecionar(tipo, indice){
    try {
        const dados = await carregarDbLocal()

        if(dados && Array.isArray(dados.refeicoes)) 
        {
            const refeicoes1 = dados.refeicoes
            let lista = [];

            if(tipo == "cafe"){
                lista = refeicoes1.filter(refeicao =>
                    refeicao.id == 1111 ||
                    refeicao.id == 1113 ||
                    refeicao.id == 1117 ||
                    refeicao.id == 1120 ||
                    refeicao.id == 1129 ||
                    refeicao.id == 1130
                );
            }
            else if(tipo == "lanche"){
                lista = refeicoes1.filter(refeicao =>
                    refeicao.id == 1119 ||
                    refeicao.id == 1122 ||
                    refeicao.id == 1128 ||
                    refeicao.id == 1113 ||
                    refeicao.id == 1117
                );
            }
            else{
                lista = refeicoes1.filter(refeicao =>
                    refeicao.id == 1112 ||
                    refeicao.id == 1114 ||
                    refeicao.id == 1116 ||
                    refeicao.id == 1118 ||
                    refeicao.id == 1121 ||
                    refeicao.id == 1123 ||
                    refeicao.id == 1124 ||
                    refeicao.id == 1125 ||
                    refeicao.id == 1126 ||
                    refeicao.id == 1127
                );
            }

            let texto = "";
            lista.forEach((item, index) => {
                texto += `${index + 1} - ${item.nome} (${item.calorias} kcal)\n`;
            });

            console.log(indice)

            let escolha = prompt(texto);
            let refeicaoEscolhida = lista[escolha - 1];
            calcularTotal()

            listaRefeicoesEscolhidas[indice] = refeicaoEscolhida
            console.log(listaRefeicoesEscolhidas)

            if(refeicaoEscolhida){
                document.getElementById(tipo).innerHTML = `
                    <strong>${refeicaoEscolhida.nome}</strong>
                    <br>
                    ${refeicaoEscolhida.calorias} kcal
                `;
            }

            document.getElementById(`areaCheckbox${indice}`).innerHTML = `
                <input type="checkbox" id="checkbox${indice}"> <br>
                <label for="checkbox${indice}">Marcar como concluído</label>
            `

            function confereMarcados() {
                let todosMarcados = true
                for(let i = 0; i < listaRefeicoesEscolhidas.length; i++)
                {
                    if(listaRefeicoesEscolhidas[i] == undefined)
                    {
                        todosMarcados = false
                        break
                    }
                }
                if(listaRefeicoesEscolhidas.length != 4)
                    todosMarcados = false
                return todosMarcados
            }

            let check = document.getElementById(`checkbox${indice}`);
            check.addEventListener("change", () => {
                calcularTotal()

                if (!confereMarcados())
                {
                    alert('Escolha todas as refeições antes de marcar alguma como concluída')
                    check.checked = false
                }
                else if (check.checked)
                    prog.style.width = ((parseFloat(prog.style.width) || 0) + ((listaRefeicoesEscolhidas[indice].calorias / total)*100)) + "%";
                else if (((parseFloat(prog.style.width) || 0) - ((listaRefeicoesEscolhidas[indice].calorias / total)*100)) > 0)
                    prog.style.width = ((parseFloat(prog.style.width) || 0) - ((listaRefeicoesEscolhidas[indice].calorias / total)*100)) + "%";
                else
                    prog.style.width = 0 + "%";

                document.getElementById('porcentagem').innerHTML = `${parseFloat(prog.style.width).toFixed(2)}%`
            })

            document.getElementById('porcentagem').innerHTML = `${parseFloat(prog.style.width).toFixed(2)}%`
        }
        else 
        {
            alert('Algo deu errado com o carregamento dos dados')
        }
    }
    catch(erro) {
        console.error("Algo deu errado: ", erro)
    }
}

function calcularTotal(){
    total = listaRefeicoesEscolhidas.reduce((soma, refeicao) => {
        return soma + refeicao.calorias;
    }, 0)
    document.getElementById("totalCalorias").innerHTML = total + " kcal";
}

function criarCheckboxComEvento(indice) {
    document.getElementById(`areaCheckbox${indice}`).innerHTML = `
        <input type="checkbox" id="checkbox${indice}"> <br>
        <label for="checkbox${indice}">Marcar como concluído</label>
    `;

    const check = document.getElementById(`checkbox${indice}`);
    if (!check) return;

    check.addEventListener('change', () => {
        calcularTotal();

        const todosMarcados = listaRefeicoesEscolhidas.length === 4 && listaRefeicoesEscolhidas.every(item => item !== undefined && item !== null);
        const prog = document.getElementById('DTprogressao');

        if (!todosMarcados) {
            alert('Escolha todas as refeições antes de marcar alguma como concluída');
            check.checked = false;
            return;
        }

        if (check.checked) {
            prog.style.width = ((parseFloat(prog.style.width) || 0) + ((listaRefeicoesEscolhidas[indice].calorias / total) * 100)) + '%';
        } else if ((parseFloat(prog.style.width) || 0) - ((listaRefeicoesEscolhidas[indice].calorias / total) * 100) > 0) {
            prog.style.width = ((parseFloat(prog.style.width) || 0) - ((listaRefeicoesEscolhidas[indice].calorias / total) * 100)) + '%';
        } else {
            prog.style.width = '0%';
        }

        document.getElementById('porcentagem').textContent = `${parseFloat(prog.style.width).toFixed(2)}%`;
    });
}

function selecionarPlanoPredefinido(item, refeicoes) {
    const nomesChaves = ['cafe', 'almoco', 'lanche', 'janta'];
    listaRefeicoesEscolhidas = item.refeicoes.map(id => refeicoes.find(ref => String(ref.id) === String(id)) || null);
    total = item.calorias;

    listaRefeicoesEscolhidas.forEach((refeicao, index) => {
        const tipo = nomesChaves[index];
        if (refeicao) {
            document.getElementById(tipo).innerHTML = `
                <strong>${refeicao.nome}</strong><br>${refeicao.calorias} kcal
            `;
            criarCheckboxComEvento(index);
        }
    });

    document.getElementById('totalCalorias').textContent = total + ' kcal';
    document.getElementById('porcentagem').textContent = '0.00%';
    document.getElementById('DTprogressao').style.width = '0%';
}

function preparaCRUD() {
    document.getElementById('btnEnviaDieta').addEventListener('click', async() => {
        for(let i = 0; i < 4; i++)
        {
            if(!listaRefeicoesEscolhidas[i])
            {
                alert('Escolha todas as refeições antes de cadastrar a dieta')
                return
            }
        }

        let dietaMontada = listaRefeicoesEscolhidas.map(item => item.id)

        const dados = {
            "refeicoes": dietaMontada,
            "calorias": total
        }

        const resposta = await fetch('http://localhost:3000/dietas', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(dados)
        })

        // ✅ SALVA O ID DA DIETA NA SESSÃO PARA A ROTINA USAR
        if (resposta.ok) {
            const dietaSalva = await resposta.json();
            sessionStorage.setItem('dietaIdAtual', dietaSalva.id);
            alert('Dieta cadastrada com sucesso!');
        }
    })

    async function pegaIDs(refeicao) {
        const dados = await fetch('http://localhost:3000/refeicoes')
        if(!dados.ok) {
            alert('Algo deu errado com o carregamento de dados')
            return null
        }
        const refeicoes = await dados.json()
        let refeicaoDesejada = refeicoes.find(prato => prato.id == refeicao)
        return refeicaoDesejada
    }

    document.getElementById('btnMostraDietas').addEventListener('click', async () => {
        const resposta = await fetch('http://localhost:3000/dietas')
        const dietas = await resposta.json()

        const refeicoesResposta = await fetch('http://localhost:3000/refeicoes')
        const refeicoes = await refeicoesResposta.json()

        const uniqueDietas = []
        const seen = new Set()

        dietas.forEach(item => {
            const key = [...item.refeicoes].map(String).sort().join('|') + '|' + item.calorias
            if (!seen.has(key)) {
                seen.add(key)
                uniqueDietas.push(item)
            }
        })

        document.getElementById('telaInicialDietas').style.display = 'none'
        document.getElementById('DTprogressao').style.width = "0%"

        const areaTela = document.getElementById('areaDietas')
        areaTela.innerHTML = '<h3>Dietas cadastradas</h3>'

        uniqueDietas.forEach((item, index) => {
            const card = document.createElement('div')
            card.className = 'dieta'
            const refeicoesUnicas = [...new Set(item.refeicoes.map(String))]
            const nomes = refeicoesUnicas.map(id => {
                const pratoDaDieta = refeicoes.find(ref => String(ref.id) === String(id))
                return pratoDaDieta ? pratoDaDieta.nome : 'Refeição não encontrada'
            }).join(' • ')

            card.innerHTML = `<h5>Plano ${index + 1} - ${item.calorias} kcal</h5><p>${nomes}</p>`

            card.addEventListener('click', async () => {
                areaTela.innerHTML = ''
                document.getElementById('telaInicialDietas').style.display = 'block'

                for(let i = 0; i < item.refeicoes.length; i++)
                {
                    listaRefeicoesEscolhidas[i] = await pegaIDs(item.refeicoes[i])
                    total = item.calorias
                }

                document.getElementById('cafe').innerHTML = `
                    <strong>${listaRefeicoesEscolhidas[0].nome}</strong>
                    <br>${listaRefeicoesEscolhidas[0].calorias} kcal`
                document.getElementById('almoco').innerHTML = `
                    <strong>${listaRefeicoesEscolhidas[1].nome}</strong>
                    <br>${listaRefeicoesEscolhidas[1].calorias} kcal`
                document.getElementById('lanche').innerHTML = `
                    <strong>${listaRefeicoesEscolhidas[2].nome}</strong>
                    <br>${listaRefeicoesEscolhidas[2].calorias} kcal`
                document.getElementById('janta').innerHTML = `
                    <strong>${listaRefeicoesEscolhidas[3].nome}</strong>
                    <br>${listaRefeicoesEscolhidas[3].calorias} kcal`

                for(let z = 0; z < 4; z++) {
                    criarCheckboxComEvento(z)
                }

                // ✅ SALVA O ID DA DIETA SELECIONADA NA SESSÃO PARA A ROTINA USAR
                sessionStorage.setItem('dietaIdAtual', item.id);

                document.getElementById('totalCalorias').innerHTML = total + ' kcal'
                document.getElementById('porcentagem').innerHTML = '0.00%'
            })

            areaTela.appendChild(card)
        })
    })
}