const mapCenter = [41.3851, 2.1734];
const zoomLevel = 13;

const map = L.map('map').setView(mapCenter, zoomLevel);

const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }); tileLayer.addTo(map);
tileLayer.addTo(map);

const markerPosition = [41.3870, 2.1699]; // Example point in Barcelona

//const marker = L.marker(markerPosition).addTo(map);

const popupText = "This is a marker in Barcelona!"; 

const marker = L.marker(markerPosition).addTo(map).bindPopup(popupText);

//const marker = L.marker(markerPosition).addTo(map).bindPopup(popupText).openPopup();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;


        // Coloca un marcador en la ubicación actual del usuario
        L.marker([lat, lng]).addTo(map)
            .bindPopup("Estás aquí").openPopup();


        // Centra el mapa en la ubicación actual
        map.setView([lat, lng], 13);
    }, function (error) {
        console.error("Error en la geolocalización:", error);
    });
} else {
    console.error("La geolocalización no está disponible en este navegador.");
}
