let estatDeLaPartida = { 
    posicioData: 0,
    preguntaActual: 0,
    contadorPreguntes: 0, 
    respostesUsuari: [],
    botoRenderitzat: false,
    botoBorrar: false,
    temps: 0
};

let ultimsDades = []; // guarda los datos actuales de la partida
let partida; // referencia global al contenedor

// --- Inicialización ---
window.addEventListener("DOMContentLoaded", () => {
    partida = document.getElementById("partida");
    iniciJoc();

    // Listener delegado único
    document.addEventListener('click', function(e){
        let boton = e.target.closest('button');
        if (!boton) return;

        switch(boton.id){
            case 'btnComencar':
                fetch('functions/getPreguntes.php?quantitat=10')
                    .then(res => res.json())
                    .then(data => {
                        ultimsDades = data;
                        renderTaulell(data);
                    });
                break;
            case 'btnEnviar':
                fetch("functions/finalitza.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        contadorPreguntes: estatDeLaPartida.contadorPreguntes,
                        respostesUsuari: estatDeLaPartida.respostesUsuari,
                        tempsTotal: estatDeLaPartida.temps
                    })
                })
                .then(res => res.json())
                .then(data => renderFinal(data));
                break;
            case 'btnBorrar':
                borrarPartida(ultimsDades);
                break;
            case 'btnDevant':
                if (estatDeLaPartida.posicioData < ultimsDades.length - 1){
                    estatDeLaPartida.posicioData++;
                    moureDivs(ultimsDades);
                }
                break;
            case 'btnEnrrere':
                if (estatDeLaPartida.posicioData > 0){
                    estatDeLaPartida.posicioData--;
                    moureDivs(ultimsDades);
                }
                break;
            default:
                if (boton.hasAttribute('preg')){
                    let valor_pregunta = boton.getAttribute('preg');
                    let valor_resposta = boton.getAttribute('resp');

                    partida.querySelectorAll(`button[preg="${valor_pregunta}"]`).forEach(b => {
                        b.classList.remove('seleccionada');
                    });
                    boton.classList.add('seleccionada');

                    marcarRespuesta(valor_pregunta, valor_resposta);
                }
                break;
        }
    });

    // Cronómetro
    setInterval(() => estatDeLaPartida.temps++, 1000);
});

// --- Funciones principales ---
function iniciJoc(){
    partida.innerHTML = `
        <div>
            <h1>Començar</h1>
            <button id="btnComencar" class="btn btn-danger">Començar Partida</button>
        </div>`;
}

function renderitzarMarcador(){
    let marcador = document.getElementById("marcador");
    if (!marcador) return;
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;
}

function actualitzarMarcador() {
    const marcador = document.getElementById("marcador");
    if (!marcador) return;

    let htmlString = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${ultimsDades.length}</p>`;

    // Recorremos solo las preguntas que existen en la partida
    ultimsDades.forEach((pregunta) => {
        // pregunta.id es el id real de la pregunta
        const resp = estatDeLaPartida.respostesUsuari[pregunta.id];
        htmlString += `Pregunta ${pregunta.id} : <span class='badge text-bg-primary'>${resp !== undefined ? "X" : "O"}</span><br>`;
    });

    marcador.innerHTML = htmlString;

    // Botones enviar y borrar
    if (estatDeLaPartida.contadorPreguntes === ultimsDades.length && !estatDeLaPartida.botoRenderitzat) {
        partida.innerHTML += `<button id="btnEnviar" class="btn btn-danger">Enviar resposta</button>`;
        estatDeLaPartida.botoRenderitzat = true;
    } else if (estatDeLaPartida.contadorPreguntes === 1 && !estatDeLaPartida.botoBorrar) {
        partida.innerHTML += `<button id="btnBorrar" class="btn btn-danger">Borrar partida</button>`;
        estatDeLaPartida.botoBorrar = true;
    }

    localStorage.setItem("partida", JSON.stringify(estatDeLaPartida));
}

function borrarPartida(data){
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
    partida.innerHTML="";
    renderTaulell(data);
}

function marcarRespuesta(pregunta, resposta){
    let num = pregunta - 1;
    if(estatDeLaPartida.respostesUsuari[num] == undefined){
        estatDeLaPartida.contadorPreguntes++;
    }
    estatDeLaPartida.respostesUsuari[num] = resposta;
    actualitzarMarcador();
}

window.marcarRespuesta = marcarRespuesta;

function renderFinal(data){
    marcador.innerHTML="";
    partida.innerHTML = "";
    partida.innerHTML = `
        <div>
            <h2>Has fet ${data.respostes_correctes}/${data.respostes_totals} preguntes bé</h2>
            <p>En ${data.temps_total} segons</p>
            <button id="btnBorrar" class="btn btn-danger">Reinicia la partida</button>
        </div>`;
}

function moureDivs(info){
    document.getElementById(estatDeLaPartida.preguntaActual).classList.add("hidden");
    estatDeLaPartida.preguntaActual = info[estatDeLaPartida.posicioData].id;
    document.getElementById(estatDeLaPartida.preguntaActual).classList.remove("hidden");
}

// --- Render dinámico de la partida ---
function renderTaulell(data){
    estatDeLaPartida.preguntaActual = data[0].id;

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
            htmlString += `<div id="btnDevantEnrrere">
                                <button id="btnEnrrere" class="btn ${k==0?'hidden':''}">Enrerre</button>
                                <button id="btnDevant" class="btn ${k==9?'hidden':''}">Següent</button>
                           </div>`;
            htmlString += `</div>`;
        }
    }
    partida.innerHTML = htmlString;

    // marcar respuestas ya seleccionadas
    for (let i = 0; i < estatDeLaPartida.respostesUsuari.length; i++){
        let resp = estatDeLaPartida.respostesUsuari[i];
        if (resp){
            let boton = partida.querySelector(`button[preg="${i+1}"][resp="${resp}"]`);
            if (boton) boton.classList.add('seleccionada');
        }
    }

    renderitzarMarcador();
}
