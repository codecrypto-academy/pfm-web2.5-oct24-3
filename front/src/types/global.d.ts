export {}; // Esto asegura que el archivo sea tratado como un módulo.

declare global {
    interface Window {
        ethereum: import("ethers").Eip1193Provider;
    }
}
