let estatDeLaPartida = { 
    contadorPreguntes: 0, 
    respostesUsuari: [],
    botoRenderitzat: false
}; 

function renderitzarMarcador(){
    let contador = estatDeLaPartida.contadorPreguntes;
    
    let marcador = document.getElementById("marcador");
    let htmlString = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;

    marcador.innerHTML = htmlString;
}

function renderTaulell(data){
    console.log(data);

    renderitzarMarcador();

    let partida = document.getElementById("partida");
    let htmlString="";

    for (var k in data){
        if(data.hasOwnProperty(k)){
            htmlString+=`<h3> ${data[k].pregunta} </h3>`;
            for (let i = 0; i < data[k].respostes.length; i++){
                htmlString+=`<button preg='${data[k].id+1}' resp='${i+1}' class='btn'> ${data[k].respostes[i][1]}</button>`
            }            
        }
    }
    partida.innerHTML = htmlString;

    partida.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')){
            let valor_pregunta = e.target.getAttribute('preg')
            let valor_resposta = e.target.getAttribute('resp')

            marcarRespuesta(valor_pregunta, valor_resposta)
        }
    })
}

window.addEventListener("DOMContentLoaded", (event) => {

    fetch ('functions/getPreguntes.php?quantitat=10')
        .then(response => response.json())
        .then(data => renderTaulell(data));
    
} );

function enviarResposta() {
  const url = "functions/finalitza.php"; 

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contadorPreguntes: estatDeLaPartida.contadorPreguntes,
      respostesUsuari: estatDeLaPartida.respostesUsuari
    })
  })
  .then(res => res.text())
  .then(data => console.log("JSON ->", data));
}

function actualitzarMarcador() {
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;
}

function renderBotoSend(){
    let contenidor = document.getElementById("partida");
    contenidor.innerHTML = `<button onclick="enviarResposta()">Enviar resposta</button>`;
}

function marcarRespuesta(pregunta, resposta) {
    console.log("Pregunta: " + pregunta + " / Resposta: " + resposta);
    let num = pregunta - 1;
    
    if(estatDeLaPartida.respostesUsuari[num] == undefined){
        estatDeLaPartida.contadorPreguntes ++;
    }

    estatDeLaPartida.respostesUsuari[num] = resposta;

    actualitzarMarcador();
    if (estatDeLaPartida.contadorPreguntes == 10 && estatDeLaPartida.botoRenderitzat == false){
        renderBotoSend();
        estatDeLaPartida.botoRenderitzat = true;
    }
    console.log(estatDeLaPartida.respostesUsuari);
}
window.marcarRespuesta = marcarRespuesta;
