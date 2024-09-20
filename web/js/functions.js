// fetch('http://localhost/Projecte/Back/data.json')
// .then(response => response.json())
// .then(data => {
//     console.log(data)
//     pintaPreguntes(data)
// });

function loadQuestions() {
    let numPreguntes = 10;
    // const response = await fetch(`Back/getPreguntes.php?numPreguntes=${numPreguntes}`);
    // let questions = await response.json();
    // fetch(`Back/getPreguntes.php?numPreguntes=${numPreguntes}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //     });

    fetch(`Back/getPreguntes.php?numPreguntes=${numPreguntes}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        questions = data
        estatDeLaPartida.respostes = new Array(data.length).fill(0); // Inicializamos las respuestas
        pintaPreguntes(questions);
    });

}

const estatDeLaPartida = {
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
        htmlString += `<br><br>${data[iPregunta].pregunta}<br>`;
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

    estatDeLaPartida.respostes[p] = r

    console.log(estatDeLaPartida);
}

function finalitzarPartida() {
    let acabat = true;
    const butonFinalitzar = document.getElementById("final");

    for (let index = 0; index < estatDeLaPartida.respostes.length; index++) {
        if(estatDeLaPartida.respostes[index] == 0){
            acabat = false;
        }
        
    }
    if (acabat) {
        alert("S'han respost totes les preguntes")
    } else {
        alert("No s'han respost totes les preguntes")
    }

    //divPartida.innerHTML;
}




