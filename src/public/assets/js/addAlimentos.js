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

    dados.alimentos.forEach((alimento, index) => {
        const li = document.createElement("li");

        // adiciona vírgula exceto no último item
        li.textContent = index === dados.alimentos.length - 1
            ? alimento
            : alimento + ",";

        lista.appendChild(li);
    });
}