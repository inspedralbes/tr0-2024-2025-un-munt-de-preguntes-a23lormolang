
function loadQuestions() {
    let numPreguntes = 5;

    fetch(`php/getPreguntes.php?numPreguntes=${numPreguntes}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            questions = data
            estatDeLaPartida.respostes = new Array(data.length).fill({ id: 0, feta: false, resposta: 0 }); // Inicializamos las respuestas
            pintaPreguntes(questions);
        });

}

const estatDeLaPartida = {
    contadorPreguntes: 0,
    respostes: [],
};

function pintaPreguntes(questions) {
    let data = questions;
    let opcions = ['A', 'B', 'C', 'D'];
    let htmlString = '';
    
    for (let iPregunta = 0; iPregunta < data.length; iPregunta++) {
        for (let i = 0; i < opcions.length; i++) {
            opcions[i] = data[iPregunta].respostes[i];

        }
        htmlString += `<br><br>${iPregunta + 1} . ${data[iPregunta].pregunta}<br>`;
        for (let iResposta = 0; iResposta < opcions.length; iResposta++) {
            htmlString += `<br><button onclick="gestionarResposta(${iPregunta}, ${opcions[iResposta]})">${opcions[iResposta]}</button>`
        }
    }
    const divPartida = document.getElementById("partida");
    divPartida.innerHTML = htmlString;
}


function botonPulsado(p, r) {
    console.log(p, r);
}


function gestionarResposta(p, r) {
    let repetit = false;
    botonPulsado(p, r)


    // for (let index = 0; index < estatDeLaPartida.respostes.length; index++) {
    //     if (estatDeLaPartida.respostes[index].pregunta == p) {
    //         estatDeLaPartida.respostes[index].resposta = r;
    //         repetit = true;
    //     }
    // }

    estatDeLaPartida.respostes[p] = { id: p, feta: true, resposta: r }

    console.log(estatDeLaPartida);
}

function finalitzarPartida() {
    let acabat = true;
    let htmlString = '';
    const butonFinalitzar = document.getElementById('final');
    for (let index = 0; index < estatDeLaPartida.respostes.length; index++) {
        if (estatDeLaPartida.respostes[index].resposta == 0) {
            acabat = false;
        }

    }
    if (acabat) {
        alert("S'han respost totes les preguntes")
        fetch('php/finalitza.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estatDeLaPartida)  // Enviem les respostes com a JSON
        })
            .then(response => response.json())
            .then(data => {
                console.log(`Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`);
                htmlString += `Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`;
                alert(`Has encertat ${data.correctAnswers} de ${data.totalQuestions} preguntes.`);
            });
    } else {
        alert("No s'han respost totes les preguntes")
    }
    butonFinalitzar.innerHTML = htmlString;
}




