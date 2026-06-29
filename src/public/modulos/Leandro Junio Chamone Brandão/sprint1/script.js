// ==========================
// TODAS AS REFEIÇÕES
// ==========================

const refeicoes = [

{
    id: 1111,
    nome: "Sanduíche de presunto e queijo",
    calorias: 350
},

{
    id: 1112,
    nome: "Arroz com frango grelhado",
    calorias: 520
},

{
    id: 1113,
    nome: "Iogurte com granola",
    calorias: 280
},

{
    id: 1114,
    nome: "Macarrão ao molho branco",
    calorias: 610
},

{
    id: 1115,
    nome: "Panquecas com mel",
    calorias: 420
},

{
    id: 1116,
    nome: "Peixe assado com legumes",
    calorias: 480
},

{
    id: 1117,
    nome: "Vitamina de banana",
    calorias: 310
},

{
    id: 1118,
    nome: "Omelete com queijo",
    calorias: 390
},

{
    id: 1119,
    nome: "Mix de castanhas",
    calorias: 560
},

{
    id: 1120,
    nome: "Tapioca com ovo",
    calorias: 330
},

{
    id: 1121,
    nome: "Arroz, bife de boi e fritas",
    calorias: 650
},

{
    id: 1122,
    nome: "Sanduíche natural de atum",
    calorias: 330
},

{
    id: 1123,
    nome: "Sopa de legumes com carne",
    calorias: 390
},

{
    id: 1124,
    nome: "Hamburguer artesanal",
    calorias: 850
},

{
    id: 1125,
    nome: "Strogonoff de frango",
    calorias: 720
},

{
    id: 1126,
    nome: "Purê de batata com carne",
    calorias: 560
},

{
    id: 1127,
    nome: "Lasanha de carne",
    calorias: 760
},

{
    id: 1128,
    nome: "Salada de frutas com iogurte",
    calorias: 280
},

{
    id: 1129,
    nome: "Mingau de aveia com canela",
    calorias: 310
},

{
    id: 1130,
    nome: "Pão de queijo com café",
    calorias: 340
}

];



// ==========================
// FUNÇÃO PRINCIPAL
// ==========================

function selecionar(tipo){

    let lista = [];


    // ==========================
    // CAFÉ DA MANHÃ
    // ==========================

    if(tipo == "cafe"){

        lista = refeicoes.filter(refeicao =>

            refeicao.id == 1111 ||
            refeicao.id == 1113 ||
            refeicao.id == 1117 ||
            refeicao.id == 1120 ||
            refeicao.id == 1129 ||
            refeicao.id == 1130

        );

    }


    // ==========================
    // LANCHE DA TARDE
    // ==========================

    else if(tipo == "lanche"){

        lista = refeicoes.filter(refeicao =>

            refeicao.id == 1119 ||
            refeicao.id == 1122 ||
            refeicao.id == 1128 ||
            refeicao.id == 1113 ||
            refeicao.id == 1117

        );

    }


    // ==========================
    // ALMOÇO E JANTA
    // ==========================

    else{

        lista = refeicoes.filter(refeicao =>

            refeicao.id == 1112 ||
            refeicao.id == 1114 ||
            refeicao.id == 1116 ||
            refeicao.id == 1118 ||
            refeicao.id == 1121 ||
            refeicao.id == 1123 ||
            refeicao.id == 1124 ||
            refeicao.id == 1125 ||
            refeicao.id == 1126 ||
            refeicao.id == 1127

        );

    }



    // ==========================
    // MONTAR TEXTO DO PROMPT
    // ==========================

    let texto = "";

    lista.forEach((item, index) => {

        texto += `${index + 1} - ${item.nome} (${item.calorias} kcal)\n`;

    });



    // ==========================
    // ESCOLHA DO USUÁRIO
    // ==========================

    let escolha = prompt(texto);



    // ==========================
    // PEGAR REFEIÇÃO ESCOLHIDA
    // ==========================

    let refeicaoEscolhida = lista[escolha - 1];



    // ==========================
    // MOSTRAR NO CARD
    // ==========================

    if(refeicaoEscolhida){

        document.getElementById(tipo).innerHTML = `
        
            <strong>${refeicaoEscolhida.nome}</strong>
            <br>
            ${refeicaoEscolhida.calorias} kcal
        
        `;


        calcularTotal();

    }

}



// ==========================
// CALCULAR TOTAL DE KCAL
// ==========================

function calcularTotal(){

    let total = 0;

    const refeicoesSelecionadas = [

        "cafe",
        "almoco",
        "lanche",
        "janta"

    ];


    refeicoesSelecionadas.forEach(id => {

        let texto = document.getElementById(id).innerText;


        // PEGAR NÚMERO DAS CALORIAS

        let calorias = texto.match(/\d+/);


        if(calorias){

            total += parseInt(calorias[0]);

        }

    });



    // MOSTRAR TOTAL

    document.getElementById("totalCalorias").innerHTML =
    total + " kcal";

}