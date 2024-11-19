import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // 1. Manejar errores de validación (Zod)
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación",
            errors: err.errors,
        });
    }

    // 2. Manejar errores personalizados
    if (err.name === "NoFileExistsError") {
        return res.status(500).json({
            message: err.message
        });
    }

    if (err.name === "NetworkAlreadyExistsError") {
        return res.status(409).json({
            message: err.message
        });
    }

    if (err.name === "NetworkSaveError") {
        return res.status(500).json({
            message: err.message
        });
    }

    if (err.name === "NetworkNotFoundError") {
        return res.status(404).json({
            message: err.message
        });
    }

    // 3. Manejar errores genéricos
    res.status(500).json({
        message: "Error interno del servidor",
        error: err.message,
    });
};
