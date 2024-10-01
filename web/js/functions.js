iniciarUsuario();

function crearSaltoDeLinea() {
    return document.createElement("br");
}

function iniciarUsuario() {
    const divPagina = document.getElementById("pagina");
    divPagina.classList.add("oculto");
    const divInici = document.getElementById("inici");

    const parrafo1 = document.createElement("p");
    parrafo1.textContent = "Insereix l'usuari: "

    const input1 = document.createElement("input");
    input1.type = "text"
    input1.id = "name"
    input1.placeholder = "Nombre"

    const parrafo2 = document.createElement("p");
    parrafo2.textContent = "Introdueix el nombre de preguntes: "

    const input2 = document.createElement("input");
    input2.type = "number"
    input2.id = "nPreguntes"

    const boto = document.createElement("button");
    boto.id = "jugar"
    boto.textContent = "Jugar"
    const salt = document.createElement("br");

    divInici.appendChild(parrafo1);
    divInici.appendChild(input1);
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(parrafo2);
    divInici.appendChild(input2);
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(boto);
    const adminB = document.createElement("a");
    adminB.href = "admin.html"
    adminB.textContent = "Admin Mode"
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(crearSaltoDeLinea());
    divInici.appendChild(adminB);

    document.getElementById('jugar').addEventListener('click', function () {
        divInici.classList.add("oculto");
        divPagina.classList.remove("oculto");
        loadQuestions();
    });
}


function loadQuestions() {
    let numPreguntes = 5;
    fetch(`php/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const estatDeLaPartida = {
                indexPregunta: 0,
                respostes: [],
            };
            estatDeLaPartida.respostes = new Array(data.length).fill({ id: 0, feta: false, resposta: 0 }); // Inicializamos las respuestas
            pintaPreguntes(estatDeLaPartida, data);
            inicializarEventos(estatDeLaPartida, data);
        });

}


function pintaPreguntes(estatDeLaPartida, questions) {
    let opcions = ['A', 'B', 'C', 'D'];
    let htmlString = '';

    htmlString += `<br><br>${estatDeLaPartida.indexPregunta + 1} . ${questions[estatDeLaPartida.indexPregunta].pregunta}<br>`;
    for (let iResposta = 0; iResposta < opcions.length; iResposta++) {
        opcions[iResposta] = questions[estatDeLaPartida.indexPregunta].respostes[iResposta];
        htmlString += `<br><button class="resposta" idP="${estatDeLaPartida.indexPregunta}" idR="${opcions[iResposta]}">${opcions[iResposta]}</button>`
    }

    const divPartida = document.getElementById("partida");
    divPartida.innerHTML = htmlString;

    actualitzarBotons(estatDeLaPartida, questions);

}

function inicializarEventos(estatDeLaPartida, questions) {

    document.getElementById('partida').addEventListener('click', function (e) {
        if (e.target.classList.contains('resposta')) {
            gestionarResposta(estatDeLaPartida, e.target.getAttribute("idP"), e.target.getAttribute("idR"));
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
    console.log(p, r);
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
            console.log(`Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`);
        });
        
    }
    
    function actualizarFinalizar(data) {
        const divFinal = document.getElementById("finalitzar");
        const respuesta = document.createElement("h4");
        respuesta.textContent = `Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`;
        const volver = document.createElement("button");
        volver.id = "tornaInici"
        volver.textContent = "Torna a començar"
        divFinal.appendChild(respuesta);
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
