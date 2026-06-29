const nome = document.getElementById("nome");
const idade = document.getElementById("idade");
const altura = document.getElementById("altura");
const peso = document.getElementById("peso");
const frequencia = document.getElementById("frequencia");
const sexo = document.getElementById("informeSexo");

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    let valorNome = nome.value.trim();
    let valorIdade = Number(idade.value);
    let valorSexo = sexo.value;
    let valorAltura = Number(altura.value);
    let valorPeso = Number(peso.value);
    let valorFrequencia = Number(frequencia.value);

    // Validação dos campos
    if (!valorNome) {
        alert("Informe o nome.");
        return;
    }

    if (!idade.value) {
        alert("Informe a idade.");
        return;
    }

    if (!altura.value) {
        alert("Informe a altura.");
        return;
    }

    if (!peso.value) {
        alert("Informe o peso.");
        return;
    }

    if (valorIdade <= 0) {
        alert("Informe uma idade válida.");
        return;
    }

    if (valorAltura <= 0) {
        alert("Informe uma altura válida.");
        return;
    }

    if (valorPeso <= 0) {
        alert("Informe um peso válido.");
        return;
    }

    let tmb = null;
    let get = null;

    if (valorAltura < 3) {
        valorAltura = valorAltura * 100;
    }

    if (valorSexo === "M") {
        tmb = 88.36 + (13.4 * valorPeso) + (4.8 * valorAltura) - (5.7 * valorIdade);
    } else {
        tmb = 447.6 + (9.2 * valorPeso) + (3.1 * valorAltura) - (4.3 * valorIdade);
    }

    get = tmb * valorFrequencia;

    const dados = {
        "nome": valorNome,
        "idade": valorIdade,
        "sexo": valorSexo,
        "peso": valorPeso,
        "altura": valorAltura,
        "tmb": Number(tmb.toFixed(2)),
        "get": Number(get.toFixed(2)),
        "nível de atividdae física": valorFrequencia,
        "pesagens": [],
        "cadastrado": true
    };

    function lerUsuariosLocais() {
        const chave = 'dietaSmartUsuarios';
        const raw = localStorage.getItem(chave);
        if (!raw) return [];

        try {
            const dados = JSON.parse(raw);
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.warn('Dados locais de usuários inválidos, resetando armazenamento.', erro);
            localStorage.removeItem(chave);
            return [];
        }
    }

    async function salvarUsuarioLocalmente(usuario) {
        const chave = 'dietaSmartUsuarios';
        const usuariosSalvos = lerUsuariosLocais();
        const usuarioComId = {
            ...usuario,
            id: usuario.id || String(Date.now())
        };
        usuariosSalvos.push(usuarioComId);
        localStorage.setItem(chave, JSON.stringify(usuariosSalvos));
        return usuarioComId;
    }

    function marcarUsuarioComoCorrente(usuario) {
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario));
        localStorage.setItem('idProcurado', String(usuario.id));
    }

    try {
        const resposta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            const usuarioCriado = await resposta.json();
            marcarUsuarioComoCorrente(usuarioCriado);
            window.location.href = "index.html";
            return;
        }

        console.warn('Servidor não respondeu corretamente, salvando usuário localmente.');
        const usuarioSalvo = await salvarUsuarioLocalmente(dados);
        marcarUsuarioComoCorrente(usuarioSalvo);
        window.location.href = "index.html";
    }
    catch (erro) {
        console.warn('Não foi possível cadastrar via servidor, salvando localmente:', erro);
        const usuarioSalvo = await salvarUsuarioLocalmente(dados);
        marcarUsuarioComoCorrente(usuarioSalvo);
        window.location.href = "index.html";
    }
});