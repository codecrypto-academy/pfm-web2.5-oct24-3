import * as fs from 'fs';

export function existeDir(dir: string): boolean {
    try {
        return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
    } catch (error) {
        console.error('Error al verificar el directorio', error)
        return false;
    }
}

export function creaContraseña(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 15; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indiceAleatorio];
    }
    return resultado;
}