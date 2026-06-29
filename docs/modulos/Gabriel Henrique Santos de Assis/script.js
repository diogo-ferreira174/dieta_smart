//Criando a função para calcular o IMC 
function calcularIMC() {
    let peso = Number(document.getElementById("peso").value);
    let altura = Number(document.getElementById("altura").value);
    let resultado = document.getElementById("resultado");
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