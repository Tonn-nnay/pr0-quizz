/*
Index:
    Objectes
    estatDeLaPartida :5 ~ Objecte que emmagatzema l'estat del joc. 
        /Pendent: pujar localStorage
    --------------------
    Renders
    renderitzarMarcador() ~ Funció que renderitza el marcador al començament de la partida 
        /Pendent: renderitzar temps
    renderTaulell(data) ~ Funció que utilitza un array de dades per renderitzar les preguntes 
        /Pendent: actualitzar amb localStorage, separació de preguntes per divs ocults, botons de mostrar divs.

        · AEL ('click') -> Truca a la funció marcarResposta() per enviar els atributs pregunta resposta
    renderBotoSend() ~ Funció que renderitza el botó d'enviar respostes
        /Pendent: canviar onclickbutton per AEL 
    -------------------
    Funcionalitats
    AEL ('DOMContentLoaded') ~ Funció que fa fetch a getPreguntes.php per a rebre un json amb les preguntes
    enviarResposta() ~ Funció que fa fetch a finalitza.php amb l'array de estatDeLaPartida.respostesUsuari i rep un json amb les respostes 
    que eren correctes.
    actualitzaMarcador() ~ Funció que actualitza el marcador.
        /Pendent: Renderitzar temps
    marcarRespuesta(pregunta, resposta) ~ Funció que actualitza l'array de estatDeLaPartida.respostesUsuari, usa la funció 
    actualitzarMarcador() i després controla que el botó Send s'hagi renderitzat i en cas contrari, truca a renderBotoSend();
*/

let estatDeLaPartida = { 
    contadorPreguntes: 0, 
    respostesUsuari: [],
    botoRenderitzat: false,
    temps: 0
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

function renderBotoSend(){
    let contenidor = document.getElementById("partida");
    contenidor.innerHTML += `<button onclick="enviarResposta()">Enviar resposta</button>`;
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

window.setInterval(function(){
    estatDeLaPartida.temps ++;
}, 1000);