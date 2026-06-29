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



checaCadastro = async () => {
    try {
        const idProcurado = localStorage.getItem('idProcurado')

        if(!idProcurado)
        {
            window.location.href = "cadastro.html"
            return
        }

        function lerUsuariosLocais() {
            const raw = localStorage.getItem('dietaSmartUsuarios');
            if (!raw) return [];

            try {
                const dados = JSON.parse(raw);
                return Array.isArray(dados) ? dados : [];
            } catch (erro) {
                console.warn('Dados locais de usuários inválidos, resetando armazenamento.', erro);
                localStorage.removeItem('dietaSmartUsuarios');
                return [];
            }
        }

        function buscarUsuarioLocal(id) {
            const usuarios = lerUsuariosLocais();
            return usuarios.find(u => String(u.id) === String(id)) || null;
        }

        async function buscarUsuarioRemoto(id) {
            const resposta = await fetch(`http://localhost:3000/usuarios/${id}`)
            if (!resposta.ok) throw new Error('Usuário não encontrado no servidor');
            return resposta.json();
        }

        let dados = null;
        try {
            dados = await buscarUsuarioRemoto(idProcurado);
        } catch (erro) {
            console.warn('Falha ao buscar usuário no servidor, usando dados locais:', erro);
            dados = buscarUsuarioLocal(idProcurado);
        }

        if (!dados) {
            window.location.href = "cadastro.html"
            return
        }

        showUserInfo(dados)

        if(dados.cadastrado !== true)
        {
            window.location.href = "cadastro.html"
            return
        }

        document.getElementById('peso').value = dados.peso;
        document.getElementById('altura').value = dados.altura;

        function caucularIMC() {
            let peso = document.getElementById('peso').value;
            let altura = document.getElementById('altura').value;
            let resultado = document.getElementById("resultado");

            if(altura > 3)
                altura = altura / 100;

            document.getElementById('altura').value = altura;

            if(peso <= 0 || altura <= 0 || isNaN(peso) || isNaN(altura)){
                resultado.innerHTML = "Informe valores válidos!";
                return;
            }
            let imc = peso / (altura * altura);
            let classificacao = "";

            if(imc < 18.5){
                classificacao = "Abaixo do peso";
            }
            else if(imc < 25){
                classificacao = "Peso normal";
            }
            else if(imc < 30){
                classificacao = "Sobrepeso";
            }
            else if(imc < 35){
                classificacao = "Obesidade grau 1";
            }
            else if(imc < 40){
                classificacao = "Obesidade grau 2";
            }
            else{
                classificacao = "Obesidade grau 3";
            }
            
            resultado.innerHTML = `
                IMC: ${imc.toFixed(2)} <br>
                Classificação: ${classificacao}
            `;
        }

        document.getElementById('btnIMC').addEventListener('click', caucularIMC)

        caucularIMC()
    }
    catch(erro)
    {
        console.error('Erro no procedimento: ', erro)
    }
}

function showUserInfo(dados) {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo || !dados) return;

    const sexo = dados.sexo === 'M' ? 'Masculino' : dados.sexo === 'F' ? 'Feminino' : dados.sexo;
    userInfo.innerHTML = `
        <div class="user-card">
            <strong>Olá, ${dados.nome}</strong><br>
            ${dados.idade} anos • ${sexo}<br>
            Peso: ${dados.peso} kg • Altura: ${dados.altura} cm
        </div>
    `;
}


document.getElementById("logout").addEventListener('click', async() => {
    const id = localStorage.getItem('idProcurado')

    if(id) {
        try {
            await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: 'DELETE'
            })
        } catch (erro) {
            console.warn('Servidor de usuários indisponível, continuando com logout local.', erro);
        }

        localStorage.removeItem('idProcurado')
        alert('Insira suas informações novamente')
        window.location = 'cadastro.html'
    } else {
        console.error("ID não encontrado");
    }
})