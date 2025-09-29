/*
Index
    AEL ('DOMContentLoaded')
*/

function renderCRUD(data){
    let print = document.getElementById(lista);
    let htmlString = ''
}

window.addEventListener("DOMContentLoaded", (event) => {

    fetch (`functions/dades/conn.php?action=read`)
        .then(response => response.json())
        .then(data => renderCRUD(data));
    
} );