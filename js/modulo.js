let estatDeLaPartida = { 
    contadorPreguntes: 0, 
    respostesUsuari: [],
    botoRenderitzat: false
}; 

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
                htmlString+=`<button onclick="marcarRespuesta(${data[k].id+1},${i+1})"> ${data[k].respostes[i][1]}</button>`
            }            
        }
    }
    partida.innerHTML = htmlString;
}

window.addEventListener("DOMContentLoaded", (event) => {

    fetch ('functions/getPreguntes.php?quantitat=10')
        .then(response => response.json())
        .then(data => renderTaulell(data));
    
} );
