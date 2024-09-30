loadQuestions();

function loadQuestions() {
    let numPreguntes = 5;

    fetch(`php/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
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
            guardarPartidaBD(estatDeLaPartida)
            console.log(`Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`);
        });

}

function actualizarFinalizar(data) {
    let htmlS = ''
    htmlS = `<h4>Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.</h4>`;
    htmlS += `<br><br><a href="index.html">Torna a començar</a>`;
    const divP = document.getElementById('pagina');
    divP.innerHTML = htmlS;
}
