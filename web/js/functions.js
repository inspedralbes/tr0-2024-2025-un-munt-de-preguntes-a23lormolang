loadQuestions();

function loadQuestions() {
    let numPreguntes = 5;

    fetch(`php/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            questions = data
            estatDeLaPartida.respostes = new Array(data.length).fill({ id: 0, feta: false, resposta: 0 }); // Inicializamos las respuestas
            pintaPreguntes();
        });

}

const estatDeLaPartida = {
    indexPregunta: 0,
    respostes: [],
};

function pintaPreguntes() {
    let opcions = ['A', 'B', 'C', 'D'];
    let htmlString = '';

    htmlString += `<br><br>${estatDeLaPartida.indexPregunta + 1} . ${questions[estatDeLaPartida.indexPregunta].pregunta}<br>`;
    for (let iResposta = 0; iResposta < opcions.length; iResposta++) {
        opcions[iResposta] = questions[estatDeLaPartida.indexPregunta].respostes[iResposta];
        htmlString += `<br><button class="resposta" idP="${estatDeLaPartida.indexPregunta}" idR="${opcions[iResposta]}">${opcions[iResposta]}</button>`
    }
    actualitzarBotons();

    const divPartida = document.getElementById("partida");
    divPartida.innerHTML = htmlString;
}

document.getElementById('partida').addEventListener('click', function (e) {
    if (e.target.classList.contains('resposta')) {
        gestionarResposta(e.target.getAttribute("idP"), e.target.getAttribute("idR"));
    }
});

document.getElementById('next').addEventListener('click', function () {
    if (estatDeLaPartida.indexPregunta < questions.length - 1) {
        estatDeLaPartida.indexPregunta++;
        pintaPreguntes();
    }
});

document.getElementById('prev').addEventListener('click', function () {
    if (estatDeLaPartida.indexPregunta > 0) {
        estatDeLaPartida.indexPregunta--;
        pintaPreguntes();
    }
});

document.getElementById('final').addEventListener('click', function () {
    finalitzarPartida()
});


function actualitzarBotons() {
    document.getElementById('prev').disabled = estatDeLaPartida.indexPregunta === 0;
    document.getElementById('next').disabled = estatDeLaPartida.indexPregunta === questions.length - 1;
    document.getElementById('final').disabled = estatDeLaPartida.indexPregunta < questions.length - 1;
}

function gestionarResposta(p, r) {
    let repetit = false;
    console.log(p, r);
    estatDeLaPartida.respostes[p] = { id: p, feta: true, resposta: r }
}

function finalitzarPartida() {

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
    let htmlS = ''
    htmlS = `<h4>Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.</h4>`;
    htmlS += `<br><br><a href="index.html">Torna a començar</a>`;
    const divP = document.getElementById('pagina');
    divP.innerHTML = htmlS;
}




