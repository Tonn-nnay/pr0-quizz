/*
Index:
    Elements
    partida ~ Agafa el div amb ID partida al html
    estatDeLaPartida :5 ~ Objecte que emmagatzema l'estat del joc. 
    --------------------
    Renders
    renderitzarMarcador() ~ Funció que renderitza el marcador al començament de la partida 
    renderTaulell(data) ~ Funció que utilitza un array de dades per renderitzar les preguntes 
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
let estatDeLaPartida = { 
    posicioData: 0,
    preguntaActual: 0,
    contadorPreguntes: 0, 
    respostesUsuari: [],
    botoRenderitzat: false,
    botoBorrar: false,
    temps: 0
}; 

window.addEventListener("DOMContentLoaded", () => {
    window.partida = document.getElementById("partida"); // global

    fetch('functions/getPreguntes.php?quantitat=10')
        .then(res => res.json())
        .then(data => renderTaulell(data));

});

function renderitzarMarcador(){
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;
}

function renderTaulell(data){
    renderitzarMarcador();
    estatDeLaPartida.preguntaActual = data[0].id;

    // afegim botons de navegació si no existeixen
    let divBotons = document.getElementById("btnDevantEnrrere");
    if (!divBotons) {
        divBotons = document.createElement("div");
        divBotons.id = "btnDevantEnrrere";
        document.body.insertBefore(divBotons, document.getElementById("partida"));
    }
    divBotons.innerHTML = `
        <button id="btnEnrrere" class="btn hidden">Enrerre</button>
        <button id="btnDevant" class="btn shown">Següent</button>
    `;

    // render de les preguntes
    let htmlString = "";
    for (let k in data){
        if (data.hasOwnProperty(k)){
            htmlString += `<div id="${data[k].id}" class="divPregunta ${estatDeLaPartida.preguntaActual == data[k].id ? "" : "hidden"}">`;
            htmlString += `<h3>${data[k].pregunta}</h3>`;
            for (let i = 0; i < data[k].respostes.length; i++){
                htmlString += `<button preg='${data[k].id+1}' resp='${i+1}' class='btn'>
                                     <img src='${data[k].respostes[i][1]}'>
                               </button>`;
            }
            htmlString += `</div>`;
        }
    }
    partida.innerHTML = htmlString;

    // listener principal de respostes
    partida.addEventListener('click', function(e) {
        let boton = e.target.closest('button');
        if (e.target.id.includes('btnEnviar')){
            fetch("functions/finalitza.php", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    contadorPreguntes: estatDeLaPartida.contadorPreguntes,
                    respostesUsuari: estatDeLaPartida.respostesUsuari
                })
            }).then(res => res.text()).then(data => console.log("JSON ->", data));
        } else if (e.target.id.includes('btnBorrar')){
            localStorage.removeItem("partida");
            estatDeLaPartida = {
                posicioData:0,
                preguntaActual:0,
                contadorPreguntes:0,
                respostesUsuari:[],
                botoRenderitzat:false,
                botoBorrar:false,
                temps:0
            };
            actualitzarMarcador();
        } else if (boton.classList.contains('btn')){
            let valor_pregunta = e.target.getAttribute('preg');
            let valor_resposta = e.target.getAttribute('resp');
            marcarRespuesta(valor_pregunta, valor_resposta);
        }
    });

    // listener de navegació
    const btnEnrrere = document.getElementById("btnEnrrere");
    const btnDevant = document.getElementById("btnDevant");

    btnDevant.addEventListener("click", () => {
        estatDeLaPartida.posicioData++;
        moureDivs(data);
        actualitzaBotons(data);
    });

    btnEnrrere.addEventListener("click", () => {
        estatDeLaPartida.posicioData--;
        moureDivs(data);
        actualitzaBotons(data);
    });
}

// mou el div visible
function moureDivs(info){
    document.getElementById(estatDeLaPartida.preguntaActual).classList.add("hidden");
    estatDeLaPartida.preguntaActual = info[estatDeLaPartida.posicioData].id;
    document.getElementById(estatDeLaPartida.preguntaActual).classList.remove("hidden");
}

// actualitza visibilitat botons
function actualitzaBotons(data){
    const btnEnrrere = document.getElementById("btnEnrrere");
    const btnDevant = document.getElementById("btnDevant");

    if (estatDeLaPartida.posicioData === 0){
        btnEnrrere.classList.add("hidden");
        btnDevant.classList.remove("hidden");
    } else if (estatDeLaPartida.posicioData === data.length - 1){
        btnDevant.classList.add("hidden");
        btnEnrrere.classList.remove("hidden");
    } else {
        btnEnrrere.classList.remove("hidden");
        btnDevant.classList.remove("hidden");
    }
}

function actualitzarMarcador() {
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;

    // botons enviar i borrar
    if (estatDeLaPartida.contadorPreguntes == 10 && !estatDeLaPartida.botoRenderitzat){
        partida.innerHTML += `<button id="btnEnviar" class="btn btn-danger">Enviar resposta</button>`;
        estatDeLaPartida.botoRenderitzat = true;
    } else if (estatDeLaPartida.contadorPreguntes == 1 && !estatDeLaPartida.botoBorrar){
        partida.innerHTML += `<button id="btnBorrar" class="btn btn-danger">Borrar partida</button>`;
        estatDeLaPartida.botoBorrar = true;
    }

    // marcar respostes seleccionades
    let seleccio = document.getElementsByClassName("seleccionada");
    for (let k = seleccio.length - 1; k >= 0; k--) seleccio[k].classList.remove("seleccionada");

    for (let i = 0; i < estatDeLaPartida.respostesUsuari.length; i++){
        let resposta = estatDeLaPartida.respostesUsuari[i];
        if (resposta != undefined){
            document.getElementById(`${i}_${resposta}`)?.classList.add("seleccionada");
        } 
    }

    localStorage.setItem("partida", JSON.stringify(estatDeLaPartida));
}

function marcarRespuesta(pregunta, resposta) {
    let num = pregunta - 1;
    if(estatDeLaPartida.respostesUsuari[num] == undefined){
        estatDeLaPartida.contadorPreguntes++;
    }
    estatDeLaPartida.respostesUsuari[num] = resposta;
    actualitzarMarcador();
}

window.marcarRespuesta = marcarRespuesta;

window.setInterval(() => {
    estatDeLaPartida.temps++;
}, 1000);