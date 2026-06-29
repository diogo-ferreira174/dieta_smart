
// =========================
// CARREGAR PESAGENS
// =========================
async function carregarPesagens() {

    try {
        const resposta = await fetch("http://localhost:3000/pesagens");
        const pesagens = await resposta.json();

        const lista = document.getElementById("listaPesagens");
        if (!lista) return;

        lista.innerHTML = "";

        pesagens.forEach((pesagem) => {

            const item = document.createElement("li");

            item.textContent =
                `${formatarData(pesagem.data)} - ${pesagem.peso} kg`;

            lista.appendChild(item);
        });

    } catch (error) {
        console.error("Erro ao carregar pesagens:", error);
    }
}


// =========================
// ADICIONAR PESAGEM
// =========================
async function adicionarPesagem() {

    const data = document.getElementById("dataReal").value;
    const peso = document.getElementById("peso").value;

    if (!data || !peso) {
        alert("Preencha a data e o peso.");
        return;
    }

    try {
        await fetch("http://localhost:3000/pesagens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: data,
                peso: Number(peso)
            })
        });

        document.getElementById("peso").value = "";
        document.getElementById("data").value = "";
        document.getElementById("dataReal").value = "";

        carregarPesagens();

    } catch (error) {
        console.error("Erro ao adicionar pesagem:", error);
    }
}


// =========================
// FORMATAR DATA
// =========================
function formatarData(data) {

    if (!data) return "";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// =========================
// CALENDÁRIO FUNCIONANDO
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const inputFake = document.getElementById("data");
    const inputReal = document.getElementById("dataReal");
    const btn = document.getElementById("btnCalendario");

    btn.addEventListener("click", () => {
        inputReal.showPicker?.();
    });

    inputReal.addEventListener("change", () => {

        const data = inputReal.value;

        if (!data) return;

        const partes = data.split("-");

        inputFake.value = `${partes[2]}/${partes[1]}/${partes[0]}`;
    });

    carregarPesagens();
});