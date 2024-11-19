import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // 1. Manejar errores de validación (Zod)
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            message: `Error de validacion: ${err.errors}`,
            code: 400
        });
    }

    // 2. Manejar errores personalizados
    if (err.name === "NoFileExistsError") {
        return res.status(500).json({
            status: "error",
            message: err.message,
            code: 500
        });
    }

    if (err.name === "NetworkAlreadyExistsError") {
        return res.status(409).json({
            status: "error",
            message: err.message,
            code: 409
        });
    }

    if (err.name === "NetworkSaveError") {
        return res.status(500).json({
            status: "error",
            message: err.message,
            code: 500
        });
    }

    if (err.name === "NetworkNotFoundError") {
        return res.status(404).json({
            status: "error",
            message: err.message,
            code: 404
        });
    }

    // 3. Manejar errores genéricos
    res.status(500).json({
        status: "error",
        message: `Error interno del servidor: ${err.errors}`,
        code: 500
    });
};
