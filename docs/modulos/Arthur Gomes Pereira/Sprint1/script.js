
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const idade = document.getElementById("idade");
const altura = document.getElementById("altura")
const peso = document.getElementById("peso");
const frequencia = document.getElementById("frequencia")

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = {
        nome: nome.value,
        email: email.value, 
        senha: senha.value,
        idade: idade.value,
        altura: altura.value,
        peso: peso.value,
        frequencia: frequencia.value
    };


    console.log(usuario);
})