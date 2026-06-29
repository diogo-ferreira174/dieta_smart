const dados = {
    alimentos: []
};

function adicionarAlimento() {
    const input = document.getElementById("alimento");
    const nome = input.value.trim();

    if (!nome) {
        alert("Digite um alimento.");
        return;
    }

    if (dados.alimentos.includes(nome)) {
        alert("Este alimento já foi adicionado.");
        return;
    }

    dados.alimentos.push(nome);
    atualizarLista();
    input.value = "";
}

function atualizarLista() {
    const lista = document.getElementById("listaAlimentos");
    lista.innerHTML = "";

    dados.alimentos.forEach(alimento => {
        const li = document.createElement("li");
        li.textContent = alimento;
        lista.appendChild(li);
    });

    console.log(JSON.stringify(dados, null, 2));
}