function calcular() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const idade = parseFloat(document.getElementById('idade').value);
    const sexo = document.getElementById('sexo').value;
    const atividade = parseFloat(document.getElementById('atividade').value);

    if (!peso || !altura || !idade) {
        alert("Preencha todos os campos!");
        return;
    }

    let tmb;

    // Fórmula de Harris-Benedict
    if (sexo === "homem") {
        tmb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
    } else {
        tmb = 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
    }

    const get = tmb * atividade;

    document.getElementById('resultado').innerHTML = `
        <strong>TMB:</strong> ${tmb.toFixed(2)} kcal/dia <br><br>
        <strong>GET:</strong> ${get.toFixed(2)} kcal/dia
    `;
}