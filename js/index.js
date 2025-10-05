let estatDeLaPartida = { 
    posicioData: 0, //posicio al array de respostesUsuari
    preguntaActual: 0, //pregunta en la que es trova al array
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
        .then(data => renderPartida(data));

});

function renderitzarMarcador(){
    let marcador = document.getElementById("marcador");
    marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`;
}

function moureDivs(info){
        document.getElementById(estatDeLaPartida.preguntaActual).classList.add("hidden");
        estatDeLaPartida.preguntaActual = info[estatDeLaPartida.posicioData].id;
        document.getElementById(estatDeLaPartida.preguntaActual).classList.remove("hidden");
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
            document.getElementsBy(`${resposta}`)?.classList.add("seleccionada");
        } 
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

function marcarRespuesta(pregunta, resposta) {
    let num = pregunta - 1;
    console.log(estatDeLaPartida.respostesUsuari);
    if(estatDeLaPartida.respostesUsuari[num] == undefined){
        estatDeLaPartida.contadorPreguntes++;
    }
    estatDeLaPartida.respostesUsuari[num] = resposta;
    actualitzarMarcador();
    }
window.marcarRespuesta = marcarRespuesta;

function renderFinal(data){
    partida.innerHTML="";
    partida.innerHTML=  `<div>
                            <h2>Has fet ${data['respostes_correctes']}/${data['respostes_totals']} preguntes bé</h2>
                            <p>En ${data['temps_total']}</p>
                            <button id="btnBorrar" class="btn btn-danger">Borrar partida</button>
                        </div>`;
}

function iniciJoc(){
    partida.innerHTML = `<div>
                            <h1>Començar</h1>

                        </div>`
}

function renderPartida(data){
    renderitzarMarcador();
    estatDeLaPartida.preguntaActual = data[0].id;

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
            htmlString += `<div id="btnDevantEnrrere">
                                <button id="btnEnrrere" class="btn ${k == 0 ? 'hidden' : 'shown'}">Enrerre</button>
                                <button id="btnDevant" class="btn ${k == 9 ? 'hidden' : 'shown'}">Següent</button>
                           </div>`;
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
                    respostesUsuari: estatDeLaPartida.respostesUsuari,
                    tempsTotal: estatDeLaPartida.temps
                })
            }).then(res => res.text())
            //.then(data => console.log("JSON ->", data))
            .then(data => renderFinal(data));
        } else if (e.target.id.includes('btnBorrar')){
            borrarPartida(data)
        } else if (e.target.id.includes('btnDevant')) {
            estatDeLaPartida.posicioData++;
            moureDivs(data);
        } else if (e.target.id.includes('btnEnrrere')) {
            estatDeLaPartida.posicioData--;
            moureDivs(data);
        } else if (boton.classList.contains('btn')){
            // funcionalitat
            let valor_pregunta = boton.getAttribute('preg');
            let valor_resposta = boton.getAttribute('resp');
            marcarRespuesta(valor_pregunta, valor_resposta);
        }
    });

    window.setInterval(() => {
        estatDeLaPartida.temps++;
    }, 1000);
}
function renderTaulell(data){
    renderitzarMarcador();
    estatDeLaPartida.preguntaActual = data[0].id;

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
            htmlString += `<div id="btnDevantEnrrere">
                                <button id="btnEnrrere" class="btn ${k == 0 ? 'hidden' : 'shown'}">Enrerre</button>
                                <button id="btnDevant" class="btn ${k == 9 ? 'hidden' : 'shown'}">Següent</button>
                           </div>`;
            htmlString += `</div>`;
        }
    }
    partida.innerHTML = htmlString;
}