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

        const resposta = await fetch(`http://localhost:3000/usuarios/${idProcurado}`)

        if(resposta.ok)
        {
            const dados = await resposta.json()
            showUserInfo(dados)

            if(dados.cadastrado === true)
            {
                console.log('Verificado com sucesso')
            }
            else
            {
                window.location.href = "cadastro.html"
            }

            document.getElementById('peso').value = dados.peso;
            document.getElementById('altura').value = dados.altura;

            function caucularIMC() {
                console.log('calculo')
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

            document.getElementById('btnIMC').addEventListener('click', await caucularIMC)

            await caucularIMC()
        }
        else
        {
            alert('houve um erro na requisição das informações')
            window.location.href = "cadastro.html"
        }
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
        await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE'
        })
        localStorage.removeItem('idProcurado')
        alert('insira suas informações novamente')

        window.location = 'cadastro.html'
    }else {
        console.error("ID não encontrado");
    }
})