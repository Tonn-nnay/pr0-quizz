/*
Index:
    Elements
    partida ~ Agafa el div amb ID partida al html
    estatDeLaPartida :5 ~ Objecte que emmagatzema l'estat del joc. 
    --------------------
    Renders
    renderitzarMarcador() ~ Funció que renderitza el marcador al començament de la partida 
    renderTaulell(data) ~ Funció que utilitza un array de dades per renderitzar les preguntes 
        /Pendent: separació de preguntes per divs ocults, botons de mostrar divs.
    -------------------
    AEL
    AEL ('DOMContentLoaded') ~ Funció que fa fetch a getPreguntes.php per a rebre un json amb les preguntes
    AEL ('click')e -> Truca a la funció marcarResposta() per enviar els atributs pregunta resposta 
    -------------------
    Funcions
    actualitzaMarcador() ~ Funció que actualitza el marcador.
    marcarRespuesta(pregunta, resposta) ~ Funció que actualitza l'array de estatDeLaPartida.respostesUsuari, usa la funció 
    actualitzarMarcador() i després controla que el botó Send s'hagi renderitzat i en cas contrari, el renderitza;
*/
let partida = document.getElementById("partida");

let estatDeLaPartida = { 
    preguntaActual: 0,
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
}

window.addEventListener("DOMContentLoaded", (event) => {

    fetch ('functions/getPreguntes.php?quantitat=10')
        .then(response => response.json())
        .then(data => renderTaulell(data));
    
} );

partida.addEventListener('click', function(e) {
        if (e.target.id.contains('btnEnviar')){
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
        } else if (e.target.id.contains('btnBorrar')){
            localStorage.removeItem("partida");
            estatDeLaPartida = {
                preguntaActual: 0,
                contadorPreguntes: 0,
                respostesUsuari: [],
                botoRenderitzat: false,
                temps: 0
            }
            actualitzaMarcador();
        } else if (e.target.classList.contains('btn')){
            let valor_pregunta = e.target.getAttribute('preg')
            let valor_resposta = e.target.getAttribute('resp')

            marcarRespuesta(valor_pregunta, valor_resposta)
        }
    })

function actualitzarMarcador() {
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;

    //renderitza el botó de enviar
    if (estatDeLaPartida.contadorPreguntes == 10 && estatDeLaPartida.botoRenderitzat == false){
        partida.innerHTML += `<button id="btnEnviar" class="btn btn-danger">Enviar resposta</button>`;
        estatDeLaPartida.botoRenderitzat = true;
    }

    if (estatDeLaPartida.contadorPreguntes == 1){
        partida.innerHTML += `<button id="btnBorrar" class="btn btn-danger">Borrar partida</button>`
    }

    let seleccio = document.getElementsByClassName("seleccionada")
    for (let k = seleccio.length - 1; k >= 0; k--) {
        seleccio[k].classList.remove("seleccionada")
    }

    for (let i = 0; i < estatDeLaPartida.respostesUsuari.length; i++) {
        let resposta = estatDeLaPartida.respostesUsuari[i]
        if (resposta != undefined){
            document.getElementById(`${i}_${resposta}`).classList.add("seleccionada")
        } 
    }

    //emmagatzema en localStorage partida l'estatDeLaPartida
    localStorage.setItem("partida", JSON.stringify(estatDeLaPartida))
    console.log(estatDeLaPartida)
}

function marcarRespuesta(pregunta, resposta) {
    console.log("Pregunta: " + pregunta + " / Resposta: " + resposta);
    let num = pregunta - 1;
    
    if(estatDeLaPartida.respostesUsuari[num] == undefined){
        estatDeLaPartida.contadorPreguntes ++;
    }

    estatDeLaPartida.respostesUsuari[num] = resposta;

    actualitzarMarcador();
    
    console.log(estatDeLaPartida.respostesUsuari);
}
window.marcarRespuesta = marcarRespuesta;

window.setInterval(function(){
    estatDeLaPartida.temps ++;
}, 1000);