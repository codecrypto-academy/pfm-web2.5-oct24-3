import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { existeDir } from './utils/utils';
import networkRoutes from './routes/network.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const PORT = 3333;

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
app.use(cors());

// Rutas
app.use("/api/network", networkRoutes);

// Middleware de manejo de errores (global)
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
