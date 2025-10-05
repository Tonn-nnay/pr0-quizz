/*
Index
    AEL ('DOMContentLoaded')
*/

function fetchRender(){
    fetch (`functions/consulta.php?action="read"`)
        .then(response => response.json())
        .then(data => render(data));
}

/*function fetchRender(query, info){
    //convertir la info en el json
    fetch("functions/consulta.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        action: query,

                    })
                })
}*/

window.addEventListener("DOMContentLoaded", (event) => {
    fetchRender();
} );

function render(data){
    let print = document.getElementsByClassName(menu);
    print.innerHTML = "";
    print.innerHTML = `${data}`;
}