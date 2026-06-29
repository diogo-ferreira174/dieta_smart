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



async function carregarDb() {
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

async function obterExercicios() {
    try {
        const resposta = await fetch('http://localhost:3000/exercicios');
        if (resposta.ok) {
            return await resposta.json();
        }
    } catch (erro) {
        // fallback para db.json local
    }

    const dados = await carregarDb();
    return Array.isArray(dados.exercicios) ? dados.exercicios : [];
}

async function obterRotinas() {
    try {
        const resposta = await fetch('http://localhost:3000/rotina');
        if (resposta.ok) {
            return await resposta.json();
        }
    } catch (erro) {
        // fallback para db.json local
    }

    const dados = await carregarDb();
    return Array.isArray(dados.rotina) ? dados.rotina : [];
}

carregaSeletores = () => {

    document.getElementById('soma').innerHTML = '';
    return obterExercicios()
        .then(lista => {
            const tela = document.getElementById('areaSeletores')
            const todasOpcoes = lista.map(exercicio => {
                return `<option value="${exercicio.tipo}">${exercicio.tipo}</option>`
            }).join('');

            let conteudo = ''
            tela.innerHTML = ''
            for(let i = 0; i < quantidade; i++)
            {
                conteudo += `
                    <div class="seletor" id="${i+1}">
                        <h3>Exercício ${i+1}</h3>
                        <select id="escolha${i+1}">
                            ${todasOpcoes}
                        </select>
                        <div id="infoExercicio${i+1}">
                        </div>
                        <div class="marcador" id="marcador${i+1}">
                        </div>
                    </div>
                `                        
            }
            if(!isNaN(quantidade))
                conteudo += '<div class="barra"><div id="EXprogressao" style="width: 0%;"></div></div>'
            
            tela.innerHTML = conteudo
            return lista;               
        })
        .then(lista => {
            escolhidos = [];
            for(let i = 0; i < quantidade; i++)
            {
                const selecionado = document.getElementById(`escolha${i+1}`);
                selecionado.addEventListener('change', () => {

                    let itemEncontrado = lista.find(item => item.tipo == selecionado.value)

                    escolhidos[i] = itemEncontrado

                    somaEscolhidos = escolhidos.reduce((soma, item) => soma + (item?.calorias || 0), 0)
                    console.log(`${somaEscolhidos}`)

                    document.getElementById(`infoExercicio${i+1}`).innerHTML = `
                        <h4>${itemEncontrado.tipo} (${itemEncontrado.tempo} minutos)</h4>
                        <p>${itemEncontrado.calorias} calorias</p>
                        <div class="barra">
                            <div id="preenchimento${i+1}" class="preenchimento"></div>
                        </div>
                        <div id="porcentagem${i+1}">
                        </div>
                    `

                    let todosEscolhidos = true;
                    for(let f = 0; f < quantidade; f++)
                    {
                        if(!escolhidos[f])
                        {
                            todosEscolhidos = false
                            break
                        }
                    }

                    for(let a = 0; a < quantidade; a++)
                    {
                        document.getElementById(`marcador${a+1}`).innerHTML = `
                            <input type="checkbox" id="1${a}">
                            <label for="1${a}">Marcar como concluído</label>
                        `;

                        const prog = document.getElementById('EXprogressao')
                        const check2 = document.getElementById(`1${a}`)
                        check2.addEventListener('change', () => {
                            if (!todosEscolhidos)
                            {
                                alert('Escolha todos os exercicios antes de concluir um')
                                check2.checked = false
                            }
                            else if (check2.checked)
                                prog.style.width = ((parseFloat(prog.style.width) || 0) + ((escolhidos[a].calorias / somaEscolhidos) * 100)) + "%";
                            else if ((parseFloat(prog.style.width) || 0) - ((escolhidos[a].calorias / somaEscolhidos) * 100) > 0)
                                prog.style.width = ((parseFloat(prog.style.width) || 0) - ((escolhidos[a].calorias / somaEscolhidos) * 100)) + "%";
                            else
                                prog.style.width = 0 + "%";
                        })
                    }
                
                    for(let j = 0; j < quantidade; j++)
                    {
                        if(escolhidos[j])
                        {
                            document.getElementById(`preenchimento${j+1}`).style.width = ((escolhidos[j].calorias / somaEscolhidos) * 100) + "%";

                            document.getElementById(`porcentagem${j+1}`).innerHTML = `
                                <p>${((escolhidos[j].calorias / somaEscolhidos) * 100).toFixed(2)}% das calorias queimadas pela sua rotina atual.</p>`
                        }
                    }
                    console.log(`${escolhidos.length}`)
                    document.getElementById('soma').innerHTML = `Total de Calorias da rotina = ${somaEscolhidos}`
                })
            } 
        })
}


let quantidade = 0;
let escolhidos = [];
let somaEscolhidos = 0;
let exerciciosRotina = ''
let idRotina = null

const carregamento = document.getElementById('qtdExercicios')
carregamento.addEventListener('input', () => {
    quantidade = parseInt(carregamento.value);
    carregaSeletores()
})


document.getElementById('cadastro').addEventListener('click', () => {
    const novaRotina = {
        exercicios: escolhidos.filter(item => item !== undefined),
        calorias: somaEscolhidos
    };

    let url = 'http://localhost:3000/rotina'
    let metodo = 'POST'

    if(idRotina !== null)
    {
        url = `http://localhost:3000/rotina/${idRotina}`
        metodo = 'PUT'
    }

    fetch(url, {
        method: metodo,
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaRotina)
    })
    .then(resposta => resposta.json())
    .then(dadosSalvos => {
        // ✅ SALVA O ID DA ROTINA NA SESSÃO PARA A ROTINA USAR
        sessionStorage.setItem('rotinaIdAtual', dadosSalvos.id);

        if(idRotina !== null)
        {
            alert('Rotina atualizada com sucesso');
        }
        else
        {
            alert('Rotina concluída com sucesso')
        }
        window.location.reload()
        idRotina = null
    })
    .catch(erro => {
        console.error('Erro na conclusão da rotina');
    })
})

function getTipoExercicio(item) {
    if (!item) return '';
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    return item.tipo || item.tipo_ejercicio || '';
}

function renderizarRotinasCadastradas(rotinas) {
    const tela = document.getElementById('areaSeletores');
    tela.innerHTML = '<h3>Rotinas cadastradas</h3>';
    document.getElementById('soma').innerHTML = '';

    if (!Array.isArray(rotinas) || rotinas.length === 0) {
        tela.innerHTML += '<p>Nenhuma rotina cadastrada.</p>';
        return;
    }

    const uniqueRotinas = [];
    const seen = new Set();

    rotinas.forEach(rotina => {
        const tipos = Array.isArray(rotina.exercicios)
            ? rotina.exercicios.map(item => String(item.tipo || item.id || '')).filter(Boolean)
            : [];
        const key = tipos.slice().sort().join('|') + '|' + rotina.calorias;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueRotinas.push(rotina);
        }
    });

    if (uniqueRotinas.length === 0) {
        tela.innerHTML += '<p>Nenhuma rotina cadastrada única encontrada.</p>';
        return;
    }

    uniqueRotinas.forEach((rotina, index) => {
        const tipos = Array.isArray(rotina.exercicios)
            ? rotina.exercicios.map(item => String(item.tipo || item.id || '')).filter(Boolean)
            : [];
        const nomes = [...new Set(tipos)].join(' • ');

        const card = document.createElement('div');
        card.className = 'rotina';
        card.style.cursor = 'pointer';
        card.innerHTML = `<h5>Rotina ${index + 1} - ${rotina.calorias} kcal</h5><p>${nomes || 'Sem exercícios'}</p>`;

        card.addEventListener('click', async () => {
            // ✅ SALVA O ID DA ROTINA SELECIONADA NA SESSÃO
            sessionStorage.setItem('rotinaIdAtual', rotina.id);
            tela.innerHTML = '';
            await carregarRotinaParaEdicao(rotina, index + 1);
        });

        tela.appendChild(card);
    });
}

document.getElementById('modificar').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const rotinas = await obterRotinas();
        renderizarRotinasCadastradas(rotinas);
    } catch (erro) {
        console.error('Erro ao carregar rotinas cadastradas:', erro);
        const tela = document.getElementById('areaSeletores');
        tela.innerHTML = '<h3>Rotinas cadastradas</h3><p>Erro ao carregar rotinas cadastradas.</p>';
    }
});

async function carregarRotinaParaEdicao(rotina, numero) {
    if (!rotina || !Array.isArray(rotina.exercicios)) return;

    quantidade = rotina.exercicios.length;
    somaEscolhidos = rotina.calorias || 0;
    idRotina = rotina.id || null;

    document.getElementById('qtdExercicios').value = quantidade;
    await carregaSeletores();

    escolhidos = rotina.exercicios.map(item => item);
    document.getElementById('soma').innerHTML = `Total de Calorias da rotina ${numero} = ${somaEscolhidos}`;

    for (let d = 0; d < quantidade; d++) {
        const escolha = document.getElementById(`escolha${d+1}`);
        if (!escolha || !escolhidos[d]) continue;
        const tipo = String(escolhidos[d].tipo || escolhidos[d].id || '');
        escolha.value = tipo;
        escolha.dispatchEvent(new Event('change'));
    }
}