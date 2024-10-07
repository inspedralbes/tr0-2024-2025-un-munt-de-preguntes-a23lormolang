// Variables globales
let intervaloTemporizador;

iniciarUsuario();

function crearSaltoDeLinea() {
    return document.createElement("br");
}

function iniciarTemporizador(duracion, estatDeLaPartida) {
    let tiempoRestante = duracion;
    const displayTemporizador = document.getElementById('temporizador');

    // Si ya existe un temporizador en ejecución, lo detenemos antes de iniciar uno nuevo
    if (intervaloTemporizador) {
        displayTemporizador.textContent = "";
        clearInterval(intervaloTemporizador);
    }

    intervaloTemporizador = setInterval(() => {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        const tiempoFormateado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        displayTemporizador.textContent = tiempoFormateado;

        tiempoRestante--;

        if (tiempoRestante < 0) {
            clearInterval(intervaloTemporizador);
            const divPagina = document.getElementById("pagina");
            divPagina.classList.add("oculto");

            displayTemporizador.textContent = "¡Tiempo agotado!";
            finalitzarPartida(estatDeLaPartida);
            displayTemporizador.textContent = "";
        }
    }, 1000);
}

function iniciarUsuario() {
    const divPagina = document.getElementById("pagina");
    const divFinal = document.getElementById("finalitzar");
    divPagina.classList.add("oculto");
    divFinal.classList.add("oculto");
    const divInici = document.getElementById("inici");

    const parrafo1 = document.createElement("p");
    parrafo1.textContent = "Insereix l'usuari: ";

    const input1 = document.createElement("input");
    input1.type = "text";
    input1.id = "name";
    input1.placeholder = "Nombre";

    const parrafo2 = document.createElement("p");
    parrafo2.textContent = "Introdueix el nombre de preguntes: ";

    const input2 = document.createElement("input");
    input2.type = "number";
    input2.id = "nPreguntes";

    const boto = document.createElement("button");
    boto.id = "jugar";
    boto.textContent = "Jugar";

    divInici.appendChild(parrafo1);
    divInici.appendChild(input1);
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(parrafo2);
    divInici.appendChild(input2);
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(boto);
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());

    const botoMenu = document.createElement("button");
    botoMenu.id = "menu";
    botoMenu.textContent = "Menu Preguntes";
    divInici.appendChild(botoMenu);

    document.getElementById('menu').addEventListener('click', function () {
        window.location.href = "admin.html";
    });

    document.getElementById('jugar').addEventListener('click', function () {
        if (input1.value.trim() === "" || input2.value.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "ERROR",
                text: "Insereix l'usuari i el nombre de preguntes",
                showConfirmButton: false,
                timerProgressBar: true,
                timer:1500,
              });
            return; 
        }

        localStorage.setItem('user', input1.value);
        localStorage.setItem('nPreg', input2.value);
        divInici.classList.add("oculto");
        divPagina.classList.remove("oculto");
        loadQuestions();
    });
}

function loadQuestions() {
    let numPreguntes = localStorage.getItem('nPreg');


    fetch(`php/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const estatDeLaPartida = {
                indexPregunta: 0,
                respostes: [],
            };
            estatDeLaPartida.respostes = new Array(data.length).fill({ id: 0, feta: false, resposta: 0 });
            iniciarTemporizador(30, estatDeLaPartida)
            inicializarEventos(estatDeLaPartida, data);
            pintaPreguntes(estatDeLaPartida, data);
        });
}


function pintaPreguntes(estatDeLaPartida, questions) {
    let opcions = ['A', 'B', 'C', 'D'];
    let htmlString = '';

    htmlString += `<br><br>${estatDeLaPartida.indexPregunta + 1} . ${questions[estatDeLaPartida.indexPregunta].pregunta}<br>`;
    for (let iResposta = 0; iResposta < opcions.length; iResposta++) {
        opcions[iResposta] = questions[estatDeLaPartida.indexPregunta].respostes[iResposta];
        htmlString += `<br><button class="resposta" idP="${estatDeLaPartida.indexPregunta}" idR="${opcions[iResposta]}">${opcions[iResposta]}</button><br>`
    }

    const divPartida = document.getElementById("partida");
    divPartida.innerHTML = htmlString;

    actualitzarBotons(estatDeLaPartida, questions);

}

function inicializarEventos(estatDeLaPartida, questions) {

    //Evitam que es dupliquin els EventListeners si es fan multiples jocs
    document.getElementById('partida').replaceWith(document.getElementById('partida').cloneNode(true));
    document.getElementById('final').replaceWith(document.getElementById('final').cloneNode(true));
    document.getElementById('next').replaceWith(document.getElementById('next').cloneNode(true));
    document.getElementById('prev').replaceWith(document.getElementById('prev').cloneNode(true));

    document.getElementById('partida').addEventListener('click', function (e) {
        if (e.target.classList.contains('resposta')) {
            gestionarResposta(estatDeLaPartida, e.target.getAttribute("idP"), e.target.getAttribute("idR"));
            if (estatDeLaPartida.indexPregunta < questions.length - 1) {
                estatDeLaPartida.indexPregunta++;
                pintaPreguntes(estatDeLaPartida, questions);
            }
        }
    });

    document.getElementById('next').addEventListener('click', function () {
        if (estatDeLaPartida.indexPregunta < questions.length - 1) {
            estatDeLaPartida.indexPregunta++;
            pintaPreguntes(estatDeLaPartida, questions);
        }
    });

    document.getElementById('prev').addEventListener('click', function () {
        if (estatDeLaPartida.indexPregunta > 0) {
            estatDeLaPartida.indexPregunta--;
            pintaPreguntes(estatDeLaPartida, questions);
        }
    });

    document.getElementById('final').addEventListener('click', function () {
        clearInterval(intervaloTemporizador);
        const divPagina = document.getElementById("pagina");
        divPagina.classList.add("oculto");
        finalitzarPartida(estatDeLaPartida);
    });

}


function actualitzarBotons(estatDeLaPartida, questions) {
    document.getElementById('prev').disabled = estatDeLaPartida.indexPregunta === 0;
    document.getElementById('next').disabled = estatDeLaPartida.indexPregunta === questions.length - 1;
    document.getElementById('final').disabled = estatDeLaPartida.indexPregunta < questions.length - 1;
}

function gestionarResposta(estatDeLaPartida, p, r) {
    estatDeLaPartida.respostes[p] = { id: p, feta: true, resposta: r }
}

function finalitzarPartida(estatDeLaPartida) {
    fetch('php/finalitza.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estatDeLaPartida)
    })
        .then(response => response.json())
        .then(data => {
            actualizarFinalizar(data)
        });

}

function actualizarFinalizar(data) {
    const divFinal = document.getElementById("finalitzar");
    const divInici = document.getElementById("inici");
    divInici.classList.add("oculto");
    divFinal.classList.add("oculto");

    //Vaciar DOM
    while (divFinal.firstChild) {
        divFinal.removeChild(divFinal.firstChild);
    }

    divFinal.classList.remove("oculto");
    const respuesta = document.createElement("h4");
    respuesta.textContent = `Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`;
    const volver = document.createElement("button");
    volver.id = "tornaInici"
    volver.textContent = "Torna a començar"
    divFinal.appendChild(respuesta);
    divFinal.appendChild(crearSaltoDeLinea());
    divFinal.appendChild(volver);

    document.getElementById('tornaInici').addEventListener('click', function () {
        const divInici = document.getElementById("inici");
        const divFinal = document.getElementById("finalitzar");
        divFinal.classList.add("oculto");
        document.getElementById("name").value = ''
        document.getElementById("nPreguntes").value = ''
        divInici.classList.remove("oculto");
    });
}
