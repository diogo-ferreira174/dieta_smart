const API = "http://localhost:3000/usuarios";
let usuarioAtual = null;
let listaUsuarios = [];
let grafico = null;

window.onload = () => {
    listarUsuarios();
    document.getElementById("formUsuario").addEventListener("submit", salvarUsuario);
    document.getElementById("pesquisa").addEventListener("input", filtrarUsuarios);
};

// Listando e salvando usuários
async function listarUsuarios() {
    try {
        const resposta = await fetch(API);
        listaUsuarios = await resposta.json();
        montarTabela(listaUsuarios);
        atualizarDashboard(listaUsuarios);
        atualizarGrafico(listaUsuarios);
    }
    catch (erro) {
        console.error("Erro ao listar usuários:", erro);
    }
}
async function salvarUsuario(event) {
    event.preventDefault();
    const usuario = {
        nome: document.getElementById("nome").value,
        idade: Number(document.getElementById("idade").value),
        peso: Number(document.getElementById("peso").value),
        altura: Number(document.getElementById("altura").value),
        sexo: document.getElementById("sexo").value
    };
    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body:
                JSON.stringify(usuario)
        });
        document.getElementById("formUsuario").reset();
        await listarUsuarios();
    }
    catch (erro) {
        console.error("Erro ao salvar usuário:", erro);
    }
}

// Função para excluir usuário 
async function excluirUsuario(id) {
    if (!confirm("Deseja realmente excluir este usuário?")) {
        return;
    }
    try {
        const resposta = await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );
        if (!resposta.ok) {
            throw new Error("Falha ao excluir usuário");
        }
        await listarUsuarios();
    }
    catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        alert("Não foi possível excluir o usuário.");
    }
}

// Função para criar a tabela 
function montarTabela(usuarios) {
    const tabela = document.getElementById("tabelaUsuarios");
    tabela.innerHTML = "";
    usuarios.forEach(usuario => {
        tabela.innerHTML += `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.idade}</td>
                <td>${usuario.peso} kg</td>
                <td>
                    <button
                        onclick='buscarUsuarioTabela("${usuario.nome}")'>
                        Selecionar
                    </button>
                    <button
                        onclick='excluirUsuario("${usuario.id}")'>
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}
// Filtro de usuário 
function filtrarUsuarios() {
    const texto = document.getElementById("pesquisa").value.toLowerCase().trim();
    const resultado = listaUsuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(texto) || usuario.idade.toString().includes(texto) || usuario.peso.toString().includes(texto));
    montarTabela(resultado);
}

function atualizarDashboard(usuarios) {
    const total = usuarios.length;
    let somaPesos = 0;
    let somaIdades = 0;
    usuarios.forEach(usuario => {
        somaPesos += usuario.peso;
        somaIdades += usuario.idade;
    });
    const pesoMedio = total > 0 ? (somaPesos / total).toFixed(1) : 0;
    const idadeMedia = total > 0 ? (somaIdades / total).toFixed(1) : 0;
    document.getElementById("totalUsuarios").innerHTML = total;
    document.getElementById("pesoMedio").innerHTML = pesoMedio + " kg";
    document.getElementById("idadeMedia").innerHTML = idadeMedia;
}

function buscarUsuario() {
    const nomeDigitado = document.getElementById("nomeHidratacao").value.trim();
    usuarioAtual = listaUsuarios.find(usuario => usuario.nome.toLowerCase() === nomeDigitado.toLowerCase());
    if (!usuarioAtual) {
        alert("Usuário não encontrado.");
        return;
    }
    iniciarMeta();
}

function buscarUsuarioTabela(nome) {
    document.getElementById("nomeHidratacao").value = nome;
    buscarUsuario();
}

function iniciarMeta() {
    usuarioAtual.meta = (usuarioAtual.peso * 35) / 1000;
    usuarioAtual.consumido = 0;
    document.getElementById("meta").innerHTML = `Meta diária: ${usuarioAtual.meta.toFixed(2)} L`;
    atualizarBarra();
}

function adicionarAgua(quantidade) {
    if (!usuarioAtual) {
        alert("Selecione um usuário primeiro.");
        return;
    }
    usuarioAtual.consumido += quantidade;
    atualizarBarra();
}

function atualizarBarra() {
    let percentual = (usuarioAtual.consumido / usuarioAtual.meta) * 100;
    if (percentual > 100) {
        percentual = 100;
    }
    const barra = document.getElementById("progresso");
    barra.style.width = percentual + "%";
    document.getElementById("textoBarra").innerHTML = percentual.toFixed(1) + "%";
    let mensagem = "";
    if (percentual < 30) {
        barra.style.background = "#ef5350";
        mensagem = "Beba mais água.";
    }
    else if (percentual < 70) {
        barra.style.background = "#ffb300";
        mensagem = "Bom progresso.";
    } else if (percentual > 70 && percentual < 100 ){
        barra.style.background = "#00c853";
        mensagem = "Meta quase concluída.";
    } else if( percentual == 100){
        barra.style.background = "#00c853";
        mensagem = "Meta Concluída.";
    }
    document.getElementById("feedback").innerHTML = mensagem;
}

// Gráfico de qtd de usuários 
function atualizarGrafico(usuarios) {
    const homens = usuarios.filter(usuario => usuario.sexo === "M").length;
    const mulheres = usuarios.filter(usuario => usuario.sexo === "F").length;
    const ctx = document.getElementById("graficoSexo");
    if (grafico) {
        grafico.destroy();
    }
grafico = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [
                "Homens",
                "Mulheres"
            ],
            datasets: [
                {
                    data: [
                        homens,
                        mulheres
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}