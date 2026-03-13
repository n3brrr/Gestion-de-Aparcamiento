// Cuando carga la página, cargamos los datos guardados en el navegador
document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialLocal();
});

function cargarHistorialLocal() {
    // Obtenemos los datos del LocalStorage
    const historialGuardado = localStorage.getItem('historial_aparcamientos');

    const tbody = document.getElementById('historial-body');
    const noData = document.getElementById('no-data');
    const tabla = document.getElementById('tabla-historial');

    // Si no hay datos, mostramos el mensaje de "vacío"
    if (!historialGuardado || JSON.parse(historialGuardado).length === 0) {
        tabla.classList.add('d-none');
        noData.classList.remove('d-none');
        return;
    }

    const historial = JSON.parse(historialGuardado);

    // Recorremos el historial al revés para que lo más nuevo salga primero
    historial.reverse().forEach(parking => {
        const tr = document.createElement('tr');

        // Formateamos las fechas para que se vean bien en español
        const fechaInicio = new Date(parking.timestamp).toLocaleString('es-ES');
        const fechaFin = parking.fechaFin ? new Date(parking.fechaFin).toLocaleString('es-ES') : 'En curso';

        tr.innerHTML = `
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td>
                <a href="https://www.google.com/maps/search/?api=1&query=${parking.lat},${parking.lng}" target="_blank" class="btn btn-sm btn-outline-secondary">
                    Ver en Google Maps
                </a>
            </td>
        `;

        tbody.appendChild(tr);
    });
}