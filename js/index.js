let estatDeLaPartida = {
  posicioData: 0,
  preguntaActual: 0,
  contadorPreguntes: 0,
  respostesUsuari: [],
  botoRenderitzat: false,
  botoBorrar: false,
  temps: 0
}

let ultimsDades = [] // guarda les dades de la partida
let partida // referencia global al contenedor

// --- Inicialització ---
window.addEventListener('DOMContentLoaded', () => {
  partida = document.getElementById('partida')
  iniciJoc()

  // Afegir els listeners
  document.addEventListener('click', e => {
    // per precaució, s'agafa l'etiqueta més cercana d'on es faci click
    const boton = e.target.closest('button')
    if (!boton) return

    switch (boton.id) {
      case 'btnComencar':
        fetch('functions/getPreguntes.php?quantitat=10')
          .then(res => res.json())
          .then(data => {
            ultimsDades = data
            renderTaulell(data)
          })
        break
      case 'btnEnviar':
        fetch('functions/finalitza.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contadorPreguntes: estatDeLaPartida.contadorPreguntes,
            respostesUsuari: estatDeLaPartida.respostesUsuari,
            tempsTotal: estatDeLaPartida.temps
          })
        })
          .then(res => res.json())
          .then(data => renderFinal(data))
        break
      case 'btnBorrar':
        borrarPartida(ultimsDades)
        break
      case 'btnDevant':
        if (estatDeLaPartida.posicioData < ultimsDades.length - 1) {
          estatDeLaPartida.posicioData++
          moureDivs(ultimsDades)
        }
        break
      case 'btnEnrrere':
        if (estatDeLaPartida.posicioData > 0) {
          estatDeLaPartida.posicioData--
          moureDivs(ultimsDades)
        }
        break
      default:
        if (boton.hasAttribute('preg')) {
          const valorPregunta = boton.getAttribute('preg')
          const valorResposta = boton.getAttribute('resp')

          // elimina de la pregunta actual la classe seleccionada per afegir la nova
          partida.querySelectorAll(`button[preg="${valorPregunta}"]`).forEach(b => {
            b.classList.remove('seleccionada')
          })
          boton.classList.add('seleccionada')

          marcarRespuesta(valorPregunta, valorResposta)
        }
        break
    }
  })

  // Cronòmetre
  setInterval(() => estatDeLaPartida.temps++, 1000)
})

// --- Funcions principals ---
function iniciJoc () {
  partida.innerHTML = `
    <div>
      <h1>Començar</h1>
      <button id='btnComencar' class='btn btn-danger'>Començar Partida</button>
    </div>`
}

function renderitzarMarcador () {
  const marcador = document.getElementById('marcador')
  if (!marcador) return
  marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de 10</p>`
}

function actualitzarMarcador () {
  const marcador = document.getElementById('marcador')
  if (!marcador) return

  let htmlString = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${ultimsDades.length}</p>`

  // Es recorre només les preguntes que existeixen
  ultimsDades.forEach(pregunta => {
    const resp = estatDeLaPartida.respostesUsuari[pregunta.id]
    htmlString += `Pregunta ${pregunta.id} : <span class='badge text-bg-primary'>${resp !== undefined ? 'X' : 'O'}</span><br>`
  })

  marcador.innerHTML = htmlString

  // Botons enviar i borrar
  if (estatDeLaPartida.contadorPreguntes === ultimsDades.length && !estatDeLaPartida.botoRenderitzat) {
    partida.innerHTML += `<button id='btnEnviar' class='btn btn-danger'>Enviar resposta</button>`
    estatDeLaPartida.botoRenderitzat = true
  } else if (estatDeLaPartida.contadorPreguntes === 1 && !estatDeLaPartida.botoBorrar) {
    partida.innerHTML += `<button id='btnBorrar' class='btn btn-danger'>Borrar partida</button>`
    estatDeLaPartida.botoBorrar = true
  }

  localStorage.setItem('partida', JSON.stringify(estatDeLaPartida))
}

function borrarPartida (data) {
  localStorage.removeItem('partida')
  estatDeLaPartida = {
    posicioData: 0,
    preguntaActual: 0,
    contadorPreguntes: 0,
    respostesUsuari: [],
    botoRenderitzat: false,
    botoBorrar: false,
    temps: 0
  }
  partida.innerHTML = ''
  renderTaulell(data)
}

function marcarRespuesta (pregunta, resposta) {
  const num = pregunta - 1
  if (estatDeLaPartida.respostesUsuari[num] === undefined) {
    estatDeLaPartida.contadorPreguntes++
  }
  estatDeLaPartida.respostesUsuari[num] = resposta
  actualitzarMarcador()
}

window.marcarRespuesta = marcarRespuesta

function renderFinal (data) {
  const marcador = document.getElementById('marcador')
  marcador.innerHTML = ''
  partida.innerHTML = `
    <div>
      <h2>Has fet ${data.respostes_correctes}/${data.respostes_totals} preguntes bé</h2>
      <p>En ${data.temps_total} segons</p>
      <button id='btnBorrar' class='btn btn-danger'>Reinicia la partida</button>
    </div>`
}

// S'encarrega de treure i posar la classe hidden
function moureDivs (info) {
  document.getElementById(estatDeLaPartida.preguntaActual).classList.add('hidden')
  estatDeLaPartida.preguntaActual = info[estatDeLaPartida.posicioData].id
  document.getElementById(estatDeLaPartida.preguntaActual).classList.remove('hidden')
}

function renderTaulell (data) {
  estatDeLaPartida.preguntaActual = data[0].id

  let htmlString = ''
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      htmlString += `<div id='${data[k].id}' class='divPregunta ${estatDeLaPartida.preguntaActual === data[k].id ? '' : 'hidden'}'>`
      htmlString += `<h3>${data[k].pregunta}</h3>`
      for (let i = 0; i < data[k].respostes.length; i++) {
        htmlString += `<button preg='${data[k].id + 1}' resp='${i + 1}' class='btn'>
          <img src='${data[k].respostes[i][1]}' alt='${data[k].respostes[i][2]}'>
        </button>`
      }
      htmlString += `<div id='btnDevantEnrrere'>
        <button id='btnEnrrere' class='btn ${k == 0 ? 'hidden' : ''}'>Enrerre</button>
        <button id='btnDevant' class='btn ${k == 9 ? 'hidden' : ''}'>Següent</button>
      </div>`
      htmlString += '</div>'
    }
  }

  partida.innerHTML = htmlString

  // Marcar respostes ja seleccionades
  for (let i = 0; i < estatDeLaPartida.respostesUsuari.length; i++) {
    const resp = estatDeLaPartida.respostesUsuari[i]
    if (resp) {
      const boton = partida.querySelector(`button[preg='${i + 1}'][resp='${resp}']`)
      if (boton) boton.classList.add('seleccionada')
    }
  }

  renderitzarMarcador()
}
