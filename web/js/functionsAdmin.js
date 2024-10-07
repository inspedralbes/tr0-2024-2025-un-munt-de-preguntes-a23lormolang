
document.getElementById("taula").addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
        const idP = target.getAttribute('idP');
        if (target.textContent === 'Eliminar') {
            eliminarPregunta(idP);
        } else if (target.textContent === 'Editar') {
            editarPregunta(idP);
        }
    }
});

loadQuestions();

function loadQuestions() {
    fetch(`php/getBD.php`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            carregarTaula(data);
        });
}

function carregarTaula(preguntes) {
    const divTaula = document.getElementById("taula");
    divTaula.classList.remove("oculto");

    //Vaciar DOM
    while (divTaula.firstChild) {
        divTaula.removeChild(divTaula.firstChild);
    }
    const tabla = document.createElement("table");
    tabla.style.border = "1";

    // Crear la fila de encabezado
    const headerRow = document.createElement("tr");
    const headers = ["ID", "Pregunta", "Respuestas", "Respuesta Correcta", "Imatge", "Opciones"];
    for (let i = 0; i < headers.length; i++) {
        const th = document.createElement("th");
        th.textContent = headers[i]
        headerRow.appendChild(th);
    }
    tabla.appendChild(headerRow);
    //Crear Filas
    for (let i = 0; i < preguntes.length; i++) {
        const row = document.createElement("tr");
        const tdId = document.createElement("td");
        tdId.textContent = preguntes[i]['id'];
        row.appendChild(tdId);
        const tdPreg = document.createElement("td");
        tdPreg.textContent = preguntes[i]['pregunta'];
        row.appendChild(tdPreg);
        const tdResp = document.createElement("td");
        //Llista
        const illista = document.createElement("ul");
        for (let j = 0; j < preguntes[i]['respostes'].length; j++) {
            const llista = document.createElement("li");
            llista.textContent = preguntes[i]['respostes'][j]['resposta'];
            illista.appendChild(llista);
        }
        tdResp.appendChild(illista);
        row.appendChild(tdResp);
        const tdRespCor = document.createElement("td");
        tdRespCor.textContent = preguntes[i]['resposta_correcta'];
        row.appendChild(tdRespCor);
        const tdImatge = document.createElement("td");
        tdImatge.textContent = preguntes[i]['imatge'];
        row.appendChild(tdImatge);
        const tdOpcions = document.createElement("td");
        //Botons
        const botoEditar = document.createElement("button");
        botoEditar.setAttribute("idP", preguntes[i]['id'])
        botoEditar.textContent = "Editar"
        botoEditar.id = "editar"
        const botoEliminar = document.createElement("button");
        botoEliminar.setAttribute("idP", preguntes[i]['id'])
        botoEliminar.id = "eliminar"
        botoEliminar.textContent = "Eliminar"
        tdOpcions.appendChild(botoEditar);
        tdOpcions.appendChild(botoEliminar);
        row.appendChild(tdOpcions);

        tabla.appendChild(row);
    }

    divTaula.appendChild(tabla);

    const botoInsertar = document.createElement("button");
    botoInsertar.id = "insertar"
    botoInsertar.textContent = "Insertar Pregunta"
    divTaula.appendChild(botoInsertar);

    const botoTornar = document.createElement("button");
    botoTornar.id = "iniciTornar"
    botoTornar.textContent = "Tornar al joc"
    divTaula.appendChild(botoTornar)
    document.getElementById('iniciTornar').addEventListener('click', function () {
        window.location.href = "index.html";
    });

    document.getElementById("insertar").addEventListener('click', function () {
        divTaula.classList.add("oculto");
        insertarPregunta();
    });
}

function insertarPregunta() {
    const nRespostes = 4;
    const divInsertar = document.getElementById("insert");
    divInsertar.classList.remove("oculto");

    //Vaciar DOM
    while (divInsertar.firstChild) {
        divInsertar.removeChild(divInsertar.firstChild);
    }

    const iPregunta = document.createElement("input");
    iPregunta.placeholder = "Pregunta"
    divInsertar.appendChild(iPregunta);
    const respostesInputs = [];
    for (let i = 0; i < nRespostes; i++) {
        const iResposta = document.createElement("input");
        iResposta.placeholder = `Resposta ${i + 1}`
        respostesInputs.push(iResposta);
        divInsertar.appendChild(iResposta);
    }
    const iRespostaC = document.createElement("input");
    iRespostaC.type = "number"
    iRespostaC.placeholder = "Nombre de la Resposta Correcta"
    const iImatge = document.createElement("input");
    iImatge.placeholder = "Imatge"

    divInsertar.appendChild(iRespostaC);
    divInsertar.appendChild(iImatge);

    const botoInsertar = document.createElement("button");
    botoInsertar.id = "eInsertar"
    botoInsertar.textContent = "Insertar Pregunta"
    const salt = document.createElement("br");
    divInsertar.appendChild(salt);
    divInsertar.appendChild(botoInsertar);

    const botoTornar = document.createElement("button");
    botoTornar.id = "iTornar"
    botoTornar.textContent = "Tornar al menu"
    divInsertar.appendChild(botoTornar)
    document.getElementById('iTornar').addEventListener('click', function () {
        divInsertar.classList.add("oculto");
        loadQuestions();
    });

    document.getElementById('eInsertar').addEventListener('click', function () {
        const respostes = respostesInputs.map(input => input.value);
        const enviarInsertar = {
            Pregunta: iPregunta.value,
            Resposta1: respostes[0],
            Resposta2: respostes[1],
            Resposta3: respostes[2],
            Resposta4: respostes[3],
            RespostaC: iRespostaC.value,
            Imatge: iImatge.value,
        };


        fetch('php/insertarPregunta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enviarInsertar)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.text();
            })
            .then(data => {
                divInsertar.classList.add("oculto");
                Swal.fire({
                    icon: "success",
                    title: "Insertat!",
                    text: "S'ha inserit correctament",
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 1500,
                });
                loadQuestions();
            });

    });


}

function eliminarPregunta(idP) {

    Swal.fire({
        title: "Seguro que desea eliminarlo?",
        text: "No se podra revertir el cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminalo!"
      }).then((result) => {
        if (result.isConfirmed) {
            fetch('php/eliminarPregunta.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idP: idP })
            })
                .then(response => { return response.text(); })
                .then(data => {
                    Swal.fire({
                        icon: "success",
                        title: "Eliminat!",
                        text: "S'ha eliminat correctament",
                        showConfirmButton: false,
                        timerProgressBar: true,
                        timer: 1500,
                      });
                    loadQuestions();
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                });
        }
      });
    
}

function editarPregunta(idP) {
    const divTaula = document.getElementById("taula");
    divTaula.classList.add("oculto");
    const nRespostes = 4;
    const divEditar = document.getElementById("edit");
    divEditar.classList.remove("oculto");

    //Vaciar DOM
    while (divEditar.firstChild) {
        divEditar.removeChild(divEditar.firstChild);
    }

    fetch(`php/getBD.php`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const pregunta = data.find(p => p.id == idP);
            console.log(pregunta);
            const iPregunta = document.createElement("input");
            iPregunta.placeholder = `${pregunta['pregunta']}`;
            divEditar.appendChild(iPregunta);
            const respostesInputs = [];
            for (let i = 0; i < nRespostes; i++) {
                const iResposta = document.createElement("input");
                iResposta.placeholder = `${pregunta[`respostes`][i]['resposta']}`
                respostesInputs.push(iResposta);
                divEditar.appendChild(iResposta);
            }
            const iRespostaC = document.createElement("input");
            iRespostaC.type = "number"
            iRespostaC.placeholder = "Nombre de la Resposta Correcta"
            const iImatge = document.createElement("input");
            iImatge.placeholder = `${pregunta['imatge']}`

            divEditar.appendChild(iRespostaC);
            divEditar.appendChild(iImatge);

            const botoEditar = document.createElement("button");
            botoEditar.id = "eEditar"
            botoEditar.textContent = "Editar Pregunta"
            const salt = document.createElement("br");
            divEditar.appendChild(salt);
            divEditar.appendChild(botoEditar);

            const botoTornar = document.createElement("button");
            botoTornar.id = "eTornar"
            botoTornar.textContent = "Tornar al menu"
            divEditar.appendChild(botoTornar)
            document.getElementById('eTornar').addEventListener('click', function () {
                divEditar.classList.add("oculto");
                loadQuestions();
            });

            document.getElementById('eEditar').addEventListener('click', function () {
                const respostes = respostesInputs.map(input => input.value);
                const enviarEditar = {
                    id: idP,
                    Pregunta: iPregunta.value,
                    idR1: pregunta[`respostes`][0]['id'],
                    Resposta1: respostes[0],
                    idR2: pregunta[`respostes`][1]['id'],
                    Resposta2: respostes[1],
                    idR3: pregunta[`respostes`][2]['id'],
                    Resposta3: respostes[2],
                    idR4: pregunta[`respostes`][3]['id'],
                    Resposta4: respostes[3],
                    RespostaC: iRespostaC.value,
                    Imatge: iImatge.value,
                };


                fetch('php/editarPregunta.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(enviarEditar)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la solicitud');
                        }
                        return response.text();
                    })
                    .then(data => {
                        Swal.fire({
                            icon: "success",
                            title: "Editat!",
                            text: "S'ha editat correctament",
                            showConfirmButton: false,
                            timerProgressBar: true,
                            timer: 1500,
                        });
                        divEditar.classList.add("oculto");
                        loadQuestions();
                    });

            });

        });

}