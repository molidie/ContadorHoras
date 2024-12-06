function calcularTiempoServicio() {
    const logInput = document.getElementById("logInput").value;
    const resultadosTable = document.getElementById("resultados");
    resultadosTable.innerHTML = "";

    const registros = {};
    const regex = /(\w+ \w+) \[steam:([^\]]+)\]\s+Hora de Entrada: (.+?)\s+\(ART\)\s+Hora de Salida: (.+?)\s+\(ART\)/g;
    let match;

    while ((match = regex.exec(logInput)) !== null) {
        const nombre = match[1];
        const steamId = `${match[2]}`;
        const horaEntradaTexto = match[3];
        const horaSalidaTexto = match[4];

        const horaEntrada = convertirFecha(horaEntradaTexto);
        const horaSalida = convertirFecha(horaSalidaTexto);

        if (horaEntrada && horaSalida) {
            const diferenciaMs = horaSalida - horaEntrada;
            const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
            const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferenciaMs % (1000 * 60)) / 1000);

            if (!registros[steamId]) {
                registros[steamId] = {
                    nombre: nombre,
                    horas: 0,
                    minutos: 0,
                    segundos: 0
                };
            }

            registros[steamId].horas += horas;
            registros[steamId].minutos += minutos;
            registros[steamId].segundos += segundos;
        }
    }

    for (const steamId in registros) {
        let { horas, minutos, segundos } = registros[steamId];

        minutos += Math.floor(segundos / 60);
        segundos = segundos % 60;
        horas += Math.floor(minutos / 60);
        minutos = minutos % 60;

        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${registros[steamId].nombre}</td>
            <td>${steamId}</td>
            <td>${horas}h ${minutos}m ${segundos}s</td>
        `;
        resultadosTable.appendChild(nuevaFila);
    }

    // Habilitar el botón de guardar datos
    document.getElementById("submitBtn").disabled = false;
}

function convertirFecha(textoFecha) {
    const [diaSemana, mes, dia, at, hora, min, ampm] = textoFecha.split(/[\s:]+/);

    let hora24 = parseInt(hora);
    if (ampm === "PM" && hora24 < 12) hora24 += 12;
    if (ampm === "AM" && hora24 === 12) hora24 = 0;

    const fecha = new Date();
    fecha.setFullYear(new Date().getFullYear());
    fecha.setMonth(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(mes));
    fecha.setDate(parseInt(dia));
    fecha.setHours(hora24);
    fecha.setMinutes(parseInt(min));
    fecha.setSeconds(0);
    fecha.setMilliseconds(0);

    return fecha;
}

function guardarDatos() {
    // Lógica para guardar datos en la API
    const resultados = [];
    const filas = document.querySelectorAll("#resultados tr");
    
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        const nombre = celdas[0].innerText;
        const steamId = celdas[1].innerText;
        const tiempo = celdas[2].innerText;

        resultados.push({
            nombre: nombre,
            steamId: steamId,
            tiempo: tiempo
        });
    });

    // Enviar datos a la API usando fetch
    fetch('URL_DE_TU_API', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos guardados:', data);
        // Aquí puedes manejar la respuesta de la API
    })
    .catch(error => {
        console.error('Error al guardar los datos:', error);
    });
}
