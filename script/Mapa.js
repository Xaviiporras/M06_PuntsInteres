class Mapa {
    #map;
    #currentLat;
    #currentLon;

    constructor() {
        this.#getPosicioActual();
        const mapCenter = [41.3851, 2.1734];
        const zoomLevel = 6;

        this.#map = L.map('map').setView(mapCenter, zoomLevel);

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '&copy; OpenStreetMap contributors' 
        });
        tileLayer.addTo(this.#map);
    }

    mostrarPuntInicial() {}

    actualitzarPosInitMapa(lat, lon) {
        if (this.#map) {
            this.#map.setView([lat, lon], 6); // Zoom a nivel país
        }
    }

    mostrarPunt(lat, lon, nom, direccio, puntuacio) {
        if (!lat || !lon) return;
    
        const popupContent = `
            <strong>${nom}</strong><br>
            ${direccio}<br>
            <strong>Puntuació:</strong> ${puntuacio}
        `;
    
        const marcador = L.marker([lat, lon]).addTo(this.#map);
        marcador.bindPopup(popupContent).openPopup();
    }
    

    borrarPunt(nombre) {
        this.#map.eachLayer((layer) => {
            if (layer instanceof L.Marker && layer.getPopup().getContent().includes(nombre)) {
                this.#map.removeLayer(layer);
            }
        });
    }

    #getPosicioActual() {
        let lat = 41.3851;
        let lon = 2.1734;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                if (this.#map) {
                    L.marker([lat, lon]).addTo(this.#map).bindPopup("Estás aquí").openPopup();
                    this.#map.setView([lat, lon], 13);
                }
                this.#currentLat = lat;
                this.#currentLon = lon;
            }, (error) => {
                console.error("Error en la geolocalización:", error);
            });
        } else {
            console.error("La geolocalización no está disponible en este navegador.");
            this.#currentLat = lat;
            this.#currentLon = lon;
        }
    }
}
