class PuntInteres {
    static totalTasques = 0;

    constructor(id, esManual, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio) {
        this._id = id; 
        this._esManual = esManual; 
        this.pais = pais; 
        this.ciutat = ciutat; 
        this.nom = nom; 
        this.direccio = direccio; 
        this.tipus = tipus; 
        this.latitud = latitud; 
        this.longitud = longitud; 
        this.puntuacio = puntuacio; 
        
        PuntInteres.totalTasques++;
    }

    // Getters y Setters
    get id() {
        return this._id;
    }

    set id(valor) {
        this._id = valor;
    }

    get esManual() {
        return this._esManual;
    }

    set esManual(valor) {
        this._esManual = valor;
    }

    static obtenirTotalElements() {
        return PuntInteres.totalTasques;
    }
}

class Atraccio extends PuntInteres {
    static IVA_PAISOS = {
        "España": 0.21,
        "Francia": 0.20,
        "Italia": 0.22,
        "Reino Unido": 0.20,
        "Alemania": 0.19
    };

    constructor(id, esManual, pais, ciutat, nom, direccio, latitud, longitud, puntuacio, horaris, preu, moneda) {
        super(id, esManual, pais, ciutat, nom, direccio, "atraccio", latitud, longitud, puntuacio);
        this.horaris = horaris;
        this.preu = parseFloat(preu);
        this.moneda = moneda; 
    }

    get preuIva() {
        if (this.preu === 0) {
            return "Entrada gratuïta";
        }

        const iva = Atraccio.IVA_PAISOS[this.pais] || 0;
        const preuFinal = this.preu * (1 + iva);
        if (iva > 0) {
            return `${preuFinal.toFixed(2)}${this.moneda} (IVA)`;
        } else {
            return `${this.preu.toFixed(2)}${this.moneda} (no IVA)`;
        }
    }
}

class Museu extends PuntInteres {
    static IVA_PAISOS = {
        "España": 0.21,
        "Francia": 0.20,
        "Italia": 0.22,
        "Reino Unido": 0.20,
        "Alemania": 0.19
    };

    constructor(id, esManual, pais, ciutat, nom, direccio, latitud, longitud, puntuacio, horaris, preu, moneda, descripcio) {
        super(id, esManual, pais, ciutat, nom, direccio, "museu", latitud, longitud, puntuacio);
        this.horaris = horaris; 
        this.preu = parseFloat(preu);
        this.moneda = moneda; 
        this.descripcio = descripcio;
    }

    get preuIva() {
        if (this.preu === 0) {
            return "Entrada gratuïta";
        }

        const iva = Museu.IVA_PAISOS[this.pais] || 0;
        const preuFinal = this.preu * (1 + iva);
        if (iva > 0) {
            return `${preuFinal.toFixed(2)}${this.moneda} (IVA)`;
        } else {
            return `${this.preu.toFixed(2)}${this.moneda} (no IVA)`;
        }
    }
}
