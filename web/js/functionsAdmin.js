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

    document.getElementById('insertar').addEventListener('click', function () {
        divTaula.classList.add("oculto");
        insertarPregunta();
    });
}

function insertarPregunta() {
    const nRespostes = 4;
    const divInsertar = document.getElementById("insert");
    divInsertar.classList.remove("oculto");

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

        fetch(`php/insertarBD.php?${enviarInsertar.toString()}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                divInsertar.classList.add("oculto");
                loadQuestions();
            });

    });

}