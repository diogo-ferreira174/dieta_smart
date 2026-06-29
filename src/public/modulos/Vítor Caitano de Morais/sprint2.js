//Lembre-se de ativar o json-server pelo terminal do computador. Abra o terminal, entre na pasta com os arquivos com o comando cd, e insira o comando "npx json-server db.json". Não feche o terminal até o fim da avaliação.

carregaSeletores = () => {

    fetch('http://localhost:3000/exercicios')
        .then(resposta => resposta.json())
        .then(lista => {
            const tela = document.getElementById('areaSeletores')
            const todasOpcoes = lista.map(exercicio => {
                return `<option value="${exercicio.tipo}">${exercicio.tipo}</option>`
            }).join('');

            tela.innerHTML = ''
            for(i = 0; i < quantidade; i++)
            {
                let conteudo=''

                conteudo += `
                    <div class="seletor" id="${i+1}">
                        <h3>Escolha o exercício ${i+1}</h3>
                        <br>
                        <select id="escolha${i+1}">
                            ${todasOpcoes}
                        </select>
                        <br>
                        <div id="infoExercicio${i+1}">
                        </div>
                    </div>
                `
                tela.innerHTML += conteudo
                
            }
            const listaExercicios = lista;
            return listaExercicios;               
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
                        <br>
                        <div class="barra">
                            <div id="preenchimento${i+1}" class="preenchimento"></div>
                        </div>
                        <div id="porcentagem${i+1}">
                        </div>
                    `
                    
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
                    document.getElementById('soma').innerHTML = `Total de Calorias da dieta = ${somaEscolhidos}`
                })
            } 
        })
}

const btnComeco = document.getElementById('comeco')
btnComeco.addEventListener('click', () => {
    carregaSeletores()
})

let quantidade = 0;
let escolhidos = [];
let somaEscolhidos = 0;
let exerciciosRotina = ''
let idRotina = null

document.getElementById('qtdExercicios').addEventListener('input', () => {
    quantidade = parseInt(document.getElementById('qtdExercicios').value);
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

document.getElementById('modificar').addEventListener('click', () => {
    fetch('http://localhost:3000/rotina')
    .then(resposta => resposta.json())
    .then(rotinas => {
        console.log(`${rotinas.length}`)
        const somaTela = document.getElementById('soma')
        somaTela.innerHTML = ''

        let exerciciosRotina = ''
        for(let i = 0; i < rotinas.length; i++)
        {
            exerciciosRotina += `
                <div class="rotina" id="rotina${i+1}">
                    <h5>Rotina ${i+1}</h5>
                    ${rotinas[i].exercicios.map(item => `<p>${item.tipo}</p>`).join('')}
                    <button id="excluir${i+1}">Excluir rotina</button>
                    <button id="atualizar${i+1}">Modificar rotina</button>
                    <br><br>
                </div>
            `
        }

        const tela = document.getElementById('areaSeletores')
        tela.innerHTML = ''
        tela.innerHTML = exerciciosRotina
        
        for(let i = 0; i < rotinas.length; i++)
        {
            document.getElementById(`excluir${i+1}`).addEventListener('click', () => {
                fetch(`http://localhost:3000/rotina/${rotinas[i].id}`, {
                    method: 'DELETE'
                })
                .then(resposta => {
                    if(resposta.ok)
                    {
                        alert('rotina deletada com sucesso!')
                    }
                    else
                    {
                        console.error('Erro na operação de delete')
                    }
                    window.location.reload()
                })
                .catch(erro => {
                    console.error('Erro na operação de delete')
                })
            })

            document.getElementById(`atualizar${i+1}`).addEventListener('click', () => {
                idRotina = rotinas[i].id
                quantidade = rotinas[i].exercicios.length
                escolhidos = rotinas[i].exercicios
                somaEscolhidos = rotinas[i].calorias

                carregaSeletores()

                document.getElementById('soma').innerHTML = `Total de Calorias da dieta ${i} = ${somaEscolhidos}`;
            })
        }
    })
})
