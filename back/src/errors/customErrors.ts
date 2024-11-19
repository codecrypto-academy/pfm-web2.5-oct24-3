export class NoFileExistsError extends Error {
    constructor() {
        super("Error al leer el archivo de networks.json");
        this.name = "NoFileExistsError";
    }
}

export class NetworkAlreadyExistsError extends Error {
    constructor() {
        super("La network ya existe");
        this.name = "NetworkAlreadyExistsError";
    }
}

export class NetworkSaveError extends Error {
    constructor() {
        super("Error al guardar la network");
        this.name = "NetworkSaveError";
    }
}

export class NetworkNotFoundError extends Error {
    constructor() {
        super("Network no encontrada");
        this.name = "NetworkNotFoundError";
    }
}
