// Variables globales
let map, userMarker, carMarker, watchId;
let currentPos = null;
let selectedPos = null;

const elements = {
    btnAparcar: document.getElementById('btn-aparcar'),
    btnRetirar: document.getElementById('btn-retirar'),
    infoPanel: document.getElementById('info-panel'),
    distancia: document.getElementById('distancia'),
    tiempo: document.getElementById('tiempo')
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initApp();
    }
});

function initApp() {
    initMap();
    checkParkingState();
    startTracking();
    
    elements.btnAparcar.addEventListener('click', () => aparcarVehiculo());
    elements.btnRetirar.addEventListener('click', retirarVehiculo);
}

function initMap() {
    map = L.map('map').setView([40.4168, -3.7038], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Permitir seleccionar ubicación manualmente
    map.on('click', (e) => {
        // Si ya está aparcado, no dejamos mover el marcador
        if (localStorage.getItem('aparcamiento_actual')) return;
        
        selectedPos = { lat: e.latlng.lat, lng: e.latlng.lng };
        marcarSeleccionTemporal(selectedPos);
        console.log("Ubicación seleccionada manualmente:", selectedPos);
    });
}

function marcarSeleccionTemporal(latlng) {
    if (carMarker) {
        carMarker.setLatLng(latlng).setOpacity(0.8);
    } else {
        const carIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        carMarker = L.marker(latlng, { icon: carIcon, opacity: 0.8 }).addTo(map);
    }
}

function startTracking() {
    if (!navigator.geolocation) return;

    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            currentPos = { lat: latitude, lng: longitude };

            if (!userMarker) {
                userMarker = L.marker([latitude, longitude], { 
                    interactive: false,
                    zIndexOffset: 1000 
                }).addTo(map);
                
                if (!localStorage.getItem('aparcamiento_actual') && !selectedPos) {
                    map.setView([latitude, longitude], 16);
                }
            } else {
                userMarker.setLatLng([latitude, longitude]);
            }
            actualizarPanelInfo();
        },
        (err) => console.log("GPS no disponible"), 
        { enableHighAccuracy: true, timeout: 5000 }
    );
}

async function aparcarVehiculo() {
    // Si hay una posición seleccionada manualmente, esa manda. Si no, el GPS actual.
    const pos = selectedPos || currentPos;
    
    if (!pos) {
        alert("Por favor, selecciona en el mapa dónde has aparcado (pulsa en el mapa) o espera a tener cobertura GPS.");
        return;
    }

    const parkingData = {
        lat: pos.lat,
        lng: pos.lng,
        timestamp: Date.now()
    };

    localStorage.setItem('aparcamiento_actual', JSON.stringify(parkingData));

    try {
        await fetch('/api/aparcamientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkingData)
        });
    } catch (e) { console.warn("Modo local"); }

    selectedPos = null;
    checkParkingState();
}

function retirarVehiculo() {
    const data = JSON.parse(localStorage.getItem('aparcamiento_actual'));
    const historial = JSON.parse(localStorage.getItem('historial_aparcamientos') || '[]');
    
    data.fechaFin = Date.now();
    historial.push(data);
    
    localStorage.setItem('historial_aparcamientos', JSON.stringify(historial));
    localStorage.removeItem('aparcamiento_actual');
    checkParkingState();
}

function checkParkingState() {
    const saved = localStorage.getItem('aparcamiento_actual');

    if (saved) {
        const data = JSON.parse(saved);
        updateCarMarker(data, 1.0);
        toggleUI(true);
        focalizarMapa();
    } else {
        if (carMarker) map.removeLayer(carMarker);
        carMarker = null;
        toggleUI(false);
    }
}

function updateCarMarker(data, opacity) {
    const latlng = [data.lat, data.lng];
    if (!carMarker) {
        const icon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        });
        carMarker = L.marker(latlng, { icon }).addTo(map).bindPopup("Coche aparcado aquí");
    } else {
        carMarker.setLatLng(latlng).setOpacity(opacity);
    }
}

function toggleUI(isParked) {
    elements.btnAparcar.classList.toggle('d-none', isParked);
    elements.btnRetirar.classList.toggle('d-none', !isParked);
    elements.infoPanel.classList.toggle('d-none', !isParked);
}

function focalizarMapa() {
    if (userMarker && carMarker) {
        const group = new L.featureGroup([userMarker, carMarker]);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
}

function actualizarPanelInfo() {
    const saved = localStorage.getItem('aparcamiento_actual');
    if (!saved || !currentPos) return;

    const data = JSON.parse(saved);
    const m = L.latLng(currentPos).distanceTo([data.lat, data.lng]);
    
    elements.distancia.textContent = Math.round(m);
    elements.tiempo.textContent = Math.floor((Date.now() - data.timestamp) / 60000);
}