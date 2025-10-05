/*
Index
    AEL ('DOMContentLoaded')
*/
let logic = 0;

function fetchRender(){
    fetch (`functions/consulta.php?action="read"`)
        .then(response => response.json())
        .then(data => render(data));
}

window.addEventListener("DOMContentLoaded", (event) => {
    fetchRender();
} );

function render(data){
    let print = document.getElementsByClassName(menu);
    print.innerHTML = "";
    for (let k in data){
        if(data.hasOwnProperty(k)){
            htmlString +=  `<div class="pregunta">
                                <label for="${data[k].ID_pregunta}">Pregunta:</label>
                                <input type="text" id="${data[k].ID_pregunta}" name="${data[k].pregunta}">${data[k].pregunta}</input>
                                <button id="eliminar" data-id="${data[k].ID_pregunta}">Eliminar pregunta</button>
                                <button id="actualitzar">Actualitzar</button>
                            </div>`
        }
    }

    if (logic == 0){
        print.addEventListener('click', function(e) {
            switch(e.target.id){
                case 'eliminar':
                    fetch('function/consulta.php', {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            case: 'delete',
                            id: e.target.data-id
                    })
                }).then()
            } 
        })
        logic ++;
    } 
}

function crear(){
    let print = document.getElementsByClassName(menu);
    print.innerHTML += `<div class="pregunta">
                            <label for="new">Pregunta:</label>
                            <input type="text" id="new" name="new"></input>
                            <button id="nou">Pujar</button>
                        </div>`
}