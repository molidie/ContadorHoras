// Función para extraer el identificador y el tiempo de servicio de un bloque de texto
function extraerInfo(bloqueTexto) {
    const identifierMatch = bloqueTexto.match(/Identifier: (.+)/);
    const tiempoMatch = bloqueTexto.match(/Tiempo en Servicio: (.+)/);

    if (identifierMatch && tiempoMatch) {
        const identifier = identifierMatch[1];
        const tiempo = tiempoMatch[1];
        return { identifier, tiempo };
    } else {
        return { identifier: null, tiempo: null };
    }
}

// Función para convertir los minutos a horas y minutos
function minutosAHoras(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas} horas, ${minutosRestantes} minutos`;
}

// Función principal para procesar el bloque de texto
function procesarBloqueTexto(bloqueTexto) {
    const { identifier, tiempo } = extraerInfo(bloqueTexto);
    if (identifier && tiempo) {
        const tiempoMinutos = tiempoAMinutos(tiempo);
        const tiempoEnHoras = minutosAHoras(tiempoMinutos);
        return { identifier, tiempoEnHoras };
    } else {
        return { identifier: null, tiempoEnHoras: null };
    }
}

document.getElementById("formTexto").addEventListener("submit", function(event) {
    event.preventDefault();
    const texto = document.getElementById("texto").value;
    const { identifier, tiempoEnHoras } = procesarBloqueTexto(texto);
    if (identifier && tiempoEnHoras) {
        const resultadoHTML = `<p>Identifier: ${identifier}</p><p>Tiempo en horas: ${tiempoEnHoras}</p>`;
        document.getElementById("resultado").innerHTML = resultadoHTML;
        // Aquí puedes agregar la lógica para enviar los datos a la base de datos
    } else {
        document.getElementById("resultado").innerHTML = "<p>No se pudo extraer la información.</p>";
    }
});
