const planos = {

  emagrecimento: {
    dieta: "Dieta com baixo carboidrato",
    rotina: "Corrida e bicicleta"
  },

  hipertrofia: {
    dieta: "Dieta rica em proteínas",
    rotina: "Musculação"
  },

  manutencao: {
    dieta: "Dieta equilibrada",
    rotina: "Caminhada e alongamento"
  }

};

function mostrarPlano(){

  const objetivo =
    document.getElementById("objetivo").value;

  const plano = planos[objetivo];

  document.getElementById("resultado").innerHTML = `
    <h2>Plano Recomendado</h2>

    <p><strong>Dieta:</strong> ${plano.dieta}</p>

    <p><strong>Rotina:</strong> ${plano.rotina}</p>
  `;
}