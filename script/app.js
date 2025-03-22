const dropZoneObj = document.querySelector(".dropZone");
const listaPuntos = document.getElementById("listaPuntos").querySelector("tbody");
const totalPuntos = document.getElementById("totalPuntos");
const filterTipo = document.getElementById("filterTipo");
const filterNombre = document.getElementById("filterNombre");
const ordenarPuntos = document.getElementById("ordenarPuntos");
const btnNetejarTot = document.getElementById("btnNetejarTot");
let fitxer = [];

let extension = "";
let numId = 0;
let puntosCargados = [];

dropZoneObj.addEventListener("dragover", function (event) {
    event.preventDefault();
    console.log("dragover")
})

dropZoneObj.addEventListener("drop", function (event) {
    event.preventDefault();
    console.log("drop");
    const files = event.dataTransfer.files;
    loadFile(files);
})

const loadFile = function (files) {
    if (files && files.length > 0) {
        const file = files[0];
        const extension = file.name.split(".")[1];
        if (extension.toLowerCase() === "csv") {
            console.log("El fitxer te un format correcte");
            readCsv(file);
        }
    }
}

const readCsv = function (file) {
    const reader = new FileReader();
    reader.onload = () => {
        console.log("el fitxer esta carregat");
        fitxer = reader.result.trim().split("\n").slice(1); 
        console.log(fitxer);
        loadData(fitxer);
    };
    reader.onerror = () => {
        showMessage("Error reading the file. Please try again.", "error");
    };
    reader.readAsText(file, "UTF-8");
}

const loadData = function (fitxer) {
    listaPuntos.innerHTML = "";
    let total = 0;

    fitxer.forEach((liniaCSV) => {
        numId++;
        const dades = liniaCSV.split(';');

        let objPunto;
        switch (dades[TIPUS].toLowerCase()) {
            case "espai":
                objPunto = new PuntInteres(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIR], dades[TIPUS], dades[LAT], dades[LON], dades[PUNTUACIO]);
                break;

            case "museu":
                objPunto = new Museu(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIR], dades[LAT], dades[LON], dades[PUNTUACIO], dades[HORARIS], dades[PREU], dades[MONEDA], dades[DESCRIPCIO]);
                break;

            case "atraccio":
                objPunto = new Atraccio(numId, false, dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIR], dades[LAT], dades[LON], dades[PUNTUACIO], dades[HORARIS], dades[PREU], dades[MONEDA]);
                break;

            default:
                alert("Tipo incorrecto en el CSV.");
                return;
        }

        total++;
        puntosCargados.push(objPunto);
        actualizarOpcionesTipo();
        agregarFilaLista(objPunto);

        mapa.mostrarPunt(
            objPunto.latitud,
            objPunto.longitud,
            objPunto.nom,
            objPunto.direccio,
            objPunto.puntuacio
        );
        

    });

    if (puntosCargados.length > 0) {
        const nombrePais = puntosCargados[0].pais;
        const ciutat = puntosCargados[0].ciutat;
        obtenerInfoPais(nombrePais, ciutat);
    }
    totalPuntos.textContent = `Total: ${total}`;
};

const obtenerInfoPais = async function (nombrePais, ciutat) {
    try {
        // Convertir el nombre del país en código ISO si es necesario
        const codigoISO = countryCodes[nombrePais] || nombrePais;

        const response = await fetch(`https://restcountries.com/v3.1/alpha/${codigoISO}`);
        if (!response.ok) throw new Error("No se pudo obtener la información del país.");

        const data = await response.json();
        const pais = data[0];

        // Obtener la bandera
        const bandera = pais.flags.svg || pais.flags.png;

        // Actualizar
        document.getElementById("ciutat").textContent = `Ciutat: ${ciutat}`;
        const imgBandera = document.getElementById("banderaPais");
        imgBandera.src = bandera;
        imgBandera.style.display = "inline"; // Mostrar la imagen

    } catch (error) {
        console.error("Error obteniendo datos del país:", error);
    }
};


const agregarFilaLista = function (punto) {
    const fila = document.createElement("tr");

    let horaris = "N/A";
    let preu = "N/A";

    if (punto instanceof Atraccio || punto instanceof Museu) {
        horaris = punto.horaris || "N/A";
        preu = punto.preuIva;
    }

    fila.innerHTML = `
        <td>${punto.ciutat}</td>
        <td>${punto.nom}</td>
        <td>${punto.tipus}</td>
        <td>${horaris}</td>
        <td>${preu}</td>
        <td><button onclick="eliminarFila(this)">Eliminar</button></td>
    `;

    listaPuntos.appendChild(fila);
};

// Función para eliminar una fila
const eliminarFila = function (btn) {
    const fila = btn.parentElement.parentElement;
    const nombre = fila.children[1].textContent;

    // Borrar el marcador del mapa
    mapa.borrarPunt(nombre);

    // Eliminar el punto de la lista
    fila.remove();
    actualizarTotal();
};

// Actualizar el total de puntos
const actualizarTotal = function () {
    totalPuntos.textContent = `Total: ${listaPuntos.rows.length}`;
};

const actualizarOpcionesTipo = function () {
    const tipos = new Set(puntosCargados.map(p => p.tipus));
    filterTipo.innerHTML = `<option value="tots">Tots</option>`;
    tipos.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo.toLowerCase();
        option.textContent = tipo;
        filterTipo.appendChild(option);
    });
};

// filtrar los puntos
const filtrarPuntos = function () {
    const tipoSeleccionado = filterTipo.value.toLowerCase();
    const textoBusqueda = filterNombre.value.toLowerCase();
    const ordenSeleccionado = ordenarPuntos.value;

    // Limpiar la lista y el mapa
    listaPuntos.innerHTML = "";
    mapa.borrarPunt();

    let puntosFiltrados = puntosCargados.filter(punto => {
        const coincideTipo = (tipoSeleccionado === "tots") || (punto.tipus.toLowerCase() === tipoSeleccionado);
        const coincideNombre = punto.nom.toLowerCase().includes(textoBusqueda);
        return coincideTipo && coincideNombre;
    });

    puntosFiltrados.sort((a, b) => {
        if (ordenSeleccionado === "asc") {
            return a.nom.localeCompare(b.nom);
        } else {
            return b.nom.localeCompare(a.nom);
        }
    });

    let total = 0;
    puntosFiltrados.forEach(punto => {
        agregarFilaLista(punto);
        mapa.mostrarPunt(punto.latitud, punto.longitud, punto.nom);
        total++;
    });

    totalPuntos.textContent = `Total: ${total}`;
};

btnNetejarTot.addEventListener("click", function () {
    // Confirmar antes de eliminar todo
    if (confirm("Estàs segur que vols esborrar tots els punts d'interès?")) {
        // Limpiar la lista en el HTML
        listaPuntos.innerHTML = `<tr id="sinDatos"><td colspan="4">No hay información a mostrar</td></tr>`;

        // Limpiar el array de puntos cargados
        puntosCargados = [];

        // Borrar los puntos del mapa
        mapa.borrarPunt();

        // Actualizar el total de puntos
        totalPuntos.textContent = "Total: 0";
    }
});



filterTipo.addEventListener("change", filtrarPuntos);
filterNombre.addEventListener("input", filtrarPuntos)
ordenarPuntos.addEventListener("change", filtrarPuntos);

const mapa = new Mapa()